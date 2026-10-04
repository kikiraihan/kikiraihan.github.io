---
title: Sindasi
description: Sistem informasi dan rekomendasi mahasiswa menggunakan AHP-TOPSIS dengan bobot kriteria yang bisa diatur.
type: engineering
category: Sistem Pendukung Keputusan
year: 2021
role: Full-stack Developer & Peneliti (Skripsi)
company: Universitas Negeri Gorontalo
order: 8
cover: /images/work/sindasi/sindasi1.png
technologies: [Laravel, AHP-TOPSIS, MySQL]
metrics:
  - value: "5"
    label: peran pengguna
links:
  - label: Paper yang dipublikasikan
    url: https://ejurnal.ung.ac.id/index.php/jji/article/view/10246
---

## Masalah

Jurusan secara rutin perlu memilih mahasiswa yang tepat — untuk beasiswa, lomba, atau asisten riset — tetapi kriterianya berubah dari satu kasus ke kasus lain.

## Solusi

**Sindasi** menggabungkan informasi mahasiswa yang lengkap (akademik dan non-akademik) dengan mesin pendukung keputusan yang dinamis berbasis **AHP** (Analytical Hierarchy Process) dan **TOPSIS**. Pengguna mendefinisikan kriteria dan perbandingan berpasangan, menyimpannya sebagai *preferensi*, lalu menghasilkan rekomendasi dari preferensi tersebut. Setiap rekomendasi bisa memberi bobot kriteria yang berbeda.

| Fitur | Dosen | Ketua Jurusan | Ketua Prodi | Mahasiswa | Admin |
| --- | --- | --- | --- | --- | --- |
| Daftar & profil mahasiswa | Mahasiswa bimbingan | Semua | Prodi sendiri | Milik sendiri | Semua |
| Master kriteria | Lihat | Lihat | Lihat | — | Penuh |
| Master preferensi | Milik sendiri | Semua | Milik sendiri | — | Semua |
| Rekomendasi otomatis | — | Ya | Ya | — | — |
| Impor data | — | Ya | — | — | Ya |

## Pelajaran

Membuat bobotnya bisa diatur mengubah tool skripsi sekali pakai menjadi sesuatu yang bisa dipakai ulang untuk banyak keputusan.

## Cuplikan

::gallery
---
images:
  - { src: /images/work/sindasi/sindasi1.png, alt: Dashboard }
  - { src: /images/work/sindasi/sindasi2.png, alt: Rekomendasi }
  - { src: /images/work/sindasi/sindasi3.png, alt: Profil mahasiswa }
---
::
