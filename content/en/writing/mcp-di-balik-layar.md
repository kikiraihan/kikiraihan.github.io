---
title: "Behind the scenes of MCP: what does the AI actually read?"
description: "The model never sees your code, doesn't speak JSON-RPC, and has no memory. So how does it know which tool to call? Following one question from host to model, and answering: is everything read every time, or is there some kind of glossary?"
date: 2026-10-06
original: id
tags: [Engineering, AI, MCP]
---

A while ago I built a [small MCP server for boarding-school student data](/writing/mcp-server-asrama) as an experiment. The server worked, and Claude could answer *"which students in class 7A are on leave today?"*. But afterwards I had questions that were more interesting than the code itself:

- What does the model actually **read**?
- Does it read **all** tool definitions and all data every time, or is there some kind of **glossary/index** it opens only when needed?
- If the model never sees my code, how does it know to call `cari_anak` (find student) first, and `absensi_harian` (daily attendance) after?

This article isn't about building the server (that's in the previous article), but about what happens behind it.

## Three players, not two

The most common misconception: "the AI is connected to the MCP server". There are actually three parties, and the model is the most "blind" of them:

```
┌──────────────┐  text/tokens  ┌──────────────┐   JSON-RPC    ┌──────────────┐
│ Model        │ ◄───────────► │ Host         │ ◄───────────► │ MCP server   │
│ (Claude)     │  (Messages    │ (Claude      │  (stdio /     │ (server.py)  │
│              │   API)        │  Desktop etc)│   HTTP)       │              │
└──────────────┘               └──────────────┘               └──────────────┘
```

| Party | What it does | What it does **not** do |
|---|---|---|
| **MCP server** | Answers `tools/list`, runs `tools/call`, calls your API | Never talks to the model |
| **Host** (Claude Desktop, Claude Code, Cursor, …) | Speaks MCP to the server *and* the API to the model, translating between them | Doesn't decide which tool to call |
| **Model** | Reads text, then writes text: an answer, or a "request to call a tool" | Opens no connections, runs no code, doesn't know the word "MCP" |

The model receives exactly one thing: **a request containing text**, and it returns text. All the "intelligent tool use" happens because the host assembles that text in a particular way.

## The journey of one question

Let's follow what happens when a staff member asks *"Which students in class 7A are on leave today?"*.

### 0. Before any question

When the host starts, it runs `python server.py`, does the `initialize` handshake, then calls `tools/list`. This list of tools is **stored by the host**, not by the model. The host only asks again if the server sends a `notifications/tools/list_changed` notification.

So before the user types anything, the model has seen nothing. It isn't even "in" this conversation yet.

### 1. The host builds the first request

As soon as the user presses Enter, the host builds a request to the model. It looks roughly like this (an illustration in the Claude Messages API format; the exact contents depend on the host):

```json
{
  "model": "claude-opus-5-5",
  "system": "Kamu adalah asisten ... Hari ini 2026-10-06.\n\n# MCP Server Instructions\n## asrama\nAkses read-only ke data anak asrama: pencarian anak, detail, kamar, dan absensi.",
  "tools": [
    {
      "name": "mcp__asrama__cari_anak",
      "description": "Cari anak asrama berdasarkan nama (sebagian), kelas (mis. '7A'), atau nama kamar.\n    Semua filter opsional. Mengembalikan daftar ringkas anak beserta id-nya.",
      "input_schema": {
        "type": "object",
        "properties": {
          "nama":  { "anyOf": [{ "type": "string" }, { "type": "null" }], "default": null },
          "kelas": { "anyOf": [{ "type": "string" }, { "type": "null" }], "default": null },
          "kamar": { "anyOf": [{ "type": "string" }, { "type": "null" }], "default": null },
          "limit": { "type": "integer", "default": 20 }
        }
      }
    },
    { "name": "mcp__asrama__detail_anak", "description": "...", "input_schema": { "...": "..." } },
    { "name": "mcp__asrama__daftar_kamar", "description": "...", "input_schema": { "...": "..." } },
    { "name": "mcp__asrama__absensi_harian", "description": "...", "input_schema": { "...": "..." } }
  ],
  "messages": [
    { "role": "user", "content": "Siapa saja anak kelas 7A yang izin hari ini?" }
  ]
}
```

(The server and its data are in Indonesian, so the prompt and the user's question are too. "Hari ini" means "today".)

A few things to notice:

- **MCP's `inputSchema` becomes `input_schema`** in the API. The host just moves the contents across. The `name` and the `description` from your docstring come along verbatim, including the `\n    ` indentation.
- **The host may prefix tool names.** Claude Code, for example, names it `mcp__asrama__cari_anak` so it doesn't clash with tools from other servers. The model doesn't know it is an "MCP tool"; to the model it is an ordinary tool with a long name.
- **The server's `instructions` go into the system prompt**, but that's the host's choice. Some hosts include them, some don't.
- **Today's date** comes from the host. The model has no clock. If the host doesn't put the date in the system prompt, the model has no idea what "today" means and has to guess or ask.

So is the JSON above what the model reads? Not exactly. The API turns the tool definitions, the system prompt and the messages into one sequence of **tokens** in a fixed order: *tools → system → messages*. Anthropic's documentation describes the tool definitions as being assembled into a special part of the system prompt. So to the model, your docstring is **text at the start of the prompt**, side by side with the other instructions.

### 2. The model "calls" a tool, but only writes text

The model reads all of it and replies:

```json
{
  "stop_reason": "tool_use",
  "content": [
    { "type": "text", "text": "Saya cek dulu daftar anak kelas 7A dan absensi hari ini." },
    { "type": "tool_use", "id": "toolu_01", "name": "mcp__asrama__cari_anak", "input": { "kelas": "7A" } },
    { "type": "tool_use", "id": "toolu_02", "name": "mcp__asrama__absensi_harian", "input": { "tanggal": "2026-10-06" } }
  ]
}
```

The model runs nothing. It only produces structured blocks that say "please run this", and stops with `stop_reason: "tool_use"`. Here it asks for **two tools at once** (parallel tool use) because they don't depend on each other. It took the date from the system prompt.

### 3. The host translates to JSON-RPC

The host sees the name `mcp__asrama__cari_anak`, knows it belongs to the `asrama` server, and sends a `tools/call` with the original name `cari_anak`, exactly as dissected in the previous article. The server calls the REST API, filters out the sensitive fields and replies with JSON in `content[].text`.

### 4. Tool results join the conversation, and **everything is sent again**

This is the part people most often miss. The host appends two messages to the history, then sends a **complete new request** to the model:

```json
{
  "system": "... (same as before) ...",
  "tools": [ "... (all four tools, in full, same as before) ..." ],
  "messages": [
    { "role": "user", "content": "Siapa saja anak kelas 7A yang izin hari ini?" },
    { "role": "assistant", "content": [ "... the text block + the two tool_use blocks above ..." ] },
    {
      "role": "user",
      "content": [
        { "type": "tool_result", "tool_use_id": "toolu_01", "content": "{\n  \"total\": 2,\n  \"data\": [ ... ]\n}" },
        { "type": "tool_result", "tool_use_id": "toolu_02", "content": "{\n  \"tanggal\": \"2026-10-06\",\n  \"data\": [ ... ]\n}" }
      ]
    }
  ]
}
```

Tool results are sent as a `role: "user"` message, paired by `tool_use_id`. If the MCP server replied with `isError: true`, the host usually passes it on as `is_error: true`. That's why an error "hidden" as a plain dict (covered in the previous article) still reads as a success.

The model rereads everything from the start, matches the two results and answers: *"Of the two students in class 7A, the one on leave today is Citra Lestari (gone home for a family event)."* This time the `stop_reason` is `end_turn`, and the host shows the answer.

## So, is everything read?

**Yes. On every request, all of it.** That's the answer to the main question:

1. **The model has no memory between requests.** The API is *stateless*. A conversation's "memory" is just the history the host sends again every time. In step 4 the model didn't "continue"; it reread the whole conversation from the start.
2. **Every tool definition rides along on every request.** All four tools, with docstrings and schemas, are sent again on the second, third and every later request, even if only one is used.
3. **Old tool results ride along too.** The student-list JSON from step 3 stays in the history and is read again on every following turn, until the host trims or summarises the history.
4. **"Reading" means all tokens are in context at once.** The model doesn't flip through pages. All tokens come in together and the model attends to all of them while producing each word. Nothing is skipped on purpose. But in a very long context, attention to small details in the middle can get less sharp. That's a good reason to keep the context lean.

The practical consequences:

- **Every tool pays "rent" in tokens on every turn.** Four small tools are barely noticeable. But ten servers with twenty tools each means thousands of tokens of tool definitions are spent before the user types anything.
- **A bulky tool result is paid for again and again.** JSON with `indent=2` and irrelevant fields is read again on every turn after it. Filtering fields (like `sembunyikan_sensitif()`) and capping `limit` isn't only about privacy, it's about context too.
- **Prompt caching helps the cost, not the content.** Because the beginning (tools, system) is the same from request to request, the API can cache it so it's cheaper and faster. But it is still in the context and still "read" by the model.

## Is there some kind of glossary?

**By default, no.** There is no index, table of contents or summary that gets opened on demand. The host sends the full definitions of every active tool. The MCP protocol itself has no glossary concept either. `tools/list` does support pagination (`cursor`), but that's only between host and server; the host still fetches everything and passes it to the model.

But precisely because "everything is read" is expensive, there are a few **glossary-like** patterns:

**1. Tool search / deferred loading (on the host or API side).** When there are very many tools, the host can hold back the full definitions and give the model only a search tool. In the Claude API this is called the *tool search tool*: other tools are marked `defer_loading: true`, the model initially sees only the search tool, then searches for the relevant tools. The schemas of the tools it finds are added to the context only at that moment. Claude Code uses a similar pattern for large numbers of MCP tools: the model only sees a list of names, then loads the full schema through a search before calling a tool. This is the closest thing to a "glossary": **names first, details later**.

**2. Resources aren't read unless attached.** `resources/list` contains only metadata (uri, name, description), and even that is for the host, not automatically for the model. A resource's contents enter the context only when the user or the host attaches it, and once they do, **all of it** goes in (unless the host truncates it). There is no automatic search for the relevant part.

**3. A glossary you build yourself: a search tool.** If the data is large, say thousands of students or a long document of boarding-school rules, don't make it a giant resource. Build a tool that filters on the server side, like `cari_anak(kelas=...)` with a `limit`, or a `cari_peraturan(kata_kunci=...)` (search rules by keyword) that returns only the relevant passages. The server does the "opening the glossary", and the model receives only the page it needs. This pattern is what's usually called RAG; MCP doesn't provide it automatically, but it is very easy to wrap as a tool.

**4. Docstrings as hints about order.** The sentence *"Gunakan cari_anak dulu jika id belum diketahui"* ("use cari_anak first if the id is not known yet") in the `detail_anak` docstring is a kind of mini map. The model has no other documentation about your server; the docstring is the only manual it reads.

## What never reaches the model

Just as important as what is read is what is **not**:

| Not read by the model | Why |
|---|---|
| Your Python code | Only the function name, docstring and the schema generated from type hints are sent |
| The API URL and the `ASRAMA_API_TOKEN` | They live in the server's environment and are never sent to the host |
| Filtered fields (`nik`, `no_hp_wali`, `alamat`) | Dropped by the server before sending |
| Logs on stderr | Only stdout carries the protocol, and the host doesn't pass logs to the model |
| The JSON-RPC envelope (`jsonrpc`, `id`, `method`) | Translated by the host into `tool_use` / `tool_result` blocks |
| Tools from servers that aren't enabled | The host only sends tools the user currently has switched on |

This boundary is also your security boundary. Whatever a tool returns is read by the model **and** stays in the conversation history. So filter on the server; don't count on the model "not paying attention".

## Measure it yourself

The most honest way to feel the "rent" of tool definitions is to count their tokens. Take the `tools/list` result from your server, rename `inputSchema` to `input_schema`, then compare the token count with and without tools using the token-counting endpoint:

```python
import json
import anthropic

client = anthropic.Anthropic()

# the MCP server's tools/list result, saved to a file
mcp_tools = json.load(open("tools_list.json"))["result"]["tools"]
tools = [
    {"name": t["name"], "description": t.get("description", ""), "input_schema": t["inputSchema"]}
    for t in mcp_tools
]
messages = [{"role": "user", "content": "Siapa saja anak kelas 7A yang izin hari ini?"}]

tanpa = client.messages.count_tokens(model="claude-opus-5-5", messages=messages)
dengan = client.messages.count_tokens(model="claude-opus-5-5", messages=messages, tools=tools)

print("tanpa tools :", tanpa.input_tokens)
print("dengan tools:", dengan.input_tokens)
print("biaya sewa  :", dengan.input_tokens - tanpa.input_tokens, "token per giliran")
```

(`tanpa` = without, `dengan` = with, `biaya sewa` = rent, `token per giliran` = tokens per turn.)

The difference is what the model reads **on every turn** just to get to know your tools. Try tidying the docstrings too (remove the indentation, sharpen the sentences) and see how the number changes.

## Summary

- The model isn't connected to the MCP server. The **host** talks to both and translates between them.
- What the model reads: the system prompt (including the server's `instructions`, if the host adds them), each tool's **name + docstring + schema**, and the entire conversation history, including every tool result.
- The model is **stateless**: everything is sent again and read again on every request. There is no built-in glossary.
- Glossary-like patterns exist, but they have to be built: **tool search / deferred loading** in the host, and **search tools** in your own server.
- So the three things that most determine an agent's quality stay the same: clear tool names, informative docstrings, and short tool results. Now the reason is clearer: all of it is text the model reads, again and again, on every turn.
