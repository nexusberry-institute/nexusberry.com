# Assignment: Tailwind Landing Page

## Overview
Build a fully responsive, multi-section landing page using **only Tailwind CSS utility classes** — zero custom CSS. This assignment tests everything covered in Lecture 6: Tailwind CSS setup, utility classes, state modifiers, and responsive prefixes.

---

## Requirements

Your Tailwind landing page must include:

### 1. Tailwind CSS Setup
- Use the Tailwind CSS 4 CDN: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- Include the viewport meta tag
- Set a dark background on `<body>` using Tailwind classes (e.g., `bg-slate-950 text-gray-100`)

### 2. Required Sections

| Section | Requirement |
|---------|-------------|
| **Sticky Navigation** | Logo + links using `flex`, `sticky top-0`, links hidden on mobile (`hidden md:flex`) |
| **Hero Section** | Full-height (`min-h-screen`), background image with dark overlay (`bg-black/60`), centered heading + CTA button |
| **Card Grid** | At least 3 cards in a responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), each card with hover effect |
| **Additional Section** | Testimonials, features, stats, or any content section with responsive layout |
| **CTA / Newsletter** | Call-to-action with heading, description, and email form (`flex-col sm:flex-row`) |
| **Footer** | Copyright text with accent border (`border-t border-amber-500/30`) |

### 3. Technical Requirements
- **Zero custom CSS** — all styling must use Tailwind utility classes only
- At least **3 different hover: interactions** (e.g., color change, translate, scale, border change)
- At least **2 responsive prefixes** (`md:` and `lg:`) used on multiple elements
- Use the **container pattern** (`max-w-7xl mx-auto px-6`) on all sections
- Semantic HTML elements (`<nav>`, `<section>`, `<footer>`, etc.)
- Proper `alt` text on all images

---

## Example Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Landing Page</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-slate-950 text-gray-100">
    <nav class="sticky top-0 z-50 bg-slate-900 ...">
        <!-- Navigation content -->
    </nav>
    <section class="relative min-h-screen ...">
        <!-- Hero with overlay -->
    </section>
    <section class="py-20 px-6">
        <!-- Card grid -->
    </section>
    <section>
        <!-- Additional section -->
    </section>
    <section>
        <!-- CTA / Newsletter -->
    </section>
    <footer>
        <!-- Footer -->
    </footer>
</body>
</html>
```

---

## Resources

- **Placeholder images**: `https://picsum.photos/600/400` (change size and add `/id/NUMBER/` for specific images)
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lecture cheatsheet**: `cheatsheet.md`
- **Lecture code**: `code/index.html` (reference implementation)
- **Color reference**: Tailwind uses shades 50-950 (e.g., `bg-slate-900`, `text-amber-500`)

---

## Submission Instructions

1. Create a single `index.html` file with all HTML (no separate CSS file needed!)
2. Test at multiple screen sizes: 375px, 768px, 1024px, 1440px
3. Verify all hover effects work smoothly
4. Open in Chrome to verify the Tailwind CDN loads
5. Upload to Google Classroom before the next lecture

---

## Pre-Submission Checklist

Before submitting, verify:

- [ ] Tailwind CDN script tag is present and working
- [ ] `<meta name="viewport">` tag is included
- [ ] Navigation is sticky and responsive (links hidden on mobile, visible on tablet+)
- [ ] Hero section is full-height with background image and dark overlay
- [ ] Card grid is responsive (1 → 2 → 3 columns)
- [ ] At least 3 hover effects work with smooth transitions
- [ ] Responsive prefixes (`md:`, `lg:`) used on multiple elements
- [ ] Container pattern (`max-w-7xl mx-auto px-6`) used on sections
- [ ] CTA/newsletter form stacks on mobile, row on larger screens
- [ ] Footer has accent border
- [ ] Zero custom CSS — no `<style>` tag in the document
- [ ] All images have descriptive `alt` text

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Tailwind CSS CDN setup (correct script tag, viewport meta) | 5 |
| Navigation (flex, sticky, responsive show/hide) | 10 |
| Hero section (full-height, overlay, centered CTA) | 15 |
| Card grid (responsive 1 → 2 → 3 cols, card structure) | 15 |
| Typography utilities (sizes, weights, spacing, alignment) | 10 |
| Color usage (backgrounds, text, borders, shade variety) | 5 |
| Hover effects (at least 3 hover: interactions with transitions) | 10 |
| Responsive prefixes (md:, lg: on multiple elements) | 15 |
| Semantic HTML structure (nav, section, footer, headings) | 5 |
| Creative addition (gradients, animations, extra section, unique design) | 10 |
| **Total** | **100** |

---

## Tips for Success

1. **Start with the structure** — get all sections in HTML first, then add Tailwind classes
2. **Use the cheatsheet** — keep `cheatsheet.md` open while building
3. **Test responsive as you go** — use Chrome DevTools Device Toolbar after adding each section
4. **Copy the patterns** — `max-w-7xl mx-auto px-6` for containers, `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` for grids
5. **Don't forget transitions** — always pair `hover:` transforms with `transition duration-300`

---

## Common Mistakes to Avoid

- Forgetting the Tailwind CDN script tag (nothing works without it!)
- Missing the shade number: `bg-blue` (wrong) → `bg-blue-500` (correct)
- Using a dash instead of colon for modifiers: `hover-bg-blue-700` → `hover:bg-blue-700`
- Missing `transition` with hover effects (causes instant jump instead of smooth animation)
- Adding a `<style>` tag — this assignment requires pure Tailwind classes, no custom CSS
- Using `w-screen` instead of `w-full` (can cause horizontal scrollbar)

---

## Creative Addition Ideas (10 bonus points)

- Gradient text: `bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent`
- Animated hover cards with `group` and `group-hover:` modifiers
- Ring effects on buttons: `ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950`
- Stats section with large numbers and descriptions
- Image gallery with grid layout and hover zoom
- Scroll-smooth navigation: add `scroll-smooth` to `<html>` tag
- Additional section (FAQ, pricing table, team members)

---

## Need Help?

- Review the lecture recording
- Check the `cheatsheet.md` file for quick reference
- Look at `code/index.html` for a complete reference implementation
- Post questions in the Google Classroom comments
- Attend office hours (schedule TBA)

You've learned the utility-first workflow — no more writing CSS rules, just composing with class names. Show us what you can build with Tailwind!
