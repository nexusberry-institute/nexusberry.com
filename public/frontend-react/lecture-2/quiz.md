# Lecture 2: Portal Quiz (10 MCQs)

**Instructions:** Complete this quiz on the online portal **before Lecture 3**.
These questions evaluate your understanding of the concepts covered in Lecture 2.
You may refer to the cheatsheet and lecture recording while attempting.

---

## Question 1

**Question:** What does "semantic HTML" mean?

- A) HTML that uses JavaScript for interactivity
- B) HTML that uses elements which describe the meaning of their content
- C) HTML that includes CSS styling inline
- D) HTML that only works in modern browsers

**Answer:** B) HTML that uses elements which describe the meaning of their content

**Explanation:** "Semantic" means "relating to meaning." Semantic HTML uses elements like `<header>`, `<nav>`, `<main>`, and `<footer>` that describe WHAT the content IS, not just how it looks. Option A describes JavaScript behavior, not semantics. Options C and D are unrelated to the concept of semantics.

---

## Question 2

**Question:** Which HTML element should be used for the primary content of a webpage?

- A) `<section>`
- B) `<article>`
- C) `<main>`
- D) `<div id="content">`

**Answer:** C) `<main>`

**Explanation:** The `<main>` element represents the primary content of a page — the content that is unique to that page. There should be only ONE `<main>` per page. `<section>` (A) groups related content within `<main>`. `<article>` (B) is for self-contained content like blog posts. `<div>` (D) is non-semantic — it has no meaning.

---

## Question 3

**Question:** How many `<main>` elements are allowed per page?

- A) As many as you need
- B) Exactly two — one for content, one for sidebar
- C) Only one
- D) None — `<main>` is not a valid HTML element

**Answer:** C) Only one

**Explanation:** The `<main>` element must be unique — only ONE per page. It represents the dominant content that is directly related to the page's purpose. If you need multiple content areas, use `<section>` elements inside `<main>`. Option D is incorrect — `<main>` is a fully valid HTML5 element.

---

## Question 4

**Question:** What is the purpose of the `<aside>` element?

- A) To create a sidebar layout with CSS
- B) To hold content tangentially related to the main content (sidebar info, fun facts, related links)
- C) To add a secondary navigation menu
- D) To hide content from the user

**Answer:** B) To hold content tangentially related to the main content (sidebar info, fun facts, related links)

**Explanation:** `<aside>` is for content that is related but not essential to the main content — like sidebars, pull quotes, fun facts, or related links. While it's often styled as a sidebar (A), its purpose is semantic, not visual. It doesn't create layout by itself. Option C describes `<nav>`, and option D doesn't describe any HTML element.

---

## Question 5

**Context:**
```html
<div id="header">
    <div id="nav">
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
    </div>
</div>
<div id="content">
    <p>Welcome to my portfolio.</p>
</div>
<div id="footer">
    <p>&copy; 2026</p>
</div>
```

**Question:** How would you improve this code using semantic HTML?

- A) Add CSS classes instead of IDs
- B) Replace `<div id="header">` with `<header>`, `<div id="nav">` with `<nav>`, `<div id="content">` with `<main>`, and `<div id="footer">` with `<footer>`
- C) Add `role` attributes to each `<div>`
- D) Wrap everything in an `<article>` element

**Answer:** B) Replace `<div id="header">` with `<header>`, `<div id="nav">` with `<nav>`, `<div id="content">` with `<main>`, and `<div id="footer">` with `<footer>`

**Explanation:** The best approach is to replace non-semantic `<div>` elements with their semantic equivalents. This gives the page structure meaning for screen readers, search engines, and developers. Option A changes styling but not semantics. Option C would work but violates the first rule of ARIA: don't use ARIA when a native element exists. Option D is wrong because `<article>` is for self-contained content, not page structure.

---

## Question 6

**Context:**
```html
<header>
    <h1>My Portfolio</h1>
</header>
<main>
    <section id="about">
        <h2>About Me</h2>
        <p>I'm a developer.</p>
    </section>
    <section id="skills">
        <h2>Skills</h2>
        <ul><li>HTML</li><li>CSS</li></ul>
    </section>
</main>
```

**Question:** Which ARIA landmark roles does the browser automatically create from this code?

- A) No landmarks — you must add `role` attributes manually
- B) `banner` (header), `main` (main), and two `region` landmarks (sections with headings)
- C) `header`, `main`, `section` — these are the landmark names
- D) Only `main` — other elements don't create landmarks

**Answer:** B) `banner` (header), `main` (main), and two `region` landmarks (sections with headings)

**Explanation:** Semantic HTML automatically creates ARIA landmarks: `<header>` becomes `banner`, `<main>` becomes `main`, and `<section>` elements with accessible names (via headings or `aria-label`) become `region` landmarks. You do NOT need to add `role` attributes manually (A). Option C uses incorrect landmark names — they follow ARIA naming, not HTML tag names. Option D is incomplete.

---

## Question 7

**Context:**
```html
<img src="team-photo.jpg" alt="">
```

**Question:** A developer added `alt=""` (empty alt) to a team photo. What happens when a screen reader encounters this image?

- A) The screen reader reads the filename "team-photo.jpg"
- B) The screen reader announces "image" with no description
- C) The screen reader skips the image entirely — empty alt marks it as decorative
- D) The screen reader throws an error

**Answer:** C) The screen reader skips the image entirely — empty alt marks it as decorative

**Explanation:** An empty `alt=""` is a deliberate signal that the image is decorative and should be ignored by screen readers. This is correct for decorative images (borders, spacers, backgrounds) but WRONG for informational images like a team photo. The team photo should have descriptive alt text like `alt="The NexusBerry development team at the Lahore office"`. Option A would happen if `alt` was completely missing (not empty). Options B and D are incorrect behavior descriptions.

---

## Question 8

**Context:**
```html
<nav role="navigation" aria-label="Main menu">
    <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
    </ul>
</nav>
```

**Question:** What is wrong with this code?

- A) `<nav>` cannot contain `<ul>` elements
- B) `role="navigation"` is redundant — `<nav>` already creates a navigation landmark
- C) `aria-label` should not be used on `<nav>`
- D) Nothing is wrong — this is perfectly correct

**Answer:** B) `role="navigation"` is redundant — `<nav>` already creates a navigation landmark

**Explanation:** The `<nav>` element automatically creates a `navigation` ARIA landmark. Adding `role="navigation"` is redundant — it repeats information the browser already provides. The `aria-label="Main menu"` is good practice (adds clarity for screen readers when multiple nav elements exist), but `role="navigation"` should be removed. This follows the first rule of ARIA: don't use ARIA when native HTML does the job. Option A is wrong — `<ul>` inside `<nav>` is standard practice.

---

## Question 9

**Context:**
```html
<head>
    <title>Portfolio</title>
</head>
```

**Question:** This page is missing several important meta tags for SEO. Which would have the MOST impact on search results?

- A) `<meta name="keywords">` — search engines rank based on keywords
- B) `<meta name="description">` — appears as the snippet in search results
- C) `<meta name="robots">` — tells search engines to index the page
- D) `<meta name="viewport">` — makes the page responsive

**Answer:** B) `<meta name="description">` — appears as the snippet in search results

**Explanation:** The `<meta name="description">` is the most impactful missing SEO meta tag. Its content appears as the snippet text below the title in Google search results. Without it, Google auto-generates a snippet (often poorly). Option A is outdated — most search engines ignore the `keywords` meta tag. Option C is not needed for basic indexing (pages are indexed by default). Option D is important for mobile experience but affects usability, not search result appearance.

---

## Question 10

**Question:** A company's website uses `<div>` tags for all page sections, has no alt text on images, and is missing a skip navigation link. A visually impaired user files a complaint. Why should the company be concerned?

- A) The user is being unreasonable — `<div>` works fine
- B) The website violates accessibility guidelines (WCAG), and in many countries, inaccessible public websites can lead to legal action
- C) The company only needs to worry if they are a government website
- D) Adding alt text alone would fix all accessibility issues

**Answer:** B) The website violates accessibility guidelines (WCAG), and in many countries, inaccessible public websites can lead to legal action

**Explanation:** Accessibility is not optional. Laws like the ADA (United States), EAA (European Union), and similar legislation in many countries require public-facing websites to be accessible. The issues described — no semantic landmarks (using `<div>` instead of semantic elements), missing alt text, and no skip navigation — violate WCAG guidelines. Option A ignores legal and ethical responsibility. Option C is wrong — private companies are also subject to accessibility laws. Option D is incomplete — while alt text is important, semantic structure and skip navigation are also required.

---

## Self-Assessment

After completing the quiz, rate your understanding:

| Topic | Confident | Need Review | Lost |
|-------|-----------|-------------|------|
| Semantic HTML elements (header, nav, main, section, article, aside, footer) | [ ] | [ ] | [ ] |
| Accessibility (A11y) fundamentals and ARIA | [ ] | [ ] | [ ] |
| Alt text best practices | [ ] | [ ] | [ ] |
| SEO meta tags (description, Open Graph) | [ ] | [ ] | [ ] |
| Semantic vs non-semantic HTML | [ ] | [ ] | [ ] |

If you marked "Need Review" or "Lost" on any topic, revisit the cheatsheet and lecture recording before the next class.
