---
title: LiteScroller
description: A lightweight macOS menu bar separator that hides icons, plus a scroller mode that keeps hidden icons reachable even when long app menus or the notch would cover them.
type: engineering
category: macOS app · Menu bar
year: 2026
role: Developer
company: Personal project
featured: false
order: 15
cover: /images/lab/lite-scroller.webp
technologies: [Swift, AppKit, macOS, Accessibility API]
contribution:
  mine: Sole developer — Swift app, installer and release workflow.
links:
  - { label: GitHub, url: "https://github.com/kikiraihan/mac-os-lite-menu-bar-scroller" }
  - { label: Teaser video, url: "https://github.com/kikiraihan/mac-os-lite-menu-bar-scroller/blob/main/video/litescroller-teaser.mp4" }
---

## Teaser video

::video-player{src="https://github.com/kikiraihan/mac-os-lite-menu-bar-scroller/blob/main/video/litescroller-teaser.mp4" poster="/images/lab/lite-scroller.webp" caption="Hidden menu bar icons in a scrollable strip, reachable even next to a long app menu."}
::

## Why it exists

Separators like Hidden Bar push icons off-screen and bring them back when opened — but when the active app has a long menu (*File, Edit, View, History, Bookmarks, …*) or the screen has a notch, macOS still hides some of them, with no way to reach them. LiteScroller keeps them hidden and shows them in a strip that **covers** the app menu area instead, and if that is still not wide enough, the strip scrolls.

## What it does

- **Toggle** and **toggle-over** modes: hide or show the icons left of the `|` separator with one click; the second one also hides the app's text menu while open, so the revealed icons have room.
- **Scroller mode**: a strip above the menu bar with **all** hidden icons, scrolled with the trackpad or mouse wheel; click an icon to open it.
- **Dropdown mode**: every hidden icon as a menu item with its image and name.
- Auto-close after 5–60 seconds, open at login, follows light/dark, no polling (0% CPU at rest), update and uninstall from the menu.

## How it's built

Pure Swift + AppKit in a single source file, no dependencies. The scroller and dropdown modes read the menu bar items and "press" the one you click through the macOS Accessibility API; with screen-recording permission the strip shows the real icon images, captured even while the icons are off-screen.

## Snapshots

::gallery
---
fit: contain
images:
  - { src: /images/work/litescroller/menubar-modes.webp, alt: Display modes in the menu bar, caption: "The modes side by side. Mockup — the real app may look slightly different." }
  - { src: /images/work/litescroller/menu.webp, alt: LiteScroller settings menu }
---
::
