# Assignment: Branded Restaurant Website

## Overview
Build a fully responsive, branded restaurant website using Tailwind CSS customization techniques — `@theme` for custom design tokens, `@apply` for reusable components, custom Google Fonts, and gradient backgrounds. This assignment tests everything covered in Lecture 7.

---

## Requirements

Your restaurant website must include:

### 1. Custom Theme (`@theme`)
- Define at least **5 custom brand colors** using the `@theme` directive (e.g., primary, secondary, background, text, accent)
- Use **semantic naming** (e.g., `--color-primary`, `--color-accent`) — not color-based names
- All colors must be used in the HTML via generated Tailwind utilities (`bg-primary`, `text-accent`, etc.)

### 2. Custom Fonts
- Include **2 Google Fonts** via `<link>` tags (one display/heading font, one body font)
- Register both fonts in `@theme` using `--font-display` and `--font-body`
- Apply `font-body` to the body and `font-display` to all headings

### 3. Component Extraction (`@apply`)
- Extract at least **4 reusable component classes** using `@apply`
- Suggestions: `.nav-link`, `.menu-card`, `.btn-primary`, `.badge`, `.section-title`
- At least one must include a **hover: modifier** inside `@apply`
- At least one should use the **base + variant pattern** (e.g., `.badge` base class → `.badge-spicy`, `.badge-veg` variants)
  - **Important**: In Tailwind v4, `@apply` CANNOT reference custom classes, only Tailwind utilities
  - Define `.badge` with base styles, then separate variant classes (`.badge-spicy`, `.badge-veg`) with color styles
  - In HTML, use BOTH classes together: `<span class="badge badge-spicy">Spicy</span>`

### 4. Required Sections

| Section | Requirement |
|---------|-------------|
| **Navigation** | Sticky, logo + links, responsive (`hidden md:flex`), backdrop blur optional |
| **Hero** | Gradient background using custom brand colors, centered heading + CTA button |
| **Menu Section(s)** | At least 2 menu sections (e.g., Starters + Mains) with card grids |
| **Menu Cards** | Image, item name, description, price, badge(s) — using `@apply` component |
| **CTA / Reservation** | Call-to-action section with gradient background, two buttons (primary + outline) |
| **Footer** | Multi-column (2-3 cols) with restaurant info, hours, contact |

### 5. Technical Requirements
- Tailwind CSS 4 CDN: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- `<style type="text/tailwindcss">` block with `@theme` and `@apply`
- At least **1 gradient section** (`bg-gradient-to-*` with `from-*`, `to-*`)
- Responsive layout using `md:` and `lg:` prefixes on multiple elements
- Semantic HTML (`<nav>`, `<section>`, `<footer>`, `<main>`)
- Proper `alt` text on all images

---

## Important: Create YOUR Own Restaurant

Do **NOT** copy the "Savory Bites" example from class. Create your own:
- **Restaurant name** (e.g., "Spice Route", "The Karachi Table", "Café Rosemary")
- **Cuisine type** (e.g., BBQ, Seafood, Italian, Chinese-Pakistani fusion)
- **Color scheme** (different from the class example's maroon/sage/cream)
- **Menu items** (your own dishes with descriptions and PKR prices)

---

## Example Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Restaurant Name | Digital Menu</title>
    <!-- Google Fonts links -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
        @theme {
            --color-primary: #YOUR_HEX;
            --color-secondary: #YOUR_HEX;
            /* ...more colors... */
            --font-display: 'Your Font', serif;
            --font-body: 'Your Font', sans-serif;
        }

        /* @apply components */
        .nav-link { @apply ...; }
        .menu-card { @apply ...; }
        .btn-primary { @apply ...; }

        /* Badge base + variants (use BOTH classes in HTML) */
        .badge { @apply text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide; }
        .badge-spicy { @apply bg-red-100 text-red-700; }
        .badge-veg { @apply bg-green-100 text-green-700; }
    </style>
</head>
<body class="bg-YOUR_BG text-YOUR_TEXT font-body">
    <nav><!-- Sticky navigation --></nav>
    <section><!-- Hero with gradient --></section>
    <section><!-- Menu Section 1 --></section>
    <section><!-- Menu Section 2 --></section>
    <section><!-- CTA / Reservation --></section>
    <footer><!-- Footer --></footer>
</body>
</html>
```

---

## Resources

- **Placeholder images**: `https://picsum.photos/600/400` (change size; add `/id/NUMBER/` for specific images)
- **Google Fonts**: https://fonts.google.com (browse and pick 2 fonts)
- **Color palette generator**: https://coolors.co (create your brand palette)
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lecture cheatsheet**: `cheatsheet.md`
- **Lecture code**: `code/index.html` (reference implementation — do NOT copy directly)

---

## Submission Instructions

1. Create a single `index.html` file (all HTML, CSS in one file)
2. Test at multiple screen sizes: 375px, 768px, 1024px, 1440px
3. Verify custom colors work (your brand palette, not default Tailwind colors)
4. Verify Google Fonts load (check that headings use your display font)
5. Verify `@apply` components render correctly
6. Upload to Google Classroom before the next lecture

---

## Pre-Submission Checklist

Before submitting, verify:

- [ ] Tailwind CDN script tag is present and working
- [ ] `<style type="text/tailwindcss">` used (NOT regular `<style>`)
- [ ] `@theme` has at least 5 custom color tokens with `--color-*` prefix
- [ ] 2 Google Fonts loaded via `<link>` tags and registered in `@theme`
- [ ] At least 4 `@apply` component classes extracted
- [ ] At least 1 `@apply` class includes `hover:` modifier
- [ ] Navigation is sticky and responsive
- [ ] Hero has gradient background using custom colors
- [ ] Menu cards use `@apply` component class
- [ ] Badge system with base + variant pattern (HTML uses BOTH classes: `badge badge-spicy`)
- [ ] CTA section has primary + outline buttons
- [ ] Footer has multi-column responsive layout
- [ ] Responsive prefixes (`md:`, `lg:`) used on multiple elements
- [ ] All images have descriptive `alt` text
- [ ] Restaurant is YOUR OWN concept (not Savory Bites)

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| `@theme` custom colors (5+ brand colors, semantic naming) | 15 |
| `@theme` custom fonts (2 Google Fonts, display + body) | 10 |
| `@apply` component extraction (4+ classes, hover modifier, base+variant) | 15 |
| Gradient section(s) (`bg-gradient-to-*` with custom colors) | 5 |
| Responsive layout (`md:`, `lg:` prefixes on multiple elements) | 15 |
| Menu card design and content (image, name, description, price) | 10 |
| Badge/tag system (base + at least 2 variants) | 5 |
| Semantic HTML + accessibility (proper elements, alt text) | 10 |
| Visual design quality (typography, spacing, brand consistency) | 10 |
| Creative addition (dark mode prep, animations, unique sections, special features) | 5 |
| **Total** | **100** |

---

## Tips for Success

1. **Start with your palette** — Pick 5-7 colors on https://coolors.co before writing any code
2. **Choose fonts first** — Browse Google Fonts and pick a display + body pair that matches your cuisine
3. **Build structure, then style** — Get all sections in HTML first, then add `@theme` and `@apply`
4. **Use the cheatsheet** — Keep `cheatsheet.md` open while building
5. **Test `@theme` early** — Verify `bg-primary` works before building the full page

---

## Common Mistakes to Avoid

- Using `<style>` instead of `<style type="text/tailwindcss">` (nothing works!)
- Missing `--` prefix on `@theme` variables (`color-brand` won't work, needs `--color-brand`)
- Using wrong namespace (`--brand` instead of `--color-brand` — utilities won't generate)
- Over-extracting with `@apply` (don't create `.big-text { @apply text-xl; }`)
- **Badge composition error**: Writing `.badge-spicy { @apply badge bg-red-100; }` won't work in Tailwind v4
  - Correct: Define base `.badge` and variant `.badge-spicy` separately, use both classes in HTML
- Copying Savory Bites directly — create your OWN restaurant concept
- Forgetting Google Fonts `<link>` tags (fonts fall back to system defaults)

---

## Creative Addition Ideas (5 bonus points)

- Dark mode preparation: Add `dark:` variants to key elements
- Gradient text effect: `bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`
- Frosted glass navigation: `bg-white/90 backdrop-blur-md`
- Ring effects on buttons: `ring-2 ring-primary ring-offset-2`
- Special "Chef's Pick" featured item spanning 2 columns
- Animated hover badges or card effects
- Scroll-smooth navigation: `scroll-smooth` on `<html>`

---

## Need Help?

- Review the lecture recording
- Check the `cheatsheet.md` file for quick reference
- Look at `code/index.html` for a reference implementation (use for learning, not copying)
- Post questions in the Google Classroom comments
- Attend office hours (schedule TBA)

You've mastered Tailwind customization — custom colors, fonts, gradients, and reusable components. Now build a restaurant brand that's uniquely yours!
