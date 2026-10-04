---
title: Klasterisasi Daun Melon
description: Klasterisasi tanpa label pada citra daun melon dengan K-Means dan fitur tekstur GLCM — Best Team di IPB International Summer Course.
type: engineering
category: AI · Machine Learning
year: 2023
timeline: 8–20 Okt 2023
role: Machine Learning Engineer
company: IPB International Summer Course
order: 10
cover: /images/work/ipb-summer-2023/1.jpeg
technologies: [Python, scikit-learn, OpenCV, K-Means, GLCM]
metrics:
  - value: "6"
    label: klaster divalidasi bersama pakar tanaman
  - value: "Best Team"
    label: penghargaan
links:
  - label: Tentang kegiatannya
    url: https://csagri23.apps.cs.ipb.ac.id/
---

## Masalah

Di International Summer Course on AI and Optimization for Smart Agriculture (IPB, Okt 2023), tim kami menguji apakah citra daun melon bisa dikelompokkan secara otomatis untuk mendukung diagnosis penyakit dan pengelolaan tanaman.

## Solusi

- Mengekstraksi fitur tekstur dengan **gray-level co-occurrence matrix (GLCM)**.
- Mengelompokkan citra dengan **K-Means** (scikit-learn, OpenCV untuk pra-pemrosesan).
- Memilih jumlah klaster dengan **SSE** dan **silhouette score** — nilai yang berguna berkisar 3–6; kami memakai 6 karena memberi informasi paling banyak bagi pakar tanaman.
- Meninjau klaster **bersama pakar tanaman**: klaster-klaster itu ternyata sesuai dengan daun berpenyakit, kekurangan nutrisi, tanaman sehat, dan kelompok dengan gejala serupa.

## Dampak

::metric-grid{:metrics="metrics"}
::

Tim kami meraih **Best Team**, dan saya menerima penghargaan **Best Local Participant**.

## Cuplikan

::gallery
---
images:
  - { src: /images/work/ipb-summer-2023/2.jpeg, alt: Klaster }
  - { src: /images/work/ipb-summer-2023/1.jpeg, alt: Plot klaster }
  - { src: /images/work/ipb-summer-2023/3.jpeg, alt: Skor SSE }
  - { src: /images/work/ipb-summer-2023/4.jpeg, alt: Silhouette score }
  - { src: /images/work/ipb-summer-2023/5.jpeg, alt: Presentasi tim }
  - { src: /images/work/ipb-summer-2023/6.jpg, alt: Penghargaan }
---
::
