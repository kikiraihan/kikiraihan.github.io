---
title: Kongkong Interface
description: A responsive, mobile-first interface for a student crowdfunding platform.
type: design
category: UI design
year: 2020
role: UI Designer
order: 24
cover: /images/work/kongkong-interface/index-desktop.png
technologies: [Interface, Bootstrap, Responsive, Mobile first]
---

## Brief

An interface for students: flexible, responsive, and able to show activities run by students and student organizations.

## Solution

Built from scratch with Bootstrap — no template — prioritising the mobile layout, since phones are what students use most. The engineering side is in the [Kongkong project](/work/kongkong).

::gallery
---
images:
  - { src: /images/work/kongkong-interface/index-desktop.png, alt: "Index page, desktop" }
  - { src: /images/work/kongkong-interface/index-mobile.png, alt: "Index page, mobile" }
  - { src: /images/work/kongkong-interface/profil-desktop.png, alt: "Profile page, desktop" }
  - { src: /images/work/kongkong-interface/profil-mobile.png, alt: "Profile page, mobile" }
---
::

## Two people, two journeys

Kongkong serves two very different visitors. A **supporter** arrives from a shared link and should reach a project and back it without creating an account. A **student or student organisation** signs in to publish proposals and follow their progress. Every screen was designed around one of those two journeys, with one primary action each.

![The two journeys the Kongkong interface was designed around](/images/work/kongkong-interface/kongkong-user-flow.svg)

## Design decisions

::process-steps
---
steps:
  - { title: Mobile first, text: "Layouts were designed at phone width first, then allowed to spread into columns on desktop — not squeezed down afterwards." }
  - { title: One search field, text: "The home page has a single headline, a friendly greeting (#SohibKongkong) and one search box. Nothing competes with it." }
  - { title: Progress on every card, text: "Each project card shows its owner, date and a funding bar, so supporters can compare projects at a glance." }
  - { title: Navigation within thumb reach, text: "On mobile the top navigation moves to a bottom tab bar: three tabs for guests, five once signed in." }
  - { title: The main action in the centre, text: "For signed-in students the centre tab is “+” — creating a proposal sits exactly where the thumb rests." }
  - { title: "Same parts, every size", text: "Cards, tabs and the activity summary are the same components on desktop and mobile, only rearranged." }
---
::

## Component breakdown

Pulled out of the screens above, these are the pieces the whole interface is built from.

![Home page hero with headline, greeting and a single search field](/images/work/kongkong-interface/detail-hero.png)

::gallery
---
fit: contain
images:
  - { src: /images/work/kongkong-interface/detail-project-card.png, alt: Project card with owner avatar and progress, caption: "Project card — cover image, title, owner avatar, date and funding percentage." }
  - { src: /images/work/kongkong-interface/detail-activity.png, alt: "Activity summary with proposal, event and wait counts", caption: "Activity summary — proposals, events and items waiting, as three numbers." }
  - { src: /images/work/kongkong-interface/detail-profile-links.png, alt: Profile links list, caption: "Profile links — website, social accounts and email in one scannable list." }
---
::

On mobile the navigation is a bottom tab bar. Guests get three tabs — proposals, documentation and log in, the same items as the desktop navigation:

![Bottom tab bar for guests](/images/work/kongkong-interface/detail-tabbar-guest.png)

Once signed in it grows to five, and the "+" for a new proposal takes the centre:

![Bottom tab bar for signed-in students](/images/work/kongkong-interface/detail-tabbar-user.png)

## Palette

Built on Bootstrap's defaults on purpose: a familiar blue for actions, a lighter teal for links and names, and a cool gray surface — quick to build, and easy for the next developer to extend.

::color-palette
---
colors:
  - { hex: "#007BFF", name: Action blue, role: Progress bars and primary buttons }
  - { hex: "#17A2B8", name: Link teal, role: Project titles and names }
  - { hex: "#F4F6F8", name: Surface gray, role: Page and hero background }
---
::
