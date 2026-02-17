# Assignment: Professional Portfolio Resume

## Overview
Build your own professional portfolio resume webpage using semantic HTML, accessibility best practices, and SEO meta tags. This isn't just homework — it's the beginning of your professional online presence.

---

## Requirements

Your portfolio resume must include:

### 1. Semantic Structure
- Proper HTML5 document structure (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`)
- `<header>` — your name, title/tagline, and profile image
- `<nav>` — navigation links to page sections (using anchor links `#about`, `#skills`, etc.)
- `<main>` — primary content area (only ONE `<main>` element)
- At least 3 `<section>` elements inside `<main>` (e.g., About, Skills, Experience)
- `<aside>` — fun facts, hobbies, certifications, or additional info
- `<footer>` — copyright notice and contact links

### 2. Accessibility Features

| Feature | Requirement |
|---------|-------------|
| **Skip Navigation** | Add `<a href="#main-content">Skip to main content</a>` as the first element in `<body>` |
| **ARIA Labels** | Add `aria-label` to `<nav>` (e.g., `aria-label="Main navigation"`) |
| **Alt Text** | All images must have descriptive `alt` text (not empty, not "image") |
| **Link Labels** | External links opening in new tabs must have `aria-label` explaining the action |
| **Heading Hierarchy** | Proper heading levels (`<h1>` → `<h2>` → `<h3>`), no skipping |

### 3. SEO Meta Tags
- `<title>` — descriptive page title (e.g., "Your Name — Frontend Developer Portfolio")
- `<meta name="description">` — page description (under 155 characters)
- `<meta name="author">` — your name
- At least 2 Open Graph tags (`og:title` and `og:description`)

### 4. Content Requirements
- At least one `<article>` element (for a job experience or project)
- At least 5 `<p>` tags with meaningful content about yourself
- At least 2 external links with `https://` and `target="_blank"`
- At least 1 email link using `mailto:`
- At least 1 `<ul>` (unordered list) and 1 `<ol>` (ordered list)
- Use `<strong>` and `<em>` where appropriate

### 5. Technical Requirements
- File must be named `index.html`
- All tags must be properly closed
- Proper nesting (no overlapping tags)
- Consistent indentation (4 spaces or 1 tab per level)
- `lang="en"` on the `<html>` element
- `<meta charset="UTF-8">` and `<meta name="viewport">` in `<head>`

---

## Example Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Name — Your Title Portfolio</title>
    <meta name="description" content="Portfolio of Your Name, a frontend developer.">
    <meta property="og:title" content="Your Name — Portfolio">
    <meta property="og:description" content="Explore my skills and projects.">
</head>
<body>
    <a href="#main-content">Skip to main content</a>

    <header>
        <h1>Your Name</h1>
        <p>Your Title / Tagline</p>
    </header>

    <nav aria-label="Main navigation">
        <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <!-- More links... -->
        </ul>
    </nav>

    <main id="main-content">
        <section id="about">
            <h2>About Me</h2>
            <p>Your introduction...</p>
        </section>
        <!-- More sections... -->
    </main>

    <aside>
        <h2>Fun Facts</h2>
        <!-- Additional content... -->
    </aside>

    <footer>
        <p>&copy; 2026 Your Name. All rights reserved.</p>
    </footer>
</body>
</html>
```

---

## Content Ideas

Not sure what to write? Here's what to include:

- **About Me:** Who you are, what you're passionate about, your career goals
- **Skills:** Technologies you know or are learning (HTML, CSS, JavaScript, etc.)
- **Experience:** Jobs, internships, freelance work, or volunteer experience
- **Education:** Schools, courses, certifications (include this NexusBerry course!)
- **Projects:** Websites or apps you've built (even from this course)
- **Contact:** Email, LinkedIn, GitHub, or other professional links

**Make it personal** — this is YOUR portfolio. Write about your real skills and experiences.

---

## Resources

- **Placeholder Images**: `https://picsum.photos/300/300` (square) or `https://picsum.photos/800/400` (banner)
- **VS Code Download**: `https://code.visualstudio.com`
- **HTML Reference**: `https://developer.mozilla.org/en-US/docs/Web/HTML`
- **Semantic Elements Guide**: `https://developer.mozilla.org/en-US/docs/Glossary/Semantics`
- **Lecture Cheatsheet**: See `cheatsheet.md` for quick reference

---

## Submission Instructions

1. Create a folder named `assignment-2` on your computer
2. Create your `index.html` file inside that folder
3. Test your page by opening it in Chrome (double-click the file)
4. Check the DevTools Accessibility panel — verify landmarks are present
5. Tab through the page with keyboard — verify skip link and navigation work
6. Upload the `index.html` file to Google Classroom

---

## Pre-Submission Checklist

Before submitting, verify:

- [ ] File is named `index.html`
- [ ] Page opens correctly in Chrome browser
- [ ] `<!DOCTYPE html>` is the first line
- [ ] `<html>` has `lang="en"` attribute
- [ ] `<head>` contains `charset`, `viewport`, `title`, and `description`
- [ ] Open Graph tags (`og:title`, `og:description`) are present
- [ ] Skip navigation link is the first element inside `<body>`
- [ ] `<header>`, `<nav>`, `<main>`, `<footer>` are all present
- [ ] Only ONE `<main>` element on the page
- [ ] At least 3 `<section>` elements inside `<main>`
- [ ] `<nav>` has `aria-label` attribute
- [ ] All images have descriptive `alt` text (not empty, not generic)
- [ ] Heading hierarchy is correct (h1 → h2 → h3, no skipping)
- [ ] All external links include `https://`
- [ ] All tags are properly closed and nested
- [ ] Code is properly indented

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Semantic structure (header, nav, main, section, aside, footer) | 20 |
| Proper HTML5 document structure (DOCTYPE, html, head, body, charset, viewport, lang) | 10 |
| Skip navigation link present and functional | 5 |
| ARIA labels on nav and external links | 10 |
| Descriptive alt text on all images | 10 |
| SEO meta tags (title, description, og:title, og:description) | 10 |
| Heading hierarchy (h1 → h2 → h3, no skipping, one h1) | 5 |
| Content quality (5+ paragraphs, meaningful personal content) | 10 |
| Lists (at least 1 ul and 1 ol) and text formatting (strong, em) | 5 |
| External links (2+ with https://) and mailto link | 5 |
| Proper tag closing, nesting, and indentation | 5 |
| Article element used (for experience or project) | 5 |
| **Total** | **100** |

---

## Tips for Success

1. **Start with the skeleton** — get all semantic elements in place before adding content
2. **Build section by section** — add one `<section>`, check it, then add the next
3. **Check the accessibility tree** — open DevTools → Elements → Accessibility pane → verify landmarks
4. **Tab through your page** — make sure the skip link works and you can reach all interactive elements
5. **Read your alt text out loud** — if it describes the image well to someone who can't see it, it's good
6. **Keep meta description under 155 characters** — that's your "ad copy" for search results

---

## Common Mistakes to Avoid

- **Multiple `<main>` elements** — only ONE per page. Use `<section>` for multiple content areas
- **Using `<section>` as a wrapper** — if it's just for styling/layout, use `<div>`. `<section>` needs semantic meaning and usually has a heading.
- **Empty alt text on informational images** — `alt=""` marks images as decorative (skipped by screen readers). Only use empty alt for truly decorative images.
- **Missing skip navigation** — it's the first thing screen reader and keyboard users encounter
- **Redundant ARIA** — don't add `<nav role="navigation">`. The `<nav>` element already creates the navigation landmark.
- **Forgetting `aria-label` on nav** — especially important when you have multiple `<nav>` elements

---

## Need Help?

- Review the Lecture 2 recording on Google Classroom
- Check the `cheatsheet.md` file for quick reference
- Use the DevTools Accessibility panel to check your landmarks
- Post questions in the Google Classroom comments
- Attend office hours (schedule TBA)

This portfolio is more than an assignment — it's the foundation of your professional web presence. Put your best self into it. In Lecture 3, we'll learn CSS to make it beautiful!
