# Lecture 5: Portal Quiz (10 MCQs)

**Instructions:** Complete this quiz on the online portal **before Lecture 6**.
These questions evaluate your understanding of the concepts covered in Lecture 5: Advanced CSS & Responsive Design.
You may refer to the cheatsheet and lecture recording while attempting.

---

## Question 1

**Context:**
```css
:root {
    --color-primary: #C9A84C;
}

h1 {
    color: var(--color-primry);
}
```

**Question:** What color will the `<h1>` element be?

- A) Gold (#C9A84C)
- B) Black (the browser default)
- C) The inherited color or browser default — the variable name is misspelled
- D) An error will appear in the console

**Answer:** C) The inherited color or browser default — the variable name is misspelled

**Explanation:** CSS variable names must match exactly. `--color-primry` is not the same as `--color-primary`. When a `var()` reference points to an undefined variable, the property is treated as invalid and the element inherits or uses the browser default. CSS does NOT show an error — it fails silently, which makes typos especially dangerous.

---

## Question 2

**Context:**
```css
/* Browser default font size: 16px */
body { font-size: 1rem; }
```

**Question:** If `1rem` equals `16px`, what is `2.5rem` in pixels?

- A) 25px
- B) 32px
- C) 40px
- D) 48px

**Answer:** C) 40px

**Explanation:** `rem` is always relative to the root font size. At the default `16px`, `2.5rem = 2.5 × 16 = 40px`. Unlike `em`, `rem` does not compound with nesting — it always refers to the root (`<html>`) font size.

---

## Question 3

**Context:**
```css
.card { width: 100%; }

@media (min-width: 768px) {
    .card { width: 50%; }
}

@media (min-width: 1024px) {
    .card { width: 33.33%; }
}
```

**Question:** Which design approach does this code use?

- A) Desktop-first (starts wide, narrows down)
- B) Mobile-first (starts narrow, expands up)
- C) Neither — it's invalid CSS
- D) Responsive-last (adds responsiveness at the end)

**Answer:** B) Mobile-first (starts narrow, expands up)

**Explanation:** The base CSS (`width: 100%`) targets the smallest screens with no media query. Then `min-width` queries progressively enhance the layout for larger screens: tablet (768px) gets 2 columns, desktop (1024px) gets 3 columns. This is the mobile-first pattern — base CSS for mobile, `min-width` to add.

---

## Question 4

**Context:**
```html
<head>
    <meta charset="UTF-8">
    <title>My Site</title>
</head>
```

**Question:** This page uses media queries but looks tiny and zoomed-out on mobile phones. What is missing?

- A) A `<link>` to a responsive CSS framework
- B) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- C) `<meta name="responsive" content="true">`
- D) A `@media` query targeting phones

**Answer:** B) `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

**Explanation:** Without the viewport meta tag, mobile browsers assume the page is designed for desktop and render it at a desktop width (typically 980px), then zoom out to fit the screen. The viewport tag tells the browser to use the device's actual width. This tag is required for all responsive websites.

---

## Question 5

**Context:**
```css
h1 {
    font-size: clamp(1.5rem, 5vw, 3rem);
}
```

**Question:** On a viewport width of 400px, what will the computed font size be?

- A) 1.5rem (24px) — the minimum kicks in
- B) 20px — exactly 5% of 400px
- C) 3rem (48px) — the maximum kicks in
- D) 5vw is always used regardless

**Answer:** A) 1.5rem (24px) — the minimum kicks in

**Explanation:** `5vw` at 400px viewport = `5% × 400 = 20px`. But `clamp()` sets a minimum of `1.5rem = 24px`. Since 20px < 24px, the minimum value wins. `clamp(min, preferred, max)` ensures the value never goes below `min` or above `max`.

---

## Question 6

**Context:**
```css
.sidebar { display: none; }

@media (min-width: 600px) {
    .sidebar { display: block; background: blue; }
}

@media (min-width: 900px) {
    .sidebar { background: red; width: 300px; }
}
```

**Question:** At a viewport width of 1000px, what is the sidebar's background color and width?

- A) Hidden (display: none)
- B) Blue background, no set width
- C) Red background, 300px wide
- D) Red background, no set width

**Answer:** C) Red background, 300px wide

**Explanation:** At 1000px, BOTH media queries apply (1000 ≥ 600 AND 1000 ≥ 900). The first query sets `display: block; background: blue`. The second query overrides `background` to `red` and adds `width: 300px`. Media queries cascade — later matching rules override earlier ones for the same properties.

---

## Question 7

**Context:**
```css
.card {
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

**Question:** When you hover over the card, what will be animated smoothly and what will change instantly?

- A) Both transform and box-shadow animate smoothly
- B) Transform animates smoothly, box-shadow changes instantly
- C) Box-shadow animates smoothly, transform changes instantly
- D) Nothing animates — transition must be on `:hover`

**Answer:** B) Transform animates smoothly, box-shadow changes instantly

**Explanation:** The `transition` property only specifies `transform`. So `transform: translateY(-8px)` will transition smoothly over 0.3s, but `box-shadow` has no transition declared and will change instantly. To animate both, use: `transition: transform 0.3s ease, box-shadow 0.3s ease;`

---

## Question 8

**Context:**
```css
.image-container {
    height: 200px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.image-container:hover img {
    transform: scale(1.1);
}
```

**Question:** When hovering, the image zooms but overflows outside the container. What's the fix?

- A) Add `overflow: hidden;` to `.image-container`
- B) Add `z-index: -1;` to the image
- C) Change `scale(1.1)` to `scale(0.9)`
- D) Remove `object-fit: cover;`

**Answer:** A) Add `overflow: hidden;` to `.image-container`

**Explanation:** When `transform: scale(1.1)` enlarges the image, it grows beyond the container's boundaries. Adding `overflow: hidden` to the container clips any content that extends outside its box. This is the standard pattern for contained image zoom effects — `overflow: hidden` + `transform: scale()`.

---

## Question 9

**Context:**
```css
:root {
    --color-primary: #C9A84C;
    --space-md: 1.5rem;
}

.btn {
    background: var(--color-primary);
    padding: var(--space-md);
    transition: all 0.3s ease;
}
```

**Question:** A colleague says this code has two professional concerns. Which TWO issues would a senior developer flag?

- A) CSS variables can't be used for padding
- B) `transition: all` animates every property — should target specific properties
- C) `:root` variables don't work inside class selectors
- D) Variable values should use `rem` for colors too

**Answer:** B) `transition: all` animates every property — should target specific properties

**Explanation:** The primary concern is `transition: all` — it tells the browser to watch and animate EVERY property change, which is inefficient and can cause unexpected animations. The fix: `transition: background-color 0.3s ease, transform 0.3s ease;`. Note: CSS variables working with padding and in class selectors is perfectly valid — options A, C, and D are incorrect.

---

## Question 10

**Context:**
You're building a responsive portfolio site. You need:
- Fluid heading that scales from 24px to 48px
- Card grid: 1 column on mobile, 2 on tablet, 3 on desktop
- Smooth hover effects on cards
- All colors changeable from one place

**Question:** Which combination of techniques achieves ALL of these requirements?

- A) JavaScript for everything — CSS can't handle responsive design alone
- B) `clamp()` for headings, `min-width` media queries for grid, `transition` + `transform` for hover, CSS variables for colors
- C) `max-width` media queries for headings, Flexbox for grid, `animation` for hover, inline styles for colors
- D) Fixed `px` values at each breakpoint, `float` for grid, JavaScript for hover, Sass variables for colors

**Answer:** B) `clamp()` for headings, `min-width` media queries for grid, `transition` + `transform` for hover, CSS variables for colors

**Explanation:** This is the modern CSS toolkit: `clamp(1.5rem, 5vw, 3rem)` for fluid typography, `@media (min-width: ...)` for mobile-first grid layouts, `transition` + `transform` for GPU-accelerated hover effects, and CSS custom properties (`--variables`) for centralized color management. No JavaScript needed, no preprocessors required — pure CSS handles it all.

---

## Self-Assessment

After completing the quiz, rate your understanding:

| Topic | Confident | Need Review | Lost |
|-------|-----------|-------------|------|
| CSS Custom Properties (variables) | [ ] | [ ] | [ ] |
| Responsive Units (rem, em, vw, vh) | [ ] | [ ] | [ ] |
| clamp() Function | [ ] | [ ] | [ ] |
| Media Queries (min-width, mobile-first) | [ ] | [ ] | [ ] |
| CSS Transitions & Transforms | [ ] | [ ] | [ ] |
| Responsive Images (object-fit) | [ ] | [ ] | [ ] |
| overflow: hidden Pattern | [ ] | [ ] | [ ] |
| Viewport Meta Tag | [ ] | [ ] | [ ] |

If you marked "Need Review" or "Lost" on any topic, revisit the cheatsheet and lecture recording before the next class.
