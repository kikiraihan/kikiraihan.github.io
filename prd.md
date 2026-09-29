# Product Requirements Document (PRD)

## Kikiraihan Portfolio Revamp

**Project:** Kikiraihan Personal Portfolio
**Current:** GitHub Pages — `kikiraihan.github.io`
**Target:** Nuxt 4
**Status:** Draft
**Primary Goal:** Transform the existing portfolio into a high-quality, interactive personal website that demonstrates software engineering, product thinking, AI experience, and visual/design capability.

---

# 1. Product Vision

The portfolio should not feel like a conventional developer CV website.

It should function as:

> **A living demonstration of how Kikiraihan thinks, designs, builds, and solves problems.**

The website should communicate three things within the first few seconds:

1. **Who I am**
2. **What I build**
3. **Why my work is interesting**

The website should emphasize actual work, measurable impact, technical depth, and personality rather than a long list of technologies.

---

# 2. Objectives

## Primary Objectives

### O1 — Showcase engineering capability

Demonstrate experience building production-grade systems involving:

* Payment systems
* Payment gateways
* B2B/B2C systems
* APIs
* AI/RAG systems
* Data processing
* High-volume transactions
* Distributed/backend systems
* Developer tooling

### O2 — Showcase product thinking

Projects should explain:

```text
Problem
↓
Context
↓
Approach
↓
Technical decisions
↓
Implementation
↓
Result
↓
Lessons learned
```

Rather than simply:

```text
Project Name
Laravel
Vue
PostgreSQL
Redis
```

### O3 — Showcase visual/design capability

The portfolio itself should demonstrate:

* UI design
* Interaction design
* Motion
* Typography
* Composition
* Information hierarchy
* Micro-interactions

The website should itself be a portfolio piece.

### O4 — Improve discoverability

Provide strong:

* SEO
* Semantic HTML
* Open Graph metadata
* Twitter/X metadata
* Structured data
* Sitemap
* robots.txt
* canonical URLs

### O5 — Make content maintainable

Adding a project should not require modifying multiple Vue components.

A project should ideally be created by adding structured content:

```text
content/projects/my-project.md
```

and Nuxt automatically generates:

```text
/work/my-project
```

---

# 3. Target Audience

## Primary

### Recruiters / Hiring Managers

Need to quickly understand:

* Who the developer is
* Experience level
* Main technical strengths
* Notable projects
* Professional history
* Contact information

### Engineering Leaders

Need deeper evidence of:

* System design
* Technical decisions
* Scalability
* Problem solving
* Engineering maturity

### Developers

Interested in:

* Technical implementations
* Architecture
* AI/RAG
* Backend engineering
* Experiments
* Technical writing

### Potential Clients / Collaborators

Need to understand:

* What can be built
* Previous experience
* Areas of expertise
* How to contact the developer

---

# 4. Brand Positioning

The portfolio should position the owner as:

> **A software engineer who combines engineering, product thinking, AI, and visual design.**

Avoid positioning purely as:

> "Full-stack developer who knows many technologies."

The emphasis should be on **outcomes and problem solving**, not technology accumulation.

---

# 5. Information Architecture

```text
/
├── Home
│
├── Work
│   ├── All Projects
│   └── /work/[slug]
│
├── About
│
├── Writing
│   └── /writing/[slug]
│
├── Lab
│   └── Experiments
│
└── Contact
```

Optional:

```text
/resume
/uses
/now
```

These should only be added if they provide meaningful value.

---

# 6. Homepage

## 6.1 Hero

The hero should immediately establish identity.

Example structure:

```text
Moh Zulkifli Katili
Software Engineer

I build systems, products, and experiences
that solve real problems.

[View selected work]
[About me]
```

The exact copy should be refined during implementation.

### Hero requirements

* Strong typography
* Minimal visual noise
* Responsive
* Subtle motion
* Clear CTA
* No unnecessary skill-cloud
* No generic stock illustration

---

# 7. Selected Work

Show approximately 4–6 high-value projects.

Each project card should communicate:

```text
Project
Category
Short description
Impact / metric
Technology
```

Example:

```text
Payment Gateway

High-volume payment infrastructure
processing hundreds of thousands
of transactions per day.

500K–800K
transactions/day
```

Metrics should only be displayed when they are accurate and safe to disclose publicly.

---

# 8. Project Case Study

Each project should have its own page.

## Required sections

### 8.1 Overview

```text
Project name
Role
Timeline
Company / Context
```

### 8.2 Problem

Explain:

* What problem existed?
* Who experienced the problem?
* Why did it matter?

### 8.3 Context

Explain relevant business/system constraints.

### 8.4 Solution

Explain what was built.

### 8.5 Architecture

Use diagrams where appropriate.

Example:

```text
Client
  ↓
API Gateway
  ↓
Payment Service
  ↓
Transaction Processing
  ↓
Provider
  ↓
Settlement
```

### 8.6 Technical Challenges

Highlight real engineering problems:

* Race conditions
* Idempotency
* Distributed state
* API integration
* Data consistency
* Performance
* Scalability
* Legacy constraints

### 8.7 Impact

Use measurable results whenever possible.

Example:

```text
500K–800K
transactions/day
```

or:

```text
Tracing time reduced
from ~1 week → 1–2 days
```

### 8.8 My Contribution

Explicitly distinguish:

```text
Team achievement
vs.
Individual contribution
```

This prevents case studies from implying sole ownership of team-wide systems.

### 8.9 Lessons Learned

Short engineering reflection.

---

# 9. About Page

The About page should provide a more personal narrative.

Sections:

```text
Introduction

Engineering journey

Current focus

Design background

AI / RAG

How I work

Tools I use

Personal interests

Contact
```

Avoid turning this into another resume page.

---

# 10. Experience

Display professional experience chronologically.

Example:

```text
SingaPay
Software Engineer
2025 — Present

HEX Studio
Designer / Developer
2016 — ...
```

Each experience should include:

* Role
* Company
* Period
* Short description
* Selected achievements

Avoid excessive bullet points.

---

# 11. Skills

Skills should be grouped by capability rather than one giant technology list.

Example:

```text
Backend
Laravel
PHP
Python
Node.js

Frontend
Vue
Nuxt
React
TypeScript

Data
PostgreSQL
Redis
Vector databases

AI
RAG
LLM
Embeddings
AI agents

Infrastructure
Docker
CI/CD
Linux
Cloud

Design
Figma
Illustrator
Photoshop
Design systems
```

Technology lists should support the story, not become the story.

---

# 12. Writing

Create a technical writing section.

Potential categories:

```text
Engineering
AI
Backend
Architecture
Payments
Developer Experience
Design
```

Articles should support Markdown/MDX-style content management.

Example:

```text
content/
└── writing/
    ├── understanding-iso-8583.md
    ├── building-rag.md
    └── payment-idempotency.md
```

Each article should have:

* Title
* Description
* Date
* Reading time
* Tags
* Cover image
* Content
* Related articles

---

# 13. Lab

Create an experimental area for projects that are interesting but don't necessarily belong in professional case studies.

Examples:

```text
AI experiments
UI experiments
Animation experiments
Developer tools
Data visualization
Creative coding
```

The Lab should communicate curiosity and experimentation.

---

# 14. GitHub Integration

Optional dynamic GitHub integration.

Potential information:

```text
GitHub profile
Public repositories
Recent activity
Selected repositories
Contribution activity
```

Do not make GitHub activity the centerpiece.

It should support the portfolio rather than become a dashboard.

---

# 15. Interactive Engineering Features

The portfolio should contain a few meaningful interactive elements.

Examples:

### Project architecture explorer

Allow visitors to inspect:

```text
Frontend
   ↓
API
   ↓
Service
   ↓
Database
```

### Technical timeline

Interactive career/project timeline.

### Project metrics

Animated counters when entering viewport.

### Code snippets

Interactive code examples with syntax highlighting.

### System diagrams

Expandable architecture diagrams.

Avoid adding interaction simply because it is technically possible.

Every interaction should reinforce the content.

---

# 16. Visual Direction

## Design principle

> Premium engineering portfolio × editorial design × experimental interface.

Avoid:

* Generic SaaS dashboard aesthetics
* Excessive gradients
* Excessive glassmorphism
* Excessive neon
* Template-like layouts
* Skill percentage bars
* Random 3D objects
* Excessive animations

Prefer:

* Strong typography
* Large whitespace
* Editorial composition
* Asymmetrical layouts
* Carefully controlled motion
* Strong visual hierarchy
* High-quality imagery
* Technical diagrams
* Subtle micro-interactions

---

# 17. Motion Design

Motion should feel intentional.

Use:

* Page transitions
* Scroll reveal
* Parallax where appropriate
* Image transformations
* Text animation
* Hover states
* Number counters
* Magnetic interactions sparingly

Avoid:

* Constant movement
* Long loading animations
* Excessive cursor effects
* Animation that blocks navigation

Accessibility requirements:

```text
prefers-reduced-motion
```

must be respected.

---

# 18. Responsive Design

Must support:

```text
Mobile
Tablet
Desktop
Large desktop
```

Primary breakpoints should be defined consistently.

Mobile should not simply be a compressed desktop.

The information hierarchy should be intentionally redesigned for small screens.

---

# 19. Technology Stack

## Core

```text
Nuxt 4
Vue 3
TypeScript
Vite
Nitro
```

## Styling

Preferred:

```text
Tailwind CSS
```

or a custom CSS architecture if the design requires more control.

## Content

```text
Nuxt Content
```

for:

* Projects
* Articles
* Experience
* Metadata

## Animation

Use one primary animation solution.

Candidate:

```text
GSAP
```

or:

```text
Motion for Vue
```

Do not introduce multiple animation libraries without a concrete requirement.

## Icons

Use a consistent icon system.

## Image optimization

Use Nuxt Image or an equivalent optimized image pipeline.

---

# 20. Rendering Strategy

Use Nuxt's rendering capabilities intentionally.

Default:

```text
SSR / prerendered
```

Content-heavy pages should be statically generated where possible.

Dynamic functionality may use:

```text
Nitro server routes
```

Potential route strategy:

```text
/
→ prerender

/work
→ prerender

/work/[slug]
→ prerender

/writing/[slug]
→ prerender

/api/*
→ server
```

---

# 21. SEO Requirements

Every public page must have:

* Unique title
* Meta description
* Canonical URL
* Open Graph metadata
* Social preview image
* Semantic headings
* Structured data where appropriate

Generate:

```text
/sitemap.xml
/robots.txt
```

Structured data may include:

```text
Person
WebSite
Article
CreativeWork
```

---

# 22. Performance Requirements

Target:

```text
Lighthouse Performance: ≥ 90
Lighthouse Accessibility: ≥ 95
Lighthouse Best Practices: ≥ 95
Lighthouse SEO: ≥ 95
```

These are targets, not guarantees.

Key requirements:

* Optimized images
* Lazy loading
* Code splitting
* Minimal client-side JavaScript
* Avoid unnecessary hydration
* Optimize fonts
* Avoid large animation bundles
* Avoid blocking resources

---

# 23. Accessibility

Target WCAG 2.2 AA where practical.

Requirements:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* Accessible buttons
* Proper labels
* Sufficient contrast
* Reduced-motion support
* Screen-reader-friendly navigation
* No interaction dependent exclusively on hover

---

# 24. Content Architecture

Recommended structure:

```text
content/
├── projects/
│   ├── payment-gateway.md
│   ├── tiara.md
│   ├── raisa.md
│   └── ...
│
├── writing/
│   ├── iso-8583.md
│   ├── rag.md
│   └── ...
│
└── experience/
    └── experience.md
```

Project schema:

```ts
{
  title,
  slug,
  description,
  category,
  year,
  role,
  company,
  technologies,
  featured,
  metrics,
  cover,
  content
}
```

---

# 25. Security & Privacy

The portfolio must not expose:

* Private company credentials
* Internal URLs
* API keys
* Customer information
* Merchant information
* Sensitive transaction information
* Internal architecture that is not publicly disclosable
* Proprietary source code

All work-related metrics must be reviewed before publication.

When describing professional work, distinguish between:

```text
Public information
Personal contribution
Team/company information
Confidential information
```

---

# 26. Analytics

Use privacy-conscious analytics if needed.

Track only useful events such as:

```text
Page views
Project views
Resume clicks
Contact clicks
External project clicks
```

Avoid unnecessary tracking.

Analytics must not negatively affect performance.

---

# 27. Contact

Primary CTA:

```text
Let's build something.
```

Potential methods:

* Email
* GitHub
* LinkedIn

The contact experience should be extremely simple.

---

# 28. Deployment

Initial deployment can remain compatible with static hosting if the portfolio does not require server functionality.

Preferred future architecture:

```text
GitHub
   ↓
CI/CD
   ↓
Nuxt build
   ↓
Deployment
```

The deployment target should support:

* HTTPS
* Custom domain
* CDN
* Automatic deployment
* Preview deployment

---

# 29. Repository Structure

Recommended:

```text
portfolio/
├── app/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   └── assets/
│
├── content/
│   ├── projects/
│   ├── writing/
│   └── experience/
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── favicon/
│
├── server/
│   └── api/
│
├── shared/
│
├── nuxt.config.ts
├── package.json
└── README.md
```

---

# 30. Development Phases

## Phase 1 — Foundation

* Initialize Nuxt 4
* Configure TypeScript
* Configure styling
* Configure fonts
* Configure ESLint
* Establish design tokens
* Establish component architecture
* Configure SEO foundation

## Phase 2 — Design System

Create:

```text
Typography
Colors
Spacing
Buttons
Links
Cards
Navigation
Containers
Section layouts
Motion primitives
```

## Phase 3 — Homepage

Implement:

* Navigation
* Hero
* Selected Work
* Experience
* Skills/capabilities
* About preview
* Contact
* Footer

## Phase 4 — Project System

Implement:

* Content schema
* Project listing
* Project detail page
* Case-study components
* Metrics
* Architecture diagrams

## Phase 5 — Writing

Implement:

* Writing listing
* Article page
* Tags
* Reading time
* Related content

## Phase 6 — Lab

Implement experimental project showcase.

## Phase 7 — Dynamic Features

Potential:

* GitHub integration
* Interactive architecture
* Dynamic metrics
* Contact API

Only implement features that improve the portfolio.

## Phase 8 — Optimization

Audit:

```text
Performance
SEO
Accessibility
Mobile
Animation
Image optimization
Bundle size
```

## Phase 9 — Launch

* Production domain
* Analytics
* Sitemap
* Search engine verification
* Social previews
* Final content review

---

# 31. Definition of Done

The revamp is complete when:

### UX

* Navigation is intuitive
* Important work is discoverable within seconds
* Mobile experience is polished
* Animations do not interfere with usability

### Content

* Professional experience is represented accurately
* Selected projects have meaningful case studies
* Contributions are clearly distinguished
* Confidential information is excluded

### Engineering

* Nuxt 4 architecture is clean
* TypeScript is used consistently
* Components are reusable
* Content is separated from presentation
* No unnecessary client-side JavaScript
* Production build succeeds

### Performance

Target:

```text
Performance ≥ 90
Accessibility ≥ 95
Best Practices ≥ 95
SEO ≥ 95
```

### SEO

* Sitemap works
* robots.txt works
* OG previews work
* Canonical URLs work
* Metadata is unique

### Accessibility

* Keyboard navigation works
* Focus states work
* Reduced motion works
* Semantic markup is used

---

# 32. Success Metrics

The portfolio should ultimately make it easier for a visitor to answer:

```text
Who is this person?
        ↓
What can they build?
        ↓
What problems have they solved?
        ↓
What was their contribution?
        ↓
What was the impact?
        ↓
How can I contact them?
```

The primary success metric is therefore **clarity of professional positioning**, not raw page views.

---

# 33. Guiding Principle

The portfolio should demonstrate the same engineering philosophy that it claims to represent:

> **Don't show everything you can build. Show that you know what is worth building.**
