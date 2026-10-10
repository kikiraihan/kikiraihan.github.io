---
title: "Di balik layar MCP: apa yang sebenarnya dibaca AI?"
description: "Model tidak pernah melihat kode Anda, tidak bicara JSON-RPC, dan tidak punya ingatan. Lalu bagaimana ia tahu tool mana yang harus dipanggil? Membedah perjalanan satu pertanyaan dari host ke model, dan menjawab: apakah semuanya dibaca, atau ada semacam glosarium?"
date: 2026-10-06
original: id
tags: [Engineering, AI, MCP]
---

Beberapa waktu lalu saya membuat [MCP server kecil untuk data anak asrama](/writing/mcp-server-asrama) sebagai percobaan. Servernya jalan, Claude bisa menjawab *"siapa anak kelas 7A yang izin hari ini?"*. Tapi setelah itu muncul pertanyaan yang lebih menarik dari kodenya sendiri:

- Sebenarnya **apa yang dibaca** oleh model?
- Apakah model membaca **semua** definisi tool dan semua data setiap kali, atau ada semacam **glosarium/indeks** yang ia buka seperlunya?
- Kalau model tidak melihat kode saya, dari mana ia tahu harus memanggil `cari_anak` dulu, baru `absensi_harian`?

Artikel ini tidak membahas cara membuat server (itu ada di artikel sebelumnya), tapi apa yang terjadi di belakangnya.

## Tiga pemain, bukan dua

Kesalahpahaman paling umum: "AI-nya terhubung ke MCP server". Sebenarnya ada tiga pihak, dan model justru yang paling "buta":

```
┌──────────────┐  teks/token   ┌──────────────┐   JSON-RPC    ┌──────────────┐
│ Model        │ ◄───────────► │ Host         │ ◄───────────► │ MCP server   │
│ (Claude)     │  (Messages    │ (Claude      │  (stdio /     │ (server.py)  │
│              │   API)        │  Desktop dll)│   HTTP)       │              │
└──────────────┘               └──────────────┘               └──────────────┘
```

| Pihak | Yang ia lakukan | Yang ia **tidak** lakukan |
|---|---|---|
| **MCP server** | Menjawab `tools/list`, menjalankan `tools/call`, memanggil API Anda | Tidak pernah bicara dengan model |
| **Host** (Claude Desktop, Claude Code, Cursor, …) | Bicara MCP ke server *dan* bicara API ke model, menerjemahkan di antara keduanya | Tidak memutuskan tool mana yang dipanggil |
| **Model** | Membaca teks, lalu menulis teks: jawaban, atau "permintaan memanggil tool" | Tidak membuka koneksi, tidak menjalankan kode, tidak tahu kata "MCP" |

Model hanya menerima satu hal: **sebuah request berisi teks**, lalu mengembalikan teks. Semua "kecerdasan memakai tool" terjadi karena host menyusun teks itu dengan cara tertentu.

## Perjalanan satu pertanyaan

Mari ikuti apa yang terjadi saat pengurus asrama bertanya *"Siapa saja anak kelas 7A yang izin hari ini?"*.

### 0. Sebelum ada pertanyaan

Saat host dijalankan, ia menjalankan `python server.py`, melakukan handshake `initialize`, lalu memanggil `tools/list`. Daftar tool ini **disimpan oleh host**, bukan oleh model. Host baru meminta ulang kalau server mengirim notifikasi `notifications/tools/list_changed`.

Jadi sebelum pengguna mengetik apa pun, model belum melihat apa-apa. Model bahkan belum "ada" dalam percakapan ini.

### 1. Host menyusun request pertama

Begitu pengguna menekan Enter, host menyusun request ke model. Bentuknya kira-kira seperti ini (ilustrasi dengan format Claude Messages API; isi persisnya tergantung host):

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

Perhatikan beberapa hal:

- **`inputSchema` dari MCP menjadi `input_schema`** di API. Host hanya memindahkan isinya. `name` dan `description` dari docstring Anda ikut apa adanya, termasuk indentasi `\n    `.
- **Nama tool bisa diberi awalan oleh host.** Claude Code misalnya menamainya `mcp__asrama__cari_anak` supaya tidak bentrok dengan tool dari server lain. Model tidak tahu itu "tool MCP"; baginya itu tool biasa bernama panjang.
- **`instructions` server masuk ke system prompt**, tapi ini keputusan host. Ada host yang memasukkannya, ada yang tidak.
- **Tanggal hari ini** datang dari host. Model tidak punya jam. Kalau host tidak menulis tanggal di system prompt, model tidak tahu apa arti "hari ini" dan harus menebak atau bertanya.

Lalu, apakah JSON di atas yang dibaca model? Tidak persis. API mengubah definisi tool, system prompt, dan pesan menjadi satu rangkaian **token** dengan urutan tetap: *tools → system → messages*. Dokumentasi Anthropic menyebut definisi tool dirangkai menjadi bagian khusus dari system prompt. Jadi bagi model, docstring Anda adalah **teks di awal prompt**, sejajar dengan instruksi lainnya.

### 2. Model "memanggil" tool, padahal hanya menulis teks

Model membaca semuanya, lalu membalas:

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

Model tidak menjalankan apa pun. Ia hanya menghasilkan blok terstruktur yang berkata "tolong jalankan ini", lalu berhenti dengan `stop_reason: "tool_use"`. Di sini model meminta **dua tool sekaligus** (parallel tool use) karena keduanya tidak saling bergantung. Tanggalnya ia ambil dari system prompt.

### 3. Host menerjemahkan ke JSON-RPC

Host melihat nama `mcp__asrama__cari_anak`, tahu itu milik server `asrama`, lalu mengirim `tools/call` dengan nama asli `cari_anak`, persis seperti yang dibedah di artikel sebelumnya. Server memanggil REST API, menyaring field sensitif, lalu membalas `content[].text` berisi JSON.

### 4. Hasil tool masuk ke percakapan, lalu **semuanya dikirim ulang**

Ini bagian yang paling sering tidak disadari. Host menambahkan dua pesan ke riwayat, lalu mengirim **request baru yang lengkap** ke model:

```json
{
  "system": "... (sama seperti tadi) ...",
  "tools": [ "... (keempat tool, lengkap, sama seperti tadi) ..." ],
  "messages": [
    { "role": "user", "content": "Siapa saja anak kelas 7A yang izin hari ini?" },
    { "role": "assistant", "content": [ "... blok text + dua blok tool_use di atas ..." ] },
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

Hasil tool dikirim sebagai pesan ber-`role: "user"`, dipasangkan dengan `tool_use_id`. Kalau MCP server membalas `isError: true`, host biasanya meneruskannya sebagai `is_error: true`. Itu sebabnya error yang "disembunyikan" sebagai dict biasa (dibahas di artikel sebelumnya) tetap terbaca sebagai sukses.

Model membaca ulang semuanya dari awal, mencocokkan dua hasil tadi, lalu menjawab: *"Dari dua anak kelas 7A, yang izin hari ini adalah Citra Lestari (pulang, acara keluarga)."* Kali ini `stop_reason`-nya `end_turn`, dan host menampilkan jawabannya.

## Jadi, apakah semuanya dibaca?

**Ya. Setiap request, semuanya.** Inilah jawaban untuk pertanyaan utama:

1. **Model tidak punya ingatan antar request.** API-nya *stateless*. "Ingatan" percakapan hanyalah riwayat yang dikirim ulang oleh host setiap kali. Di langkah 4 tadi model tidak "melanjutkan"; ia membaca ulang seluruh percakapan dari awal.
2. **Semua definisi tool ikut di setiap request.** Keempat tool, lengkap dengan docstring dan schema, dikirim lagi di request kedua, ketiga, dan seterusnya, walaupun yang dipakai cuma satu.
3. **Hasil tool lama juga ikut.** JSON daftar anak dari langkah 3 tetap ada di riwayat dan terbaca lagi di setiap giliran berikutnya, sampai host memangkas atau meringkas riwayatnya.
4. **"Membaca" berarti semua token ada di konteks sekaligus.** Model tidak membuka-buka halaman. Semua token masuk bersamaan dan model memperhatikan seluruhnya saat menghasilkan setiap kata. Tidak ada bagian yang dilewati secara sengaja. Tapi pada konteks yang sangat panjang, perhatian terhadap detail kecil di tengah bisa kurang tajam. Ini alasan bagus untuk menjaga konteks tetap ringkas.

Konsekuensinya praktis:

- **Setiap tool punya "biaya sewa" token di setiap giliran.** Empat tool kecil tidak terasa. Tapi sepuluh server dengan dua puluh tool masing-masing berarti ribuan token definisi tool sudah terpakai sebelum pengguna mengetik apa pun.
- **Hasil tool yang gemuk dibayar berulang kali.** JSON dengan `indent=2` dan field yang tidak relevan terbaca lagi di setiap giliran setelahnya. Menyaring field (seperti `sembunyikan_sensitif()`) dan membatasi `limit` tidak cuma soal privasi, tapi juga soal konteks.
- **Prompt caching membantu biaya, bukan isi.** Karena bagian awal (tools, system) sama dari request ke request, API bisa menyimpannya dalam cache sehingga lebih murah dan cepat. Tapi isinya tetap ada di konteks dan tetap "dibaca" model.

## Apakah ada semacam glosarium?

**Secara default, tidak.** Tidak ada indeks, daftar isi, atau ringkasan yang dibuka seperlunya. Host mengirim definisi lengkap semua tool yang aktif. Protokol MCP sendiri juga tidak punya konsep glosarium. `tools/list` memang mendukung paginasi (`cursor`), tapi itu hanya urusan host dan server; host tetap mengambil semuanya lalu meneruskannya ke model.

Tapi justru karena "semua dibaca" itu mahal, ada beberapa pola yang **mirip glosarium**:

**1. Tool search / deferred loading (di sisi host atau API).** Ketika tool-nya sangat banyak, host bisa menahan definisi lengkap dan hanya memberi model sebuah tool pencari. Di Claude API ini disebut *tool search tool*: tool lain ditandai `defer_loading: true`, model awalnya hanya melihat alat pencarinya, lalu mencari tool yang relevan. Schema tool yang ditemukan baru ditambahkan ke konteks saat itu. Claude Code memakai pola serupa untuk MCP tool dalam jumlah besar: model hanya melihat daftar nama, lalu memuat schema lengkap lewat pencarian sebelum memanggilnya. Inilah yang paling mendekati "glosarium": **nama dulu, detail belakangan**.

**2. Resource tidak dibaca kecuali dilampirkan.** `resources/list` hanya berisi metadata (uri, nama, deskripsi), dan itu pun untuk host, bukan otomatis untuk model. Isi resource baru masuk ke konteks saat pengguna atau host melampirkannya, dan begitu masuk, **seluruh isinya** masuk (kecuali host memotongnya). Tidak ada pencarian bagian yang relevan secara otomatis.

**3. Glosarium yang Anda buat sendiri: tool pencarian.** Kalau datanya besar, misalnya ribuan anak atau dokumen peraturan asrama yang panjang, jangan jadikan resource raksasa. Buat tool yang menyaring di sisi server, seperti `cari_anak(kelas=...)` dengan `limit`, atau `cari_peraturan(kata_kunci=...)` yang mengembalikan potongan yang relevan saja. Server yang melakukan "membuka glosarium", lalu model hanya menerima halaman yang dibutuhkan. Pola inilah yang biasanya disebut RAG; MCP tidak menyediakannya otomatis, tapi sangat mudah dibungkus sebagai tool.

**4. Docstring sebagai petunjuk urutan.** Kalimat *"Gunakan cari_anak dulu jika id belum diketahui"* di docstring `detail_anak` adalah semacam peta mini. Model tidak punya dokumentasi lain tentang server Anda; docstring-lah satu-satunya manual yang ia baca.

## Yang tidak pernah sampai ke model

Sama pentingnya dengan yang dibaca adalah yang **tidak** dibaca:

| Tidak dibaca model | Kenapa |
|---|---|
| Kode Python Anda | Hanya nama fungsi, docstring, dan schema hasil type hint yang dikirim |
| URL API dan token `ASRAMA_API_TOKEN` | Hidup di environment server, tidak pernah dikirim ke host |
| Field yang disaring (`nik`, `no_hp_wali`, `alamat`) | Dibuang server sebelum dikirim |
| Log di stderr | Hanya stdout yang dipakai protokol, dan host tidak meneruskan log ke model |
| Amplop JSON-RPC (`jsonrpc`, `id`, `method`) | Diterjemahkan host menjadi blok `tool_use` / `tool_result` |
| Tool dari server yang tidak aktif | Host hanya mengirim tool yang sedang diaktifkan pengguna |

Batas ini juga batas keamanan Anda. Apa pun yang dikembalikan tool akan dibaca model **dan** tetap ada di riwayat percakapan. Jadi saringlah di server, jangan berharap model "tidak memperhatikan".

## Coba ukur sendiri

Cara paling jujur untuk merasakan "biaya sewa" definisi tool adalah menghitung token-nya. Ambil hasil `tools/list` dari server Anda, ganti `inputSchema` menjadi `input_schema`, lalu bandingkan jumlah token dengan dan tanpa tools memakai endpoint token counting:

```python
import json
import anthropic

client = anthropic.Anthropic()

# hasil tools/list dari MCP server, disimpan ke file
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

Selisihnya adalah token yang dibaca model **di setiap giliran** hanya untuk mengenal tool Anda. Coba juga rapikan docstring (hapus indentasi, perjelas kalimat) dan lihat bagaimana angkanya berubah.

## Ringkasan

- Model tidak terhubung ke MCP server. **Host** yang bicara ke keduanya dan menerjemahkan di antaranya.
- Yang dibaca model: system prompt (termasuk `instructions` server, kalau host memasukkannya), **nama + docstring + schema** setiap tool, dan seluruh riwayat percakapan termasuk semua hasil tool.
- Model **stateless**: semuanya dikirim ulang dan dibaca ulang di setiap request. Tidak ada glosarium bawaan.
- Pola mirip glosarium ada, tapi harus dibangun: **tool search / deferred loading** di host, dan **tool pencarian** di server Anda sendiri.
- Karena itu, tiga hal paling menentukan kualitas agent tetap sama: nama tool yang jelas, docstring yang informatif, dan hasil tool yang ringkas. Sekarang alasannya lebih jelas: semua itu adalah teks yang dibaca model, berulang kali, di setiap giliran.
