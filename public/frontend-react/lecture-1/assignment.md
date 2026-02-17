# Assignment: My First Blog Article

## Overview
Create your own blog article webpage from scratch using HTML. Choose a topic you're passionate about and build a properly structured HTML page using the elements we learned in Lecture 1.

---

## Requirements

Your blog article must include:

### 1. Document Structure
- Proper HTML5 document structure (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`)
- `<meta charset="UTF-8">` tag
- `<meta name="viewport">` tag for mobile responsiveness
- A descriptive `<title>` tag (shown in browser tab)
- `lang="en"` attribute on the `<html>` element

### 2. Content Elements

| Element | Requirement |
|---------|-------------|
| **Headings** | Use `<h1>` for article title, at least 2 `<h2>` section headings, and at least 1 `<h3>` subsection heading. No skipping levels. |
| **Paragraphs** | At least 5 `<p>` tags with meaningful content (not lorem ipsum) |
| **Links** | At least 2 `<a>` tags — 1 external link (with `https://`) and 1 with `target="_blank"` |
| **Images** | At least 1 `<img>` tag with a valid `src` and descriptive `alt` text |
| **Unordered List** | At least 1 `<ul>` with 3+ `<li>` items |
| **Ordered List** | At least 1 `<ol>` with 3+ `<li>` items |
| **Text Formatting** | Use `<strong>` and `<em>` at least once each |

### 3. Technical Requirements
- File must be named `index.html`
- All tags must be properly closed
- Proper nesting (no overlapping tags)
- Consistent indentation (4 spaces or 1 tab per level)
- No content inside `<head>` — only metadata

---

## Example Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Article Title | Your Name</title>
</head>
<body>
    <h1>Your Article Title</h1>
    <p><strong>By Your Name</strong> | February 2026</p>

    <img src="https://picsum.photos/800/400" alt="Describe this image">

    <h2>First Section</h2>
    <p>Your content here...</p>

    <h2>Second Section</h2>
    <ul>
        <li>Point one</li>
        <li>Point two</li>
        <li>Point three</li>
    </ul>

    <!-- Continue with more sections... -->
</body>
</html>
```

---

## Topic Ideas

Not sure what to write about? Here are some suggestions:
- Your favorite hobby or sport
- A travel destination you'd recommend
- A review of your favorite book, movie, or game
- A "getting started" guide for something you know well
- A day in the life of your profession
- Technology trends that interest you

**Pick something you care about** — your article will be better if you're genuinely interested in the topic.

---

## Resources

- **Placeholder Images**: `https://picsum.photos/800/400` (random image) or `https://picsum.photos/id/237/800/400` (specific image)
- **VS Code Download**: `https://code.visualstudio.com`
- **HTML Reference**: `https://developer.mozilla.org/en-US/docs/Web/HTML`
- **Lecture Cheatsheet**: See `cheatsheet.md` for quick reference

---

## Submission Instructions

1. Create a folder named `assignment-1` on your computer
2. Create your `index.html` file inside that folder
3. Test your page by opening it in Chrome (double-click the file)
4. Verify all elements render correctly
5. Upload the `index.html` file to Google Classroom

---

## Pre-Submission Checklist

Before submitting, verify:

- [ ] File is named `index.html`
- [ ] Page opens correctly in Chrome browser
- [ ] `<!DOCTYPE html>` is the first line
- [ ] `<html>` has `lang="en"` attribute
- [ ] `<head>` contains `charset`, `viewport`, and `title`
- [ ] Only one `<h1>` on the page
- [ ] Heading hierarchy is correct (no skipped levels)
- [ ] All images have descriptive `alt` text
- [ ] All external links include `https://`
- [ ] All tags are properly closed
- [ ] Code is properly indented
- [ ] Content is original and meaningful (not placeholder text)

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Correct HTML5 document structure (DOCTYPE, html, head, body) | 15 |
| Proper metadata (charset, viewport, title, lang) | 10 |
| Heading hierarchy (h1, h2, h3 — no skipped levels) | 10 |
| Paragraphs with meaningful content (5+ paragraphs) | 10 |
| Links with correct href (2+ links, includes https://) | 10 |
| Image with valid src and descriptive alt text | 10 |
| Unordered list with 3+ items | 5 |
| Ordered list with 3+ items | 5 |
| Text formatting (strong and em used correctly) | 5 |
| Proper tag closing and nesting | 10 |
| Clean indentation and code formatting | 5 |
| Original, engaging content (not lorem ipsum) | 5 |
| **Total** | **100** |

---

## Tips for Success

1. **Write the structure first** — get the DOCTYPE, html, head, and body in place before adding content
2. **Build section by section** — don't try to write everything at once. Add one `<h2>` section, check it in the browser, then add the next
3. **Test frequently** — save your file and refresh the browser after every few lines
4. **Use the cheatsheet** — keep `cheatsheet.md` open while you work
5. **Read your alt text out loud** — if it describes the image well to someone who can't see it, it's good

---

## Common Mistakes to Avoid

- **Using `<br>` for spacing** — use separate `<p>` tags instead
- **Forgetting `https://`** in links — `href="google.com"` won't work as expected
- **Empty alt text** — `alt=""` is not the same as a descriptive alt. Describe the image.
- **Using headings for font size** — don't use `<h3>` just because you want smaller text. Use headings for structure.
- **Skipping heading levels** — don't jump from `<h1>` to `<h3>`. Always use `<h2>` in between.

---

## Need Help?

- Review the Lecture 1 recording on Google Classroom
- Check the `cheatsheet.md` file for quick reference
- Post questions in the Google Classroom comments
- Attend office hours (schedule TBA)

You've already built a blog article in class — this assignment is your chance to make one that's truly yours. Pick a topic you love, and have fun with it!
