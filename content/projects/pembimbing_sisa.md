---
title: "Jadwalin | [Frontend, Backend]"
date: 2022-04-25
---

# Jadwalin

### Masalah :
Fakultas Ekonomi dan Bisnis Islam IAIN Sultan Amai Gorontalo, membutuhkan sebuah sistem untuk mengatur jadwal matakuliah dalam skala fakultas. Data matakuliah dan contoh jadwal yang tersedia berupa file excell, yang diperoleh dari Sistem Informasi Akademik (SIAK). Dalam kasus ini, akses melalui API SIAK tidak diizinkan untuk alasan tertentu.
Sistem harus mempertimbangkan : 
1. Jurusan → jadwal bagi mahasiswa dalam satu jurusan tidak boleh bertabrakan.
2. Dosen → cek dosen pengajar apakah ada matakuliah juga di jam yang sama.
3. Ruangan → cek apakah ruangan sudah terpakai di jam yang sama.
4. SKS -> cek SKS matakuliah kalau sesuai dengan SKS pada slot jam. (sks adalah satuan kredit semester).

**Waktu pengerjaan :** 2 bulan

**Tanggal :** April – Mei 2022

### Solusi :
Untuk menyelesaikan permasalahan di brief diberikan solusi berikut :
- Fitur input dibangun menggunakan prinsip export data excell, untuk memudahkan user yang sudah terbiasa bekerja dengan file excell, dan memudahkan integrasi dikarenakan belum mendapat akses SIAT.
- Pembuatan fitur sudah mempertimbangkan ke 4 hal dibrief, Jurusan, Dosen, Ruangan, SKS, dan dapat dengan mudah ditambahkan fitur karena dibuat dalam sistem rule laravel.
- Terdapat fitur Generate jadwal otomatis dengan menggunakan algoritma greedy.

#### Tangkapan Layar :
![/projects/jadwalin1.png](/projects/jadwalin1.png)
![/projects/jadwalin2.png](/projects/jadwalin2.png)
![/projects/jadwalin3.png](/projects/jadwalin3.png)