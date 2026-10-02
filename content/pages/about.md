---
title: About
description: Software engineer from Gorontalo, Indonesia, working across payments, backend systems, data, AI and visual design.
---

## Introduction

Hi, I'm Mohammad Zulkifli Katili — most people call me **Kiki**. I'm a software engineer from Gorontalo, Indonesia. I like problems where engineering, data and design meet, and I care as much about *why* something should be built as *how*.

## Engineering journey

I studied Information Systems at Universitas Negeri Gorontalo, graduating as the best graduate of the Faculty of Engineering. My undergraduate thesis became **Sindasi**, a decision-support system using AHP-TOPSIS.

While studying I built production apps for real clients: **Raisa**, an inflation early-warning system for Bank Indonesia's Gorontalo office during my internship, then **TimeMarket**, a workload-management PWA for the same office. Project work followed — a nearest-mosque API and admin panel for **Digimosque**, a scheduling system for **IAIN Sultan Amai Gorontalo**, backend modules for **Contag School**, and spatial sales intelligence for **PT. Makassar Raya Motor**.

## Current focus

I'm working on payment systems — payment gateways, B2B/B2C flows and the APIs around them — where correctness, idempotency and consistency matter more than anything clever.

As a Senior Fullstack Developer at **Singapay** I help maintain a payment gateway core that handles hundreds of thousands of transactions a day. Day to day that means bank integrations under **SNAP** (Bank Indonesia's open-API payment standard, including the access-token and request-signature layer), moving busy transaction jobs onto Kafka topics and Redis queues, and writing Go microservices as parts of the PHP monolith are split out. I standardised the PPOB biller integrations — hundreds of service types and thousands of products — behind one internal schema and one abstract interface, which brought adding a new service down from about two weeks to about three days. I also build the tooling that keeps the ledger honest: nightly integrity checks, dry-run-first data patches that can always be reverted, and dispute-resolution tools that turned a 3–5 day case into a matter of hours.

## AI, knowledge graphs & RAG

My master's in Computer Science at **IPB University** (Computational Intelligence & Optimization, GPA 3.83) focused on knowledge graphs and network analysis. The thesis became **VektorPedia** and a Scopus-indexed paper. Knowledge graphs are one of the most useful ways to give language models real context, which is why I keep exploring retrieval-augmented generation and LLM tooling. That interest turned into production work at Bank Indonesia, where I led two AI projects — see Leadership below.

## Design background

Before I wrote much code, I designed. I led the multimedia division of the campus Linux Study Group, reached the finals of a national graphic design competition, and have designed logos and brand systems — HEXSTUDIO, Katili Corp, Kotaluwuk.com, and the GenBI Gorontalo identity. That habit shows up in the interfaces I build, including this site.

## How I work

- **Start from the problem.** Understand who is affected and what "better" looks like before choosing a stack.
- **Meet users where they are.** Sometimes that's a PWA on the phone they already carry; sometimes it's an Excel import instead of an API.
- **Be clear about ownership.** On team projects, I say what the team built and what I built.
- **Leave it maintainable.** Conventions, small modules and readable code outlive clever ones.

## Leadership

I have led the development of an AI application twice, both for **Bank Indonesia's Regional Department** in Jakarta:

- **TIARA v3** (2025) — Bank Indonesia's AI policy chatbot. I led it end to end: architecture, features and deployment. Retrieval-augmented generation over PostgreSQL + pgvector with Gemini; a tool that lets the model query tabular data with pandas and return a summary; and a small self-hosted classification model (GLiClass, served on CPU) that screens every incoming prompt for injection attempts before it reaches the main model. Plus user and admin portals in React / Next.js and full technical documentation. The knowledge base reached **88% response accuracy**, with **100% of feature tests passing**, out-of-scope questions included.
- **RAISA** (2024–2025) — a risk-assessment system for transaction data reported by payment service providers (PJP) and money changers (KUPVA). Machine-learning prediction for the Net Risk Assessment (NRA APU) reaching **95% accuracy**, an analytical dashboard over **50+ million transactions a month**, and automation that cut manual analysis time by **up to 30%**.

Earlier, outside work, I chaired **Generasi Baru Indonesia (GenBI) Gorontalo** (2020–2021): 6 departments and 3 university commissariats, 60+ activities in a year, a rebuilt member scoring system that raised active membership to 80%, and the community's 2025 vision.

## Publications

1. Katili, M. Z., Herdiyeni, Y., & Hardhienata, M. K. D. (2024). *Leveraging Biotic Interaction Knowledge Graph and Network Analysis to Uncover Insect Vectors of Plant Virus.* JISEBI. [Link](https://e-journal.unair.ac.id/JISEBI/article/view/50015)
2. Katili, M., Amali, L., & Tuloli, M. (2021). *Implementasi Metode AHP-TOPSIS dalam Sistem Pendukung Rekomendasi Mahasiswa Berprestasi.* Jambura Journal of Informatics, 3(1), 1–10. [Link](https://ejurnal.ung.ac.id/index.php/jji/article/view/10246)

## Awards

| Year | Award |
| --- | --- |
| 2023 | Best Team & Best Local Participant — IPB International Summer Course (AI for Smart Agriculture) |
| 2021 | 3rd Best Trainer — SIAPIK Trainers Contest, Bank Indonesia |
| 2020 | 3rd Winner — Startup Idea Competition, Sekolah Startup |
| 2019 | 1st Winner — Software Engineering, Smart Fest Gorontalo Regency |
| 2019 | 3rd Winner — UKSW FIT National Web Programming Competition |
| 2018 | 6th Winner — UKSW FIT National Web Programming Competition |
| 2017 | Finalist — National Graphic Design Competition UNITY-UNY |

<!-- TODO: Personal interests section (PRD §9) — add when ready. -->
