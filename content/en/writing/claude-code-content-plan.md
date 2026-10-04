---
title: Turning a 30-day content plan into draft articles with Claude Code
description: How I replaced a copy-paste loop between browser tabs with one slash command — a tiny token-protected API, a bash client, and one subagent per article to keep the context small.
date: 2026-10-03
tags: [Engineering, AI, Laravel, Claude Code]
cover: /images/writing/claude-code-content-plan/flow.svg
---

[katili.dev](https://katili.dev) — my hosting and web-development studio — runs a bilingual blog. Each month I plan about 30 articles in a spreadsheet (title, description, category, language, reference links, and a ready-made prompt), import it into the Laravel admin panel, and work through it day by day.

Writing the articles was the slow part, and not because of the writing.

## The copy-paste loop

The routine for every single article looked like this:

1. Open a Claude project whose instructions hold my writing guide (structure, tone, SEO fields, and the exact JSON shape my importer expects).
2. Go back to the admin panel, find the day, press **Copy Prompt**.
3. Switch tabs, open a new chat in the project, paste, wait.
4. Copy the JSON answer, go to the import page, paste it, import.
5. Go back to the plan and mark the day as done, then link it to the new post.

Five context switches per article, thirty articles a month. None of it was hard; all of it was friction. I wanted to type one thing and come back to drafts — **without** adding an AI API key to the server and paying per token on top of the subscription I already use every day.

## The idea: let Claude Code drive, keep the server dumb

Claude Code already runs in my terminal, inside the repository. It can run shell commands, fetch web pages, write files, and start subagents with a chosen model. So the server doesn't need to *generate* anything. It only needs to:

- tell Claude what is in the plan,
- hand over one item's prompt,
- accept the finished JSON and import it.

![The flow: Claude Code calls a small API through a bash script; one subagent per article](/images/writing/claude-code-content-plan/flow.svg)

### 1. A small, boring API

Five routes in `routes/api.php`, behind one middleware that compares a Bearer token with an environment variable using `hash_equals`. No Sanctum, no users — it is a tool for one person.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/content-plans` | plans with done / in progress / to-do counts |
| `GET /api/content-plans/{plan}/items` | items **without** their prompts |
| `GET /api/content-plan-items/{item}` | one item with its full prompt and references |
| `PATCH /api/content-plan-items/{item}` | change status |
| `POST /api/content-plan-items/{item}/import` | import the generated articles |

Two decisions mattered more than the routes themselves:

- **An empty token switches the API off** (403) instead of leaving it open. Forgetting to set an env var should never publish an import endpoint to the world.
- **The import reuses the existing `blog:import-json` command** — the same code path the admin page uses. The endpoint stores the JSON on the same disk, calls the command, then reads back the post IDs it wrote. There is still only one way an article enters the database, and every new post lands as a **draft**.

### 2. A bash client instead of a smart one

`bin/content-plan` is plain bash and `curl` — no `jq`, nothing to install:

```bash
bin/content-plan plans
bin/content-plan items 1          # what is still to do
bin/content-plan show 42          # the full prompt
bin/content-plan check 42 a.json  # validate only (dry run)
bin/content-plan import 42 a.json # draft posts, item marked done
```

It is just as useful by hand as it is to Claude, which is a good sign the interface is right.

### 3. A skill, and one subagent per article

A project skill (`.claude/skills/generate-blog/SKILL.md`) turns the whole loop into:

```text
/generate-blog 1 3,5,7-9 sonnet
```

Plan 1, items 3, 5, 7, 8 and 9, written by Sonnet (the default is Opus). For each item the main session starts **one subagent** with the chosen model. The subagent reads the writing guide straight from the repository, asks the API for that item's prompt, fetches the reference links, writes the bilingual JSON, validates it with a dry run, fixes what the server complains about, and imports it.

Then it answers with a single line:

```text
OK 42 | Apa Itu Harness dalam AI Agent? | #101 (id), #102 (en) · draft
```

## Designing for tokens, not just for features

The interesting constraint wasn't functionality — it was context size. A naïve version would pull the 7.6 KB guide, thirty prompts, a dozen fetched web pages, and every finished article into one conversation. By article five the session would be slow and expensive; by article ten it would be forgetting the guide.

Three choices keep it lean:

- **Text, not JSON, for anything a model reads.** Every `GET` accepts `?format=text` and returns a compact pipe-separated table. JSON repeats every key on every row; a model pays for each repetition.
- **Prompts only on demand.** The item list never includes prompts. Only the item being written fetches its prompt.
- **Subagents as a context firewall.** The guide, the references and the article itself live only inside the subagent's context and disappear when it finishes. The main session sees a table going in and one line per article coming out — so the tenth article costs about as much as the first.

## Making it work from the browser too

I wanted the same command to work from Claude Code on the web, so I could start a batch from my phone. A cloud session has three differences from my laptop: the repository is a fresh clone (my local config file isn't there), outbound traffic goes through a network policy, and nobody is around to approve each command.

Configuration was easy — the script now reads environment variables first and the local file second, so the token can live in the cloud environment's settings.

The network part was more interesting. When I tried it, the session's proxy refused the connection to my domain with a **403**. My API *also* answers 403 when it is switched off, and 401 for a wrong token. From the script's point of view, "your token is wrong" and "you are not allowed to leave this sandbox" looked the same, and the fixes are completely different.

The fix is a single response header. The middleware stamps `X-Content-Plan-Api: 1` on **every** response, including its own 401 and 403. The script checks for it:

- header present → the API answered; exit code **1** with the API's own message;
- header missing → something else answered (a proxy, the wrong host, a server that hasn't deployed the route yet); exit code **2** with a `NETWORK:` prefix and a hint to allow the domain.

The skill reads those exit codes and tells me exactly which setting to change — and never asks me to paste a token into the chat.

Two smaller guards came from the same "what if two of me run this?" question:

- **A per-item lock on import.** A laptop session and a web session (or two parallel subagents) could both pass the "does this item already have a post?" check before either finishes. The import now takes a cache lock per item, re-reads the item inside it, and answers **423** to the loser. An item that already has a post gets **409** unless I explicitly force a re-import.
- **A non-interactive mode.** `/generate-blog next 2` takes the next two unfinished items without asking anything, so it can run on a schedule. The output is still drafts; publishing stays a human decision.

## What I deliberately left out

- **No AI calls on the server.** The server stores and imports; the writing happens in a tool I already pay for.
- **No auto-publishing.** Generated articles are drafts. I still read, edit and schedule each one.
- **No permission changes committed for me.** The allow-list that lets a cloud session run unattended is documented, not committed — that is a decision for the repository owner, not for the agent that wrote the feature.

## Result

The routine went from five tab switches per article to one line for a whole batch:

```text
/generate-blog next 3
```

A few minutes later there are three bilingual drafts in the admin panel, linked to their days in the content-plan calendar, with the source JSON kept next to every other import. The whole feature is roughly 550 lines of PHP and bash plus one Markdown skill, covered by 14 feature tests — and most of the thinking went into what the model should *not* have to read.
