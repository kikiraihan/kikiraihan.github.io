---
title: Antarmuka Kongkong
description: Antarmuka responsif dan mobile-first untuk platform crowdfunding mahasiswa.
type: design
category: Desain UI
year: 2020
role: UI Designer
order: 24
cover: /images/work/kongkong-interface/index-desktop.png
technologies: [Interface, Bootstrap, Responsive, Mobile first]
---

## Brief

Antarmuka untuk mahasiswa: fleksibel, responsif, dan mampu menampilkan kegiatan yang dijalankan oleh mahasiswa maupun organisasi kemahasiswaan.

## Solusi

Dibangun dari nol dengan Bootstrap — tanpa template — dengan memprioritaskan tampilan mobile, karena ponsel adalah perangkat yang paling sering dipakai mahasiswa. Sisi engineering-nya ada di [proyek Kongkong](/work/kongkong).

::gallery
---
images:
  - { src: /images/work/kongkong-interface/index-desktop.png, alt: "Halaman index, desktop" }
  - { src: /images/work/kongkong-interface/index-mobile.png, alt: "Halaman index, mobile" }
  - { src: /images/work/kongkong-interface/profil-desktop.png, alt: "Halaman profil, desktop" }
  - { src: /images/work/kongkong-interface/profil-mobile.png, alt: "Halaman profil, mobile" }
---
::

## Dua jenis pengguna, dua perjalanan

Kongkong melayani dua jenis pengunjung yang sangat berbeda. Seorang **pendukung** datang dari tautan yang dibagikan dan harus bisa sampai ke sebuah proyek lalu mendukungnya tanpa membuat akun. Seorang **mahasiswa atau organisasi kemahasiswaan** masuk untuk menerbitkan proposal dan memantau perkembangannya. Setiap layar dirancang untuk salah satu dari dua perjalanan itu, masing-masing dengan satu aksi utama.

![Dua perjalanan yang menjadi dasar desain antarmuka Kongkong](/images/work/kongkong-interface/kongkong-user-flow.svg)

## Keputusan desain

::process-steps
---
steps:
  - { title: Mobile first, text: "Layout didesain di lebar ponsel lebih dulu, baru kemudian dibiarkan melebar menjadi kolom di desktop — bukan dijejalkan belakangan." }
  - { title: Satu kolom pencarian, text: "Halaman beranda punya satu judul, sapaan yang ramah (#SohibKongkong), dan satu kotak pencarian. Tidak ada yang menyainginya." }
  - { title: Progres di setiap kartu, text: "Setiap kartu proyek menampilkan pemilik, tanggal, dan bar pendanaan, sehingga pendukung bisa membandingkan proyek dalam sekali lihat." }
  - { title: Navigasi dalam jangkauan jempol, text: "Di mobile, navigasi atas pindah ke tab bar bawah: tiga tab untuk tamu, lima setelah masuk." }
  - { title: Aksi utama di tengah, text: "Bagi mahasiswa yang sudah masuk, tab tengahnya adalah “+” — membuat proposal berada tepat di tempat jempol beristirahat." }
  - { title: "Komponen yang sama, di setiap ukuran", text: "Kartu, tab, dan ringkasan aktivitas adalah komponen yang sama di desktop dan mobile, hanya disusun ulang." }
---
::

## Rincian komponen

Diambil dari layar-layar di atas, inilah bagian-bagian yang membentuk seluruh antarmuka.

![Hero halaman beranda dengan judul, sapaan, dan satu kolom pencarian](/images/work/kongkong-interface/detail-hero.png)

::gallery
---
fit: contain
images:
  - { src: /images/work/kongkong-interface/detail-project-card.png, alt: Kartu proyek dengan avatar pemilik dan progres, caption: "Kartu proyek — gambar sampul, judul, avatar pemilik, tanggal, dan persentase pendanaan." }
  - { src: /images/work/kongkong-interface/detail-activity.png, alt: "Ringkasan aktivitas dengan jumlah proposal, acara, dan antrean", caption: "Ringkasan aktivitas — proposal, acara, dan item yang menunggu, sebagai tiga angka." }
  - { src: /images/work/kongkong-interface/detail-profile-links.png, alt: Daftar tautan profil, caption: "Tautan profil — website, akun media sosial, dan email dalam satu daftar yang mudah dipindai." }
---
::

Di mobile, navigasinya berupa tab bar di bawah. Tamu mendapat tiga tab — proposal, dokumentasi, dan masuk, sama dengan item navigasi di desktop:

![Tab bar bawah untuk tamu](/images/work/kongkong-interface/detail-tabbar-guest.png)

Setelah masuk, jumlahnya bertambah menjadi lima, dan tombol "+" untuk proposal baru menempati posisi tengah:

![Tab bar bawah untuk mahasiswa yang sudah masuk](/images/work/kongkong-interface/detail-tabbar-user.png)

## Palet

Sengaja dibangun di atas warna default Bootstrap: biru yang familier untuk aksi, teal yang lebih terang untuk tautan dan nama, serta permukaan abu-abu yang sejuk — cepat dibangun, dan mudah dikembangkan oleh developer berikutnya.

::color-palette
---
colors:
  - { hex: "#007BFF", name: Biru aksi, role: Bar progres dan tombol utama }
  - { hex: "#17A2B8", name: Teal tautan, role: Judul proyek dan nama }
  - { hex: "#F4F6F8", name: Abu-abu permukaan, role: Latar halaman dan hero }
---
::
