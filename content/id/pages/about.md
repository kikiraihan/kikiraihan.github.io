---
title: Tentang
description: Software engineer yang berdomisili di Jabodetabek (asal Gorontalo), bekerja di bidang pembayaran, sistem backend, data, AI, dan desain visual.
---

## Perkenalan

Nama lengkap saya Mohammad Zulkifli Katili, tapi kebanyakan orang memanggil saya **Kiki**. Saya berasal dari Gorontalo dan kini tinggal di Tangerang, Jabodetabek. Saya menyukai masalah yang mempertemukan engineering, data, dan desain, dan saya sama pedulinya pada *mengapa* sesuatu perlu dibangun seperti pada *bagaimana* membangunnya.

## Perjalanan engineering

Saya kuliah Sistem Informasi di Universitas Negeri Gorontalo dan lulus sebagai lulusan terbaik Fakultas Teknik. Skripsi saya menjadi **Sindasi**, sistem pendukung keputusan yang menggunakan AHP-TOPSIS.

Selama kuliah saya membangun aplikasi produksi untuk klien sungguhan: **Raisa**, sistem peringatan dini inflasi untuk Kantor Perwakilan Bank Indonesia Gorontalo saat magang, lalu **TimeMarket**, PWA manajemen beban kerja untuk kantor yang sama. Setelah itu datang pekerjaan berbasis proyek — API masjid terdekat dan panel admin untuk **Digimosque**, sistem penjadwalan untuk **IAIN Sultan Amai Gorontalo**, modul backend untuk **Contag School**, dan intelijen penjualan spasial untuk **PT. Makassar Raya Motor**.

## Fokus saat ini

Saya sedang mengerjakan sistem pembayaran — payment gateway, alur B2B/B2C, dan API di sekitarnya — di mana ketepatan, idempotensi, dan konsistensi lebih penting daripada trik yang cerdik.

Sebagai Senior Fullstack Developer di **Singapay**, saya ikut merawat inti payment gateway yang menangani ratusan ribu transaksi per hari, di atas infrastruktur Huawei Cloud dengan Alibaba Cloud sebagai situs disaster recovery. Sehari-hari itu berarti:

- **Integrasi bank dengan standar SNAP** — standar open API pembayaran dari Bank Indonesia, termasuk lapisan access token dan tanda tangan request. Enam bank secara langsung, puluhan lainnya melalui vendor.
- **Satu cara untuk menambah biller.** Saya menstandarkan integrasi biller PPOB — ratusan jenis layanan dan ribuan produk — di balik satu skema internal dan satu interface abstrak. Menambah layanan baru yang dulu sekitar dua minggu kini menjadi sekitar tiga hari.
- **Memecah monolit.** Job transaksi yang padat dipindahkan ke message queue asinkron, dan layanan baru dibangun dengan Go seiring bagian-bagian monolit PHP dipisahkan.
- **Rilis tanpa jendela downtime**, menggunakan blue-green deployment.
- **Tooling yang menjaga ledger tetap jujur** — pengecekan integritas tiap malam, patch data yang selalu dijalankan dry-run dulu dan selalu bisa di-revert, serta tools penyelesaian sengketa yang mengubah kasus 3–5 hari menjadi hitungan jam.

Kini saya menangani proyek PPOB, bekerja dari Indonesia bersama tim yang hampir seluruhnya berada di Shanghai.

Di luar pekerjaan utama, saya berkontribusi di **[Anveesa](https://anveesa.com/)**, rangkaian developer tools open-source (database studio, manajemen database, AI retrieval tool, dan cloud storage), sebagian besar di sisi front end dengan Vue. Saya terlibat di Anveesa Aras, Anveesa Vestra, Anveesa Nias, dan Anveesa Workflow.

## AI, knowledge graph & RAG

Studi magister Ilmu Komputer saya di **IPB University** (Kecerdasan Komputasional & Optimasi, IPK 3,83) berfokus pada knowledge graph dan analisis jaringan. Tesisnya menjadi **VektorPedia** dan sebuah paper terindeks Scopus. Knowledge graph adalah salah satu cara paling berguna untuk memberi konteks nyata kepada language model, itulah sebabnya saya terus mengeksplorasi retrieval-augmented generation dan tooling LLM. Minat itu berubah menjadi pekerjaan produksi di Bank Indonesia, tempat saya memimpin dua proyek AI — lihat bagian Kepemimpinan di bawah.

## Latar belakang desain

Sebelum banyak menulis kode, saya mendesain. Saya memimpin divisi multimedia Linux Study Group di kampus, masuk final kompetisi desain grafis nasional, dan telah merancang logo serta sistem brand — HEXSTUDIO, Katili Corp, Kotaluwuk.com, dan identitas GenBI Gorontalo. Kebiasaan itu terlihat pada antarmuka yang saya bangun, termasuk situs ini.

## Cara saya bekerja

- **Mulai dari masalahnya.** Pahami siapa yang terdampak dan seperti apa "lebih baik" itu sebelum memilih stack.
- **Temui pengguna di tempat mereka berada.** Kadang itu berarti PWA di ponsel yang sudah mereka bawa; kadang berarti impor Excel alih-alih API.
- **Jelas soal kepemilikan.** Di proyek tim, saya menyebutkan apa yang dibangun tim dan apa yang saya bangun.
- **Tinggalkan dalam kondisi mudah dirawat.** Konvensi, modul kecil, dan kode yang mudah dibaca bertahan lebih lama daripada kode yang cerdik.

## Kepemimpinan

Saya sudah dua kali memimpin pengembangan aplikasi AI, keduanya untuk **Departemen Regional Bank Indonesia** di Jakarta:

- **TIARA v3** (2025) — chatbot kebijakan berbasis AI milik Bank Indonesia. Saya memimpinnya dari ujung ke ujung: arsitektur, fitur, dan deployment. Retrieval-augmented generation di atas PostgreSQL + pgvector dengan Gemini; tool yang memungkinkan model melakukan query data tabular dengan pandas lalu mengembalikan ringkasan; dan model klasifikasi kecil yang di-host sendiri (GLiClass, berjalan di CPU) yang menyaring setiap prompt masuk dari upaya injection sebelum sampai ke model utama. Ditambah portal pengguna dan admin dengan React / Next.js serta dokumentasi teknis lengkap. Basis pengetahuannya mencapai **akurasi respons 88%**, dengan **100% uji fitur lolos**, termasuk pertanyaan di luar cakupan.
- **RAISA** (2024–2025) — sistem penilaian risiko untuk data transaksi yang dilaporkan penyelenggara jasa pembayaran (PJP) dan kegiatan usaha penukaran valuta asing (KUPVA). Prediksi machine learning untuk Net Risk Assessment (NRA APU) dengan **akurasi 95%**, dashboard analisis atas **lebih dari 50 juta transaksi per bulan**, dan otomatisasi yang memangkas waktu analisis manual **hingga 30%**.

Sebelumnya, di luar pekerjaan, saya menjadi Ketua **Generasi Baru Indonesia (GenBI) Gorontalo** (2020–2021): 6 departemen dan 3 komisariat kampus, lebih dari 60 kegiatan dalam setahun, sistem penilaian anggota yang dibangun ulang sehingga keanggotaan aktif naik menjadi 80%, serta visi komunitas 2025.

## Publikasi

1. Katili, M. Z., Herdiyeni, Y., & Hardhienata, M. K. D. (2024). *Leveraging Biotic Interaction Knowledge Graph and Network Analysis to Uncover Insect Vectors of Plant Virus.* JISEBI. [Tautan](https://e-journal.unair.ac.id/JISEBI/article/view/50015)
2. Katili, M., Amali, L., & Tuloli, M. (2021). *Implementasi Metode AHP-TOPSIS dalam Sistem Pendukung Rekomendasi Mahasiswa Berprestasi.* Jambura Journal of Informatics, 3(1), 1–10. [Tautan](https://ejurnal.ung.ac.id/index.php/jji/article/view/10246)

## Penghargaan

| Tahun | Penghargaan |
| --- | --- |
| 2023 | Best Team & Best Local Participant — IPB International Summer Course (AI for Smart Agriculture) |
| 2021 | Best Trainer — SIAPIK (Sistem Informasi Aplikasi Pencatatan Informasi Keuangan), Bank Indonesia |
| 2020 | Best Idea — Startup Building Competition, BuatStartup Edisi COVID-19 |
| 2019 | Juara 1 — Software Engineering, Smart Fest, KOMINFO Kabupaten Gorontalo |
| 2019 | Juara 3 — Lomba Pemrograman Web Nasional UKSW FIT |
| 2018 | Juara 6 — Lomba Pemrograman Web Nasional UKSW FIT |
| 2017 | Finalis — Lomba Desain Grafis Nasional UNITY-UNY |

<!-- TODO: Bagian minat pribadi (PRD §9) — tambahkan jika sudah siap. -->
