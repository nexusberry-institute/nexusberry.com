# Assignment: Responsive Luxury Showcase

## Overview
Build a fully responsive, multi-section luxury website using CSS custom properties, mobile-first media queries, transitions, and responsive images. This assignment tests everything covered in Lecture 5: Advanced CSS & Responsive Design.

---

## Requirements

Your luxury showcase website must include:

### 1. CSS Custom Properties
- Define at least **8 CSS variables** in `:root`
- Must include: colors, spacing, typography sizes, and transition values
- Use variables consistently throughout all sections (no hardcoded colors or repeated values)

### 2. Responsive Layout (Mobile-First)
- Base CSS targets **mobile** (single-column)
- At least **2 breakpoints** using `min-width` media queries (e.g., 768px and 1024px)
- Layouts must adapt: 1 column (mobile) → 2 columns (tablet) → 3+ columns (desktop)

### 3. Required Sections

| Section | Requirement |
|---------|-------------|
| **Sticky Navigation** | Logo + links, `position: sticky`, links hidden on mobile, visible on tablet+ |
| **Hero Section** | Full-width background image with gradient overlay (`::before`), centered heading + CTA button |
| **Card Grid** | At least 3 cards, responsive grid (1→2→3 columns), each card with an image |
| **Feature/Info Section** | At least 3 feature items in a responsive grid |
| **Contact Section** | Contact info + form, stacked on mobile, side-by-side on tablet+ |
| **Footer** | Copyright text with accent border |

### 4. Technical Requirements
- `box-sizing: border-box` universal reset
- Responsive typography using `clamp()` or media queries
- CSS transitions on at least 2 hover interactions
- Responsive images using `object-fit: cover`
- Semantic HTML elements (`<nav>`, `<section>`, `<footer>`, etc.)
- `<meta name="viewport">` tag included

---

## Example Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Luxury Brand</title>
    <style>
        :root {
            --color-primary: #yourcolor;
            --color-bg: #yourcolor;
            /* ... at least 8 variables ... */
        }

        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        /* Mobile-first base styles */
        /* ... */

        @media (min-width: 768px) {
            /* Tablet enhancements */
        }

        @media (min-width: 1024px) {
            /* Desktop enhancements */
        }
    </style>
</head>
<body>
    <nav><!-- Sticky navigation --></nav>
    <section><!-- Hero with overlay --></section>
    <section><!-- Card grid --></section>
    <section><!-- Features --></section>
    <section><!-- Contact --></section>
    <footer><!-- Footer --></footer>
</body>
</html>
```

---

## Resources

- **Placeholder images**: `https://picsum.photos/600/400` (use different sizes and IDs)
- **CSS Variables**: [MDN - Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- **Media Queries**: [MDN - Using Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)
- **clamp()**: [MDN - clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- **Transitions**: [MDN - transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)
- **Lecture cheatsheet**: `cheatsheet.md`

---

## Submission Instructions

1. Create a single `index.html` file with all HTML and CSS (internal stylesheet)
2. Test at multiple screen sizes: 320px, 768px, 1024px, 1440px
3. Verify all hover effects work smoothly
4. Upload to Google Classroom before the next lecture

---

## Pre-Submission Checklist

Before submitting, verify:

- [ ] At least 8 CSS variables defined in `:root`
- [ ] `box-sizing: border-box` reset applied universally
- [ ] `<meta name="viewport">` tag is present
- [ ] Navigation is sticky and responsive (hidden links on mobile)
- [ ] Hero has background image with gradient overlay
- [ ] Card grid is responsive (1→2→3 columns)
- [ ] At least 2 hover transitions work smoothly
- [ ] Images use `object-fit: cover` and don't distort
- [ ] All media queries use `min-width` (mobile-first)
- [ ] Footer has an accent border
- [ ] Page looks good at 320px, 768px, and 1024px+
- [ ] No hardcoded colors outside of `:root` variables

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| CSS Custom Properties (8+ variables, consistent use) | 15 |
| Mobile-first media queries (2+ breakpoints, `min-width`) | 20 |
| Sticky navigation (responsive show/hide) | 5 |
| Hero section with image overlay (`::before` + gradient) | 10 |
| Responsive card grid (1→3 columns with images) | 10 |
| CSS Transitions on hover (at least 2 interactions) | 10 |
| Responsive images (`object-fit: cover`) | 5 |
| Responsive typography (`clamp()` or media queries) | 5 |
| Semantic HTML (`nav`, `section`, `footer`, etc.) | 5 |
| `box-sizing: border-box` universal reset | 5 |
| Creative addition (animation, custom fonts, extra section, etc.) | 10 |
| **Total** | **100** |

---

## Tips for Success

1. **Start mobile-first** — write all your base CSS for a 320px viewport, then add media queries
2. **Define variables early** — set up your `:root` block before writing any section styles
3. **Test as you build** — use Chrome DevTools responsive mode after every section
4. **Be specific with transitions** — use `transition: transform 0.3s ease` not `transition: all`
5. **Use the lecture code as reference** — the `code/index.html` from today's lecture follows the exact pattern

---

## Common Mistakes to Avoid

- Using `max-width` instead of `min-width` in media queries (that's desktop-first, not mobile-first!)
- Forgetting `<meta name="viewport">` (responsive design completely breaks)
- Misspelling CSS variable names (they fail silently — no error!)
- Putting `transition` only on `:hover` (the un-hover won't animate)
- Using `transition: all` instead of specific properties (performance issue)
- Forgetting `overflow: hidden` on image containers with `scale()` hover effects

---

## Creative Addition Ideas (10 bonus points)

- CSS `@keyframes` animation on the hero heading (fade-in, slide-up)
- Dark/light theme toggle using CSS variables and a class swap
- `scroll-behavior: smooth` for anchor links
- Custom Google Fonts for a premium feel
- Additional section (testimonials, stats, gallery)
- Gradient text effects using `background-clip: text`

---

## Need Help?

- Review the lecture recording
- Check the `cheatsheet.md` file for quick reference
- Post questions in the Google Classroom comments
- Attend office hours (schedule TBA)

You've learned CSS variables, media queries, transitions, and responsive images — now combine them all into one premium website. Show us what you can build!
