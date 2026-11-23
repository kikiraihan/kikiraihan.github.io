---
title: Commit Bukan Berarti Siap
description: Split payment sukses di satu ledger tapi ditolak di ledger lain. Ternyata bukan bug, melainkan dua sistem yang punya jam masing-masing.
date: 2026-11-23
original: id
tags: [Engineering, Payment]
---

*Split payment sukses di satu ledger tapi ditolak di ledger lain. Ternyata bukan bug, melainkan dua sistem yang punya jam masing-masing.*

## "Split-nya sukses kok… di sini"

Semuanya dimulai dari satu baris di laporan tim operasional:

> Split payment sukses di sistem kita, tapi internal funds transfer-nya ditolak `INSUFFICIENT_BALANCE`.

Reaksi pertama saya jujur saja: *kok bisa?* Saldonya jelas ada. Saya buka datanya, dan uangnya memang sudah pindah. Account utama berkurang, account partner bertambah, histori split tercatat rapi, dan webhook ke merchant juga sudah terkirim.

Masalahnya ada di ledger yang **satunya lagi**.

Kami tidak memegang uang merchant sendirian. Setiap pergerakan dana di database kami juga harus dicatat di sebuah core ledger milik pihak lain. Anggap saja ini pembukuan kembar: dua buku besar yang harus selalu sama isinya. Kalau kami memindahkan Rp 30.000,00 dari account A ke account B, ledger di seberang juga harus mencatat perpindahan yang sama.

Di buku kami, transfer split itu sudah terjadi. Di buku mereka, transfer itu ditolak karena saldo dianggap tidak cukup.

Dua buku, dua cerita. Bagi tim rekonsiliasi, itu mimpi buruk.

## Dugaan pertama: "pasti urutan job-nya"

Di grup tim, dugaan yang muncul cukup masuk akal: *kemungkinan bagian sync-nya bermasalah, entah urutan trigger-nya, atau urutan job yang mengeksekusinya.*

Saya setuju arahnya. Tapi "urutan job" itu bisa berarti banyak hal, jadi saya memutuskan membaca ulang alurnya dari awal, pelan-pelan, seolah baru pertama kali melihat kodenya.

Sekilas, alurnya kelihatan sudah benar:

```text
settlement:  pending → available        ┐
split:       account utama → partner    ├─ satu DB transaction
outbox:      tulis "niat sync" transfer ┘
COMMIT
→ job outbox (afterCommit) kirim transfer ke ledger seberang
→ job report kirim file settlement ke ledger seberang
```

Settlement dulu, baru split. Job sync-nya pun pakai `afterCommit()`, jadi tidak mungkin mengirim sesuatu yang belum commit. Saya sempat berpikir, *ini sudah rapi, lalu salahnya di mana?*

Jawabannya ada di baris terakhir yang hampir saya lewati: **job report**.

## Momen "oh…"

Ledger di seberang tidak tahu apa-apa soal settlement kami sampai kami mengirim report-nya. Setelah report diterima pun, mereka tidak langsung memprosesnya. Statusnya `PENDING` dulu, lalu mereka melakukan *clearing* secara async. Baru setelah itu dana pindah dari saldo *frozen* ke *available* di sisi mereka.

Sementara itu, transfer split kami sudah berangkat duluan.

```text
waktu ─────────────────────────────────────────────────────▶
kita:        [COMMIT]
transfer:        [kirim] ✗ saldo kurang
report:              [kirim] → PENDING ........... SETTLED
seberang:    dana masih frozen ───────────────────▶ available
```

Saat itulah saya sadar sesuatu yang kedengarannya sepele tapi ternyata penting:

**`afterCommit()` itu janji ke database kita sendiri, bukan ke dunia luar.**

Commit di sisi kami berarti "data kami sudah final". Itu sama sekali tidak menjamin ledger di seberang sudah siap menerima transfer yang bergantung pada data tersebut.

Masih ada satu hal yang bikin sedikit meringis. 😅 Penolakan `INSUFFICIENT_BALANCE` itu balasan 4xx, dan sistem outbox kami menganggap 4xx sebagai kegagalan permanen. Barisnya langsung ditandai `FAILED`, padahal sweeper hanya mengambil baris `PENDING`. Jadi setelah settlement di seberang selesai sekalipun, **tidak ada yang mencoba mengirim ulang**. Transfernya hilang begitu saja.

## Godaan solusi cepat

Begitu akar masalahnya ketemu, otak langsung menawarkan solusi-solusi instan. Saya tulis semuanya, lalu saya coret satu per satu:

- **Tukar urutan dispatch, report dulu baru transfer.** Tidak cukup. Report yang sudah terkirim masih berstatus `PENDING`, belum selesai.
- **Job chain, transfer menunggu job report sukses.** Sama saja. Report sukses terkirim tidak sama dengan settlement selesai diproses.
- **Kasih delay 5 menit.** Ini yang paling menggoda. Tapi berapa lama queue, upload file, dan clearing di seberang? Hari ini 2 menit, besok bisa 20 menit. Delay tetap itu cuma tebakan yang dibungkus angka.
- **Retry semua `INSUFFICIENT_BALANCE`.** Kalau suatu saat saldonya memang benar-benar kurang, retry seperti ini akan menutupinya.
- **Panggil API mereka di dalam transaksi settlement.** Lock merchant akan tertahan selama round-trip HTTP, padahal ada belasan worker yang berebut lock yang sama. Tidak, terima kasih.

Setelah dicoret semua, polanya baru kelihatan. Semua ide itu **menebak kapan** dana siap. Yang sebenarnya saya butuhkan adalah **konfirmasi bahwa** dana sudah siap.

## Dokumentasinya bilang dua hal berbeda

Pertanyaannya jadi sederhana: status apa yang menandakan dana settlement sudah bisa dipakai di ledger seberang?

Jawabannya ternyata tidak sesederhana pertanyaannya.

Di satu halaman dokumentasi API, lifecycle settlement ditulis `PENDING → PROCESSING → SETTLED → PAYING → COMPLETED`, dengan catatan kecil bahwa `SETTLED` hanya berlaku untuk settlement ke rekening bank. Di halaman lain, endpoint query status settlement punya enum yang berbeda dan tidak ada `COMPLETED` sama sekali. Satu-satunya kalimat yang secara eksplisit bilang "dana ada di available balance" justru ada di endpoint ketiga, yaitu status per transaksi.

Saya bisa saja memilih salah satu dan berharap tebakannya benar. Tapi untuk urusan uang, berharap bukan strategi.

Jadi saya kirim pesan ke tim yang mengelola ledger itu. Saya sengaja tidak bertanya "statusnya apa ya?", karena pertanyaan terbuka seperti itu biasanya dibalas dengan pertanyaan balik. Saya tuliskan apa yang saya temukan di dokumen, kesimpulan saya, lalu minta mereka mengoreksi.

Jawaban mereka singkat, dan isinya menyederhanakan semuanya:

- Dana siap saat inquiry settlement mengembalikan **`SETTLED`**.
- Internal funds transfer itu **sinkron**. HTTP 200 dengan `success = true` berarti saldo sudah benar-benar pindah.
- Retry dengan `reference_number` yang sama boleh, tapi *coba dulu di sandbox*.

Satu sinyal, di level settlement. Ternyata saya tidak perlu mengecek status per transaksi.

## Yang ditunda cuma bayangannya

Sebelum menulis kode, saya pegang satu prinsip: **uangnya tetap pindah saat commit. Yang menunggu hanya mirror-nya ke ledger seberang.**

Balance di sisi kami, histori split, dan webhook ke merchant tidak berubah sama sekali. Settlement tetap selesai secepat sebelumnya. Satu-satunya yang ditahan adalah baris outbox transfer split, dan baris itu sekarang tahu sedang menunggu siapa:

```text
outbox.depends_on_settlement_id = settlement.id
```

Kolom ini ditulis di savepoint yang sama dengan perpindahan dananya. Kalau batch split di-rollback, niat sync-nya ikut hilang. Transfer yang bukan split tetap `NULL` dan tidak terpengaruh.

Lalu di titik tempat semua jalur pengirim outbox bertemu, saya pasang satu gerbang. Gerbang ini hanya membaca status settlement yang sudah tersimpan di database, tanpa menelepon ledger seberang. Settlement dengan 500 split tidak boleh menghasilkan 500 request inquiry.

| Status di seberang | Yang terjadi |
|---|---|
| `SETTLED` | Kirim ✅ |
| kosong / `PENDING` / `PROCESSING` | Tunggu ⏳ |
| `FAILED` / `REJECTED` | Tahan + alert 🚨 |

Ada satu detail yang menurut saya paling penting di sini: **menunggu tidak dihitung sebagai gagal.** Baris yang ditunda hanya dimundurkan `next_retry_at`-nya, sedangkan `retry_count` tidak disentuh. Kalau dihitung, settlement yang lambat akan menghabiskan jatah retry, lalu barisnya mati dengan status `FAILED`. Masalah lama akan kembali lewat pintu belakang.

## "Berarti job-nya query terus dong?"

Ini pertanyaan pertama yang muncul waktu saya menjelaskan desainnya. Pertanyaan yang wajar, karena kata "menunggu" di dalam job memang terdengar seperti `while (true) { sleep(); }`.

Jawabannya tidak. Tidak ada job yang hidup lama.

Job transfer jalan sekali. Kalau status settlement belum `SETTLED`, job itu memundurkan barisnya 10 menit lalu selesai. Barisnya diam di tabel dan tidak ada proses yang memegangnya.

Yang bertugas "mengintip" ke seberang adalah **satu watcher per settlement**. Watcher ini delayed job biasa. Ia melakukan inquiry status sekali, lalu kalau belum selesai, ia menjadwalkan dirinya lagi untuk 1 menit kemudian, lalu 2 menit, 3 menit, dan seterusnya sampai maksimal 10 menit. Jedanya diurus queue, jadi tidak ada worker yang tertahan.

Berapa pun jumlah split-nya, watcher-nya tetap satu. Duplikasinya dicegah dengan satu cache key per settlement. Kalau sudah terlalu lama menunggu, watcher berhenti dan mengirim alert, supaya tidak ada yang menunggu diam-diam selamanya.

Begitu status `SETTLED` tersimpan, entah dari watcher, polling per jam, tombol cek manual, atau langsung dari respons report, semua baris yang menunggu settlement itu dibangunkan dan dikirim. Sebelum benar-benar mengirim, gerbangnya dicek sekali lagi.

## Race yang cuma kelihatan di atas kertas

Kode sudah jadi dan saya cukup puas. Lalu saya melakukan sesuatu yang belakangan jadi kebiasaan: **menggambar timeline-nya**, kejadian demi kejadian, dengan dua worker yang berjalan bersamaan.

Di sinilah ketemu:

```text
worker A : claim baris → baca status: PENDING
watcher  : simpan SETTLED → release: baris dibuat due sekarang
worker A : tunda baris 10 menit   ← menimpa release barusan
```

Akibatnya baris tertahan 10 menit padahal dananya sudah siap. Ada juga kebalikannya yang lebih berbahaya: release membangunkan baris yang sedang dipegang worker lain, lalu dua worker mengirim reference yang sama.

Bug ini tidak akan kelihatan dari membaca kode baris per baris. Setiap fungsinya benar kalau dilihat sendiri-sendiri. Masalahnya hanya muncul di sela-sela antar fungsi.

Perbaikannya ada dua lapis. Pertama, release tidak boleh menyentuh baris yang sedang di-claim. Baris yang ditunda punya `next_retry_at` jauh di depan, sedangkan baris yang sedang di-claim hanya sejauh durasi lease, jadi keduanya bisa dibedakan. Kedua, worker yang baru menunda wajib mengecek status sekali lagi. Kalau ternyata sudah `SETTLED`, worker itu sendiri yang membangunkan barisnya.

Dengan dua lapis ini, urutan mana pun berakhir aman: release sempat melihat baris yang ditunda, atau worker yang menunda sempat melihat status `SETTLED`. Tidak ada celah di antaranya.

## Membereskan yang sudah terlanjur

Fix ini mencegah kejadian berikutnya, tapi baris yang sudah `FAILED` sebelumnya tidak akan sembuh sendiri.

Untuk itu saya buat satu command recovery dengan aturan yang sengaja dibuat membosankan. Default-nya dry-run. Command hanya menampilkan baris yang settlement-nya sudah `SETTLED`, nominalnya dalam dua desimal, dan account sumbernya. Saat dieksekusi, yang di-requeue hanya baris outbox-nya, dengan reference yang sama. Split engine tidak dijalankan ulang, tidak ada movement baru, dan balance kami tidak disentuh.

Karena transfernya sinkron, transfer yang ditolak berarti uangnya memang tidak pindah. Reference yang sama itulah yang memastikan retry tidak pernah menghasilkan transfer ganda.

## "Settlement-nya jadi lambat nggak?"

Pertanyaan ini datang paling cepat, dan wajar saja, karena settlement adalah jantung alur uang kami.

Jawabannya tidak. Di dalam transaksi settlement, satu-satunya perubahan adalah satu kolom tambahan di INSERT yang sudah ada sejak awal. Tidak ada HTTP dan tidak ada proses menunggu. Transaksi reguler tanpa split bahkan tidak lewat kode baru sama sekali. Yang berubah hanya *kapan* bayangan transfer split muncul di ledger seberang: beberapa menit setelah settlement, bukan langsung.

Dan beberapa menit itu masih jauh lebih baik daripada versi sebelumnya, yang tidak pernah muncul sama sekali.

## Yang saya bawa pulang

1. **Commit itu janji ke diri sendiri.** Begitu ada sistem kedua, "sudah commit" dan "sudah siap" adalah dua kejadian yang berbeda.
2. **Di dunia async, urutan ditentukan oleh status, bukan oleh waktu.** Delay, job chain, dan urutan dispatch semuanya cuma menebak jam.
3. **Menunggu bukan gagal.** Jangan biarkan proses menunggu memakan jatah retry.
4. **Kalau dokumentasi ambigu, bertanya sambil membawa temuan.** Pertanyaan "di sini tertulis X, di sana Y, yang benar yang mana?" dijawab jauh lebih cepat daripada "statusnya apa ya?".
5. **Gambar timeline-nya.** Race yang paling licin tinggal di sela-sela antar fungsi, bukan di dalam fungsinya.

Sekarang setiap kali ada split, saya kadang masih mengintip tabel outbox. Barisnya duduk sabar dengan `waiting dependency`, lalu beberapa menit kemudian berubah jadi `COMMITTED`. Ternyata pekerjaan terberatnya bukan membuat sistem bergerak lebih cepat, tapi mengajarinya kapan harus menunggu. 🙂
