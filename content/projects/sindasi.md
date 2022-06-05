---
title: "Sindasi | [Frontend, Backend]"
date: 2021-02-05
---

# Sindasi : SPK Rekomendasi Mahasiswa Menggunakan Metode AHP-TOPSIS

### Masalah :
Dibutuhkan aplikasi yang dapat membantu Birokrasi Jurusan dalam menemukan mahasiswa yang cocok untuk kasus tertentu seperti lomba/penelitian dll. Aplikasi harus dinamis, artinya dapat disesuaikan, sehingga dapat digunakan pada multi kasus selama menggunakan data mahasiswa (nilai MK, organisasi, gaji orang tua) berupa keterangan yang diisi oleh mahasiwa tersebut serta data nilai matakuliah dari sistem informasi akademik.

contoh kasus : rekomendasi calon penerima beasiswa, rekomendasi utusan lomba, rekomendasi pendampingan penelitian dosen dll.

### Solusi :
Sindasi adalah Sistem Informasi dan Rekomendasi Mahasiswa. Sistem ini menyediakan informasi lengkap mahasiswa baik akademik maupun nonakademik. Selain itu sistem ini menerapkan metode Sistem Pendukung Keputusan dalam proses penentuan rekomendasi mahasiswa secara dinamis dengan menggunakan kombinasi **metode Analitical Hierarcy Process dan Technique for Order Preference by Similarity to Ideal Solution (AHP-TOPSIS)**. Artinya rekomendasi dapat dibuat dinamis dengan preferensi bobot yang dapat disesuaikan.
Rekomendasi yang dibuat dapat dikonfigurasi melalui penilaian dan perbandingan berpasangan kriteria lalu disimpan menjadi preferensi rekomendasi. Rekomendasi mahasiswa kemudian dapat dihasilkan berdasarkan preferensi yang tersimpan.  Kriteria diperoleh dari sejumlah data mahasiswa berupa (nilai matakuliah, kegiatan ekstrakulikuler, ataupun prestasi yang dimiliki). Bobot setiap kriteria dapat berbeda antara masing-masing rekomendasi, sehingga dapat digunakan secara dinamis untuk membantu ketua jurusan atau ketua prodi dalam menemukan rekomendasi mahasiswa untuk kebutuhan tertentu yang spesifik.

Detail Fitur dapat dilihat ditabel berikut :
No | Fitur | Dosen | Kajur | Kaprodi | Mahasiswa | Admin | 
-------|-------|-------|-------|-------|-------|-------|
1 | Login | Ada | Ada | Ada | Ada | Ada | 
2 | Dashboard | Ada | Ada | Ada | Ada | Ada | 
3 | Kelola data mahasiswa | - | - | - | Ada | - | 
4 | Tampil daftar mahasiswa | Hanya lihat mahasiswa PA | Hanya lihat semua mahasiswa | Hanya lihat mahasiswa prodi | - | Hanya lihat semua mahasiswa | 
5 | Tampil profil dan akademik mahasiswa | Hanya lihat mahasiswa PA | Hanya lihat semua mahasiswa | Hanya lihat mahasiswa prodi | Hanya lihat profilnya | Hanya lihat semua mahasiswa | 
6 | Monitoring matakuliah | - | Semua MK | Hanya MK Prodi | - | - | 
7 | Master kriteria | Hanya lihat | Hanya lihat | Hanya lihat | - | Lihat, Update, Hapus, dan Tambah kriteria | 
8 | Master preferensi | Lihat, tambah preferensi, hapus hanya preferensi miliknya | Lihat, tambah preferensi, hapus semua preferensi | Lihat, tambah preferensi, hapus hanya preferensi miliknya | - | Lihat, tambah preferensi, hapus semua preferensi | 
9 | Rekomendasi otomatis | - | Ada | Ada | - | - | 
10 | Kelola data user | - | Ada | - | - | Ada | 
11 | Import data | - | Ada | - | - | Ada

#### Tangkapan layar :
![/projects/sindasi1.png](/projects/sindasi1.png)
![/projects/sindasi2.png](/projects/sindasi2.png)
![/projects/sindasi3.png](/projects/sindasi3.png)