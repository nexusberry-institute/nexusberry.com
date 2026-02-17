# Lecture 3: CSS Fundamentals & The Box Model

## PRESENTER ONLY (Not shared with students)

### Overview
- **Format**: Live Google Meet session
- **Style**: Presentation-driven (reveal.js) + live coding (VS Code)
- **Project**: Styled Business Card
- **Goal**: Students can write CSS rules, use selectors, understand specificity & cascade, and apply the Box Model to style HTML elements

---

## Pre-Class Setup Checklist

- [ ] VS Code with clean theme (dark mode recommended)
- [ ] Large font size (18-20px) for screen share visibility
- [ ] Browser ready (Chrome DevTools accessible)
- [ ] Blank project folder created: `styled-business-card/`
- [ ] Presentation loaded: `presentation/index.html` open in browser
- [ ] reveal.js CDN verified (test slides load correctly)
- [ ] Prepare a plain HTML file (unstyled) to show before/after CSS transformation
- [ ] Chrome DevTools: Elements panel > Styles tab ready to demonstrate
- [ ] Disable notifications on all devices

---

## Phase 0: Before Lecture (0:00 – 10:00)

### Portal Quiz Review (from Lecture 2)
- Review portal quiz results from Lecture 2
- Likely missed questions:
  - **Q6 (ARIA landmarks):** Students confuse `role="navigation"` with `<nav>` — reinforce that `<nav>` already implies the role
  - **Q8 (Redundant roles):** `<main role="main">` is redundant — the semantic element carries the role automatically
  - **Q10 (Legal implications):** Accessibility isn't just nice-to-have — lawsuits are real (ADA, Section 508)
- Reinforce: semantic elements carry implicit ARIA roles — don't double up

### Assignment Feedback
- Common mistakes observed:
  - Missing `aria-label` on icon-only links
  - Generic alt text like "image" instead of descriptive text
  - Skipping `<aside>` for supplementary content
  - Using `<div>` where `<section>` or `<article>` would be semantic
- Good examples to highlight: students who used skip navigation links, proper heading hierarchy
- Questions to address: "When do I use `<section>` vs `<article>`?" — quick recap

### Bridge to CSS
> *"Your portfolios from Lecture 2 have excellent semantic structure — screen readers love them. But let's be honest... they look like plain text from 1995. Today, we change that. Welcome to CSS."*

---

## Phase 1: Today's Lecture (90 Minutes)

### Part 1: Why CSS? From Plain HTML to Styled Pages (10:00 – 30:00)

**Background / Motivation (Presentation)**
- Show a plain HTML page (unstyled) — the portfolio from Lecture 2
- Then reveal the same page WITH CSS — dramatic visual difference
- "This is the same HTML. Not a single tag changed. Only CSS was added."
- Separation of concerns: HTML = structure/meaning, CSS = appearance
- Analogy: "HTML is the skeleton, CSS is the skin, muscles, and clothing"

**Illustrations / Animations (Presentation)**
- Before/After comparison infographic (`.nb-compare`)
- CSS rule anatomy diagram (`.nb-anatomy`): `selector { property: value; }`
- 3 ways to add CSS icon cards (`.nb-cards`): inline, internal `<style>`, external `<link>`
- Callout: We'll use internal `<style>` today — external comes in later lectures

**"Let's see in Code now" (VS Code)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First CSS</title>
    <style>
        h1 {
            color: red;
            font-size: 36px;
            text-align: center;
        }

        p {
            color: #333333;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            font-size: 18px;
            line-height: 1.6;
        }

        body {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
    <h1>Hello CSS!</h1>
    <p>This paragraph is now styled with CSS.</p>
</body>
</html>
```
- Type each rule one by one, refresh browser to show changes
- Point out: "Notice the pattern — selector, curly braces, property, colon, value, semicolon"
- Show `color`, `font-size`, `text-align`, `background-color`, `font-family`, `line-height`

**Interactive Question 1: Predict-Output (Presentation)**
> Given: `h1 { color: red; }` — What changes on the page?
> - A) All text turns red
> - B) Only `<h1>` elements turn red
> - C) The background turns red
> - D) Nothing — CSS doesn't change colors
>
> **Answer: B** — The selector `h1` targets only `<h1>` elements

**Interactive Question 2: Spot-the-Error (Presentation)**
```css
h1 {
    color: blue
    font-size: 24px;
}
```
> What's wrong? → Missing semicolon after `blue`. CSS won't throw an error — it just silently breaks `font-size` too!

**Interactive Question 3: Concept-Check (Presentation)**
> Where does the `<style>` tag go?
> - A) Inside `<body>`
> - B) Inside `<head>`
> - C) After `</html>`
> - D) Anywhere — it doesn't matter
>
> **Answer: B** — `<style>` goes in `<head>`. It technically works in `<body>` but it's invalid and bad practice.

**Live Debugging (VS Code)**
- Intentionally type `colour: red;` (British spelling) — nothing happens
- "CSS fails SILENTLY. No error messages. No red underline. Nothing. This is the #1 frustration for beginners."
- Show how VS Code autocomplete helps prevent this
- Also demo: missing closing brace `}` — everything after it breaks

**Part 1 Closing (Presentation)**
- Common Mistakes:
  - Forgetting semicolons (properties stop working)
  - Misspelling property names (silent failure)
  - Putting `<style>` in `<body>` instead of `<head>`
- Best Practices:
  - Use VS Code autocomplete — let the editor help you
  - Always check the browser after each change
  - Start with small changes, build up gradually
- Pro Tip: "In 25 years, I've seen senior developers waste hours on a missing semicolon. CSS's silent failure is its biggest gotcha."

---

### Part 2: CSS Selectors & The Cascade (30:00 – 52:00)

**Background / Motivation (Presentation)**
- "You've targeted elements by tag name. But what if you have 10 paragraphs and want to style only one?"
- Enter: selectors — CSS's targeting system
- Element selectors are like addressing "all residents" — class selectors are like addressing "apartment 3B"

**Illustrations / Animations (Presentation)**
- Selector types comparison (`.nb-compare`): class vs ID
- Specificity hierarchy flow (`.nb-flow`): element → class → ID → inline
- Specificity scoring anatomy (`.nb-anatomy`): the 0-0-0 system
- Callout: Classes are the workhorse — IDs are rarely needed in modern CSS

**"Let's see in Code now" (VS Code)**
```html
<style>
    /* Element selector — targets ALL paragraphs */
    p {
        color: #333;
        font-size: 16px;
    }

    /* Class selector — targets elements with class="highlight" */
    .highlight {
        background-color: yellow;
        font-weight: bold;
    }

    /* ID selector — targets the ONE element with id="main-title" */
    #main-title {
        color: darkblue;
        font-size: 32px;
    }

    /* Grouping selectors */
    h1, h2, h3 {
        font-family: Georgia, serif;
    }

    /* Pseudo-class — hover state */
    a:hover {
        color: red;
        text-decoration: underline;
    }

    /* Pseudo-class — first child */
    p:first-child {
        font-size: 20px;
    }
</style>

<h1 id="main-title">CSS Selectors</h1>
<p class="highlight">This paragraph is highlighted.</p>
<p>This paragraph is normal.</p>
<p>This is another normal paragraph.</p>
<a href="#">Hover over me!</a>
```
- Type each selector, demonstrate in browser
- Emphasize: dot `.` in CSS, but NOT in HTML `class="highlight"` (no dot)
- Show hover effect live
- Show `:first-child` — "only the first `<p>` gets larger"

**Interactive Question 1: Predict-Output (Presentation)**
```css
p { color: blue; }
.special { color: red; }
```
```html
<p class="special">What color am I?</p>
```
> Answer: **Red** — class selector (0-1-0) beats element selector (0-0-1)

**Interactive Question 2: Quick-Fire (Presentation)**
> Rank these selectors from LOWEST to HIGHEST specificity:
> 1. `#header` (ID)
> 2. `.nav-link` (class)
> 3. `p` (element)
>
> Answer: `p` (0-0-1) → `.nav-link` (0-1-0) → `#header` (1-0-0)

**Interactive Question 3: Spot-the-Error (Presentation)**
```html
<p class=".highlight">Styled text</p>
```
> What's wrong? → The dot `.` is CSS syntax, not HTML! Should be `class="highlight"`. This is the #1 selector mistake beginners make.

**Interactive Question 4: Hidden-Fact-Reveal (Presentation)**
```css
p { color: blue; }
p { color: red; }
```
> What color? → **Red!** Same specificity — last rule wins. This is called "the cascade" in Cascading Style Sheets.

**Live Debugging (VS Code)**
- Write a class rule that doesn't apply
- Open Chrome DevTools → Elements → Styles panel
- Show: the rule IS there, but it's crossed out (strikethrough)
- "DevTools shows you exactly which rule won and why. This is your best debugging friend."
- Show the specificity calculation in DevTools

**Part 2 Closing (Presentation)**
- Common Mistakes:
  - Putting a dot in the HTML class attribute: `class=".name"` ← WRONG
  - Using IDs for styling (save them for JavaScript)
  - Not understanding why a rule doesn't apply (specificity conflict)
- Best Practices:
  - Use classes for styling — they're reusable
  - Use IDs sparingly — only when you need a unique identifier
  - When in doubt, open DevTools Styles panel
- Pro Tip: "In professional codebases, you'll almost never see ID selectors in CSS. Classes are king. Some teams even ban `#id` in their CSS linters."

---

### Part 3: The Box Model (52:00 – 75:00)

**Background / Motivation (Presentation)**
- "Every HTML element — every heading, paragraph, image, link — is a rectangular box. Even if it looks round, it's a box."
- This is THE most important CSS concept. Get this right, and layouts make sense.
- Analogy: Picture frame
  - Photo = content
  - Matting around photo = padding
  - The frame itself = border
  - Wall space between frames = margin

**Illustrations / Animations (Presentation)**
- Box Model anatomy (`.nb-anatomy`) — KEY SLIDE with labeled layers
- content-box vs border-box comparison (`.nb-compare`)
- Width calculation flow (`.nb-flow`): content + padding + border = total width

**"Let's see in Code now" (VS Code)**
```html
<style>
    .box-demo {
        width: 300px;
        padding: 20px;
        border: 5px solid #990147;
        margin: 30px;
        background-color: #0F1642;
        color: white;
    }

    /* The professional reset */
    *, *::before, *::after {
        box-sizing: border-box;
    }

    .box-content {
        width: 300px;
        padding: 20px;
        border: 5px solid #E04A7A;
        box-sizing: content-box; /* default */
        background-color: #1A2258;
        color: white;
        margin-bottom: 20px;
    }

    .box-border {
        width: 300px;
        padding: 20px;
        border: 5px solid #00C896;
        box-sizing: border-box; /* professional choice */
        background-color: #1A2258;
        color: white;
    }

    /* Centering with margin auto */
    .centered-box {
        width: 400px;
        margin: 40px auto;
        padding: 20px;
        border: 2px solid #4D70FF;
        background-color: #0F1642;
        color: white;
        text-align: center;
    }
</style>

<div class="box-demo">I'm a box with margin, border, padding, and content!</div>

<h2>content-box vs border-box</h2>
<div class="box-content">content-box: I'm wider than 300px!</div>
<div class="box-border">border-box: I'm exactly 300px!</div>

<div class="centered-box">I'm centered with margin: 0 auto</div>
```
- First show `.box-demo` — open DevTools, hover to see margin/padding/border highlighted
- Show DevTools Box Model visualizer — click the colored boxes
- Then build content-box vs border-box side by side
- "Which one is 300px wide? Let's measure..."
  - content-box: 300 + 20 + 20 + 5 + 5 = 350px total!
  - border-box: 300px total (padding + border eat into the content)
- Show `margin: 0 auto` — explain: top/bottom 0, left/right auto = centered

**Interactive Question 1: Predict-Output (Presentation)**
> An element has: `width: 200px; padding: 15px; border: 5px solid black;`
> Using DEFAULT box-sizing, what is the total width?
> - A) 200px
> - B) 215px
> - C) 230px
> - D) 240px
>
> Answer: **D) 240px** — 200 + 15 + 15 + 5 + 5 = 240px. Padding and border are added on BOTH sides!

**Interactive Question 2: Concept-Check (Presentation)**
> You want space BETWEEN two boxes. Which property?
> - A) padding
> - B) margin
> - C) border
> - D) width
>
> Answer: **B) margin** — Padding is INSIDE the border (space between content and border). Margin is OUTSIDE the border (space between elements).

**Interactive Question 3: Hidden-Fact-Reveal (Presentation)**
- Live demo: Open DevTools on any element
- Hover over the Box Model visualizer
- Show orange (margin), green (padding), blue (content) highlights on the page
- "This visualizer is available on EVERY website. Try it on YouTube, Amazon, Google — everything is boxes!"

**Live Debugging (VS Code)**
```css
.container {
    width: 100%;
    padding: 30px;
    border: 2px solid red;
}
```
- "Watch what happens..." — the container overflows the screen horizontally
- Horizontal scrollbar appears!
- Fix: Add `box-sizing: border-box;` — scrollbar disappears
- "This is exactly why every professional stylesheet starts with the `border-box` reset"

**Part 3 Closing (Presentation)**
- Common Mistakes:
  - Forgetting that padding and border add to width (in content-box)
  - Confusing padding (inside) with margin (outside)
  - Not using the `border-box` reset
- Best Practices:
  - Always add the universal `box-sizing: border-box` reset at the top
  - Use `margin: 0 auto` for horizontal centering (needs a set width)
  - Use DevTools Box Model visualizer — it's your X-ray vision
- Pro Tip: "Every CSS framework — Bootstrap, Tailwind, every single one — uses `border-box` as the default. This one-line reset saves hours of frustration."

---

### Part 4: Building the Styled Business Card (75:00 – 95:00)

**Background / Motivation (Presentation)**
- "Now we combine everything — selectors, properties, Box Model — into a real project"
- Show the final business card design (screenshot or live preview)
- CSS Colors: named colors, hex `#990147`, RGB `rgb(153, 1, 71)`, RGBA `rgba(0,0,0,0.5)` for transparency
- Typography properties: `font-family` with fallback stack, `font-weight`, `line-height`, `letter-spacing`
- Visual polish: `border-radius`, `box-shadow`, `text-decoration`, `list-style`

**Illustrations / Animations (Presentation)**
- Color formats icon cards (`.nb-cards`): named, hex, rgb, rgba
- Hex usage stat bars (`.nb-stats`): hex ~70%, rgb ~15%, named ~10%, other ~5%
- Callout: Always provide `font-family` fallbacks — not everyone has your fonts

**"Let's see in Code now" (VS Code)**
- Build the business card step by step:
  1. Start with semantic HTML (from Lectures 1-2): `<div class="card">`, `<h1>`, `<p>`, `<ul>`, `<a>`
  2. Add `box-sizing: border-box` universal reset
  3. Style `body`: dark background, centered layout
  4. Style `.card`: width, padding, border-radius, box-shadow, background
  5. Add circular profile image: `border-radius: 50%`
  6. Typography: name (h1), title (p.title), contact items
  7. Hover effects on links: `:hover` pseudo-class
  8. Color choices: NexusBerry Berry (#990147) and accents
- Type line by line, refresh after each section
- Show the card transforming from unstyled HTML to polished design

**Interactive Question 1: Quick-Fire (Presentation)**
> What CSS property makes an image circular?
> - A) `shape: circle`
> - B) `border-radius: 50%`
> - C) `round: true`
> - D) `display: circle`
>
> Answer: **B) `border-radius: 50%`** — When applied to a square element, 50% rounds it into a perfect circle.

**Interactive Question 2: Predict-Output (Presentation)**
> `box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.3);` — What do the 4 values mean?
> - A) top, right, bottom, left
> - B) x-offset, y-offset, blur, color
> - C) width, height, spread, color
> - D) margin on all four sides
>
> Answer: **B)** — 4px right, 8px down, 16px blur radius, 30% opaque black shadow

**Live Debugging (VS Code)**
- Set card text to `color: #990147` on dark background — barely visible
- "Can you read this? Neither can your users."
- Open DevTools → inspect the element → show contrast ratio checker
- "Accessibility in CSS means color contrast matters. We learned accessibility in HTML — it continues in CSS."
- Fix: change to `color: #E04A7A` (lighter berry) — much better

**Part 4 Closing (Presentation)**
- Common Mistakes:
  - Forgetting `font-family` fallbacks (broken fonts on other devices)
  - Poor color contrast (accessibility violation)
  - Using `border-radius: 50%` on non-square images (creates ovals, not circles)
- Best Practices:
  - Always test color contrast (DevTools or WebAIM checker)
  - Use `rem` or `em` for font sizes (we'll cover responsive units later)
  - Group related CSS properties together (layout, typography, colors)
- Pro Tip: "The `box-shadow` property is the easiest way to make something look 'elevated' or professional. Every card UI on the web uses it."

---

### Lecture Ending (95:00 – 100:00)

**Cheat Sheet Slides (Presentation)**
- Walk through key reference slides (synced with `cheatsheet.md`)
- CSS rule anatomy, selector types table, specificity scoring, Box Model diagram, common properties

**Assignment Introduction (Presentation)**
- Show assignment: "Styled Contact Card"
- Walk through grading criteria (100 points)
- Highlight: must use element selectors, class selectors, AND at least one pseudo-class
- Must demonstrate Box Model (padding, margin, border all visible)
- Creative addition (10 points) — add something we didn't cover in class

**Q&A**
- Open floor for questions
- Address any confusion from the session

**Next Lecture Teaser**
> *"Today you styled ONE card. But what if you want TWO cards side by side? Or a navigation bar with evenly spaced links? That's LAYOUT — and in Lecture 4, we master Flexbox and CSS Grid. Your business card is about to get neighbors."*

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
| Part 1 | Predict-output | `h1 { color: red; }` targeting | Understand selector targeting |
| Part 1 | Spot-the-error | Missing semicolon | Learn CSS silent failure |
| Part 1 | Concept-check | `<style>` placement | Reinforce HTML structure |
| Part 2 | Predict-output | Class vs element specificity | Understand specificity wins |
| Part 2 | Quick-fire | Rank 3 selectors | Specificity scoring practice |
| Part 2 | Spot-the-error | Dot in HTML class attribute | Common beginner mistake |
| Part 2 | Hidden-fact-reveal | Same specificity — last rule wins | Discover the cascade |
| Part 3 | Predict-output | Width calculation (content-box) | Box Model math |
| Part 3 | Concept-check | Padding vs margin | Distinguish inside vs outside |
| Part 3 | Hidden-fact-reveal | DevTools Box Model visualizer | Professional debugging tool |
| Part 4 | Quick-fire | Circular image property | Recall `border-radius: 50%` |
| Part 4 | Predict-output | box-shadow values | Understand shadow properties |

---

## Teaching Tips Summary

| Moment | Tip Type | Purpose |
|--------|----------|---------|
| Part 1 opening | Before/after reveal | Create "wow" moment for CSS power |
| Part 1 `colour` typo | Live debugging | Show CSS silent failure — most important gotcha |
| Part 2 class vs ID | Professional insight | "Teams ban #id in CSS" — differentiate from YouTube |
| Part 2 DevTools | Tool mastery | Styles panel as debugging essential |
| Part 3 Box Model | Analogy | Picture frame analogy makes layers intuitive |
| Part 3 border-box | Industry standard | "Every framework uses border-box" |
| Part 4 contrast | Accessibility tie-in | Connect CSS to Lecture 2 accessibility concepts |
| Part 4 box-shadow | Design polish | Simple property, dramatic visual impact |

---

## Emergency Recovery

| Problem | Solution |
|---------|----------|
| reveal.js CDN fails | Use local fallback copy or switch to screen-sharing code directly |
| DevTools not showing styles | Check element selector, clear cache, confirm CSS is in `<head>` |
| Color not displaying | Check hex format (# + 6 digits), check for typos in property name |
| Box Model calculation confusion | Draw on whiteboard/screen — content + padding×2 + border×2 |
| Running behind | Skip one interactive question per Part, summarize Part closing |
| Running ahead | Add bonus: CSS custom properties (variables), extra hover effects, live code student suggestions |

---

## Conversion Phrases (Sprinkle Throughout)

- *"YouTube tutorials show you the WHAT. I show you the WHY — and the mistakes you'll make in real projects."*
- *"In 25 years of development, I've never seen a professional codebase without the border-box reset. This is non-negotiable."*
- *"This is what separates a developer from someone who copies code — understanding WHY things look the way they do."*
- *"When you join a team, they'll expect you to debug CSS with DevTools. We're building that skill from Day 1."*

---

## Never Say
- "This is easy/simple" → Say "foundational"
- "You should know this" → Say "Let me show you"
- "Obviously..." → Just explain it
