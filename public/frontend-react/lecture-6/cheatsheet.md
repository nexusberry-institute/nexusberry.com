# Tailwind CSS Basics Cheatsheet

Quick reference for all Tailwind CSS utility classes covered in Lecture 6.

---

## Tailwind CSS 4 CDN Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-slate-950 text-gray-100">
    <!-- Your content here -->
</body>
</html>
```

**One script tag. No npm. No config. That's it.**

---

## Spacing Scale (4px Base)

Every spacing value is a multiple of 4px: **number × 4 = pixels**.

| Class | Value | Pixels |
|-------|-------|--------|
| `p-0` | `0` | 0px |
| `p-1` | `0.25rem` | 4px |
| `p-2` | `0.5rem` | 8px |
| `p-3` | `0.75rem` | 12px |
| `p-4` | `1rem` | 16px |
| `p-5` | `1.25rem` | 20px |
| `p-6` | `1.5rem` | 24px |
| `p-8` | `2rem` | 32px |
| `p-10` | `2.5rem` | 40px |
| `p-12` | `3rem` | 48px |
| `p-16` | `4rem` | 64px |
| `p-20` | `5rem` | 80px |

### Spacing Directions

| Prefix | Direction | CSS Property |
|--------|-----------|--------------|
| `p-*` | All sides | `padding` |
| `px-*` | Left + Right | `padding-left` + `padding-right` |
| `py-*` | Top + Bottom | `padding-top` + `padding-bottom` |
| `pt-*` | Top only | `padding-top` |
| `pb-*` | Bottom only | `padding-bottom` |
| `pl-*` | Left only | `padding-left` |
| `pr-*` | Right only | `padding-right` |

Same pattern for margin: `m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*`, `ml-*`, `mr-*`

**Pro Tip**: Quick math — `p-6` = 6 × 4 = 24px = 1.5rem. Works for every spacing utility.

---

## Layout Utilities

### Flexbox

```html
<!-- Horizontal row, items spread apart, vertically centered -->
<div class="flex justify-between items-center">...</div>

<!-- Vertical column with gap -->
<div class="flex flex-col gap-4">...</div>

<!-- Center everything -->
<div class="flex items-center justify-center">...</div>
```

| Class | CSS | Use |
|-------|-----|-----|
| `flex` | `display: flex` | Create flex container |
| `flex-col` | `flex-direction: column` | Vertical stacking |
| `flex-row` | `flex-direction: row` | Horizontal (default) |
| `justify-between` | `justify-content: space-between` | Push to edges |
| `justify-center` | `justify-content: center` | Center horizontally |
| `items-center` | `align-items: center` | Center vertically |
| `gap-*` | `gap: *` | Space between children |
| `flex-1` | `flex: 1 1 0%` | Fill remaining space |
| `shrink-0` | `flex-shrink: 0` | Never shrink |

### Grid

```html
<!-- Responsive grid: 1 col → 2 cols → 3 cols -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">...</div>
```

| Class | CSS |
|-------|-----|
| `grid` | `display: grid` |
| `grid-cols-1` | `grid-template-columns: repeat(1, 1fr)` |
| `grid-cols-2` | `grid-template-columns: repeat(2, 1fr)` |
| `grid-cols-3` | `grid-template-columns: repeat(3, 1fr)` |
| `col-span-2` | `grid-column: span 2` |
| `gap-*` | `gap: *` |

### Sizing

| Class | CSS | Common Use |
|-------|-----|------------|
| `w-full` | `width: 100%` | Full parent width |
| `h-screen` | `height: 100vh` | Full viewport height |
| `min-h-screen` | `min-height: 100vh` | At least full viewport |
| `max-w-7xl` | `max-width: 80rem` | Container max width |
| `w-12` | `width: 3rem` | Fixed width (48px) |
| `h-56` | `height: 14rem` | Fixed height (224px) |

### Container Pattern

```html
<!-- Standard centered container (use on every section) -->
<div class="max-w-7xl mx-auto px-6">...</div>
```

---

## Typography

```html
<h1 class="text-5xl font-bold tracking-tight leading-tight">Heading</h1>
<p class="text-lg text-gray-400 leading-relaxed">Body text</p>
<span class="text-sm uppercase tracking-widest">Label</span>
```

### Font Sizes

| Class | Size |
|-------|------|
| `text-xs` | 0.75rem (12px) |
| `text-sm` | 0.875rem (14px) |
| `text-base` | 1rem (16px) |
| `text-lg` | 1.125rem (18px) |
| `text-xl` | 1.25rem (20px) |
| `text-2xl` | 1.5rem (24px) |
| `text-3xl` | 1.875rem (30px) |
| `text-4xl` | 2.25rem (36px) |
| `text-5xl` | 3rem (48px) |
| `text-7xl` | 4.5rem (72px) |

### Font Weight

| Class | Weight |
|-------|--------|
| `font-light` | 300 |
| `font-normal` | 400 |
| `font-medium` | 500 |
| `font-semibold` | 600 |
| `font-bold` | 700 |

### Other Typography

| Class | CSS |
|-------|-----|
| `leading-relaxed` | `line-height: 1.625` |
| `leading-tight` | `line-height: 1.25` |
| `tracking-wide` | `letter-spacing: 0.025em` |
| `tracking-widest` | `letter-spacing: 0.1em` |
| `tracking-tight` | `letter-spacing: -0.025em` |
| `uppercase` | `text-transform: uppercase` |
| `text-center` | `text-align: center` |
| `italic` | `font-style: italic` |

---

## Color System

Every color has shades from **50** (lightest) to **950** (darkest).

```
50 → 100 → 200 → 300 → 400 → 500 → 600 → 700 → 800 → 900 → 950
lightest                      base                            darkest
```

### Common Colors Used in This Lecture

| Class | Use |
|-------|-----|
| `bg-slate-950` | Page background (near black) |
| `bg-slate-900` | Card/section background |
| `bg-slate-800` | Input background |
| `text-white` | Primary headings |
| `text-gray-100` | Body text |
| `text-gray-300` | Secondary text |
| `text-gray-400` | Muted text |
| `text-gray-500` | Placeholder/subtle text |
| `text-amber-500` | Accent/brand color |
| `bg-amber-500` | CTA buttons |
| `bg-amber-600` | Button hover |
| `border-amber-500` | Accent borders |

### Opacity Shorthand

```html
<!-- bg-black at 60% opacity -->
<div class="bg-black/60">...</div>

<!-- border at 30% opacity -->
<div class="border-amber-500/30">...</div>
```

The `/number` syntax sets opacity (0-100). Replaces `rgba()` from traditional CSS.

---

## Borders, Rounded Corners & Shadows

```html
<div class="border border-slate-700 rounded-xl shadow-lg">...</div>
```

| Class | CSS |
|-------|-----|
| `border` | `border-width: 1px` |
| `border-2` | `border-width: 2px` |
| `border-b` | `border-bottom-width: 1px` |
| `border-t` | `border-top-width: 1px` |
| `border-transparent` | `border-color: transparent` |
| `rounded` | `border-radius: 0.25rem` |
| `rounded-lg` | `border-radius: 0.5rem` |
| `rounded-xl` | `border-radius: 0.75rem` |
| `rounded-full` | `border-radius: 9999px` (circle) |
| `shadow-md` | Medium shadow |
| `shadow-lg` | Large shadow |
| `shadow-xl` | Extra-large shadow |

---

## State Modifiers

Tailwind uses **modifier:class** syntax to style interactive states.

```html
<!-- Hover: background changes + card lifts -->
<div class="hover:bg-slate-800 hover:-translate-y-2 transition duration-300">

<!-- Focus: ring appears around input -->
<input class="focus:ring-2 focus:ring-amber-500 focus:outline-none">

<!-- Active: scales down on click -->
<button class="active:scale-95">
```

| Modifier | Triggers When | CSS Equivalent |
|----------|---------------|----------------|
| `hover:` | Mouse over | `:hover` |
| `focus:` | Element focused | `:focus` |
| `active:` | Being clicked | `:active` |
| `group-hover:` | Parent with `group` class is hovered | `.group:hover .child` |

**Syntax**: `modifier:property-value` — colon separates modifier from class.

**Common mistake**: Using a dash instead of a colon: `hover-bg-blue-500` (wrong) → `hover:bg-blue-500` (correct)

---

## Transitions & Transforms

```html
<!-- Smooth hover effect -->
<div class="hover:-translate-y-2 hover:shadow-xl transition duration-300">

<!-- Transform + transition on image zoom -->
<img class="hover:scale-105 transition-transform duration-300">
```

### Transitions

| Class | CSS |
|-------|-----|
| `transition` | Transitions common properties (color, bg, border, shadow, transform) |
| `transition-all` | Transitions ALL properties |
| `transition-colors` | Transitions color properties only |
| `transition-transform` | Transitions transform only |
| `duration-200` | `transition-duration: 200ms` |
| `duration-300` | `transition-duration: 300ms` |
| `duration-500` | `transition-duration: 500ms` |
| `ease-in-out` | `transition-timing-function: ease-in-out` |

### Transforms

| Class | CSS |
|-------|-----|
| `-translate-y-2` | `transform: translateY(-0.5rem)` (lift 8px) |
| `-translate-y-1` | `transform: translateY(-0.25rem)` (lift 4px) |
| `scale-105` | `transform: scale(1.05)` |
| `scale-95` | `transform: scale(0.95)` |
| `rotate-45` | `transform: rotate(45deg)` |

---

## Responsive Prefixes

Base classes = mobile. Prefixed classes ADD rules for larger screens.

```html
<!-- 1 col on mobile, 2 on tablet, 3 on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

### Breakpoints

| Prefix | Min Width | Target Device |
|--------|-----------|---------------|
| *(none)* | 0px | Mobile (default) |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

### Common Responsive Patterns

```html
<!-- Responsive text size -->
<h1 class="text-3xl md:text-5xl lg:text-7xl">

<!-- Responsive visibility -->
<ul class="hidden md:flex">  <!-- Hidden on mobile, flex on tablet+ -->

<!-- Responsive flex direction -->
<form class="flex flex-col sm:flex-row gap-4">  <!-- Stack on mobile, row on larger -->

<!-- Responsive spacing -->
<section class="py-12 md:py-20">
```

**Key Rule**: Same mobile-first from Lecture 5 — base = mobile, prefixes ADD for larger. No `max-width` equivalent — always `min-width`.

---

## Positioning & Overlays

```html
<!-- Full-cover overlay pattern -->
<div class="relative">
    <img class="absolute inset-0 w-full h-full object-cover">
    <div class="absolute inset-0 bg-black/60"></div>
    <div class="relative z-10">Content above overlay</div>
</div>
```

| Class | CSS |
|-------|-----|
| `relative` | `position: relative` |
| `absolute` | `position: absolute` |
| `sticky` | `position: sticky` |
| `fixed` | `position: fixed` |
| `inset-0` | `top: 0; right: 0; bottom: 0; left: 0` |
| `top-0` | `top: 0` |
| `z-10` | `z-index: 10` |
| `z-50` | `z-index: 50` |

---

## Common Mistakes to Avoid

### 1. Missing Color Shade
```html
<!-- WRONG — no shade number -->
<div class="bg-blue text-gray">

<!-- CORRECT — always include shade -->
<div class="bg-blue-500 text-gray-400">
```

### 2. Wrong Modifier Syntax
```html
<!-- WRONG — dash instead of colon -->
<button class="hover-bg-blue-700">

<!-- CORRECT — colon separates modifier -->
<button class="hover:bg-blue-700">
```

### 3. Missing Transition with Hover Transform
```html
<!-- WRONG — hover jumps instantly -->
<div class="hover:-translate-y-2">

<!-- CORRECT — smooth animation -->
<div class="hover:-translate-y-2 transition duration-300">
```

### 4. Missing CDN Script Tag
```html
<!-- Without this, no Tailwind classes work! -->
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

---

## VS Code + Tailwind IntelliSense

### Extension Setup
Install: **Tailwind CSS IntelliSense** by Tailwind Labs

### Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Space` | Trigger Tailwind class autocomplete |
| `Ctrl + D` | Select next occurrence (rename classes) |
| `Alt + Up/Down` | Move line up/down |
| `Shift + Alt + Down` | Duplicate line (great for card repetition) |
| Hover over class | See generated CSS in tooltip |

---

## Quick Reference Table

| What you want | Tailwind classes |
|---------------|-----------------|
| Dark page background | `bg-slate-950 text-gray-100` |
| Centered container | `max-w-7xl mx-auto px-6` |
| Sticky nav | `sticky top-0 z-50 bg-slate-900` |
| Full-screen hero | `min-h-screen flex items-center justify-center` |
| Dark overlay | `absolute inset-0 bg-black/60` |
| CTA button | `bg-amber-500 text-black font-bold py-3 px-8 rounded-lg` |
| Button hover | `hover:bg-amber-600 hover:-translate-y-0.5 transition duration-300` |
| Responsive grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` |
| Card with hover | `bg-slate-900 rounded-xl p-8 hover:-translate-y-2 transition duration-300` |
| Image zoom | `overflow-hidden rounded-xl` + `hover:scale-105 transition-transform duration-300` |
| Form input | `bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500` |
| Hidden on mobile | `hidden md:flex` |

---

## What's Next?

In **Lecture 7: Advanced Tailwind & Customization**, you'll learn:
- Custom theme configuration (`@theme` directive)
- Your own brand colors and spacing scale
- Component extraction with `@apply`
- Building a complete Restaurant Digital Menu
- Moving from CDN to production build tools

> *"Today you used Tailwind's defaults. Next, you make Tailwind YOUR tool — custom colors, custom spacing, reusable components."*

---

*Keep this cheatsheet handy while working on your assignment!*
