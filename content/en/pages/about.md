---
title: About
description: Software engineer based in Greater Jakarta, Indonesia (originally from Gorontalo), working across payments, backend systems, data, AI and visual design.
---

## Introduction

My full name is Mohammad Zulkifli Katili, but most people call me **Kiki**. I'm originally from Gorontalo, now based in Tangerang, in Greater Jakarta, Indonesia. I like problems where engineering, data and design meet, and I care as much about *why* something should be built as *how*.

I've been building software professionally since 2019. I work in English and Indonesian (my native language), and I'm used to working with teams across borders.

## Engineering journey

I studied Information Systems at Universitas Negeri Gorontalo, graduating as the best graduate of the Faculty of Engineering. My undergraduate thesis became **Sindasi**, a decision-support system using AHP-TOPSIS.

While studying I built production apps for real clients: **Raisa**, an inflation early-warning system for Bank Indonesia's Gorontalo office during my internship, then **TimeMarket**, a workload-management PWA for the same office. Project work followed — a nearest-mosque API and admin panel for **Digimosque**, a scheduling system for **IAIN Sultan Amai Gorontalo**, backend modules for **Contag School**, and spatial sales intelligence for **PT. Makassar Raya Motor**.

## Current focus

I'm working on payment systems — payment gateways, B2B/B2C flows and the APIs around them — where correctness, idempotency and consistency matter more than anything clever.

As a Senior Fullstack Developer at **Singapay** I help maintain a payment gateway core that handles hundreds of thousands of transactions a day, on infrastructure that runs on Huawei Cloud with Alibaba Cloud as the disaster-recovery site. Day to day that means:

- **Bank integrations under SNAP** — Bank Indonesia's open-API payment standard, including the access-token and request-signature layer. Six banks directly, dozens more through vendors.
- **One way to add a biller.** I standardised the PPOB biller integrations — hundreds of service types and thousands of products — behind one internal schema and one abstract interface. Adding a new service went from about two weeks to about three days.
- **Splitting the monolith.** Busy transaction jobs moved onto asynchronous message queues, and new services are built in Go as parts of the PHP monolith are split out.
- **Releases without a downtime window**, using blue-green deployment.
- **Tooling that keeps the ledger honest** — nightly integrity checks, dry-run-first data patches that can always be reverted, and dispute-resolution tools that turned a 3–5 day case into a matter of hours.
- **Fixing the cause, not only the data.** When two transfers 63 ms apart wiped out a debit, I traced the race condition, repaired the balances from the ledger, and applied one lock order across the code paths that move money. I wrote it up in [The 63 Milliseconds That Broke the Balances of Hundreds of Accounts](/writing/race-condition-63ms).
- **Go services** for PPOB, QRIS and the backend-for-frontend of Singapay's B2C app, the Payment Link front end in React, and small C++ command-line utilities on the servers.
- **Documentation as AI context.** A documentation workflow that AI tools can read cut development and issue-tracing turnaround from about a week to one or two days.
- **Working with vendors and merchants** — UAT before every integration goes live, and I'm the person merchants most often ask for technical help.

I now handle the PPOB project, working from Indonesia with a team that is almost entirely in Shanghai. Within the team I'm a senior engineer: I review code, pair with teammates when debugging, and onboard new engineers onto the codebase.

Outside the day job I contribute to **[Anveesa](https://anveesa.com/)**, a suite of open-source developer tools (a database studio, database management, an AI retrieval tool and cloud storage), on both the front end (in Vue) and the back end. I'm involved in Anveesa Aras, Anveesa Vestra, Anveesa Nias and Anveesa Workflow; the Nias back end is written in Go.

## AI, knowledge graphs & RAG

My master's in Computer Science at **IPB University** (Computational Intelligence & Optimization, GPA 3.83) focused on knowledge graphs and network analysis. The thesis became **VektorPedia** and a Scopus-indexed paper. Knowledge graphs are one of the most useful ways to give language models real context, which is why I keep exploring retrieval-augmented generation and LLM tooling. That interest turned into production work at Bank Indonesia, where I led two AI projects — see Leadership below.

On my own time I built **[Anveesa Aness](https://github.com/kikiraihan/anveesa-aness)**, an open-source RAG framework that turns Markdown knowledge bases into a chat API with source citations: FastAPI with Docker Compose, a cross-encoder reranker after vector search, and a router that sends each question to one of three model tiers by complexity (OpenRouter, Anthropic, Groq), with a Vue + Tailwind chat front end.

## Design background

Before I wrote much code, I designed. I led the multimedia division of the campus Linux Study Group, reached the finals of a national graphic design competition, and have designed logos and brand systems — HEXSTUDIO, Katili Corp, Kotaluwuk.com, and the GenBI Gorontalo identity. That habit shows up in the interfaces I build, including this site.

I've run that practice as **HEX Studio** ([@hexstudiogo](https://www.instagram.com/hexstudiogo)) since 2016, taking brand and interface briefs from clients and organisations, and documenting each piece as a case study: brief, decision, reasoning. I also designed the logo for GenBI Nusantara's 9th anniversary, and I keep drawing; over the years my illustrations have settled into a style of their own.

## Side projects

I like building small, complete products end to end. Since October 2026 that has included native **macOS menu bar apps in Swift + AppKit**, built with AI-assisted development and shipped through GitHub releases: [Temu](/work/temu) (a pixel companion that lives on a friend's Mac, with a Go server and Vue web app), [PasteLAN](/work/pastelan) (clipboard sharing between Mac and phone), [AI Todo](/work/ai-todo), [LiteScroller](/work/litescroller), LiteCalendar and LiteMonitor. Alongside them are web apps such as [Racik](/work/racik), [Our Day](/work/our-day) and [Ngoding5](/work/ngoding5). Everything is on the [Lab](/lab) page.

## How I work

- **Start from the problem.** Understand who is affected and what "better" looks like before choosing a stack.
- **Meet users where they are.** Sometimes that's a PWA on the phone they already carry; sometimes it's an Excel import instead of an API.
- **Be clear about ownership.** On team projects, I say what the team built and what I built.
- **Leave it maintainable.** Conventions, small modules and readable code outlive clever ones.

## Leadership

I have led the development of an AI application twice, both for **Bank Indonesia's Regional Department** in Jakarta, each with a small team of 4–5 people:

- **TIARA v3** (2025) — Bank Indonesia's AI policy chatbot. I led it end to end: architecture, features and deployment. Retrieval-augmented generation over PostgreSQL + pgvector with Gemini; a tool that lets the model query tabular data with pandas and return a summary; and a small self-hosted classification model (GLiClass, served on CPU) that screens every incoming prompt for injection attempts before it reaches the main model. Plus user and admin portals in React / Next.js (App Router), with answers streamed to the chat over SSE, and full technical documentation. OpenAI was integrated as a second provider. The knowledge base reached **88% response accuracy**, with **100% of feature tests passing**, out-of-scope questions included.
- **RAISA** (2024–2025) — a risk-assessment system for transaction data reported by payment service providers (PJP) and money changers (KUPVA). Machine-learning prediction for the Net Risk Assessment (NRA APU) reaching **95% accuracy**, an analytical dashboard over **50+ million transactions a month**, and automation that cut manual analysis time by **up to 30%**.

Earlier, outside work, I chaired **Generasi Baru Indonesia (GenBI) Gorontalo** (2020–2021): 6 departments and 3 university commissariats, 60+ activities in a year, a rebuilt member scoring system that raised active membership to 80%, and the community's 2025 vision. Before that I was on its Public Relations & Partnership staff (2019–2020), documenting every activity and serving on the committee of more than 100 of them. On campus I led the multimedia division of the **Linux Study Group** (2017–2018), running weekly sharing sessions on graphic design and video editing.

## Education

| Years | Degree |
| --- | --- |
| 2021–2023 | **Master of Computer Science**, IPB University — Computational Intelligence & Optimization, GPA 3.83 / 4.00. Thesis (grade A): an insect-virus vector search engine based on insect–virus–plant interaction network analysis. |
| 2016–2021 | **Bachelor of Information Systems**, Universitas Negeri Gorontalo — GPA 3.53 / 4.00, best graduate of the Faculty of Engineering. Thesis (grade A): AHP-TOPSIS in a recommendation system for outstanding students. Won 5 national and provincial student competitions in design and programming. |

## Research & publications

1. Katili, M. Z., Herdiyeni, Y., & Hardhienata, M. K. D. (2024). *Leveraging Biotic Interaction Knowledge Graph and Network Analysis to Uncover Insect Vectors of Plant Virus.* JISEBI. [Link](https://e-journal.unair.ac.id/JISEBI/article/view/50015)
2. Katili, M., Amali, L., & Tuloli, M. (2021). *Implementasi Metode AHP-TOPSIS dalam Sistem Pendukung Rekomendasi Mahasiswa Berprestasi.* Jambura Journal of Informatics, 3(1), 1–10. [Link](https://ejurnal.ung.ac.id/index.php/jji/article/view/10246)

Publication 1 is SINTA-1 and Scopus indexed; it draws on data from GloBI, Wikidata, DBpedia and the NCBITaxon ontology. Two smaller research projects came out of international summer courses at IPB:

- **[Melon leaf image clustering](/work/ipb-summer-2023)** (2023) — K-Means on GLCM texture features, AI and Optimization for Smart Agriculture and Biomedical Applications.
- **Graph-network humidity sensing** (2022) — humidity sensors modelled as graph nodes to monitor plants and how disease spreads, IoT for Smart Urban Farming.

## Awards

| Year | Award |
| --- | --- |
| 2023 | Best Team & Best Local Participant — IPB International Summer Course (AI for Smart Agriculture) |
| 2021 | Best Trainer — SIAPIK (Financial Information Recording System), Bank Indonesia |
| 2020 | Best Idea — Startup Building Competition, BuatStartup COVID-19 Edition |
| 2019 | 1st Winner — Software Engineering, Smart Fest, Gorontalo Regency KOMINFO |
| 2019 | 3rd Winner — UKSW FIT National Web Programming Competition |
| 2018 | 6th Winner — UKSW FIT National Web Programming Competition |
| 2017 | Finalist — National Graphic Design Competition UNITY-UNY |

## Certifications

Data Analysis with Python · Basic Data Science · SQL · Machine Learning Development · AI & Optimization Course · ASEAN Data Science Explorer · IoT for Smart Urban Farming · Basic Data Visualization · Problem Solving in Programming (2022–2023).

<!-- TODO: Personal interests section (PRD §9) — add when ready. -->
