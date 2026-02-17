# Semantic HTML & Accessibility Cheatsheet

Quick reference for all concepts covered in Lecture 2.

---

## HTML5 Semantic Elements

These elements replaced the old `<div id="header">` pattern. Use them to give your HTML meaning.

| Element | Purpose | When to Use |
|---------|---------|-------------|
| `<header>` | Introductory content or navigational aids | Page header, article header, section header |
| `<nav>` | Navigation links | Main menu, sidebar links, breadcrumbs |
| `<main>` | Primary content of the page | ONE per page — the core content |
| `<section>` | Thematic grouping of content | Chapters, tabs, grouped content with a heading |
| `<article>` | Self-contained, independently distributable content | Blog posts, news articles, product cards, comments |
| `<aside>` | Tangentially related content | Sidebars, pull quotes, related links, fun facts |
| `<footer>` | Footer for its nearest ancestor | Page footer, article footer (author bio, dates) |

**Key Rules:**
- Only ONE `<main>` per page
- `<header>` and `<footer>` can appear inside `<article>` and `<section>` (not just at page level)
- `<section>` should almost always have a heading (`<h2>`–`<h6>`)

---

## Semantic Page Structure

A typical semantic page layout:

```
┌──────────────────────────────────┐
│          <header>                │  ← Banner: logo, title, tagline
│  ┌──────────────────────────┐   │
│  │        <nav>             │   │  ← Navigation: main menu
│  └──────────────────────────┘   │
└──────────────────────────────────┘
┌──────────────────────┐ ┌────────┐
│      <main>          │ │<aside> │
│  ┌────────────────┐  │ │        │
│  │  <section>     │  │ │Sidebar │
│  │  About         │  │ │content │
│  └────────────────┘  │ │        │
│  ┌────────────────┐  │ └────────┘
│  │  <section>     │  │
│  │  Skills        │  │
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │  <article>     │  │
│  │  Blog Post     │  │
│  └────────────────┘  │
└──────────────────────┘
┌──────────────────────────────────┐
│          <footer>                │  ← Copyright, contact, links
└──────────────────────────────────┘
```

---

## Semantic vs Non-Semantic Comparison

```html
<!-- NON-SEMANTIC (div soup) — AVOID -->
<div id="header">
    <div id="nav">...</div>
</div>
<div id="content">
    <div class="article">...</div>
    <div id="sidebar">...</div>
</div>
<div id="footer">...</div>

<!-- SEMANTIC (meaningful) — USE THIS -->
<header>
    <nav>...</nav>
</header>
<main>
    <article>...</article>
    <aside>...</aside>
</main>
<footer>...</footer>
```

**Why it matters:** Both render identically, but semantic HTML:
- Creates landmarks for screen readers
- Improves SEO (search engines understand page structure)
- Makes code self-documenting for other developers

---

## Accessibility (A11y) Basics

### ARIA (Accessible Rich Internet Applications)

ARIA adds accessibility info when semantic HTML isn't enough.

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `aria-label` | Provides a text label for elements | `<nav aria-label="Main navigation">` |
| `aria-labelledby` | Points to an element that labels this one | `<section aria-labelledby="about-heading">` |
| `role` | Defines what an element IS | `<div role="navigation">` (prefer `<nav>` instead) |

**The First Rule of ARIA:** Don't use ARIA if a native HTML element can do the job. Semantic HTML first!

### Skip Navigation

```html
<!-- First element inside <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- On the main element -->
<main id="main-content">
    ...
</main>
```

Skip links let keyboard and screen reader users jump past navigation directly to main content.

### Accessibility Landmarks

Semantic elements automatically create ARIA landmarks:

| HTML Element | ARIA Landmark Role |
|-------------|-------------------|
| `<header>` (page-level) | `banner` |
| `<nav>` | `navigation` |
| `<main>` | `main` |
| `<aside>` | `complementary` |
| `<footer>` (page-level) | `contentinfo` |
| `<section>` (with label) | `region` |
| `<form>` (with label) | `form` |

---

## Alt Text Best Practices

### Good vs Bad Alt Text

```html
<!-- BAD — generic, useless -->
<img src="photo.jpg" alt="image">
<img src="photo.jpg" alt="photo">
<img src="photo.jpg" alt="">  <!-- ONLY for decorative images -->

<!-- GOOD — descriptive and specific -->
<img src="photo.jpg" alt="Ayesha Khan presenting at a React conference">
<img src="chart.jpg" alt="Bar chart showing React usage growing from 40% to 67% between 2022 and 2026">
```

### Alt Text Decision Guide

| Image Type | Alt Text Approach |
|-----------|-------------------|
| **Informational** (photos, charts) | Describe what the image shows and why it matters |
| **Functional** (buttons, icons) | Describe the action: "Search", "Close menu" |
| **Decorative** (borders, spacers) | Use `alt=""` (empty) — screen readers will skip it |
| **Complex** (infographics, diagrams) | Brief alt + longer description nearby or via `aria-describedby` |

**Pro Tip**: Read your alt text out loud. If it describes the image well to someone who can't see it, it's good.

---

## SEO Meta Tags

### Essential Meta Tags

```html
<head>
    <!-- Page title (appears in browser tab + search results) -->
    <title>Ayesha Khan — Frontend Developer Portfolio</title>

    <!-- Meta description (search result snippet, ~155 chars max) -->
    <meta name="description" content="Portfolio of Ayesha Khan, a frontend developer specializing in React and Next.js.">

    <!-- Author -->
    <meta name="author" content="Ayesha Khan">
</head>
```

### Open Graph Tags (Social Sharing)

```html
<head>
    <!-- What shows when shared on WhatsApp, Facebook, LinkedIn -->
    <meta property="og:title" content="Ayesha Khan — Frontend Developer Portfolio">
    <meta property="og:description" content="Explore projects and skills of a modern frontend developer.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://example.com/preview-image.jpg">
</head>
```

**Remember:**
- `<title>` and `<meta description>` should be unique for every page
- Keep descriptions under 155 characters
- `og:image` should be at least 1200x630 pixels for best social previews

---

## Common Mistakes to Avoid

### 1. Div Soup (No Semantic Elements)
```html
<!-- WRONG — meaningless structure -->
<div id="header">
    <div id="nav">...</div>
</div>

<!-- CORRECT — meaningful structure -->
<header>
    <nav>...</nav>
</header>
```

### 2. Multiple `<main>` Elements
```html
<!-- WRONG — only one <main> per page -->
<main>...</main>
<main>...</main>

<!-- CORRECT — use <section> within <main> -->
<main>
    <section>...</section>
    <section>...</section>
</main>
```

### 3. Using `<section>` as a Generic Wrapper
```html
<!-- WRONG — using section just for styling -->
<section class="wrapper">...</section>

<!-- CORRECT — use div for styling, section for meaning -->
<div class="wrapper">...</div>
```

### 4. Missing Landmarks for Screen Readers
```html
<!-- WRONG — no way for screen reader to find content -->
<div>Navigation here</div>
<div>Main content here</div>

<!-- CORRECT — landmarks created automatically -->
<nav>Navigation here</nav>
<main>Main content here</main>
```

### 5. Using ARIA When Semantic HTML Exists
```html
<!-- WRONG — redundant ARIA -->
<nav role="navigation">...</nav>

<!-- CORRECT — semantic element IS the landmark -->
<nav>...</nav>

<!-- CORRECT USE — adding clarity -->
<nav aria-label="Main navigation">...</nav>
```

---

## VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `!` + Tab | Generate HTML boilerplate (Emmet) |
| `Ctrl + /` | Toggle comment |
| `Alt + Shift + F` | Format/indent code |
| `Ctrl + D` | Select next occurrence of word |
| `Alt + ↑/↓` | Move line up/down |
| `Ctrl + Shift + P` | Open Command Palette |
| `Ctrl + Space` | Trigger autocomplete (shows semantic element options) |
| `F12` | Open DevTools from VS Code |

---

## Chrome DevTools: Accessibility Tree

How to inspect the accessibility tree:

1. Open DevTools (`F12` or `Ctrl + Shift + I`)
2. Go to the **Elements** tab
3. Open the **Accessibility** pane (in the right sidebar)
4. Enable "Full-page accessibility tree" button (top of Elements panel)
5. Toggle between DOM tree and accessibility tree

**What to look for:**
- `banner` = `<header>`
- `navigation` = `<nav>`
- `main` = `<main>`
- `complementary` = `<aside>`
- `contentinfo` = `<footer>`

If you see no landmarks, you're missing semantic elements.

---

## Quick Reference Table

| What you want | How to do it |
|---------------|--------------|
| Page header area | `<header>` |
| Navigation menu | `<nav>` |
| Primary page content | `<main>` (one per page) |
| Group related content | `<section>` |
| Self-contained content | `<article>` |
| Sidebar / tangential info | `<aside>` |
| Page footer area | `<footer>` |
| Skip to content link | `<a href="#main-content">Skip to main content</a>` |
| Label a nav for screen readers | `<nav aria-label="Main navigation">` |
| SEO page description | `<meta name="description" content="...">` |
| Social sharing preview | `<meta property="og:title" content="...">` |
| Decorative image (skip for SR) | `<img src="..." alt="">` |
| Informational image | `<img src="..." alt="Descriptive text here">` |

---

## What's Next?

In **Lecture 3: CSS Fundamentals & The Box Model**, you'll learn:
- How CSS transforms plain HTML into beautiful, professional designs
- The Box Model — every element is a box with content, padding, border, and margin
- Selectors, properties, and values
- Building a **Styled Business Card** from our plain HTML

---

*Keep this cheatsheet handy while working on your assignment!*
