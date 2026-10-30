---
title: 63 Milidetik yang Bikin Saldo Ratusan Akun Salah
description: Cerita tentang race condition, meeting yang sempat panas, dan satu jam eksekusi script yang sudah ditunggu berminggu-minggu.
date: 2026-10-30
original: id
tags: [Engineering, Payment, Database]
---

*Cerita tentang race condition, meeting yang sempat panas, dan satu jam eksekusi script yang sudah ditunggu berminggu-minggu.*

## "Mas, kok hitungannya nggak cocok ya?"

Semua berawal dari pesan biasa. Seorang rekan sedang menghitung ulang mutasi di statement salah satu klien kami secara manual: saldo awal, tambah kredit, kurangi debit. Hasilnya tidak sama dengan angka `balance_after` di sistem.

Selisihnya tidak besar, cuma seribu-dua ribu rupiah per baris. Tapi di payment gateway, selisih seribu rupiah itu bukan soal nominal. Itu tanda bahwa **sistem menghitung uang orang dengan salah**.

Fakta yang agak memalukan: sistem monitoring kami sebenarnya **sudah** mengirim alert ke Telegram. Cuma alert-nya tenggelam di antara puluhan notifikasi lain yang masuk tiap hari. Alert yang terlalu ramai pada akhirnya sama saja dengan tidak ada alert. Yang menyelamatkan kami justru seorang manusia yang iseng menghitung pakai kalkulator.

## Kliennya siapa, dan kenapa kena?

Klien yang terdampak adalah platform yang menyediakan etalase, marketplace, dan pembayaran untuk UMKM. Mereka memakai fitur **multi account** kami, semacam kantong-kantong dana. Satu akun utama menampung fee mereka, dan ratusan akun lain dipakai untuk masing-masing seller.

Artinya, perpindahan dana antar-akun mereka **sangat** sering dan **sangat** paralel. Fitur internal account movement kami ternyata belum siap untuk kondisi itu.

## Momen "waduh"

Saya buka data salah satu akun dan menemukan tiga baris ini:

| # | Waktu | Debit | Balance After (tersimpan) | Seharusnya |
|---|---|---|---|---|
| 9 | 18:26:51 | Rp 1.458,00 | Rp 6.732.740,00 | ✅ |
| 8 | 21:13:21**.072** | Rp 1.458,00 | Rp 6.731.282,00 | ✅ |
| 7 | 21:13:21**.135** | Rp 1.458,00 | **Rp 6.731.282,00** | ❌ Rp 6.729.824,00 |

Dua transaksi dengan jarak **63 milidetik**, dan `balance_after`-nya sama persis.

Reaksi pertama saya, jujur: *"Waduh. Ternyata masih ada race condition."*

Yang bikin gemas, kami sudah pernah membereskan race condition di modul lain. Kami juga punya aturan tertulis untuk agent AI yang membantu ngoding: *setiap operasi saldo wajib `lockForUpdate()` di dalam transaksi database.* Tapi aturan itu ternyata tidak dipatuhi waktu fitur account movement dibuat.

Dugaan saya, waktu itu aturannya masih di `CLAUDE.md` dan saya memakai mode auto. Model yang pertama membaca konteks belum tentu model yang "patuh" pada file itu, sehingga aturannya terlewat. Sekarang aturannya sudah saya pindah ke `AGENTS.md` yang lebih general dan dibaca agent mana pun. Pelajarannya: **aturan penting jangan cuma ditulis, pastikan juga pembacanya memang membaca.** Ini berlaku untuk manusia maupun AI.

## Jadi sebenarnya apa yang terjadi?

Sederhananya begini. Ada dua request transfer dari akun yang sama, hampir bersamaan:

```
Request A                          Request B
baca saldo = X                     baca saldo = X
simpan X - 1.458
                                   simpan X - 1.458   ← menimpa hasil A
```

Keduanya membaca saldo **lama** yang sama, lalu masing-masing menyimpan hasil hitungannya sebagai **angka absolut**. Akibatnya debit yang satu "hilang". Statement-nya tetap tercatat lengkap, tapi saldo akunnya tidak lagi sama dengan jumlah statement.

Seharusnya salah satu request **menunggu** sampai yang lain selesai, supaya ia membaca saldo yang sudah terupdate. Itulah fungsi lock.

Dampaknya ke dua arah:
- **Debit yang hilang** membuat saldo akun lebih besar dari seharusnya, jadi merchant "untung".
- **Kredit yang hilang** membuat saldo lebih kecil dari seharusnya, jadi merchant "rugi".

Ditelusuri ke belakang, `balance_after` yang janggal sudah muncul sejak akhir Juli, sekitar saat fitur account movement mulai dipakai. Kasus race yang pertama kali terbukti jelas terjadi pertengahan September.

## Fix kodenya: bagian yang mudah

Perbaikan kodenya relatif cepat. Saya membuat helper yang membaca ulang akun **dengan lock, di dalam transaksi, urut berdasarkan ID** supaya tidak terjadi deadlock A→B vs B→A. Pengecekan saldo cukup juga dipindah ke dalam lock. Lima jalur transfer yang terdampak semuanya memakai helper ini.

Setelah deploy, saya jalankan script pendeteksi race untuk beberapa hari ke depan. Hasilnya nol. Aman.

Tapi fix kode hanya menghentikan pendarahan. Lukanya, yaitu data yang sudah telanjur salah, masih ada.

## Bagian yang susah: manusia

Sebelum menyentuh data produksi yang menyangkut saldo klien, kami harus:
1. Mengirim pemberitahuan dispute ke klien,
2. Menyepakati solusinya,
3. Melewati beberapa lapis approval internal dan menyusun laporan resolusi dispute.

Di sinilah ketegangannya. **Setiap hari yang lewat tanpa perbaikan data, selisihnya bisa bertambah.** Hitungan kasar saya, kalau dibiarkan cukup lama, selisihnya bisa membengkak ke 7 sampai 10 juta, bahkan lebih. Jadi kami berpacu dengan waktu, sementara proses birokrasi tetap harus dilalui.

### Dua pilihan, satu dilema

Kami punya dua opsi untuk akun yang saldonya akan jadi minus setelah dikoreksi:

- **Opsi 1:** Tutup saldo minus itu memakai dana dari akun utama klien.
- **Opsi 2:** Biarkan saldo minus, nanti tertutup sendiri saat seller melakukan top up atau menerima dana. Risikonya, ada akun yang mungkin sudah tidak aktif atau tidak akan aktif lagi, sehingga minusnya menggantung.

Kami awalnya mengajukan opsi 1, atas saran lead kami. Saya paham pertimbangannya: saldo minus yang dibiarkan bisa jadi bola liar. Tapi jujur, dalam hati saya kurang sreg. Kesalahan ini ada di sistem kami, jadi rasanya tidak adil membebankannya ke klien.

Klien pun menolak, dan diskusinya panjang.

## Meeting yang sempat "panas"

Lalu tibalah meeting sinkronisasi, online. Dari pihak kami hadir saya (fullstack developer), tech lead, dua PM, technical support, dan sales.

Salah satu PM kami maju lebih dulu sebagai "narator". Niatnya baik: membuka dengan penjelasan yang normatif dan runut supaya suasana lebih cair, sekaligus memberi kami sedikit waktu. Dia mengulang kronologi kasus yang sebelumnya sudah dijelaskan lewat email dan chat.

Ternyata klien tidak sedang butuh cerita. Mereka butuh **data**. Dan keluarlah kalimat yang sampai sekarang masih saya ingat:

> *"Jangan ke teorinya mulu mas, kelamaan! Kita butuh penjelasan konkret, kasih langsung datanya mana yang dispute. Sebaiknya sediakan dulu datanya, atau kalau datanya belum ada kita tunda lagi aja meeting ini sampai [kalian] bisa provide datanya."*

Hening sebentar. 😅

Saya langsung ambil alih. Tanpa slide dan tanpa analogi:
1. Export statement salah satu akun langsung dari sistem,
2. Buka di Excel, pisahkan kolom debit dan kredit,
3. Tambahkan `SUM` di masing-masing kolom,
4. Tunjukkan bahwa total debit dikurangi total kredit **tidak cocok** dengan saldo akun. Ada kelebihan debit yang belum terpotong, sehingga saldo yang benar seharusnya minus.

Dua menit, satu spreadsheet, dan angkanya bicara sendiri.

Suasananya langsung berubah. Setelah klien melihat buktinya sendiri, dan kami bisa memastikan bahwa **sistem sudah berjalan normal dan yang tersisa tinggal perbaikan data**, mereka menjadi jauh lebih tenang dan kooperatif.

Lucunya, di diskusi lanjutan klien justru menawarkan solusi yang sama dengan opsi 2 kami. Sepakat, dan kami jalan.

### Terima kasih, benteng kami

Saya ingin memberi kredit untuk teman PM tadi. Dia yang kena tegur duluan, tapi dia juga yang **bersedia berdiri paling depan**. Sebagai PM, dia menjadi benteng supaya kami para programmer tidak langsung jadi sasaran di menit pertama. Tanpa "pemanasan" darinya, mungkin saya yang kena tegur duluan sebelum sempat membuka Excel.

Pelajaran buat saya: **di depan klien yang sedang kecewa, data konkret lebih menenangkan daripada narasi yang rapi.** Dan tim yang baik adalah tim yang saling menutupi, termasuk saat ada yang harus pasang badan.

## Hari eksekusi

Begitu disetujui, saya eksekusi. Rencana step-by-step sudah saya tulis jauh-jauh hari, jadi tinggal dijalankan berurutan:

1. **Pastikan race sudah berhenti.** Scan beberapa hari setelah deploy, hasilnya nol.
2. **Cari selisih** antara saldo akun dan total statement, lalu generate file adjustment.
3. **Sinkronkan saldo akun** ke total statement-nya.
4. **Hitung ulang `balance_after`** di statement akun.
5. **Cek dan sinkronkan level merchant**, lalu hitung ulang `balance_after` di level merchant.
6. **Verifikasi ulang semuanya.**

Semua script ditulis dengan Python dan langsung ke database, karena datanya terlalu berat untuk ditangani lewat framework web biasa. Statement yang `balance_after`-nya dihitung ulang jumlahnya ratusan ribu sampai jutaan baris. Semua script berjalan *dry-run* secara default, jadi saya bisa melihat preview sebelum menambahkan `--execute`.

### Hampir kelewatan

Di tengah eksekusi ada satu momen *"eh, tunggu dulu"*. Di batch pertama saya hanya menghitung akun yang **available balance**-nya minus. Ternyata ada akun yang available-nya kelihatan aman, tapi kalau dihitung bersama **pending** dan **held**, totalnya tetap bermasalah.

Akhirnya saya jalankan batch kedua dengan cakupan yang benar. Tidak ada yang rusak, karena semua script idempotent dan saldo selalu disinkronkan ke "kebenaran", yaitu statement. Tapi ini pengingat bahwa **definisi "minus" itu sendiri perlu didefinisikan dengan teliti.**

### Angka akhirnya

- **112 akun** saldonya dikoreksi agar sama persis dengan statement.
- Akun utama klien **naik sekitar Rp 5,44 juta**, karena ada kredit yang dulu "hilang".
- Sisanya, puluhan akun seller, **turun** karena debit yang dulu "hilang".
- Setelah koreksi, ada **50 akun dengan total saldo minus sekitar Rp 3,2 juta**. Angka ini jauh lebih kecil daripada skenario kalau kami menunggu lebih lama.
- Total waktu eksekusi: **kurang dari satu jam.**

Terakhir, saya jalankan semua script pengecekan sekali lagi. Output-nya kurang lebih:

> *All the balance already sync and valid. There is nothing to update.*

Kalimat itu terasa sangat melegakan.

## Yang saya bawa pulang

1. **Uang itu harus di-lock, bukan dihitung lalu ditimpa.** `lockForUpdate()` di dalam transaksi, dengan urutan lock yang konsisten. Tidak ada kompromi.
2. **Alert yang terlalu banyak sama dengan tidak ada alert.** Sistem kami sebenarnya sudah tahu, tapi tidak ada yang sempat membaca.
3. **Aturan untuk AI juga perlu dipastikan dibaca.** Menulis aturan di file konfigurasi agent tidak menjamin aturannya dipatuhi.
4. **Fix kode itu 20%, fix data dan komunikasi itu 80%.**
5. **Bawa data ke meeting, bukan teori.** Satu spreadsheet dengan `SUM` lebih meyakinkan daripada sepuluh slide.
6. **Siapkan runbook sebelum dibutuhkan.** Eksekusi selesai dalam satu jam karena perencanaannya sudah dilakukan berminggu-minggu sebelumnya.
7. **Hargai orang yang mau berdiri di depan.** Kadang tugasnya memang menjadi benteng dan kena tegur duluan.

Sekarang tinggal memantau akun-akun yang masih minus sampai saldonya tertutup kembali. Kalau suatu hari ada pesan *"Mas, kok hitungannya nggak cocok ya?"*, saya harap jawabannya cuma salah input kalkulator. 🙂
