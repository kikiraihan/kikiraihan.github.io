---
title: "Building an MCP Server for a Boarding-School Student Data Service (Python SDK v2) — With the Raw JSON-RPC Messages"
description: "A step-by-step guide to wrapping a boarding-school student REST API as an MCP server with MCPServer (MCP Python SDK v2), then dissecting the JSON-RPC messages an AI agent actually reads."
date: 2026-10-06
original: id
tags: [Engineering, AI, MCP, Python]
---

Imagine you run a boarding school (an *asrama* or *pesantren*). Student data already lives neatly in a service: name, class, room, status, and daily attendance. One day a new need comes up: the staff want to ask an AI assistant something like *"which students in class 7A are on leave today?"*, and have it answer from the real data, not a guess.

This is where **MCP (Model Context Protocol)** comes in. In this article we will:

1. Understand where an MCP server sits between the AI and your service.
2. Build an MCP server with the **MCP Python SDK v2** (`MCPServer`).
3. Test it against a mock service.
4. Connect it to Claude Desktop.
5. **Dissect the raw JSON-RPC messages** that pass between the agent and the server, so you know exactly what the model reads.

> **Version note:** This article uses the `mcp` package 2.x (tested on 2.3.0). In version 2, the `FastMCP` class you see in older tutorials was renamed to `MCPServer`. If you are still on the old code, pin your dependency to `mcp<2`.

The code keeps its Indonesian names (`cari_anak` = find student, `kamar` = room, `absensi` = attendance, `izin` = on leave), because the JSON-RPC captures below come from running exactly this code.

---

## The Short Version: MCP Is an Adapter

An MCP server does not replace your service. It only **wraps** the endpoints you already have as *tools* the AI can call.

```
┌──────────────┐     JSON-RPC      ┌──────────────┐      HTTP/REST     ┌──────────────────┐
│ AI host      │ ◄───────────────► │ MCP Server   │ ◄────────────────► │ School service   │
│ (Claude      │   (stdio / HTTP)  │ (server.py)  │                    │ (your API)       │
│  Desktop etc)│                   │              │                    │                  │
└──────────────┘                   └──────────────┘                    └──────────────────┘
       ▲
       │ tool definitions + tool results
       ▼
┌──────────────┐
│ AI model     │
└──────────────┘
```

An MCP server can offer three kinds of "capabilities":

| Kind | What it does | Who uses it |
|---|---|---|
| **Tool** | An action that can be called (find a student, get attendance) | Chosen by the model |
| **Resource** | Data that can be read as context | Usually chosen by the host/user |
| **Prompt** | A ready-made message template | Usually chosen by the user from a menu |

---

## Project Structure

```
mcp-asrama/
├── server.py                          # MCP server
├── mock_service.py                    # mock service for testing
├── requirements.txt
└── claude_desktop_config.example.json
```

---

## Step 1 — Set Up the Project

```bash
mkdir mcp-asrama && cd mcp-asrama
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / Mac
source .venv/bin/activate
```

Contents of `requirements.txt`:

```text
mcp>=2,<3
httpx
# hanya untuk mock_service.py
fastapi
uvicorn
```

Then install:

```bash
pip install -r requirements.txt
```

---

## Step 2 — Prepare the Service (Start with a Mock)

So you can try it right away, we build a mock service with FastAPI. It imitates four endpoints, `/anak`, `/anak/{id}`, `/kamar` and `/absensi`, with simple Bearer-token authentication.

If your real service is ready, you can skip this step.

```python
"""
Service tiruan (mock) data anak asrama.
Ganti dengan service asli Anda nanti. File ini hanya untuk testing lokal.

Jalankan: uvicorn mock_service:app --port 8000
"""
from fastapi import FastAPI, HTTPException, Header, Query
from typing import Optional

app = FastAPI(title="Service Data Anak Asrama (Mock)")

TOKEN_VALID = "rahasia123"

DATA_ANAK = [
    {"id": "A001", "nama": "Ahmad Fauzi", "kelas": "7A", "kamar": "Al-Fatih 1",
     "status": "aktif", "nik": "3171xxxxxxxx0001", "no_hp_wali": "0812xxxx001",
     "alamat": "Jl. Melati No. 1, Bogor", "nama_wali": "Bapak Hasan"},
    {"id": "A002", "nama": "Budi Santoso", "kelas": "8B", "kamar": "Al-Fatih 1",
     "status": "aktif", "nik": "3171xxxxxxxx0002", "no_hp_wali": "0812xxxx002",
     "alamat": "Jl. Mawar No. 2, Depok", "nama_wali": "Ibu Sari"},
    {"id": "A003", "nama": "Citra Lestari", "kelas": "7A", "kamar": "Aisyah 2",
     "status": "izin", "nik": "3171xxxxxxxx0003", "no_hp_wali": "0812xxxx003",
     "alamat": "Jl. Kenanga No. 3, Bekasi", "nama_wali": "Bapak Joko"},
]

DATA_KAMAR = [
    {"nama": "Al-Fatih 1", "gedung": "Putra", "kapasitas": 6, "musyrif": "Ust. Ridwan"},
    {"nama": "Aisyah 2", "gedung": "Putri", "kapasitas": 6, "musyrif": "Ustz. Halimah"},
]

DATA_ABSENSI = {
    "2026-10-06": [
        {"id_anak": "A001", "status": "hadir"},
        {"id_anak": "A002", "status": "hadir"},
        {"id_anak": "A003", "status": "izin", "keterangan": "Pulang, acara keluarga"},
    ]
}


def cek_token(authorization: Optional[str]):
    if authorization != f"Bearer {TOKEN_VALID}":
        raise HTTPException(status_code=401, detail="Token tidak valid")


@app.get("/anak")
def list_anak(
    nama: Optional[str] = None,
    kelas: Optional[str] = None,
    kamar: Optional[str] = None,
    limit: int = Query(20, le=100),
    authorization: Optional[str] = Header(None),
):
    cek_token(authorization)
    hasil = DATA_ANAK
    if nama:
        hasil = [a for a in hasil if nama.lower() in a["nama"].lower()]
    if kelas:
        hasil = [a for a in hasil if a["kelas"].lower() == kelas.lower()]
    if kamar:
        hasil = [a for a in hasil if a["kamar"].lower() == kamar.lower()]
    return {"total": len(hasil), "data": hasil[:limit]}


@app.get("/anak/{id_anak}")
def detail_anak(id_anak: str, authorization: Optional[str] = Header(None)):
    cek_token(authorization)
    for a in DATA_ANAK:
        if a["id"] == id_anak:
            return a
    raise HTTPException(status_code=404, detail="Anak tidak ditemukan")


@app.get("/kamar")
def list_kamar(authorization: Optional[str] = Header(None)):
    cek_token(authorization)
    hasil = []
    for k in DATA_KAMAR:
        terisi = len([a for a in DATA_ANAK if a["kamar"] == k["nama"]])
        hasil.append({**k, "terisi": terisi})
    return {"data": hasil}


@app.get("/absensi")
def absensi(tanggal: str, authorization: Optional[str] = Header(None)):
    cek_token(authorization)
    return {"tanggal": tanggal, "data": DATA_ABSENSI.get(tanggal, [])}
```

Run it:

```bash
uvicorn mock_service:app --port 8000
```

Note that the mock data deliberately contains sensitive fields (`nik` — national ID number, `no_hp_wali` — guardian's phone, `alamat` — address). Later we filter them out in the MCP server so they never reach the AI model.

---

## Step 3 — Write the MCP Server

This is the heart of the article. Save it as `server.py`:

```python
"""
MCP Server: Data Anak Asrama
Menjembatani AI (Claude, dll.) dengan service data anak asrama via REST API.

Jalankan (stdio): python server.py
Testing:          npx @modelcontextprotocol/inspector python server.py
"""
import os
import sys
import logging
from typing import Any, Optional

import httpx
from mcp.server.mcpserver import MCPServer  # SDK v2 (dulu: FastMCP)

# ---------------------------------------------------------------------------
# Konfigurasi
# ---------------------------------------------------------------------------
API_BASE_URL = os.getenv("ASRAMA_API_URL", "http://localhost:8000")
API_TOKEN = os.getenv("ASRAMA_API_TOKEN", "")

# PENTING: mode stdio memakai stdout untuk protokol MCP.
# Jangan pernah print() ke stdout, log harus ke stderr.
logging.basicConfig(stream=sys.stderr, level=logging.INFO)
log = logging.getLogger("mcp-asrama")

# Field sensitif yang tidak boleh dikirim ke AI (data anak = data pribadi).
FIELD_SENSITIF = {"nik", "no_hp_wali", "alamat"}

mcp = MCPServer(
    "asrama",
    instructions="Akses read-only ke data anak asrama: pencarian anak, detail, kamar, dan absensi.",
)


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
async def panggil_api(path: str, params: Optional[dict] = None) -> Any:
    """Panggil service asrama. Error dikembalikan sebagai dict agar AI bisa membacanya."""
    headers = {"Authorization": f"Bearer {API_TOKEN}"} if API_TOKEN else {}
    # buang parameter yang kosong
    params = {k: v for k, v in (params or {}).items() if v not in (None, "")}
    try:
        async with httpx.AsyncClient(base_url=API_BASE_URL, timeout=15) as client:
            resp = await client.get(path, params=params, headers=headers)
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as e:
        log.warning("API error %s pada %s", e.response.status_code, path)
        return {"error": f"Service mengembalikan status {e.response.status_code}",
                "detail": e.response.text[:300]}
    except httpx.RequestError as e:
        log.error("Gagal konek ke service: %s", e)
        return {"error": "Tidak bisa terhubung ke service asrama"}


def sembunyikan_sensitif(data: Any) -> Any:
    """Hapus field sensitif secara rekursif sebelum dikirim ke model."""
    if isinstance(data, dict):
        return {k: sembunyikan_sensitif(v) for k, v in data.items() if k not in FIELD_SENSITIF}
    if isinstance(data, list):
        return [sembunyikan_sensitif(x) for x in data]
    return data


# ---------------------------------------------------------------------------
# Tools: aksi yang bisa dipanggil AI
# Docstring + type hint dipakai otomatis sebagai deskripsi & schema tool,
# jadi tulis sejelas mungkin.
# ---------------------------------------------------------------------------
@mcp.tool()
async def cari_anak(
    nama: Optional[str] = None,
    kelas: Optional[str] = None,
    kamar: Optional[str] = None,
    limit: int = 20,
) -> dict:
    """Cari anak asrama berdasarkan nama (sebagian), kelas (mis. '7A'), atau nama kamar.
    Semua filter opsional. Mengembalikan daftar ringkas anak beserta id-nya."""
    hasil = await panggil_api("/anak", {"nama": nama, "kelas": kelas,
                                        "kamar": kamar, "limit": min(limit, 100)})
    return sembunyikan_sensitif(hasil)


@mcp.tool()
async def detail_anak(id_anak: str) -> dict:
    """Ambil detail satu anak asrama berdasarkan id (mis. 'A001').
    Gunakan cari_anak dulu jika id belum diketahui."""
    hasil = await panggil_api(f"/anak/{id_anak}")
    return sembunyikan_sensitif(hasil)


@mcp.tool()
async def daftar_kamar() -> dict:
    """Daftar semua kamar asrama beserta gedung, kapasitas, jumlah terisi, dan musyrif."""
    return await panggil_api("/kamar")


@mcp.tool()
async def absensi_harian(tanggal: str) -> dict:
    """Rekap absensi anak asrama pada tanggal tertentu. Format tanggal: YYYY-MM-DD."""
    return await panggil_api("/absensi", {"tanggal": tanggal})


# ---------------------------------------------------------------------------
# Resource: data yang bisa "dibaca" sebagai konteks (opsional)
# ---------------------------------------------------------------------------
@mcp.resource("asrama://kamar")
async def resource_kamar() -> str:
    """Daftar kamar asrama sebagai konteks."""
    import json
    data = await panggil_api("/kamar")
    return json.dumps(data, ensure_ascii=False, indent=2)


# ---------------------------------------------------------------------------
# Prompt: template siap pakai (opsional)
# ---------------------------------------------------------------------------
@mcp.prompt()
def laporan_kamar(nama_kamar: str) -> str:
    """Template untuk membuat laporan singkat satu kamar."""
    return (f"Buatkan laporan singkat untuk kamar '{nama_kamar}': daftar penghuni, "
            f"jumlah terisi vs kapasitas, dan siapa yang tidak hadir hari ini.")


if __name__ == "__main__":
    log.info("MCP Asrama berjalan, API: %s", API_BASE_URL)
    mcp.run()  # default transport: stdio
```

### Code Walkthrough

**`MCPServer("asrama", instructions=...)`** creates a server named `asrama`. The `instructions` text is sent to the host during the handshake and is often passed on to the model as general guidance.

**`panggil_api()`** ("call API") is the single doorway to your service. Every HTTP error and connection error is caught here and returned as a message the AI can read. Empty parameters are dropped so the query string stays clean.

**`sembunyikan_sensitif()`** ("hide sensitive") removes `nik`, `no_hp_wali` and `alamat` before the data goes to the model. Student data is personal data (relevant to Indonesia's Personal Data Protection Law), so the principle is: **send the model only what it really needs**.

**`@mcp.tool()`** turns a Python function into an MCP tool. What to remember:

- The function name becomes the tool name.
- The docstring becomes the tool description, and **the model picks tools based on this text**.
- Type hints are turned into a JSON Schema for argument validation.

**`mcp.run()`** runs the server over the `stdio` transport by default. The host starts `python server.py` as a subprocess and talks to it over stdin/stdout.

> ⚠️ **Never `print()` in a stdio server.** Stdout carries the protocol messages. One stray `print()` can break the connection. Use `logging` to stderr as in the example.

---

## Step 4 — Adapt It to Your Real Service

To connect it to the real service:

1. Change the endpoint path in each tool (`/anak`, `/kamar`, …) to match your API.
2. Set the URL and token through the `ASRAMA_API_URL` and `ASRAMA_API_TOKEN` environment variables.
3. Adjust `FIELD_SENSITIF` to the field names your service uses.
4. For extra features (violations, Qur'an memorisation, health records), just add new functions with `@mcp.tool()`.

---

## Step 5 — Test with MCP Inspector

MCP Inspector is a browser-based UI for trying an MCP server without any AI:

```bash
npx @modelcontextprotocol/inspector python server.py
```

From the Inspector you can see the list of tools, fill in arguments and call them by hand. Make a habit of testing here before connecting it to an AI.

---

## Step 6 — Connect to Claude Desktop

Open **Settings → Developer → Edit Config** and add:

```json
{
  "mcpServers": {
    "asrama": {
      "command": "C:\\path\\ke\\mcp-asrama\\.venv\\Scripts\\python.exe",
      "args": ["C:\\path\\ke\\mcp-asrama\\server.py"],
      "env": {
        "ASRAMA_API_URL": "http://localhost:8000",
        "ASRAMA_API_TOKEN": "rahasia123"
      }
    }
  }
}
```

On Linux/Mac, change the path to something like `/home/user/mcp-asrama/.venv/bin/python`. After restarting Claude Desktop, try asking:

> *"Who are the students in class 7A, and who is on leave?"*

---

## Dissecting JSON-RPC: What Does the Agent Actually Read?

This part is often skipped in tutorials, yet it helps a lot when debugging. MCP uses **JSON-RPC 2.0**. In stdio mode, each message is one line of JSON sent over stdin/stdout.

All the examples below are **real captures** from running the `server.py` above (`mcp` package 2.3.0) against the mock service.

There are two layers of readers to tell apart:

1. The **host** (Claude Desktop, Cursor, etc.) reads the entire JSON-RPC message.
2. The **AI model** only receives part of it, passed on by the host.

### 1. Handshake: `initialize`

As soon as it connects, the host sends `initialize`:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {},
    "clientInfo": { "name": "probe", "version": "1" }
  }
}
```

The server replies with the capabilities it has:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "capabilities": {
      "prompts":   { "listChanged": false },
      "resources": { "listChanged": false, "subscribe": false },
      "tools":     { "listChanged": false }
    },
    "instructions": "Akses read-only ke data anak asrama: pencarian anak, detail, kamar, dan absensi.",
    "protocolVersion": "2025-06-18",
    "serverInfo": { "name": "asrama", "version": "" }
  }
}
```

The host then sends a notification that initialization is done. Because it is a notification (no `id`), the server does not reply:

```json
{ "jsonrpc": "2.0", "method": "notifications/initialized" }
```

Notice that the `instructions` from the `MCPServer` constructor show up here. `serverInfo.version` is empty because we did not pass a `version` to the constructor.

### 2. Listing Tools: `tools/list`

The host asks for the list of tools:

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

The server's reply (complete, all four tools):

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "cari_anak",
        "description": "Cari anak asrama berdasarkan nama (sebagian), kelas (mis. '7A'), atau nama kamar.\n    Semua filter opsional. Mengembalikan daftar ringkas anak beserta id-nya.",
        "inputSchema": {
          "type": "object",
          "title": "cari_anakArguments",
          "properties": {
            "nama":  { "anyOf": [{ "type": "string" }, { "type": "null" }], "default": null, "title": "Nama" },
            "kelas": { "anyOf": [{ "type": "string" }, { "type": "null" }], "default": null, "title": "Kelas" },
            "kamar": { "anyOf": [{ "type": "string" }, { "type": "null" }], "default": null, "title": "Kamar" },
            "limit": { "type": "integer", "default": 20, "title": "Limit" }
          }
        }
      },
      {
        "name": "detail_anak",
        "description": "Ambil detail satu anak asrama berdasarkan id (mis. 'A001').\n    Gunakan cari_anak dulu jika id belum diketahui.",
        "inputSchema": {
          "type": "object",
          "title": "detail_anakArguments",
          "properties": {
            "id_anak": { "type": "string", "title": "Id Anak" }
          },
          "required": ["id_anak"]
        }
      },
      {
        "name": "daftar_kamar",
        "description": "Daftar semua kamar asrama beserta gedung, kapasitas, jumlah terisi, dan musyrif.",
        "inputSchema": {
          "type": "object",
          "title": "daftar_kamarArguments",
          "properties": {}
        }
      },
      {
        "name": "absensi_harian",
        "description": "Rekap absensi anak asrama pada tanggal tertentu. Format tanggal: YYYY-MM-DD.",
        "inputSchema": {
          "type": "object",
          "title": "absensi_harianArguments",
          "properties": {
            "tanggal": { "type": "string", "title": "Tanggal" }
          },
          "required": ["tanggal"]
        }
      }
    ]
  }
}
```

This is the part that **most shapes the agent's behaviour**. How the Python code maps to the JSON:

| In the Python code | Becomes in the JSON |
|---|---|
| Function name `cari_anak` | `"name": "cari_anak"` |
| Docstring | `"description"`, verbatim, including the `\n    ` indentation |
| `Optional[str] = None` | `anyOf: [string, null]` with `default: null` |
| `limit: int = 20` | `type: integer` with `default: 20` |
| Parameter without a default (`id_anak: str`) | Goes into `required` |
| Function without parameters | `properties: {}` |

The host passes `name`, `description` and `inputSchema` to the model as the tool definition. The model **does not see your code**; it decides when and how to call a tool from this text alone. A sentence like *"Gunakan cari_anak dulu jika id belum diketahui"* ("use cari_anak first if the id is not known yet") in the `detail_anak` docstring really does help the model put the calls in the right order.

### 3. Calling a Tool: `tools/call`

Say the user asks about the students in class 7A. The model decides to call `cari_anak`, and the host sends:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "cari_anak",
    "arguments": { "kelas": "7A" }
  }
}
```

The server's reply:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"total\": 2,\n  \"data\": [\n    {\n      \"id\": \"A001\",\n      \"nama\": \"Ahmad Fauzi\",\n      \"kelas\": \"7A\",\n      \"kamar\": \"Al-Fatih 1\",\n      \"status\": \"aktif\",\n      \"nama_wali\": \"Bapak Hasan\"\n    },\n    {\n      \"id\": \"A003\",\n      \"nama\": \"Citra Lestari\",\n      \"kelas\": \"7A\",\n      \"kamar\": \"Aisyah 2\",\n      \"status\": \"izin\",\n      \"nama_wali\": \"Bapak Joko\"\n    }\n  ]\n}"
      }
    ],
    "isError": false
  }
}
```

Two important things here:

1. The `dict` returned by the Python function is serialised as **JSON text** inside `content[].text`. That text is what the model receives as the tool result.
2. The `nik`, `no_hp_wali` and `alamat` fields are **gone**. The filtering by `sembunyikan_sensitif()` works, so sensitive data never reaches the model.

### 4. When Something Goes Wrong

There are two kinds of error, and they turn out differently.

**a) Invalid arguments.** For example, the model calls `absensi_harian` without `tanggal` (date):

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": { "name": "absensi_harian", "arguments": {} }
}
```

The SDK validates the arguments against the schema automatically, then replies:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Error executing tool absensi_harian: 1 validation error for absensi_harianArguments\ntanggal\n  Field required [type=missing, input_value={}, input_type=dict]\n    For further information visit https://errors.pydantic.dev/2.13/v/missing"
      }
    ],
    "isError": true
  }
}
```

Notice this is **not** a JSON-RPC error (there is no top-level `error` field). Tool errors are sent as a normal `result` with `isError: true`. That way the model can read the message and try again with the right arguments.

**b) Data not found.** For example, `detail_anak` is called with an id that does not exist:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": { "name": "detail_anak", "arguments": { "id_anak": "X999" } }
}
```

The reply:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"error\": \"Service mengembalikan status 404\",\n  \"detail\": \"{\\\"detail\\\":\\\"Anak tidak ditemukan\\\"}\"\n}"
      }
    ],
    "isError": false
  }
}
```

Here `isError` is **`false`**, even though an error did happen. The reason: `panggil_api()` catches the error and returns it as a plain `dict`, so the SDK treats it as a successful result. The model usually still understands from the text, but the host cannot tell it apart from a success.

**Tip:** if you want errors flagged properly, raise an exception instead of returning a `dict`:

```python
    except httpx.HTTPStatusError as e:
        log.warning("API error %s pada %s", e.response.status_code, path)
        raise ValueError(f"Service mengembalikan status {e.response.status_code}: "
                         f"{e.response.text[:300]}")
```

The SDK automatically wraps the exception into a result with `isError: true`, just like the validation case above.

### 5. Resources: `resources/list`

```json
{ "jsonrpc": "2.0", "id": 6, "method": "resources/list" }
```

The reply:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "result": {
    "resources": [
      {
        "uri": "asrama://kamar",
        "name": "resource_kamar",
        "description": "Daftar kamar asrama sebagai konteks.",
        "mimeType": "text/plain"
      }
    ]
  }
}
```

`resources/list` only contains **metadata**. The data itself is fetched only when the host calls `resources/read` with that `uri`. Unlike tools, resources are usually picked by the host or the user to attach as context, not called by the model on its own.

### 6. Prompts: `prompts/get`

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "prompts/get",
  "params": {
    "name": "laporan_kamar",
    "arguments": { "nama_kamar": "Al-Fatih 1" }
  }
}
```

The reply:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "result": {
    "description": "Template untuk membuat laporan singkat satu kamar.",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Buatkan laporan singkat untuk kamar 'Al-Fatih 1': daftar penghuni, jumlah terisi vs kapasitas, dan siapa yang tidak hadir hari ini."
        }
      }
    ]
  }
}
```

The string returned by the `laporan_kamar` ("room report") function is wrapped into a message with `role: "user"`. In Claude Desktop, a prompt like this usually shows up as a menu option and is then inserted into the conversation as if the user had typed it.

### Summary: What the Model Really Reads

The model does **not** see the `jsonrpc`, `id` or `method` envelope. All that reaches the model is:

- the server's `instructions` (depending on the host),
- each tool's `name`, `description` and `inputSchema`,
- the text inside the `content` of each tool result, along with its error status.

In other words, the quality of your agent depends heavily on three things: **clear tool names, informative docstrings, and tool results that are short and relevant**.

---

## Capturing JSON-RPC Yourself

If you want to see the raw messages from your own server, here is a small script that runs the server as a subprocess and sends messages one at a time:

```python
import json, subprocess, os

env = {**os.environ, "ASRAMA_API_TOKEN": "rahasia123"}
p = subprocess.Popen(
    ["python", "server.py"],
    stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
    text=True, env=env,
)

def send(msg, expect=True):
    print(">>> CLIENT KIRIM:\n" + json.dumps(msg, indent=2, ensure_ascii=False))
    p.stdin.write(json.dumps(msg) + "\n")
    p.stdin.flush()
    if expect:
        r = json.loads(p.stdout.readline())
        print("<<< SERVER BALAS:\n" + json.dumps(r, indent=2, ensure_ascii=False))
        print("=" * 60)

send({"jsonrpc": "2.0", "id": 1, "method": "initialize",
      "params": {"protocolVersion": "2025-06-18", "capabilities": {},
                 "clientInfo": {"name": "probe", "version": "1"}}})
send({"jsonrpc": "2.0", "method": "notifications/initialized"}, expect=False)
send({"jsonrpc": "2.0", "id": 2, "method": "tools/list"})
send({"jsonrpc": "2.0", "id": 3, "method": "tools/call",
      "params": {"name": "cari_anak", "arguments": {"kelas": "7A"}}})

p.terminate()
```

Make sure the mock service is running on port 8000 before you run this script.

---

## Tips and Good Practices

**Write docstrings for the model, not just for humans.** Mention the input format (e.g. `YYYY-MM-DD`), example values (`'7A'`), and when the tool should be used. Docstrings are sent raw, indentation included. For a cleaner result, use `@mcp.tool(description="...")` explicitly.

**Filter data before sending it.** Tool results go into the model's context. Drop sensitive and irrelevant fields; besides being safer, it also saves tokens.

**Limit the number of results.** A `limit` parameter with an upper bound (`min(limit, 100)`) stops the model from pulling thousands of rows at once.

**Start read-only.** Tools that change data (e.g. recording attendance or changing a student's status) are best added later, with strict validation and access control.

**Use stderr for logs.** This was covered already, but it is worth repeating because it is the most common cause of errors in stdio servers.

**For remote access, switch the transport.** If the MCP server is meant to be used by many people over the network, change `mcp.run()` to `mcp.run(transport="streamable-http")` and add authentication.

---

## Closing

An MCP server is basically a thin layer on top of the API you already have. With the Python SDK v2, a few decorators are enough to turn ordinary functions into tools an AI agent can use.

What makes the big difference is not the complexity of the code, but understanding **what actually gets sent to the model**. Once you see the raw JSON-RPC, it is clear that your docstrings are the "API documentation" for the model, and every tool result is context it reads along the way. Design both carefully, and your agent becomes far more reliable.
