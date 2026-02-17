# Lecture 1: HTML Fundamentals & Document Structure

## PRESENTER ONLY (Not shared with students)

### Overview
- **Format**: Live Google Meet session
- **Style**: Presentation-driven (reveal.js) + live coding (VS Code)
- **Project**: Blog Article Template
- **Goal**: Students understand how the web works, can write a properly structured HTML document, and use common HTML elements to build a blog article

---

## Pre-Class Setup Checklist

- [ ] VS Code with clean theme (dark mode recommended)
- [ ] Large font size (18-20px) for screen share visibility
- [ ] Browser ready (Chrome DevTools accessible)
- [ ] Blank project folder created: `blog-article/`
- [ ] Presentation loaded: `presentation/index.html` open in browser
- [ ] reveal.js CDN verified (test slides load correctly)
- [ ] Emmet abbreviation enabled in VS Code (should be default)
- [ ] Live Server extension installed in VS Code
- [ ] Disable notifications on all devices
- [ ] Have a sample website open (e.g., nexusberry.com) for "View Page Source" demo

---

## Phase 0: Before Lecture

**Skipped** — This is Lecture 1. No prior quiz or assignment to review.

Welcome students, introduce yourself, and set expectations for the course.

---

## Phase 1: Today's Lecture (90 Minutes)

### Part 1: What is the Web? (0:00 - 20:00)

**Background / Motivation (Presentation)**
- "Before we write a single line of code, let's understand what we're building for"
- The web is everywhere — phones, laptops, smart TVs, even refrigerators
- Every website you've ever visited is made of HTML, CSS, and JavaScript
- Today we focus on HTML — the skeleton of every webpage
- Analogy: "Think of a building. HTML is the structure — the walls, floors, rooms. CSS is the paint and decoration. JavaScript is the electricity and plumbing that makes things work."

**Illustrations / Animations (Presentation)**
- Browser request/response diagram: User types URL → Browser sends request → Server responds with HTML → Browser renders page
- Show the three layers: HTML (structure) → CSS (style) → JS (behavior)
- Visual: skeleton (HTML) → skin/clothes (CSS) → muscles/movement (JS)

**"Let's see in Code now" (VS Code)**
- Open Chrome, go to nexusberry.com (or any familiar website)
- Right-click → "View Page Source" — THE AHA MOMENT
- "Everything you see here? That's HTML. Every website, from Google to Facebook, is built with this"
- Right-click → Inspect Element — show the Elements panel
- Hover over elements to highlight them on the page
- "By the end of today, you'll be able to read and write this"

**Interactive Questions (Presentation/Verbal)**

*Quick-fire concept check:*
- "When you type a URL and press Enter, what do you think happens first?"
  - Let students answer in chat
  - Reveal: Browser sends a request to a server, server sends back HTML

*Predict what happens:*
- "If I delete this `<h1>` tag in the Elements panel, what will happen to the heading on the page?"
  - Demo it live — heading disappears
  - "Don't worry, this is only on YOUR computer. Refresh and it comes back."

**Live Debugging (VS Code)**
- Show what happens when you modify HTML in DevTools Elements panel
- Demonstrate that changes are temporary (refresh restores original)
- This is a debugging tool, not an editing tool

**Part Closing (Presentation)**
- Common Mistakes: Thinking you need special software to create websites (you just need a text editor and a browser)
- Optimization Tips: Chrome DevTools is your best friend — learn it early
- Best Practices: Always use "View Page Source" and "Inspect" to learn from other websites
- Professional Insights: "In 25+ years of development, I still use View Page Source every single day. The best developers are curious — they look under the hood."

---

### Part 2: HTML Document Structure (20:00 - 45:00)

**Background / Motivation (Presentation)**
- Every HTML document follows the same blueprint — like every house has a foundation, walls, and a roof
- This structure hasn't changed much since HTML5 — learn it once, use it everywhere
- The browser is very forgiving — it'll try to render broken HTML — but that doesn't mean you should write broken HTML
- "Professional developers write clean, correct HTML. That's what separates you from someone who just copies code from the internet."

**Illustrations / Animations (Presentation)**
- HTML Document Tree diagram:
  ```
  <!DOCTYPE html>
  └── <html>
      ├── <head>       ← metadata (invisible to user)
      │   ├── <meta>
      │   └── <title>
      └── <body>       ← content (visible to user)
          └── ...
  ```
- Analogy: `<head>` is like the backstage of a theater — the audience (user) doesn't see it, but it's essential. `<body>` is the stage — everything the audience sees.
- Show what each piece does:
  - `<!DOCTYPE html>` — tells the browser "this is HTML5"
  - `<html lang="en">` — the root element, language attribute for accessibility
  - `<head>` — metadata, title, character encoding
  - `<body>` — all visible content

**"Let's see in Code now" (VS Code)**
- Create a new file: `index.html`
- Type the structure manually first (no shortcuts yet):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my very first webpage.</p>
</body>
</html>
```
- Save, open in browser with Live Server
- "Congratulations — you just built your first webpage!"
- Now show the Emmet shortcut: type `!` and press Tab — generates the same boilerplate
- "This is what professionals use, but now you understand what every line does"

**Interactive Questions (Presentation/Verbal)**

*Spot-the-error:*
```html
<html>
<head>
    <title>My Page<title>
</head>
<body>
    <h1>Welcome</h1>
</body>
</html>
```
- "What's wrong with this code? Two things are missing or wrong."
- Answer: Missing `<!DOCTYPE html>`, and `<title>` closing tag is `<title>` instead of `</title>` (missing forward slash)

*Concept check:*
- "If I put a `<p>` tag inside `<head>`, will the user see it?"
- Let students answer — then demo it
- Answer: Browsers may still render it, but it's wrong. Head is for metadata only.

*Quick-fire:*
- "What does `charset="UTF-8"` do?" → Ensures special characters (é, ñ, 中文) display correctly
- "What does the `<title>` tag control?" → The text shown in the browser tab

**Live Debugging (VS Code)**
- Remove `<!DOCTYPE html>` — show page still renders but explain quirks mode
- Remove `<meta charset="UTF-8">` — show broken characters with special text: "Café résumé naïve"
- Remove `<title>` — show browser tab shows the file path instead
- Fix each one and explain why it matters

**Part Closing (Presentation)**
- Common Mistakes: Forgetting `<!DOCTYPE html>`, missing closing tags, putting visible content in `<head>`
- Optimization Tips: Use Emmet (`!` + Tab) after you understand the structure — never before
- Best Practices: Always include `lang` attribute, `charset`, and `viewport` meta tag
- Professional Insights: "I've seen production websites with missing DOCTYPE declarations. The site still works, but it renders in quirks mode — causing subtle bugs that take hours to track down. Get the foundation right from day one."

---

### Part 3: Common HTML Elements (45:00 - 65:00)

**Background / Motivation (Presentation)**
- Now that we have the skeleton, let's add the organs — the elements that make up real content
- HTML has over 100 elements, but you'll use about 20 of them 90% of the time
- Today we'll cover the essential ones: headings, paragraphs, links, images, and lists
- "These five element types are the building blocks of every blog, news site, and documentation page on the internet"

**Illustrations / Animations (Presentation)**
- Visual showing heading hierarchy (h1 → h6) with decreasing sizes
- Anatomy of a link: `<a href="URL">Link Text</a>` — three parts labeled
- Anatomy of an image: `<img src="URL" alt="description">` — self-closing, two required attributes
- List comparison: ordered (numbered) vs unordered (bullets)

**"Let's see in Code now" (VS Code)**
- Build up elements one at a time in the existing file:

```html
<!-- Headings - hierarchy matters! -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- Paragraphs -->
<p>This is a paragraph of text. Browsers add space above and below automatically.</p>
<p>This is another paragraph. Notice the gap between them.</p>

<!-- Links -->
<a href="https://nexusberry.com">Visit NexusBerry</a>
<a href="https://google.com" target="_blank">Open Google in New Tab</a>

<!-- Images -->
<img src="https://picsum.photos/600/400" alt="A beautiful random image">

<!-- Unordered List (bullets) -->
<ul>
    <li>HTML - Structure</li>
    <li>CSS - Style</li>
    <li>JavaScript - Behavior</li>
</ul>

<!-- Ordered List (numbers) -->
<ol>
    <li>Learn HTML</li>
    <li>Learn CSS</li>
    <li>Learn JavaScript</li>
</ol>
```
- Show each in the browser as you add it
- Point out: "Notice I'm indenting nested elements — this is a best practice for readability"

**Interactive Questions (Presentation/Verbal)**

*Predict-output:*
```html
<h1>Welcome</h1>
<h3>About Us</h3>
<p>We build websites.</p>
```
- "I skipped `<h2>` and went straight from `<h1>` to `<h3>`. Will the browser show an error?"
- Answer: No error — browser renders it fine. But it's bad practice. Heading levels should not skip. Screen readers and SEO depend on proper hierarchy.
- "This is exactly the kind of thing YouTube tutorials skip. In a professional setting, accessibility and SEO matter."

*Spot-the-error:*
```html
<a href="nexusberry.com">Visit NexusBerry</a>
```
- "This link won't work as expected. Why?"
- Answer: Missing protocol — should be `https://nexusberry.com`. Without it, the browser treats it as a relative path.

*Quick-fire:*
- "What's the `alt` attribute on images for?" → Describes the image for screen readers and displays if the image fails to load
- "What's the difference between `<ul>` and `<ol>`?" → Unordered (bullets) vs Ordered (numbers)

**Live Debugging (VS Code)**
- Remove `alt` from an image — show browser still works but explain accessibility impact
- Create a broken image `src` — show the alt text appearing as fallback
- Create a link without `href` — show it doesn't work
- Demonstrate unclosed `<li>` tags — browser auto-closes but code is messy

**Part Closing (Presentation)**
- Common Mistakes: Skipping heading levels, forgetting `alt` on images, missing `https://` in links
- Optimization Tips: Use meaningful `alt` text — not "image" or "photo", describe what the image shows
- Best Practices: One `<h1>` per page, proper heading hierarchy, descriptive link text (not "click here")
- Professional Insights: "Alt text isn't just for blind users. It helps SEO, it shows when images break, and it's legally required in many countries. I've seen companies get sued over missing alt text. Make it a habit from day one."

---

### Part 4: Building the Blog Article (65:00 - 85:00)

**Background / Motivation (Presentation)**
- "Now we put everything together — this is where it clicks"
- We'll build a real Blog Article Template from scratch
- This is the kind of page you see on Medium, Dev.to, or any news site
- "By the end of this Part, you'll have a complete webpage in your portfolio"

**Illustrations / Animations (Presentation)**
- Wireframe of a blog article layout:
  - Title (h1)
  - Author info and date
  - Feature image
  - Article content with sections (h2s)
  - Lists within sections
  - Links to references
- Show a real blog article (e.g., a Medium post) and map its parts to HTML elements

**"Let's see in Code now" (VS Code)**
- Start fresh in `blog-article/index.html`
- Build the complete Blog Article Template step by step:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Future of Web Development in 2026 | NexusBerry Blog</title>
</head>
<body>
    <h1>The Future of Web Development in 2026</h1>
    <p><strong>By Rana M. Ajmal</strong> | Published: February 2026</p>
    <p><em>A comprehensive look at the technologies shaping modern web development.</em></p>

    <img src="https://picsum.photos/800/400" alt="Modern laptop displaying code on a desk with coffee">

    <h2>Introduction</h2>
    <p>Web development is evolving faster than ever. From AI-powered tools to new frameworks,
    the landscape in 2026 looks dramatically different from just a few years ago. In this article,
    we'll explore the key trends every developer should know.</p>

    <h2>Top Technologies to Learn</h2>
    <p>If you're starting your web development journey, focus on these core technologies:</p>
    <ol>
        <li><strong>HTML &amp; CSS</strong> — The foundation of every website</li>
        <li><strong>JavaScript</strong> — The programming language of the web</li>
        <li><strong>React</strong> — The most popular UI library</li>
        <li><strong>Next.js</strong> — Full-stack React framework</li>
        <li><strong>TypeScript</strong> — Type-safe JavaScript for large projects</li>
    </ol>

    <h2>Why HTML Still Matters</h2>
    <p>Despite the rise of complex frameworks, HTML remains the backbone of the web.
    Every React component, every Next.js page ultimately renders as HTML in the browser.</p>
    <p>Understanding HTML deeply gives you:</p>
    <ul>
        <li>Better accessibility for all users</li>
        <li>Improved SEO for search engines</li>
        <li>Faster debugging skills</li>
        <li>A solid foundation for learning CSS and JavaScript</li>
    </ul>

    <h3>The Role of Semantic HTML</h3>
    <p>In our next lecture, we'll dive into <strong>semantic HTML</strong> — using elements
    that describe their meaning, not just their appearance. This is what separates
    professional developers from beginners.</p>

    <h2>Getting Started</h2>
    <p>The best way to learn web development is by building projects. Here's what you need:</p>
    <ul>
        <li>A text editor — we recommend <a href="https://code.visualstudio.com" target="_blank">VS Code</a></li>
        <li>A modern browser — <a href="https://www.google.com/chrome" target="_blank">Google Chrome</a> with DevTools</li>
        <li>Curiosity and consistency</li>
    </ul>

    <h2>Conclusion</h2>
    <p>The web is the most accessible platform in the world. With just a text editor and
    a browser, you can create something that billions of people can access. That's the
    power of what you're learning today.</p>
    <p>Ready to go deeper? Join the
    <a href="https://nexusberry.com" target="_blank">NexusBerry Modern Frontend Course</a>
    and build your career in web development.</p>

    <p><em>Thank you for reading! Follow us for more articles on modern web development.</em></p>
</body>
</html>
```

- Build it section by section, explaining each decision
- Save and show in browser after each major section
- Point out proper nesting and indentation throughout

**Interactive Questions (Presentation/Verbal)**

*Concept check:*
- "We used `<strong>` for the author name. Could we have used `<b>` instead? What's the difference?"
- Answer: Both make text bold visually, but `<strong>` means "important" to screen readers and search engines. `<b>` is just visual. We'll cover this more in Lecture 2.

*Predict-output:*
- "What will `&amp;` display in the browser?"
- Answer: It displays as `&` — this is an HTML entity. Some characters need special encoding.

**Live Debugging (VS Code)**
- Intentionally break nesting: put `<li>` outside a `<ul>` — show browser still renders but inspect element shows auto-correction
- Remove the closing `</h2>` tag — show how everything after becomes a heading
- Add a second `<h1>` — discuss why one `<h1>` per page is the convention
- Fix each error with explanation

**Part Closing (Presentation)**
- Common Mistakes: Forgetting to close tags, nesting errors, using `<br>` instead of separate `<p>` tags for paragraphs
- Optimization Tips: Use VS Code's built-in HTML validation, keep your code indented
- Best Practices: One `<h1>` per page, meaningful content hierarchy, always use `alt` on images
- Professional Insights: "The blog article you just built follows the same HTML structure as the New York Times, BBC, and every major news site. The difference is CSS styling — which we'll add in Lecture 3. You've just built the foundation."

---

### Lecture Ending (85:00 - 90:00)

**Cheat Sheet Slides (Presentation)**
- Walk through key reference slides (synced with `cheatsheet.md`)
- HTML document skeleton
- Common elements reference table
- Nesting rules
- VS Code shortcuts

**Assignment Introduction (Presentation)**
- Show assignment requirements: "My First Blog Article"
- Walk through grading criteria (100-point rubric)
- Highlight: topic is their choice — make it personal and interesting
- Submission via Google Classroom

**Q&A**
- Open floor for questions
- Address any confusion from the session
- "There are no silly questions — especially on day one"

**Next Lecture Teaser**
> *"Today we built with basic HTML elements. But did you know there are special HTML tags that tell the browser — and search engines — exactly what each part of your page means? A `<nav>` that says 'this is navigation', a `<footer>` that says 'this is the footer'. In Lecture 2, we'll unlock Semantic HTML and Accessibility — the skills that make employers say 'this person knows what they're doing.' See you on Wednesday!"*

---

## Phase 2: Share After Lecture

- [ ] Upload video recording to Google Classroom
- [ ] Push `code/` folder to course repo
- [ ] Post `assignment.md` to Google Classroom
- [ ] Share `presentation/` (HTML or PDF export)
- [ ] Post `cheatsheet.md` to Google Classroom
- [ ] Upload `quiz.md` to online portal for pre-class evaluation

---

## Interactive Questions Summary

| Part | Type | Topic | Purpose |
|------|------|-------|---------|
| Part 1 | quick-fire | What happens when you type a URL | Engage curiosity about how the web works |
| Part 1 | predict-output | Deleting an h1 in DevTools | Show that DevTools changes are temporary |
| Part 2 | spot-the-error | Missing DOCTYPE and broken closing tag | Teach attention to detail in HTML structure |
| Part 2 | concept-check | Content in `<head>` vs `<body>` | Clarify the purpose of each section |
| Part 2 | quick-fire | charset and title tag purpose | Reinforce metadata understanding |
| Part 3 | predict-output | Skipping heading levels | Teach proper heading hierarchy |
| Part 3 | spot-the-error | Missing protocol in link href | Common beginner mistake with links |
| Part 3 | quick-fire | alt attribute and list types | Reinforce element attributes |
| Part 4 | concept-check | `<strong>` vs `<b>` | Preview semantic HTML (Lecture 2 teaser) |
| Part 4 | predict-output | HTML entities (`&amp;`) | Introduce special characters |

---

## Teaching Tips Summary

| Moment | Tip Type | Purpose |
|--------|----------|---------|
| Part 1 opening | First impression | Set the tone: "This isn't a YouTube tutorial — this is a professional course" |
| View Page Source | Aha moment | Demystify websites — they're just HTML |
| Part 2 Emmet demo | Pro tip | Show professional workflow vs manual typing |
| Part 3 alt text | Professional insight | Accessibility and legal requirements |
| Part 4 building | Confidence boost | "You just built the same structure as the NYT" |
| Lecture ending | Teaser | Build anticipation for semantic HTML |

---

## Emergency Recovery

| Problem | Solution |
|---------|----------|
| reveal.js CDN fails | Use local fallback copy or switch to screen-sharing code directly |
| Live Server not working | Open HTML file directly in browser (double-click) |
| picsum.photos down | Use `https://via.placeholder.com/800x400` instead |
| Students can't follow along | Slow down, share screen with larger font, repeat key steps |
| Running behind | Skip one interactive question per Part, summarize Part closings |
| Running ahead | Add bonus: show more DevTools features, try editing live sites in Elements panel, live code student suggestions |

---

## Conversion Phrases (Sprinkle Throughout)

- *"This is the kind of detail you won't find in a 10-minute YouTube video."*
- *"In my 25+ years of building production websites, I've learned that fundamentals matter more than frameworks."*
- *"In this course, we don't just show you what works — we show you why it works and what happens when it breaks."*
- *"By the end of this 3-month course, you'll have a portfolio that gets interviews. Today is step one."*

---

## Never Say
- "This is easy/simple" → Say "foundational"
- "You should know this" → Say "Let me show you"
- "Obviously..." → Just explain it
