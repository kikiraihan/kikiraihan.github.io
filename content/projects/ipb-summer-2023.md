---
title: Melon Leaf Clustering
description: Unsupervised clustering of melon leaf images with K-Means and GLCM texture features — Best Team at the IPB International Summer Course.
type: engineering
category: AI · Machine Learning
year: 2023
timeline: 8–20 Oct 2023
role: Machine Learning Engineer
company: IPB International Summer Course
order: 10
cover: /images/work/ipb-summer-2023/1.jpeg
technologies: [Python, scikit-learn, OpenCV, K-Means, GLCM]
metrics:
  - value: "6"
    label: clusters validated with plant experts
  - value: "Best Team"
    label: award
links:
  - label: About the course
    url: https://csagri23.apps.cs.ipb.ac.id/
---

## Problem

At the International Summer Course on AI and Optimization for Smart Agriculture (IPB, Oct 2023), our team explored whether melon leaf images could be grouped automatically to support disease diagnosis and crop management.

## Solution

- Extracted texture features with the **gray-level co-occurrence matrix (GLCM)**.
- Clustered images with **K-Means** (scikit-learn, OpenCV for pre-processing).
- Chose the number of clusters with **SSE** and **silhouette score** — useful values ranged 3–6; we used 6 because it gave the most information to plant experts.
- Reviewed clusters **with plant experts**: they mapped to diseased leaves, nutrient deficiencies, healthy plants, and similar-symptom groups.

## Impact

::metric-grid{:metrics="metrics"}
::

Our team won **Best Team**, and I received the **Best Local Participant** award.

## Snapshots

::gallery
---
images:
  - { src: /images/work/ipb-summer-2023/2.jpeg, alt: Clusters }
  - { src: /images/work/ipb-summer-2023/1.jpeg, alt: Cluster plot }
  - { src: /images/work/ipb-summer-2023/3.jpeg, alt: SSE score }
  - { src: /images/work/ipb-summer-2023/4.jpeg, alt: Silhouette score }
  - { src: /images/work/ipb-summer-2023/5.jpeg, alt: Team presentation }
  - { src: /images/work/ipb-summer-2023/6.jpg, alt: Award }
---
::
