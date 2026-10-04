---
title: VektorPedia
description: A search engine that finds insect vectors of plant viruses by integrating four public knowledge graphs and running network analysis on top.
type: engineering
category: AI · Knowledge Graph
year: 2023
timeline: Aug 2022 — Dec 2023
role: Researcher & Engineer (Master thesis)
company: IPB University
featured: true
order: 1
cover: /images/work/vektorpedia/6.jpg
technologies: [Python, Vue, SPARQL, Knowledge Graph, Network Analysis]
metrics:
  - value: "4"
    label: public knowledge graphs integrated
  - value: "3 mo"
    label: from design to deployed app
  - value: "Scopus"
    label: indexed publication
architecture:
  - id: sources
    label: GloBI · Wikidata · DBpedia · NCBITaxon
    detail: Four public knowledge graphs describing species, taxonomy and biotic interactions.
  - id: ingest
    label: Ingestion & alignment
    detail: Entities from each source are ingested and aligned into one biodiversity knowledge graph.
  - id: graph
    label: Biodiversity knowledge graph
    detail: Insects, viruses and plants connected by typed interaction edges.
  - id: analysis
    label: Network analysis & scoring
    detail: Graph metrics score how likely an insect is to act as a vector for a plant virus.
  - id: api
    label: Python web server
    detail: Handles queries and data processing for the search engine.
  - id: client
    label: Vue client
    detail: Search UI for researchers to explore candidate vectors and their evidence.
contribution:
  team: Research direction and supervision came from my thesis supervisors.
  mine: Data ingestion, knowledge-graph integration, network analysis, and the full search application (backend + frontend).
links:
  - label: vektorpedia.ipb.ac.id
    url: https://vektorpedia.ipb.ac.id/
  - label: Published paper
    url: https://e-journal.unair.ac.id/JISEBI/article/view/50015
---

## Problem

Plant viruses spread through insects, but the knowledge of *which* insect carries *which* virus is scattered across many biodiversity databases. Researchers and plant-disease practitioners had no single place to ask: "which insects are likely vectors for this virus?"

## Context

This was my master's thesis at IPB University. The data already existed publicly — in Global Biotic Interactions (GloBI), Wikidata, DBpedia and the NCBI Taxonomy ontology — but in different shapes, identifiers and levels of completeness.

## Solution

I built **VektorPedia**, a search engine backed by an integrated biodiversity knowledge graph. Data from the four sources was ingested and aligned into one graph that captures relationships between insects, viruses and plants. Network analysis on that graph surfaces and scores candidate insect vectors.

## Architecture

::architecture-explorer{:nodes="architecture"}
::

## Technical challenges

- **Heterogeneous sources** — each knowledge graph uses its own identifiers and vocabulary, so entities had to be aligned before any analysis made sense.
- **Signal from structure** — interactions are sparse; network analysis was used to infer likely vectors from how species are connected, not just from direct records.
- **Research to product** — turning a research pipeline into a usable search application within about three months.

## Impact

::metric-grid{:metrics="metrics"}
::

The work was published in a Scopus-indexed journal (*JISEBI*, 2024) and deployed at [vektorpedia.ipb.ac.id](https://vektorpedia.ipb.ac.id/).

## Lessons learned

Knowledge graphs are powerful precisely because they carry context — but most of the effort is in the unglamorous alignment work. A good search experience on top is what makes the research usable by people outside the lab.

## Snapshots

::gallery
---
images:
  - { src: /images/work/vektorpedia/1.jpeg, alt: Summary of the idea }
  - { src: /images/work/vektorpedia/2.jpeg, alt: Research stages }
  - { src: /images/work/vektorpedia/3.jpeg, alt: Interaction graph }
  - { src: /images/work/vektorpedia/4.jpeg, alt: Embedded taxon }
  - { src: /images/work/vektorpedia/5.jpg, alt: Insect vector scoring }
  - { src: /images/work/vektorpedia/6.jpg, alt: Detail information page }
---
::
