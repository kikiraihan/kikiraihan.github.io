---
title: The 63 Milliseconds That Broke the Balances of Hundreds of Accounts
description: A story about a race condition, a meeting that got heated, and a one-hour script run we had been waiting weeks for.
date: 2026-10-30
original: id
tags: [Engineering, Payment, Database]
---

*A story about a race condition, a meeting that got heated, and a one-hour script run we had been waiting weeks for.*

## "Hey, why don't these numbers add up?"

It all started with an ordinary message. A colleague was manually recalculating the transactions on one of our clients' statements: opening balance, plus credits, minus debits. The result didn't match the `balance_after` value in the system.

The difference wasn't big, just one or two thousand rupiah per row. But in a payment gateway, a thousand-rupiah difference isn't about the amount. It's a sign that **the system is counting other people's money wrong**.

A slightly embarrassing fact: our monitoring **had** in fact sent an alert to Telegram. It just drowned among the dozens of other notifications that come in every day. An alert channel that's too noisy ends up being no better than having no alerts at all. What saved us was a human who decided to check with a calculator.

## Who was the client, and why them?

The affected client is a platform that provides storefronts, a marketplace and payments for small businesses (UMKM). They use our **multi account** feature, a sort of set of fund pockets. One main account holds their fees, and hundreds of other accounts are used for individual sellers.

That means money moves between their accounts **very** often and **very** concurrently. Our internal account movement feature turned out not to be ready for that.

## The "uh-oh" moment

I opened the data for one of the accounts and found these three rows:

| # | Time | Debit | Balance After (stored) | Should be |
|---|---|---|---|---|
| 9 | 18:26:51 | Rp 1,458.00 | Rp 6,732,740.00 | ✅ |
| 8 | 21:13:21**.072** | Rp 1,458.00 | Rp 6,731,282.00 | ✅ |
| 7 | 21:13:21**.135** | Rp 1,458.00 | **Rp 6,731,282.00** | ❌ Rp 6,729,824.00 |

Two transactions **63 milliseconds** apart, with exactly the same `balance_after`.

My first reaction, honestly: *"Uh-oh. There's still a race condition."*

The frustrating part: we had already fixed race conditions in another module. We also had a written rule for the AI agents that help us code: *every balance operation must use `lockForUpdate()` inside a database transaction.* But that rule wasn't followed when the account movement feature was built.

My guess is that back then the rule lived in `CLAUDE.md` and I was using auto mode. The model that first reads the context isn't necessarily the one that "obeys" that file, so the rule slipped through. I've since moved it to `AGENTS.md`, which is more general and read by any agent. The lesson: **don't just write important rules down, make sure whoever needs to read them actually does.** That goes for humans and AI alike.

## So what actually happened?

Put simply: two transfer requests from the same account, at almost the same time:

```
Request A                          Request B
read balance = X                   read balance = X
save X - 1,458
                                   save X - 1,458   ← overwrites A's result
```

Both read the same **old** balance, then each saved its result as an **absolute number**. As a result, one of the debits "disappeared". The statement still recorded everything, but the account balance no longer matched the statement total.

One request should have **waited** for the other to finish, so it would read the updated balance. That's exactly what a lock is for.

The impact went both ways:
- **Lost debits** made the account balance higher than it should be, so the merchant "gained".
- **Lost credits** made the balance lower than it should be, so the merchant "lost".

Tracing back, odd `balance_after` values had been appearing since late July, around when the account movement feature went live. The first clearly proven race happened in mid-September.

## Fixing the code: the easy part

The code fix was relatively quick. I wrote a helper that re-reads the accounts **with a lock, inside a transaction, ordered by ID** to avoid an A→B vs B→A deadlock. The sufficient-balance check was moved inside the lock too. All five affected transfer paths now use this helper.

After deploying, I ran a race-detection script for the next few days. Zero hits. Safe.

But a code fix only stops the bleeding. The wound, the data that was already wrong, was still there.

## The hard part: people

Before touching production data involving client balances, we had to:
1. Send a dispute notice to the client,
2. Agree on a solution,
3. Pass several layers of internal approval and write a dispute resolution report.

This is where the tension was. **Every day without a data fix, the difference could grow.** By my rough estimate, if left long enough it could balloon to 7 to 10 million rupiah, or more. So we were racing against time while still having to go through the bureaucracy.

### Two options, one dilemma

We had two options for accounts whose balance would go negative after the correction:

- **Option 1:** Cover the negative balance with funds from the client's main account.
- **Option 2:** Leave the balance negative; it will be covered once the seller tops up or receives funds. The risk: some accounts may already be inactive or never become active again, leaving the negative balance hanging.

We initially proposed option 1, on our lead's advice. I understood the reasoning: negative balances left alone can become a loose cannon. But honestly, deep down it didn't sit right with me. The mistake was in our system, so it felt unfair to put the burden on the client.

The client rejected it, and the discussion dragged on.

## The meeting that got "heated"

Then came the sync meeting, online. On our side were me (fullstack developer), the tech lead, two PMs, technical support and sales.

One of our PMs went first as the "narrator". The intention was good: open with a careful, orderly explanation to ease the mood, and buy us a little time. They went over the timeline of the case that had already been explained by email and chat.

It turned out the client didn't need a story. They needed **data**. And out came a line I still remember:

> *"Stop with the theory, this is taking too long! We need something concrete, show us the disputed data directly. Better prepare the data first, or if you don't have it yet, let's just postpone this meeting until you can provide it."*

A moment of silence. 😅

I took over right away. No slides, no analogies:
1. Export one account's statement straight from the system,
2. Open it in Excel, split the debit and credit columns,
3. Add a `SUM` to each column,
4. Show that total debits minus total credits **don't match** the account balance. There were extra debits that had never been deducted, so the correct balance should have been negative.

Two minutes, one spreadsheet, and the numbers spoke for themselves.

The mood changed instantly. Once the client saw the proof for themselves, and we could confirm that **the system was already running normally and only the data fix remained**, they became much calmer and more cooperative.

Funnily enough, in the follow-up discussion the client proposed the same solution as our option 2. Agreed, and off we went.

### Thank you, our shield

I want to give credit to that PM. They were the one who got called out first, but they were also the one **willing to stand at the front**. As a PM, they acted as our shield so we programmers weren't the target in the very first minute. Without their "warm-up", I might have been the one called out before I even had a chance to open Excel.

My lesson: **in front of a disappointed client, concrete data is more reassuring than a polished narrative.** And a good team covers for each other, including when someone has to take the hit.

## Execution day

Once approved, I executed. I had written the step-by-step plan well in advance, so it was just a matter of running it in order:

1. **Make sure the race has stopped.** Scanned for several days after deploy, zero hits.
2. **Find the differences** between account balances and statement totals, and generate an adjustment file.
3. **Sync account balances** to their statement totals.
4. **Recalculate `balance_after`** on the account statements.
5. **Check and sync the merchant level**, then recalculate `balance_after` at the merchant level.
6. **Verify everything again.**

All scripts were written in Python and ran directly against the database, because the data was too heavy to handle through a regular web framework. The statements whose `balance_after` was recalculated numbered hundreds of thousands to millions of rows. Every script ran as a *dry-run* by default, so I could see a preview before adding `--execute`.

### Almost missed it

Midway through there was one *"wait a second"* moment. In the first batch I only counted accounts whose **available balance** was negative. It turned out some accounts looked fine on available balance, but once **pending** and **held** were included, the total was still off.

So I ran a second batch with the correct scope. Nothing broke, because all scripts were idempotent and balances were always synced to the "truth", the statement. But it was a reminder that **the definition of "negative" itself needs to be defined carefully.**

### The final numbers

- **112 accounts** had their balance corrected to match their statements exactly.
- The client's main account **went up by about Rp 5.44 million**, because of credits that had "disappeared".
- The rest, dozens of seller accounts, **went down** because of debits that had "disappeared".
- After the correction, **50 accounts had a combined negative balance of about Rp 3.2 million**. Far smaller than if we had waited longer.
- Total execution time: **under an hour.**

Finally, I ran all the check scripts once more. The output was roughly:

> *All the balance already sync and valid. There is nothing to update.*

That line felt like a huge relief.

## What I took home

1. **Money must be locked, not calculated and overwritten.** `lockForUpdate()` inside a transaction, with a consistent lock order. No compromises.
2. **Too many alerts is the same as no alerts.** Our system actually knew, but nobody had time to read it.
3. **Rules for AI need to be actually read, too.** Writing rules in an agent config file doesn't guarantee they're followed.
4. **Fixing the code is 20%; fixing the data and the communication is 80%.**
5. **Bring data to the meeting, not theory.** One spreadsheet with `SUM` is more convincing than ten slides.
6. **Prepare the runbook before you need it.** Execution took an hour because the planning had been done weeks earlier.
7. **Appreciate the people willing to stand in front.** Sometimes their job really is to be the shield and get called out first.

Now it's just a matter of watching the accounts that are still negative until their balances are covered again. If one day there's another *"Hey, why don't these numbers add up?"*, I hope the answer is just a calculator typo. 🙂
