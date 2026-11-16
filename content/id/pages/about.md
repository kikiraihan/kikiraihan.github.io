---
title: Tentang
description: Software engineer yang berdomisili di Jabodetabek (asal Gorontalo), bekerja di bidang pembayaran, sistem backend, data, AI, dan desain visual.
---

## Perkenalan

Nama lengkap saya Mohammad Zulkifli Katili, tapi kebanyakan orang memanggil saya **Kiki**. Saya berasal dari Gorontalo dan kini tinggal di Tangerang, Jabodetabek. Saya menyukai masalah yang mempertemukan engineering, data, dan desain, dan saya sama pedulinya pada *mengapa* sesuatu perlu dibangun seperti pada *bagaimana* membangunnya.

Saya membangun software secara profesional sejak 2019. Saya bekerja dalam bahasa Inggris dan bahasa Indonesia (bahasa ibu saya), dan terbiasa bekerja dengan tim lintas negara.

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
- **Memperbaiki penyebabnya, bukan hanya datanya.** Saat dua transfer berselang 63 ms menghapus sebuah debit, saya melacak race condition-nya, memperbaiki saldo dari ledger, lalu menerapkan satu urutan lock di jalur kode yang memindahkan uang. Ceritanya saya tulis di [63 Milidetik yang Bikin Saldo Ratusan Akun Salah](/writing/race-condition-63ms).
- **Layanan Go** untuk PPOB, QRIS, dan backend-for-frontend aplikasi B2C Singapay, front end Payment Link dengan React, serta utilitas command-line kecil dengan C++ di server.
- **Dokumentasi sebagai konteks AI.** Alur dokumentasi yang bisa dibaca tools AI memangkas waktu pengembangan dan penelusuran masalah dari sekitar seminggu menjadi satu sampai dua hari.
- **Bekerja dengan vendor dan merchant** — UAT sebelum setiap integrasi tayang, dan saya orang yang paling sering ditanya langsung oleh merchant soal teknis.

Kini saya menangani proyek PPOB, bekerja dari Indonesia bersama tim yang hampir seluruhnya berada di Shanghai. Di tim, saya senior engineer: me-review kode, pair programming saat debugging bersama rekan, dan membimbing engineer baru mengenal codebase.

Di luar pekerjaan utama, saya berkontribusi di **[Anveesa](https://anveesa.com/)**, rangkaian developer tools open-source (database studio, manajemen database, AI retrieval tool, dan cloud storage), baik di sisi front end (dengan Vue) maupun back end. Saya terlibat di Anveesa Aras, Anveesa Vestra, Anveesa Nias, dan Anveesa Workflow; back end Nias ditulis dengan Go.

## AI, knowledge graph & RAG

Studi magister Ilmu Komputer saya di **IPB University** (Kecerdasan Komputasional & Optimasi, IPK 3,83) berfokus pada knowledge graph dan analisis jaringan. Tesisnya menjadi **VektorPedia** dan sebuah paper terindeks Scopus. Knowledge graph adalah salah satu cara paling berguna untuk memberi konteks nyata kepada language model, itulah sebabnya saya terus mengeksplorasi retrieval-augmented generation dan tooling LLM. Minat itu berubah menjadi pekerjaan produksi di Bank Indonesia, tempat saya memimpin dua proyek AI — lihat bagian Kepemimpinan di bawah.

Di waktu luang saya membangun **[Anveesa Aness](https://github.com/kikiraihan/anveesa-aness)**, framework RAG open-source yang mengubah basis pengetahuan Markdown menjadi chat API dengan sitasi sumber: FastAPI dengan Docker Compose, reranker cross-encoder setelah vector search, dan router yang mengirim setiap pertanyaan ke salah satu dari tiga tingkat model sesuai kompleksitasnya (OpenRouter, Anthropic, Groq), dengan front end chat Vue + Tailwind.

## Latar belakang desain

Sebelum banyak menulis kode, saya mendesain. Saya memimpin divisi multimedia Linux Study Group di kampus, masuk final kompetisi desain grafis nasional, dan telah merancang logo serta sistem brand — HEXSTUDIO, Katili Corp, Kotaluwuk.com, dan identitas GenBI Gorontalo. Kebiasaan itu terlihat pada antarmuka yang saya bangun, termasuk situs ini.

Praktik itu saya jalankan sebagai **HEX Studio** ([@hexstudiogo](https://www.instagram.com/hexstudiogo)) sejak 2016, menerima brief brand dan antarmuka dari klien dan organisasi, dan mendokumentasikan setiap karya sebagai studi kasus: brief, keputusan, alasan. Saya juga merancang logo ulang tahun ke-9 GenBI Nusantara, dan masih terus menggambar; dari tahun ke tahun ilustrasi saya menemukan gayanya sendiri.

## Proyek sampingan

Saya suka membangun produk kecil yang utuh dari ujung ke ujung. Sejak Oktober 2026 itu termasuk **aplikasi menu bar macOS dengan Swift + AppKit**, dibangun dengan bantuan AI dan dirilis lewat GitHub Releases: [Temu](/work/temu) (teman pixel yang hidup di Mac sahabatmu, dengan server Go dan web Vue), [PasteLAN](/work/pastelan) (berbagi clipboard antara Mac dan ponsel), [AI Todo](/work/ai-todo), [LiteScroller](/work/litescroller), LiteCalendar, dan LiteMonitor. Di sampingnya ada aplikasi web seperti [Racik](/work/racik), [Our Day](/work/our-day), dan [Ngoding5](/work/ngoding5). Semuanya ada di halaman [Lab](/lab).

## Cara saya bekerja

- **Mulai dari masalahnya.** Pahami siapa yang terdampak dan seperti apa "lebih baik" itu sebelum memilih stack.
- **Temui pengguna di tempat mereka berada.** Kadang itu berarti PWA di ponsel yang sudah mereka bawa; kadang berarti impor Excel alih-alih API.
- **Jelas soal kepemilikan.** Di proyek tim, saya menyebutkan apa yang dibangun tim dan apa yang saya bangun.
- **Tinggalkan dalam kondisi mudah dirawat.** Konvensi, modul kecil, dan kode yang mudah dibaca bertahan lebih lama daripada kode yang cerdik.

## Kepemimpinan

Saya sudah dua kali memimpin pengembangan aplikasi AI, keduanya untuk **Departemen Regional Bank Indonesia** di Jakarta, masing-masing dengan tim kecil 4–5 orang:

- **TIARA v3** (2025) — chatbot kebijakan berbasis AI milik Bank Indonesia. Saya memimpinnya dari ujung ke ujung: arsitektur, fitur, dan deployment. Retrieval-augmented generation di atas PostgreSQL + pgvector dengan Gemini; tool yang memungkinkan model melakukan query data tabular dengan pandas lalu mengembalikan ringkasan; dan model klasifikasi kecil yang di-host sendiri (GLiClass, berjalan di CPU) yang menyaring setiap prompt masuk dari upaya injection sebelum sampai ke model utama. Ditambah portal pengguna dan admin dengan React / Next.js (App Router), dengan jawaban yang dialirkan ke chat lewat SSE, serta dokumentasi teknis lengkap. OpenAI diintegrasikan sebagai provider kedua. Basis pengetahuannya mencapai **akurasi respons 88%**, dengan **100% uji fitur lolos**, termasuk pertanyaan di luar cakupan.
- **RAISA** (2024–2025) — sistem penilaian risiko untuk data transaksi yang dilaporkan penyelenggara jasa pembayaran (PJP) dan kegiatan usaha penukaran valuta asing (KUPVA). Prediksi machine learning untuk Net Risk Assessment (NRA APU) dengan **akurasi 95%**, dashboard analisis atas **lebih dari 50 juta transaksi per bulan**, dan otomatisasi yang memangkas waktu analisis manual **hingga 30%**.

Sebelumnya, di luar pekerjaan, saya menjadi Ketua **Generasi Baru Indonesia (GenBI) Gorontalo** (2020–2021): 6 departemen dan 3 komisariat kampus, lebih dari 60 kegiatan dalam setahun, sistem penilaian anggota yang dibangun ulang sehingga keanggotaan aktif naik menjadi 80%, serta visi komunitas 2025. Sebelumnya saya staf Hubungan Masyarakat & Kemitraan di organisasi yang sama (2019–2020), mendokumentasikan setiap kegiatan dan menjadi panitia di lebih dari 100 kegiatan. Di kampus saya memimpin divisi multimedia **Linux Study Group** (2017–2018), dengan sesi berbagi mingguan tentang desain grafis dan editing video.

## Pendidikan

| Tahun | Gelar |
| --- | --- |
| 2021–2023 | **Magister Ilmu Komputer**, IPB University — Kecerdasan Komputasional & Optimasi, IPK 3,83 / 4,00. Tesis (nilai A): mesin pencari vektor virus serangga berbasis analisis jaringan interaksi serangga–virus–tanaman. |
| 2016–2021 | **Sarjana Sistem Informasi**, Universitas Negeri Gorontalo — IPK 3,53 / 4,00, lulusan terbaik Fakultas Teknik. Skripsi (nilai A): AHP-TOPSIS dalam sistem pendukung rekomendasi mahasiswa berprestasi. Memenangkan 5 kompetisi mahasiswa tingkat nasional dan provinsi di bidang desain dan pemrograman. |

## Riset & publikasi

1. Katili, M. Z., Herdiyeni, Y., & Hardhienata, M. K. D. (2024). *Leveraging Biotic Interaction Knowledge Graph and Network Analysis to Uncover Insect Vectors of Plant Virus.* JISEBI. [Tautan](https://e-journal.unair.ac.id/JISEBI/article/view/50015)
2. Katili, M., Amali, L., & Tuloli, M. (2021). *Implementasi Metode AHP-TOPSIS dalam Sistem Pendukung Rekomendasi Mahasiswa Berprestasi.* Jambura Journal of Informatics, 3(1), 1–10. [Tautan](https://ejurnal.ung.ac.id/index.php/jji/article/view/10246)

Publikasi 1 terindeks SINTA-1 dan Scopus; datanya diambil dari GloBI, Wikidata, DBpedia, dan ontologi NCBITaxon. Dua riset kecil lain lahir dari summer course internasional di IPB:

- **[Klasterisasi citra daun melon](/work/ipb-summer-2023)** (2023) — K-Means pada fitur tekstur GLCM, AI and Optimization for Smart Agriculture and Biomedical Applications.
- **Penginderaan kelembapan berbasis jaringan graf** (2022) — sensor kelembapan dimodelkan sebagai simpul graf untuk memantau tanaman dan pola penyebaran penyakit, IoT for Smart Urban Farming.

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

## Sertifikasi

Data Analysis with Python · Basic Data Science · SQL · Machine Learning Development · AI & Optimization Course · ASEAN Data Science Explorer · IoT for Smart Urban Farming · Basic Data Visualization · Problem Solving in Programming (2022–2023).

<!-- TODO: Bagian minat pribadi (PRD §9) — tambahkan jika sudah siap. -->
