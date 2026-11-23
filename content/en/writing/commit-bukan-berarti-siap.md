---
title: Committed Doesn't Mean Ready
description: A split payment succeeded in one ledger and was rejected in the other. Not a bug, just two systems running on two different clocks.
date: 2026-11-23
original: id
tags: [Engineering, Payment]
---

*A split payment succeeded in one ledger and was rejected in the other. Not a bug, just two systems running on two different clocks.*

## "The split went through… on our side"

It all started with one line in an operations report:

> Split payment succeeded in our system, but the internal funds transfer was rejected with `INSUFFICIENT_BALANCE`.

My first reaction, honestly: *how?* The balance was clearly there. I opened the data, and the money had in fact moved. The main account went down, the partner account went up, the split history was recorded neatly, and the webhook to the merchant had already gone out.

The problem was in the **other** ledger.

We don't hold merchant money on our own. Every movement of funds in our database also has to be recorded in a core ledger run by another party. Think of it as double bookkeeping: two books that must always agree. If we move Rp 30,000.00 from account A to account B, the ledger on the other side has to record the same movement.

In our book, the split transfer had happened. In theirs, it was rejected because the balance wasn't enough.

Two books, two stories. For the reconciliation team, that's a nightmare.

## First guess: "it must be the job order"

In the team chat, the first guess was a reasonable one: *the sync part is probably the problem, either the order of the triggers or the order of the jobs running them.*

I agreed with the direction. But "job order" can mean a lot of things, so I decided to reread the flow from the start, slowly, as if I were seeing the code for the first time.

At first glance, the flow looked right:

```text
settlement:  pending → available         ┐
split:       main account → partner      ├─ one DB transaction
outbox:      write the transfer "intent" ┘
COMMIT
→ outbox job (afterCommit) sends the transfer to the other ledger
→ report job sends the settlement file to the other ledger
```

Settlement first, then split. The sync job even uses `afterCommit()`, so it can never send something that hasn't been committed. I briefly thought, *this is tidy, so where's the bug?*

The answer was in the last line, the one I almost skipped: **the report job**.

## The "oh…" moment

The ledger on the other side knows nothing about our settlement until we send the report. And even once the report arrives, they don't process it right away. It starts as `PENDING`, then they run *clearing* asynchronously. Only after that do the funds move from *frozen* to *available* on their side.

Meanwhile, our split transfer had already left.

```text
time ──────────────────────────────────────────────────────▶
us:          [COMMIT]
transfer:        [send] ✗ insufficient balance
report:              [send] → PENDING ........... SETTLED
other side:  funds still frozen ─────────────────▶ available
```

That's when something that sounds trivial turned out to matter a lot:

**`afterCommit()` is a promise to our own database, not to the outside world.**

A commit on our side means "our data is final". It says nothing about whether the ledger on the other side is ready to accept a transfer that depends on that data.

And there was one more thing that made me wince. 😅 The `INSUFFICIENT_BALANCE` rejection is a 4xx response, and our outbox treats 4xx as a permanent failure. The row gets marked `FAILED` immediately, while the sweeper only picks up `PENDING` rows. So even after the settlement finished on the other side, **nobody tried to send it again**. The transfer was simply gone.

## The temptation of quick fixes

Once the root cause was clear, my brain immediately offered a list of instant fixes. I wrote them all down, then crossed them out one by one:

- **Swap the dispatch order, report first, then transfer.** Not enough. A report that has been sent is still `PENDING`, not done.
- **Job chain, the transfer waits for the report job to succeed.** Same problem. A report sent successfully isn't a settlement that has been processed.
- **Add a 5-minute delay.** The most tempting one. But how long do the queue, the file upload and the clearing on the other side take? Two minutes today, twenty tomorrow. A fixed delay is just a guess with a number attached.
- **Retry every `INSUFFICIENT_BALANCE`.** If the balance is ever genuinely short, this kind of retry would hide it.
- **Call their API inside the settlement transaction.** The merchant lock would be held for the whole HTTP round trip, with a dozen workers fighting for that same lock. No, thank you.

With everything crossed out, the pattern finally showed. Every one of those ideas was **guessing when** the funds would be ready. What I actually needed was **confirmation that** they were.

## The docs said two different things

So the question became simple: which status means the settlement funds can be used in the other ledger?

The answer wasn't as simple as the question.

One page of the API docs describes the settlement lifecycle as `PENDING → PROCESSING → SETTLED → PAYING → COMPLETED`, with a small note that `SETTLED` only applies to settlements paid out to a bank account. Another page, for the settlement status query endpoint, has a different enum, and no `COMPLETED` at all. The only sentence that explicitly says "funds are in available balance" lives on a third endpoint, the per-transaction status.

I could have picked one and hoped the guess was right. But when it comes to money, hope isn't a strategy.

So I messaged the team that runs that ledger. I deliberately didn't ask "what's the status?", because open questions like that usually get a question back. I wrote down what I had found in the docs and my conclusion, and asked them to correct me.

Their reply was short, and it simplified everything:

- The funds are ready when the settlement inquiry returns **`SETTLED`**.
- Internal funds transfer is **synchronous**. HTTP 200 with `success = true` means the balance has actually moved.
- Retrying with the same `reference_number` is fine, but *try it on the sandbox first*.

One signal, at the settlement level. I didn't need per-transaction statuses after all.

## Only the shadow waits

Before writing any code, I held on to one principle: **the money still moves at commit. Only its mirror in the other ledger waits.**

Our balances, the split history and the merchant webhook don't change at all. Settlement finishes as fast as it did before. The only thing held back is the split transfer's outbox row, and that row now knows what it's waiting for:

```text
outbox.depends_on_settlement_id = settlement.id
```

The column is written in the same savepoint as the money movement. If the split batch rolls back, its sync intent goes with it. Transfers that aren't splits stay `NULL` and are unaffected.

Then, at the point where every outbox sending path meets, I put a gate. The gate only reads the settlement status already stored in our database. It never calls the other ledger. A settlement with 500 splits must not turn into 500 inquiry requests.

| Status on the other side | What happens |
|---|---|
| `SETTLED` | Send ✅ |
| empty / `PENDING` / `PROCESSING` | Wait ⏳ |
| `FAILED` / `REJECTED` | Hold + alert 🚨 |

There's one detail I think matters most here: **waiting doesn't count as failing.** A row that waits only has its `next_retry_at` pushed back. Its `retry_count` is left alone. If waiting counted, a slow settlement would burn through the retry budget and the row would die as `FAILED`, bringing the old problem back through the back door.

## "So the job just keeps querying?"

That was the first question when I walked the team through the design. Fair enough, since "waiting" inside a job does sound like `while (true) { sleep(); }`.

The answer is no. No job stays alive.

The transfer job runs once. If the settlement isn't `SETTLED` yet, it pushes its row back 10 minutes and finishes. The row just sits in the table, and no process is holding it.

The one peeking at the other side is **a single watcher per settlement**. The watcher is an ordinary delayed job. It runs one status inquiry, and if the settlement isn't done, it schedules itself again for 1 minute later, then 2, then 3, up to 10 minutes. The queue handles the delay, so no worker is tied up.

However many splits there are, there's still only one watcher, de-duplicated with one cache key per settlement. If it has waited too long, the watcher stops and sends an alert, so nothing waits silently forever.

As soon as `SETTLED` is stored, whether from the watcher, the hourly poll, the manual check button or straight from the report response, every row waiting on that settlement is woken up and sent. Right before it actually sends, the gate is checked once more.

## A race that only shows up on paper

The code was done and I was fairly happy with it. Then I did something that has lately become a habit: I **drew the timeline**, event by event, with two workers running at the same time.

That's where it showed up:

```text
worker A : claim row → read status: PENDING
watcher  : store SETTLED → release: make the row due now
worker A : push row back 10 minutes   ← overwrites the release
```

The row ends up stuck for 10 minutes even though the funds are ready. The reverse is worse: the release wakes a row that another worker is still holding, and two workers send the same reference.

You wouldn't see this bug by reading the code line by line. Each function is correct on its own. The problem only lives in the gaps between them.

The fix has two layers. First, the release must not touch a row that is currently claimed. A row that is waiting has its `next_retry_at` far ahead, while a claimed row only has it as far as the lease, so the two can be told apart. Second, a worker that has just pushed a row back must check the status once more. If it's already `SETTLED`, that worker wakes the row up itself.

With both layers, every ordering ends safely: either the release sees the row that was pushed back, or the worker that pushed it back sees `SETTLED`. There's no gap in between.

## Cleaning up what already happened

The fix prevents the next occurrence, but rows that had already gone `FAILED` won't heal on their own.

For those I wrote a recovery command with rules that are deliberately boring. It's a dry run by default. It only lists rows whose settlement is already `SETTLED`, with amounts in two decimals and the source account. When executed, it requeues only the outbox row, with the same reference. The split engine doesn't run again, no new movement is created, and our balances aren't touched.

Because the transfer is synchronous, a rejected transfer means the money really didn't move. The same reference is what guarantees a retry never produces a double transfer.

## "Does settlement get slower?"

This question came fastest, and that makes sense, since settlement is the heart of our money flow.

It doesn't. Inside the settlement transaction, the only change is one extra column in an INSERT that was already there. No HTTP, no waiting. Regular transactions without splits don't even go through the new code. The only thing that changes is *when* the split transfer's shadow appears in the other ledger: a few minutes after settlement instead of immediately.

And a few minutes is still much better than the old version, where it never appeared at all.

## What I took home

1. **A commit is a promise to yourself.** As soon as there's a second system, "committed" and "ready" are two different events.
2. **In an async world, order comes from status, not from time.** Delays, job chains and dispatch order are all just guessing the clock.
3. **Waiting isn't failing.** Don't let waiting eat the retry budget.
4. **When the docs are ambiguous, ask with your findings in hand.** "It says X here and Y there, which one is right?" gets answered much faster than "what's the status?".
5. **Draw the timeline.** The slipperiest races live in the gaps between functions, not inside them.

These days, whenever a split happens, I still sometimes peek at the outbox table. The row sits there patiently with `waiting dependency`, and a few minutes later it turns into `COMMITTED`. The hardest part, it turns out, wasn't making the system move faster. It was teaching it when to wait. 🙂
