---
title: "Membuat MCP Server untuk Service Data Anak Asrama (Python SDK v2) — Lengkap dengan Isi JSON-RPC Mentahnya"
description: "Panduan langkah demi langkah membungkus REST API data anak asrama menjadi MCP server dengan MCPServer (SDK MCP Python v2), lalu membedah pesan JSON-RPC yang sebenarnya dibaca oleh agent AI."
date: 2026-10-06
original: id
lab: true
tags: [Engineering, AI, MCP, Python]
---

Bayangkan Anda mengelola sebuah asrama atau pesantren. Data anak sudah tersimpan rapi di sebuah service: nama, kelas, kamar, status, dan absensi harian. Suatu hari muncul kebutuhan baru: pengurus ingin bisa bertanya ke asisten AI, misalnya *"siapa saja anak kelas 7A yang izin hari ini?"*, lalu AI menjawab berdasarkan data asli, bukan tebakan.

Di sinilah **MCP (Model Context Protocol)** berperan. Dalam artikel ini kita akan:

1. Memahami posisi MCP server di antara AI dan service Anda.
2. Membuat MCP server dengan **SDK MCP Python v2** (`MCPServer`).
3. Mengujinya dengan service tiruan (mock).
4. Menyambungkannya ke Claude Desktop.
5. **Membedah pesan JSON-RPC mentah** yang lewat di antara agent dan server, supaya Anda paham persis apa yang dibaca oleh model.

> **Catatan versi:** Artikel ini memakai paket `mcp` versi 2.x (diuji di 2.3.0). Di versi 2, kelas `FastMCP` yang sering muncul di tutorial lama sudah diganti menjadi `MCPServer`. Kalau Anda masih memakai kode lama, pin dependensi ke `mcp<2`.

---

## Konsep Singkat: MCP Itu Adaptor

MCP server tidak menggantikan service Anda. Ia hanya **membungkus** endpoint-endpoint yang sudah ada menjadi *tools* yang bisa dipanggil AI.

```
┌──────────────┐     JSON-RPC      ┌──────────────┐      HTTP/REST     ┌──────────────────┐
│ Host AI      │ ◄───────────────► │ MCP Server   │ ◄────────────────► │ Service Asrama   │
│ (Claude      │   (stdio / HTTP)  │ (server.py)  │                    │ (API Anda)       │
│  Desktop dll)│                   │              │                    │                  │
└──────────────┘                   └──────────────┘                    └──────────────────┘
       ▲
       │ definisi tool + hasil tool
       ▼
┌──────────────┐
│ Model AI     │
└──────────────┘
```

Ada tiga jenis "kemampuan" yang bisa ditawarkan MCP server:

| Jenis | Fungsi | Siapa yang memakai |
|---|---|---|
| **Tool** | Aksi yang bisa dipanggil (cari anak, ambil absensi) | Dipilih oleh model |
| **Resource** | Data yang bisa dibaca sebagai konteks | Biasanya dipilih host/user |
| **Prompt** | Template pesan siap pakai | Biasanya dipilih user dari menu |

---

## Struktur Proyek

```
mcp-asrama/
├── server.py                          # MCP server
├── mock_service.py                    # service tiruan untuk testing
├── requirements.txt
└── claude_desktop_config.example.json
```

---

## Langkah 1 — Siapkan Proyek

```bash
mkdir mcp-asrama && cd mcp-asrama
python -m venv .venv

# Windows
.venv\Scripts\activate
# Linux / Mac
source .venv/bin/activate
```

Isi `requirements.txt`:

```text
mcp>=2,<3
httpx
# hanya untuk mock_service.py
fastapi
uvicorn
```

Lalu install:

```bash
pip install -r requirements.txt
```

---

## Langkah 2 — Siapkan Service (Pakai Mock Dulu)

Supaya bisa langsung dicoba, kita buat service tiruan dengan FastAPI. Service ini meniru empat endpoint: `/anak`, `/anak/{id}`, `/kamar`, dan `/absensi`, dengan autentikasi Bearer token sederhana.

Kalau service asli Anda sudah siap, langkah ini boleh dilewati.

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

Jalankan:

```bash
uvicorn mock_service:app --port 8000
```

Perhatikan bahwa data mock sengaja berisi field sensitif (`nik`, `no_hp_wali`, `alamat`). Nanti kita akan menyaringnya di MCP server agar tidak sampai ke model AI.

---

## Langkah 3 — Tulis MCP Server

Inilah inti artikel ini. Simpan sebagai `server.py`:

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

### Bedah Kode

**`MCPServer("asrama", instructions=...)`** membuat server bernama `asrama`. Teks `instructions` akan dikirim ke host saat handshake dan sering diteruskan ke model sebagai petunjuk umum.

**`panggil_api()`** adalah satu-satunya pintu ke service Anda. Semua error HTTP dan error koneksi ditangkap di sini, lalu dikembalikan sebagai pesan yang bisa dibaca AI. Parameter yang kosong dibuang supaya query string tetap bersih.

**`sembunyikan_sensitif()`** menghapus `nik`, `no_hp_wali`, dan `alamat` sebelum data dikirim ke model. Data anak termasuk data pribadi (relevan dengan UU Pelindungan Data Pribadi), jadi prinsipnya: **kirim ke model hanya yang benar-benar dibutuhkan**.

**`@mcp.tool()`** mengubah fungsi Python menjadi tool MCP. Yang perlu Anda ingat:

- Nama fungsi menjadi nama tool.
- Docstring menjadi deskripsi tool, dan **model memilih tool berdasarkan teks ini**.
- Type hint diubah menjadi JSON Schema untuk validasi argumen.

**`mcp.run()`** menjalankan server dengan transport `stdio` secara default. Host akan menjalankan `python server.py` sebagai subprocess lalu berkomunikasi lewat stdin/stdout.

> ⚠️ **Jangan pernah `print()` di server stdio.** Stdout dipakai untuk pesan protokol. Satu `print()` yang nyasar bisa merusak koneksi. Gunakan `logging` ke stderr seperti di contoh.

---

## Langkah 4 — Sesuaikan dengan Service Asli Anda

Untuk menyambungkan ke service sungguhan:

1. Ubah path endpoint di setiap tool (`/anak`, `/kamar`, dst.) agar sesuai dengan API Anda.
2. Atur URL dan token lewat environment variable `ASRAMA_API_URL` dan `ASRAMA_API_TOKEN`.
3. Sesuaikan `FIELD_SENSITIF` dengan nama field di service Anda.
4. Untuk fitur tambahan (pelanggaran, hafalan, kesehatan), cukup tambah fungsi baru dengan `@mcp.tool()`.

---

## Langkah 5 — Uji dengan MCP Inspector

MCP Inspector adalah UI berbasis browser untuk mencoba server MCP tanpa perlu AI:

```bash
npx @modelcontextprotocol/inspector python server.py
```

Dari Inspector Anda bisa melihat daftar tool, mengisi argumen, dan memanggilnya secara manual. Biasakan menguji di sini dulu sebelum menyambungkan ke AI.

---

## Langkah 6 — Sambungkan ke Claude Desktop

Buka **Settings → Developer → Edit Config**, lalu tambahkan:

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

Di Linux/Mac, ganti path-nya menjadi seperti `/home/user/mcp-asrama/.venv/bin/python`. Setelah Claude Desktop di-restart, coba tanya:

> *"Siapa saja anak kelas 7A, dan siapa yang sedang izin?"*

---

## Membedah JSON-RPC: Apa yang Sebenarnya Dibaca Agent?

Bagian ini sering terlewat di tutorial, padahal sangat membantu saat debugging. MCP memakai **JSON-RPC 2.0**. Di mode stdio, setiap pesan adalah satu baris JSON yang dikirim lewat stdin/stdout.

Semua contoh di bawah adalah **tangkapan asli** dari menjalankan `server.py` di atas (paket `mcp` 2.3.0) terhadap service mock.

Ada dua lapisan pembaca yang perlu dibedakan:

1. **Host** (Claude Desktop, Cursor, dll.) membaca seluruh pesan JSON-RPC.
2. **Model AI** hanya menerima sebagian isinya, yang diteruskan oleh host.

### 1. Handshake: `initialize`

Begitu terhubung, host mengirim `initialize`:

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

Server membalas dengan kemampuan yang dimilikinya:

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

Host kemudian mengirim notifikasi bahwa inisialisasi selesai. Karena ini notifikasi (tanpa `id`), server tidak membalas:

```json
{ "jsonrpc": "2.0", "method": "notifications/initialized" }
```

Perhatikan bahwa `instructions` dari konstruktor `MCPServer` muncul di sini. `serverInfo.version` kosong karena kita tidak mengisi parameter `version` di konstruktor.

### 2. Daftar Tool: `tools/list`

Host meminta daftar tool:

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

Balasan server (lengkap, keempat tool):

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

Inilah bagian yang **paling menentukan perilaku agent**. Pemetaan dari kode Python ke JSON-nya:

| Di kode Python | Menjadi di JSON |
|---|---|
| Nama fungsi `cari_anak` | `"name": "cari_anak"` |
| Docstring | `"description"`, apa adanya, termasuk indentasi `\n    ` |
| `Optional[str] = None` | `anyOf: [string, null]` dengan `default: null` |
| `limit: int = 20` | `type: integer` dengan `default: 20` |
| Parameter tanpa default (`id_anak: str`) | Masuk ke `required` |
| Fungsi tanpa parameter | `properties: {}` |

Host meneruskan `name`, `description`, dan `inputSchema` ke model sebagai definisi tool. Model **tidak melihat kode Anda**; ia memutuskan kapan dan bagaimana memanggil tool hanya dari teks ini. Kalimat seperti *"Gunakan cari_anak dulu jika id belum diketahui"* di docstring `detail_anak` benar-benar membantu model menyusun urutan pemanggilan yang tepat.

### 3. Memanggil Tool: `tools/call`

Misalkan user bertanya tentang anak kelas 7A. Model memutuskan memanggil `cari_anak`, dan host mengirim:

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

Balasan server:

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

Ada dua hal penting di sini:

1. `dict` yang dikembalikan fungsi Python diserialisasi menjadi **teks JSON** di dalam `content[].text`. Teks inilah yang diterima model sebagai hasil tool.
2. Field `nik`, `no_hp_wali`, dan `alamat` **tidak ada**. Penyaringan oleh `sembunyikan_sensitif()` bekerja, jadi data sensitif tidak pernah sampai ke model.

### 4. Ketika Terjadi Error

Ada dua jenis error, dan hasilnya ternyata berbeda.

**a) Argumen tidak valid.** Misalnya model memanggil `absensi_harian` tanpa `tanggal`:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": { "name": "absensi_harian", "arguments": {} }
}
```

SDK memvalidasi argumen secara otomatis berdasarkan schema, lalu membalas:

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

Perhatikan bahwa ini **bukan** error JSON-RPC (tidak ada field `error` di level atas). Error tool dikirim sebagai `result` biasa dengan `isError: true`. Dengan begitu, model bisa membaca pesannya dan mencoba lagi dengan argumen yang benar.

**b) Data tidak ditemukan.** Misalnya `detail_anak` dipanggil dengan id yang tidak ada:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": { "name": "detail_anak", "arguments": { "id_anak": "X999" } }
}
```

Balasannya:

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

Di sini `isError` bernilai **`false`**, padahal sebenarnya terjadi error. Penyebabnya, `panggil_api()` menangkap error lalu mengembalikannya sebagai `dict` biasa, sehingga SDK menganggapnya hasil sukses. Model biasanya tetap paham dari isi teksnya, tetapi host tidak bisa membedakannya dari hasil sukses.

**Tips:** kalau ingin error ditandai dengan benar, lempar exception alih-alih mengembalikan `dict`:

```python
    except httpx.HTTPStatusError as e:
        log.warning("API error %s pada %s", e.response.status_code, path)
        raise ValueError(f"Service mengembalikan status {e.response.status_code}: "
                         f"{e.response.text[:300]}")
```

SDK akan otomatis membungkus exception tersebut menjadi hasil dengan `isError: true`, seperti pada kasus validasi di atas.

### 5. Resource: `resources/list`

```json
{ "jsonrpc": "2.0", "id": 6, "method": "resources/list" }
```

Balasan:

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

`resources/list` hanya berisi **metadata**. Isi datanya baru diambil ketika host memanggil `resources/read` dengan `uri` tersebut. Berbeda dengan tool, resource biasanya dipilih oleh host atau user untuk dilampirkan sebagai konteks, bukan dipanggil sendiri oleh model.

### 6. Prompt: `prompts/get`

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

Balasan:

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

String yang dikembalikan fungsi `laporan_kamar` dibungkus menjadi pesan ber-`role: "user"`. Di Claude Desktop, prompt seperti ini biasanya muncul sebagai pilihan di menu, lalu disisipkan ke percakapan seolah-olah user yang mengetiknya.

### Ringkasan: Yang Benar-Benar Dibaca Model

Model **tidak** melihat amplop `jsonrpc`, `id`, atau `method`. Yang sampai ke model hanyalah:

- `instructions` dari server (tergantung host),
- `name`, `description`, dan `inputSchema` setiap tool,
- teks di dalam `content` setiap hasil tool, beserta status error-nya.

Artinya, kualitas agent Anda sangat bergantung pada tiga hal: **nama tool yang jelas, docstring yang informatif, dan hasil tool yang ringkas serta relevan**.

---

## Cara Menangkap JSON-RPC Sendiri

Kalau ingin melihat pesan mentah dari server Anda sendiri, berikut skrip kecil yang menjalankan server sebagai subprocess lalu mengirim pesan satu per satu:

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

Pastikan service mock sudah berjalan di port 8000 sebelum menjalankan skrip ini.

---

## Tips dan Praktik Baik

**Tulis docstring untuk model, bukan untuk manusia saja.** Sebutkan format input (misalnya `YYYY-MM-DD`), contoh nilai (`'7A'`), dan kapan tool sebaiknya dipakai. Docstring dikirim mentah, termasuk indentasinya. Kalau ingin lebih bersih, gunakan `@mcp.tool(description="...")` secara eksplisit.

**Saring data sebelum dikirim.** Hasil tool masuk ke konteks model. Buang field sensitif dan field yang tidak relevan; selain lebih aman, ini juga menghemat token.

**Batasi jumlah hasil.** Parameter `limit` dengan batas atas (`min(limit, 100)`) mencegah model menarik ribuan baris sekaligus.

**Mulai dari read-only.** Tool yang mengubah data (misalnya input absensi atau mengubah status anak) sebaiknya ditambahkan belakangan, dengan validasi dan pembatasan akses yang ketat.

**Gunakan stderr untuk log.** Ini sudah dibahas, tetapi layak diulang karena merupakan penyebab error paling umum pada server stdio.

**Untuk akses jarak jauh, ganti transport.** Kalau MCP server ingin dipakai banyak orang lewat jaringan, ganti `mcp.run()` menjadi `mcp.run(transport="streamable-http")` dan tambahkan autentikasi.

---

## Penutup

MCP server pada dasarnya adalah lapisan tipis di atas API yang sudah Anda miliki. Dengan SDK Python v2, cukup beberapa dekorator untuk mengubah fungsi biasa menjadi tool yang bisa dipakai agent AI.

Yang membuat perbedaan besar bukan kerumitan kodenya, melainkan pemahaman tentang **apa yang sebenarnya dikirim ke model**. Setelah melihat JSON-RPC mentahnya, jelas bahwa docstring Anda adalah "dokumentasi API" untuk model, dan setiap hasil tool adalah konteks yang ikut ia baca. Rancang keduanya dengan cermat, dan agent Anda akan jauh lebih bisa diandalkan.
