# Lecture 6: Portal Quiz (10 MCQs)

**Instructions:** Complete this quiz on the online portal **before Lecture 7**.
These questions evaluate your understanding of the concepts covered in Lecture 6: Tailwind CSS Basics.
You may refer to the cheatsheet and lecture recording while attempting.

---

## Question 1

**Context:**
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body class="bg-slate-950 text-gray-100">
    <h1 class="text-3xl font-bold text-amber-500">Hello</h1>
</body>
```

**Question:** The page loads but none of the Tailwind classes are working — the heading is not amber, the background is white. What's missing?

- A) A `<link>` to a Tailwind CSS stylesheet
- B) The Tailwind CSS CDN script tag: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- C) A `<style>` tag with Tailwind imports
- D) The `class="tailwind"` attribute on the `<html>` element

**Answer:** B) The Tailwind CSS CDN script tag: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`

**Explanation:** Without the CDN script tag, the browser doesn't know what `bg-slate-950`, `text-gray-100`, or `text-amber-500` mean — they're just class names with no associated CSS. The Tailwind CDN script generates the actual CSS rules at runtime. This is the #1 setup mistake.

---

## Question 2

**Context:**
Tailwind uses a 4px base spacing system.

**Question:** What is the CSS equivalent of `p-6`?

- A) `padding: 6px`
- B) `padding: 0.6rem`
- C) `padding: 1.5rem` (24px)
- D) `padding: 6rem`

**Answer:** C) `padding: 1.5rem` (24px)

**Explanation:** Tailwind's spacing scale uses a 4px base. The formula is: number × 4 = pixels. So `p-6` = 6 × 4 = 24px = 1.5rem. This same scale applies to margin (`m-6`), gap (`gap-6`), width (`w-6`), and all other spacing utilities.

---

## Question 3

**Context:**
```html
<div class="bg-blue text-white p4">Hello World</div>
```

**Question:** This Tailwind code has errors. What's wrong?

- A) `text-white` is not a valid Tailwind class
- B) `bg-blue` needs a shade number (e.g., `bg-blue-500`) and `p4` needs a dash (`p-4`)
- C) You need to wrap everything in a Tailwind container
- D) `div` elements don't support Tailwind classes

**Answer:** B) `bg-blue` needs a shade number (e.g., `bg-blue-500`) and `p4` needs a dash (`p-4`)

**Explanation:** Tailwind colors always require a shade: `bg-blue-500`, not `bg-blue`. The shade system goes from 50 (lightest) to 950 (darkest). Spacing utilities always use a dash separator: `p-4`, not `p4`. These are the two most common syntax mistakes when starting with Tailwind.

---

## Question 4

**Context:**
```html
<div class="bg-amber-500">Amber 500</div>
<div class="bg-amber-700">Amber 700</div>
<div class="bg-amber-200">Amber 200</div>
```

**Question:** Which shade is the darkest?

- A) `bg-amber-200`
- B) `bg-amber-500`
- C) `bg-amber-700`
- D) They're all the same shade, just different names

**Answer:** C) `bg-amber-700`

**Explanation:** Tailwind's color system goes from 50 (lightest) to 950 (darkest). So `amber-200` is light, `amber-500` is the base/medium shade, and `amber-700` is dark. Higher numbers = darker shades. This applies to all Tailwind colors: slate, gray, red, green, blue, etc.

---

## Question 5

**Context:**
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
</div>
```

**Question:** At a viewport width of 900px, how many columns will be displayed?

- A) 1 column
- B) 2 columns
- C) 3 columns
- D) The grid won't work — you need a CSS file

**Answer:** B) 2 columns

**Explanation:** Tailwind is mobile-first. At 900px: the base `grid-cols-1` applies for all screens, but `md:grid-cols-2` overrides it because `md:` triggers at 768px (and 900 ≥ 768). The `lg:grid-cols-3` doesn't apply yet because `lg:` triggers at 1024px (and 900 < 1024). So at 900px, we get 2 columns.

---

## Question 6

**Context:**
```html
<button class="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Click Me
</button>
```

**Question:** The button's background doesn't change on hover. Why?

- A) `rounded` is interfering with hover styles
- B) `hover-bg-blue-700` uses a dash instead of a colon — should be `hover:bg-blue-700`
- C) You need `transition` for hover to work
- D) Tailwind doesn't support hover effects

**Answer:** B) `hover-bg-blue-700` uses a dash instead of a colon — should be `hover:bg-blue-700`

**Explanation:** Tailwind modifiers use a colon separator: `hover:bg-blue-700`, `focus:ring-2`, `active:scale-95`. Using a dash (`hover-bg-blue-700`) creates a single class name that doesn't exist in Tailwind. The colon tells Tailwind to apply the class only when the modifier condition is true (hover, focus, etc.).

---

## Question 7

**Context:**
```html
<div class="flex justify-between items-center">
    <span>Logo</span>
    <nav>Links</nav>
</div>
```

**Question:** What layout does this combination create?

- A) Two items stacked vertically, centered
- B) Two items in a horizontal row, pushed to opposite edges, vertically centered
- C) A 2-column CSS grid
- D) Items overlap on top of each other

**Answer:** B) Two items in a horizontal row, pushed to opposite edges, vertically centered

**Explanation:** `flex` creates a flex container (horizontal row by default). `justify-between` pushes flex items to opposite edges — the logo goes to the left, the nav goes to the right, with space between. `items-center` vertically centers the items within the row. This is the standard navigation bar layout pattern.

---

## Question 8

**Context:**
```html
<div class="hover:-translate-y-2 hover:shadow-xl">
    Card content
</div>
```

**Question:** The card jumps instantly when hovered instead of animating smoothly. What's missing?

- A) A `<style>` tag with transition CSS
- B) The `animate` class
- C) `transition duration-300` to enable smooth animation
- D) `hover:` modifiers can't be combined

**Answer:** C) `transition duration-300` to enable smooth animation

**Explanation:** Tailwind's `hover:` modifiers define what happens on hover, but without `transition`, the changes happen instantly. Adding `transition duration-300` tells the browser to animate the property changes over 300ms. Always pair hover transforms/color changes with a transition class for professional-feeling interactions.

---

## Question 9

**Context:**
```html
<section class="py-20 px-6">
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Cards -->
        </div>
    </div>
</section>
```

**Question:** What does `max-w-7xl mx-auto` do, and why is it important?

- A) Makes text extra-large and centers it
- B) Sets a maximum width of 80rem (1280px) and centers the container — prevents content from stretching on wide screens
- C) Creates a 7-column grid with automatic margins
- D) Only works on screens wider than XL (1280px)

**Answer:** B) Sets a maximum width of 80rem (1280px) and centers the container — prevents content from stretching on wide screens

**Explanation:** `max-w-7xl` sets `max-width: 80rem` (1280px), constraining content to a readable width. `mx-auto` sets `margin-left: auto; margin-right: auto`, centering the block horizontally. Together, they form the standard container pattern — essential for preventing content from stretching uncomfortably wide on 4K monitors and large screens.

---

## Question 10

**Context:**
You need to convert this Lecture 5 CSS to Tailwind utility classes:

```css
.hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background: rgba(0, 0, 0, 0.6);
}
```

**Question:** Which Tailwind approach replaces BOTH the hero layout AND the `::before` overlay?

- A) `min-h-screen flex items-center justify-center text-center` for layout + a `<div class="absolute inset-0 bg-black/60">` for overlay
- B) `h-full center-content` for layout + `overlay-dark` for overlay
- C) You must use custom CSS — Tailwind can't replicate `::before`
- D) `screen flex center` for layout + `bg-overlay-60` for overlay

**Answer:** A) `min-h-screen flex items-center justify-center text-center` for layout + a `<div class="absolute inset-0 bg-black/60">` for overlay

**Explanation:** Tailwind replaces the CSS layout with direct utility classes: `min-h-screen` = `min-height: 100vh`, `flex items-center justify-center` = flexbox centering, `text-center` = text alignment. For the overlay, instead of a `::before` pseudo-element (6 lines of CSS), Tailwind uses a real `<div>` with `absolute inset-0 bg-black/60`. The `/60` sets 60% opacity — no `rgba()` needed. Same visual result, dramatically less code.

---

## Self-Assessment

After completing the quiz, rate your understanding:

| Topic | Confident | Need Review | Lost |
|-------|-----------|-------------|------|
| Tailwind CSS CDN Setup | [ ] | [ ] | [ ] |
| Spacing Scale (4px base) | [ ] | [ ] | [ ] |
| Color Shades (50–950) | [ ] | [ ] | [ ] |
| Layout Utilities (flex, grid) | [ ] | [ ] | [ ] |
| State Modifiers (hover:, focus:) | [ ] | [ ] | [ ] |
| Responsive Prefixes (md:, lg:) | [ ] | [ ] | [ ] |
| Transition + Hover Pairing | [ ] | [ ] | [ ] |
| Container Pattern (max-w-7xl mx-auto) | [ ] | [ ] | [ ] |

If you marked "Need Review" or "Lost" on any topic, revisit the cheatsheet and lecture recording before the next class.
