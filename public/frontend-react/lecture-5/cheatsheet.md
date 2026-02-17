# Advanced CSS & Responsive Design Cheatsheet

Quick reference for all responsive design concepts covered in Lecture 5.

---

## CSS Custom Properties (Variables)

Define once in `:root`, use everywhere with `var()`.

```css
/* Declare variables */
:root {
    --color-primary: #C9A84C;
    --space-md: 1.5rem;
    --text-xl: clamp(1.5rem, 4vw, 2rem);
}

/* Use variables */
h1 {
    color: var(--color-primary);
    margin-bottom: var(--space-md);
    font-size: var(--text-xl);
}

/* With fallback value */
p {
    color: var(--color-primary, #FFD700);
}
```

| Concept | Syntax | Example |
|---------|--------|---------|
| Declare | `--name: value;` | `--color-bg: #0A0A0A;` |
| Use | `var(--name)` | `background: var(--color-bg);` |
| Fallback | `var(--name, fallback)` | `color: var(--color-bg, black);` |
| Scope | `:root { }` | Available everywhere on the page |

**Pro Tip**: Name variables by purpose, not value: `--color-primary` not `--gold-color`. If you rebrand, the name still makes sense.

---

## Responsive Units

| Unit | Relative To | Best For | Example |
|------|-------------|----------|---------|
| `px` | Nothing (absolute) | Borders, shadows | `border: 1px solid;` |
| `rem` | Root font size (16px default) | Font sizes, spacing, margins | `padding: 1.5rem;` (= 24px) |
| `em` | Parent font size | Nested scaling (rarely used) | `margin: 0.5em;` |
| `vw` | 1% of viewport width | Full-width elements, fluid sizing | `width: 50vw;` |
| `vh` | 1% of viewport height | Full-screen sections | `min-height: 100vh;` |
| `%` | Parent element | Fluid widths | `width: 50%;` |

### rem Quick Reference

| rem | Pixels (at 16px base) |
|-----|----------------------|
| `0.5rem` | 8px |
| `1rem` | 16px |
| `1.5rem` | 24px |
| `2rem` | 32px |
| `3rem` | 48px |
| `4rem` | 64px |

---

## The `clamp()` Function

Fluid sizing: `clamp(minimum, preferred, maximum)`

```css
/* Font scales smoothly between 2rem and 3.5rem based on viewport */
h1 {
    font-size: clamp(2rem, 6vw, 3.5rem);
}

/* Padding scales with viewport */
section {
    padding: clamp(1rem, 4vw, 3rem);
}
```

**How it works:**
- **Minimum**: Never go smaller than this (e.g., `2rem`)
- **Preferred**: Use this value (scales with viewport, e.g., `6vw`)
- **Maximum**: Never go bigger than this (e.g., `3.5rem`)

---

## Media Queries (Mobile-First)

Base CSS targets mobile. Use `min-width` to enhance for larger screens.

```css
/* Base: Mobile (0px and up) */
.grid {
    grid-template-columns: 1fr;
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Wide (1280px and up) */
@media (min-width: 1280px) {
    .grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

### Syntax Breakdown

```
@media (min-width: 768px) { ... }
  ^       ^          ^
  |       |          |
  rule    condition  breakpoint value
```

### Standard Breakpoints

| Breakpoint | Target | Use Case |
|------------|--------|----------|
| `768px` | Tablet | Show navigation, 2-column layouts |
| `1024px` | Desktop | 3+ columns, sidebar layouts |
| `1280px` | Wide | 4 columns, extra spacing |

**Key Rule**: Mobile-first = `min-width`. Desktop-first = `max-width`. Pick `min-width`.

---

## CSS Transitions

Smooth animation between property states.

```css
/* Declare on base state */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Change happens on hover */
.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}
```

### Syntax

```
transition: property duration timing-function delay;
transition: transform 0.3s   ease           0s;
```

| Part | Values | Default |
|------|--------|---------|
| Property | `transform`, `opacity`, `color`, `background-color`, etc. | `all` |
| Duration | `0.2s`, `0.3s`, `300ms` | `0s` |
| Timing | `ease`, `ease-in`, `ease-out`, `ease-in-out`, `linear` | `ease` |
| Delay | `0s`, `0.1s` | `0s` |

**Performance Rule**: Only animate `transform` and `opacity`. These are GPU-accelerated. Avoid animating `width`, `height`, `margin`, `padding`.

---

## CSS Transform Functions

```css
/* Move */
transform: translateY(-8px);     /* Move up 8px */
transform: translateX(10px);     /* Move right 10px */

/* Scale */
transform: scale(1.05);          /* 105% size */
transform: scale(0.95);          /* 95% size */

/* Rotate */
transform: rotate(45deg);        /* Rotate 45 degrees */

/* Combine multiple transforms */
transform: translateY(-10px) scale(1.02);
```

| Function | Effect | Common Use |
|----------|--------|------------|
| `translateY(-N)` | Move up | Card hover lift |
| `translateX(N)` | Move right | Slide animations |
| `scale(N)` | Zoom in/out | Image hover zoom |
| `rotate(Ndeg)` | Spin | Icon animations |

---

## Responsive Images

```css
/* Basic responsive image */
img {
    max-width: 100%;
    height: auto;
}

/* Fill container (crop to fit) */
.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Zoom on hover (contained) */
.image-container {
    overflow: hidden;
}

.image-container img {
    transition: transform 0.3s ease;
}

.image-container:hover img {
    transform: scale(1.05);
}
```

| Property | Effect |
|----------|--------|
| `max-width: 100%` | Never wider than parent |
| `object-fit: cover` | Fill and crop (no distortion) |
| `object-fit: contain` | Fit inside (may have gaps) |
| `overflow: hidden` | Clip zoomed/overflowing content |

---

## `position: sticky`

Sticks an element when it reaches a scroll threshold.

```css
.nav {
    position: sticky;
    top: 0;
    z-index: 100;
}
```

**Requirements:**
- Must set `top`, `bottom`, `left`, or `right`
- Parent must NOT have `overflow: hidden`
- Works within the parent's scroll context

---

## The `::before` Pseudo-Element (Overlays)

```css
.hero {
    position: relative;
    background: url('image.jpg') center / cover;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4));
}

.hero-content {
    position: relative;  /* Above the overlay */
    z-index: 1;
}
```

---

## Common Mistakes to Avoid

### 1. Misspelled Variable Name
```css
/* WRONG — fails silently! No error message. */
color: var(--color-primry);

/* CORRECT */
color: var(--color-primary);

/* SAFER — use fallback */
color: var(--color-primary, #C9A84C);
```

### 2. max-width in Mobile-First Code
```css
/* WRONG — this is desktop-first */
@media (max-width: 768px) { ... }

/* CORRECT — mobile-first uses min-width */
@media (min-width: 768px) { ... }
```

### 3. Missing Viewport Meta Tag
```html
<!-- REQUIRED for responsive design -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 4. Transition on Hover Only
```css
/* WRONG — only animates on hover-in, not hover-out */
.card:hover {
    transition: transform 0.3s ease;
    transform: translateY(-8px);
}

/* CORRECT — transition on base state */
.card {
    transition: transform 0.3s ease;
}
.card:hover {
    transform: translateY(-8px);
}
```

### 5. Using `transition: all`
```css
/* AVOID — transitions every property change */
.card { transition: all 0.3s ease; }

/* BETTER — specific properties only */
.card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
```

---

## VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Space` | CSS property autocomplete |
| `Ctrl + /` | Toggle comment |
| `Ctrl + D` | Select next occurrence (great for renaming variables) |
| `Alt + Up/Down` | Move line up/down |
| `Shift + Alt + Down` | Duplicate line |
| `Ctrl + Shift + P` → "Wrap" | Wrap selection in tag/element |
| Type `mt` + Tab | Emmet: `margin-top: ;` |
| Type `mb` + Tab | Emmet: `margin-bottom: ;` |
| Type `trf` + Tab | Emmet: `transform: ;` |
| Type `trs` + Tab | Emmet: `transition: ;` |

---

## Chrome DevTools Responsive Mode

### Opening Responsive Mode
1. Open DevTools (`F12` or `Ctrl + Shift + I`)
2. Click the **Device Toolbar** icon (phone/tablet icon) or press `Ctrl + Shift + M`
3. Select device presets (iPhone SE, iPad, etc.) or drag the viewport handles

### Testing Workflow
1. Start at **320px** width (smallest phones)
2. Slowly drag wider — watch for layout breaks
3. Check at **375px** (iPhone), **768px** (iPad), **1024px** (laptop), **1440px** (desktop)
4. Verify nothing is cut off, overlapping, or unreadable at each size

### Debugging Media Queries
- Add `background: red !important;` inside a media query to see exactly when it activates
- Check the **Computed** tab to see which styles are currently applied
- Look for the media query badges in the **Styles** panel

---

## Quick Reference Table

| What you want | How to do it |
|---------------|--------------|
| Reusable colors/spacing | CSS variables in `:root` |
| Fluid font sizes | `clamp(min, preferred, max)` |
| Scalable spacing | `rem` units |
| Full-height sections | `min-height: 100vh` |
| Mobile-first responsive | `@media (min-width: 768px)` |
| Sticky navigation | `position: sticky; top: 0;` |
| Image overlay | `::before` pseudo-element |
| Smooth hover effects | `transition` + `transform` |
| Responsive images | `object-fit: cover` |
| Image zoom contained | `overflow: hidden` + `scale()` |
| Centered container | `max-width: 1200px; margin: 0 auto;` |

---

## What's Next?

In **Lecture 6: Landing Page Components**, you'll learn:
- **Tailwind CSS** — utility-first CSS framework
- Building components with just class names
- No more writing custom CSS rules
- Rapid UI development workflow

> *"You wrote a LOT of CSS today. What if there's a framework that does all this with just class names? Meet Tailwind CSS."*

---

*Keep this cheatsheet handy while working on your assignment!*
