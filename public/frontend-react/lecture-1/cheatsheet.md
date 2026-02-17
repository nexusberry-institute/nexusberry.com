# HTML Fundamentals Cheatsheet

Quick reference for all HTML concepts covered in Lecture 1.

---

## HTML Document Skeleton

Every HTML page starts with this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <!-- Your visible content goes here -->
</body>
</html>
```

| Part | Purpose |
|------|---------|
| `<!DOCTYPE html>` | Tells the browser to use HTML5 standards mode |
| `<html lang="en">` | Root element; `lang` helps screen readers and search engines |
| `<head>` | Metadata — invisible to the user (title, character set, viewport) |
| `<meta charset="UTF-8">` | Supports all characters (accents, symbols, other languages) |
| `<meta name="viewport" ...>` | Makes the page responsive on mobile devices |
| `<title>` | Text shown in the browser tab |
| `<body>` | All visible content goes here |

---

## Common HTML Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `<h1>` to `<h6>` | Headings (h1 = most important) | `<h1>Main Title</h1>` |
| `<p>` | Paragraph of text | `<p>Some text here.</p>` |
| `<a>` | Hyperlink | `<a href="https://example.com">Link</a>` |
| `<img>` | Image (self-closing) | `<img src="photo.jpg" alt="Description">` |
| `<ul>` | Unordered list (bullets) | `<ul><li>Item</li></ul>` |
| `<ol>` | Ordered list (numbers) | `<ol><li>First</li></ol>` |
| `<li>` | List item (inside `<ul>` or `<ol>`) | `<li>Item text</li>` |
| `<strong>` | Important text (bold + meaning) | `<strong>Warning!</strong>` |
| `<em>` | Emphasized text (italic + meaning) | `<em>Note:</em>` |

---

## Anatomy of a Link

```
<a href="https://nexusberry.com" target="_blank">Visit NexusBerry</a>
 │   │                              │                │
 │   │                              │                └── Link text (visible)
 │   │                              └── Opens in new tab
 │   └── URL destination
 └── Anchor element
```

**Remember:** Always include `https://` for external links.

---

## Anatomy of an Image

```
<img src="https://picsum.photos/600/400" alt="A scenic mountain view">
 │    │                                    │
 │    │                                    └── Description (for accessibility)
 │    └── Image source URL
 └── Self-closing tag (no </img> needed)
```

**Remember:** `alt` is required for accessibility. Describe what the image shows.

---

## Nesting Rules

HTML elements can contain other elements — this is called **nesting**.

```html
<!-- CORRECT nesting -->
<ul>
    <li>First item</li>
    <li>Second item</li>
</ul>

<!-- WRONG nesting — tags overlap -->
<p>This is <strong>bold text</p></strong>

<!-- CORRECT nesting — tags close in order -->
<p>This is <strong>bold text</strong></p>
```

**Rule:** Tags must close in the reverse order they were opened (like stacking boxes).

---

## Heading Hierarchy

Use headings in order — never skip levels:

```html
<!-- CORRECT -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>

<!-- WRONG — skips h2 -->
<h1>Page Title</h1>
  <h3>Subsection</h3>
```

**Guidelines:**
- One `<h1>` per page
- Don't skip levels (h1 → h3)
- Don't choose heading levels for font size — use CSS for that

---

## Common Mistakes to Avoid

### 1. Missing Closing Tags
```html
<!-- WRONG -->
<p>First paragraph
<p>Second paragraph

<!-- CORRECT -->
<p>First paragraph</p>
<p>Second paragraph</p>
```

### 2. Forgetting `alt` on Images
```html
<!-- WRONG -->
<img src="photo.jpg">

<!-- CORRECT -->
<img src="photo.jpg" alt="Team photo at the NexusBerry office">
```

### 3. Missing Protocol in Links
```html
<!-- WRONG — treated as relative path -->
<a href="nexusberry.com">Visit</a>

<!-- CORRECT -->
<a href="https://nexusberry.com">Visit</a>
```

### 4. Putting Content in `<head>`
```html
<!-- WRONG -->
<head>
    <p>Welcome to my site</p>
</head>

<!-- CORRECT -->
<body>
    <p>Welcome to my site</p>
</body>
```

---

## VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `!` + Tab | Generate HTML boilerplate (Emmet) |
| `Ctrl + S` | Save file |
| `Ctrl + /` | Toggle comment |
| `Alt + Shift + F` | Format/indent code |
| `Ctrl + D` | Select next occurrence of word |
| `Alt + ↑/↓` | Move line up/down |
| `Ctrl + Shift + P` | Open Command Palette |

---

## Chrome DevTools Basics

| Action | How |
|--------|-----|
| Open DevTools | `F12` or `Ctrl + Shift + I` |
| Inspect an element | Right-click → Inspect |
| View page source | `Ctrl + U` |
| Toggle device toolbar | `Ctrl + Shift + M` (in DevTools) |

**Tip:** Changes in DevTools are temporary — refresh the page to reset.

---

## Quick Reference Table

| What you want | How to do it |
|---------------|--------------|
| Create a new HTML file | New file → name it `index.html` |
| Add a heading | `<h1>Your Text</h1>` |
| Add a paragraph | `<p>Your Text</p>` |
| Add a link | `<a href="https://url.com">Text</a>` |
| Add an image | `<img src="url" alt="description">` |
| Add a bullet list | `<ul><li>Item</li></ul>` |
| Add a numbered list | `<ol><li>Item</li></ol>` |
| Make text bold | `<strong>Text</strong>` |
| Make text italic | `<em>Text</em>` |
| Open in new tab | Add `target="_blank"` to `<a>` |
| Add a comment | `<!-- Your comment -->` |

---

## HTML Entities (Special Characters)

| Character | Entity Code |
|-----------|-------------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| Non-breaking space | `&nbsp;` |
| © | `&copy;` |

---

## What's Next?

In **Lecture 2: Semantic HTML & Accessibility**, you'll learn:
- Semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- Why semantic HTML matters for SEO and accessibility
- ARIA basics and screen reader testing
- Building a Professional Portfolio Resume

---

*Keep this cheatsheet handy while working on your assignment!*
