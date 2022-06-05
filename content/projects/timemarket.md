---
title: "TimeMarket | [Frontend, Backend]"
date: 2021-05-24
---

# TimeMarket

### Masalah :
Dibutuhkan aplikasi manajemen beban kerja seperti human resource management, untuk diikutkan dalam program BI Inovasi. Aplikasi bertujuan mempermudah pendelegasian pekerjaan secara akurat, untuk tujuan efisiensi dalam mengelola dan memonitor pekerjaan pegawai, serta membatasi jumlah pekerjaan pegawai yang dianggap wajar.
Aplikasi harus dapat diakses dari mana saja, dan mudah untuk digunakan.

**Waktu pengerjaan :** 2 bulan (tetantif) + maintenance 

**Tanggal :** Mei – Oktober 2021

### Solusi :
Untuk menyelesaikan permasalahan di brief diberikan solusi berikut :
- Interaktif UI menggunakan livewire, untuk memudahkan pengguna dan mendukung kecepatan pengembangan
- Desain tampilan interface dengan prinsip mobile first development, sehingga responsifitas aplikasi terhadap perangkat desktop dan smartphon dapat terpenuhi
- Penambahan fitur access mode native melalui browser chrome dengan menambahkan metada tertentu pada halaman utama HTML. Sehingga aplikasi web dapat dibuka seolah-olah aplikasi android native (Semi Progressif Web App).
- Pembuatan Manual Book

Aplikasi ini dapat diakses melalui [link berikut](https://timemarket.masuk.id). sebuah aplikasi Human Resource Management yang bertujuan untuk melakukan monitoring dan controlling terhadap beban kerja pegawai berdasarkan pengelolaan waktu dan sumber manusia agar seimbang guna mencapai target secara efisien dan efektif. Aplikasi ini memiliki 4 role user yaitu pegawai, Kepala Tim (Chief), Kepala Perwakilan (KPw), dan Admin.

![/projects/timemarket.png](/projects/timemarket.png)

Adapun detail fitur dapat dilihat di tabel 1, berikut :
No | Fitur | Pegawai | Kepala Tim (Chief) | Kepala Perwakilan (KPw) | Admin
---|-------|---------|--------------------|-------------------------|--------
1 | Login | ada | ada | ada | ada | 
2 | Dashboard | ada | ada | ada | ada | 
3 | Setting personal akun | ada | ada | ada | ada | 
4 | Melihat proker | ada | ada | ada | ada | 
5 | Menghapus proker | - | - | - | ada | 
6 | Menambahkan Proker Baru | - | ada | - | 
7 | Edit Proker | Hanya jika menjadi kepala proker | ada | - | ada | 
8 | Melihat pekerjaan | ada | ada | ada | ada | 
9 | Menghapus pekerjaan | Hanya jika menjadi kepala proker | Hanya jika menjadi kepala proker. | - | - | 
10 | Menambahkan pekerjaan baru | Hanya jika menjadi kepala proker | Hanya jika menjadi kepala proker | - | - | 
11 | Edit pekerjaan | Hanya jika menjadi kepala proker | Hanya jika menjadi kepala proker | - | - | 
12 | Mengakses Kalender Utama | ada | ada | ada | - | 
13 | Memindahkan pekerjaan pada pegawai lain | Hanya jika menjadi kepala proker | Hanya jika menjadi kepala proker | - | - | 
14 | Menandai status pekerjaan selesai | ada | - | - | -
