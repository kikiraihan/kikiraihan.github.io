---
title: VektorPedia
description: Mesin pencari yang menemukan serangga vektor virus tanaman dengan mengintegrasikan empat knowledge graph publik dan menjalankan analisis jaringan di atasnya.
type: engineering
category: AI · Knowledge Graph
year: 2023
timeline: Agu 2022 — Des 2023
role: Peneliti & Engineer (Tesis magister)
company: IPB University
featured: true
order: 1
cover: /images/work/vektorpedia/6.jpg
technologies: [Python, Vue, SPARQL, Knowledge Graph, Network Analysis]
metrics:
  - value: "4"
    label: knowledge graph publik terintegrasi
  - value: "3 bln"
    label: dari desain hingga aplikasi ter-deploy
  - value: "Scopus"
    label: publikasi terindeks
architecture:
  - id: sources
    label: GloBI · Wikidata · DBpedia · NCBITaxon
    detail: Empat knowledge graph publik yang mendeskripsikan spesies, taksonomi, dan interaksi biotik.
  - id: ingest
    label: Ingesti & penyelarasan
    detail: Entitas dari setiap sumber diambil lalu diselaraskan menjadi satu knowledge graph keanekaragaman hayati.
  - id: graph
    label: Knowledge graph keanekaragaman hayati
    detail: Serangga, virus, dan tanaman yang terhubung lewat edge interaksi bertipe.
  - id: analysis
    label: Analisis jaringan & skoring
    detail: Metrik graf memberi skor seberapa mungkin seekor serangga berperan sebagai vektor virus tanaman.
  - id: api
    label: Web server Python
    detail: Menangani query dan pemrosesan data untuk mesin pencari.
  - id: client
    label: Client Vue
    detail: UI pencarian bagi peneliti untuk menjelajahi kandidat vektor beserta buktinya.
contribution:
  team: Arah riset dan bimbingan berasal dari dosen pembimbing tesis saya.
  mine: Ingesti data, integrasi knowledge graph, analisis jaringan, dan seluruh aplikasi pencarian (backend + frontend).
links:
  - label: vektorpedia.ipb.ac.id
    url: https://vektorpedia.ipb.ac.id/
  - label: Paper yang dipublikasikan
    url: https://e-journal.unair.ac.id/JISEBI/article/view/50015
---

## Masalah

Virus tanaman menyebar melalui serangga, tetapi pengetahuan tentang serangga *mana* yang membawa virus *apa* tersebar di banyak database keanekaragaman hayati. Peneliti dan praktisi penyakit tanaman tidak punya satu tempat untuk bertanya: "serangga apa saja yang kemungkinan menjadi vektor virus ini?"

## Konteks

Ini adalah tesis magister saya di IPB University. Datanya sebenarnya sudah tersedia secara publik — di Global Biotic Interactions (GloBI), Wikidata, DBpedia, dan ontologi NCBI Taxonomy — tetapi dalam bentuk, identifier, dan tingkat kelengkapan yang berbeda-beda.

## Solusi

Saya membangun **VektorPedia**, mesin pencari yang didukung knowledge graph keanekaragaman hayati yang terintegrasi. Data dari keempat sumber diambil dan diselaraskan menjadi satu graf yang menangkap hubungan antara serangga, virus, dan tanaman. Analisis jaringan pada graf itu memunculkan dan memberi skor pada kandidat serangga vektor.

## Arsitektur

::architecture-explorer{:nodes="architecture"}
::

## Tantangan teknis

- **Sumber yang heterogen** — setiap knowledge graph memakai identifier dan kosakatanya sendiri, sehingga entitas harus diselaraskan dulu sebelum analisis apa pun bisa bermakna.
- **Sinyal dari struktur** — data interaksinya jarang; analisis jaringan dipakai untuk menyimpulkan kandidat vektor dari cara spesies saling terhubung, bukan hanya dari catatan langsung.
- **Dari riset menjadi produk** — mengubah pipeline riset menjadi aplikasi pencarian yang bisa dipakai dalam waktu sekitar tiga bulan.

## Dampak

::metric-grid{:metrics="metrics"}
::

Penelitian ini dipublikasikan di jurnal terindeks Scopus (*JISEBI*, 2024) dan di-deploy di [vektorpedia.ipb.ac.id](https://vektorpedia.ipb.ac.id/).

## Pelajaran

Knowledge graph kuat justru karena membawa konteks — tetapi sebagian besar usahanya ada pada pekerjaan penyelarasan yang tidak glamor. Pengalaman pencarian yang baik di atasnyalah yang membuat riset bisa dipakai oleh orang di luar laboratorium.

## Cuplikan

::gallery
---
images:
  - { src: /images/work/vektorpedia/1.jpeg, alt: Ringkasan ide }
  - { src: /images/work/vektorpedia/2.jpeg, alt: Tahapan penelitian }
  - { src: /images/work/vektorpedia/3.jpeg, alt: Graf interaksi }
  - { src: /images/work/vektorpedia/4.jpeg, alt: Embedding takson }
  - { src: /images/work/vektorpedia/5.jpg, alt: Skoring serangga vektor }
  - { src: /images/work/vektorpedia/6.jpg, alt: Halaman informasi detail }
---
::
