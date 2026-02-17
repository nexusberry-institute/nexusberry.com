# Advanced Tailwind & Customization Cheatsheet

Quick reference for all Tailwind CSS customization techniques covered in Lecture 7.

---

## `@theme` Directive — Custom Design Tokens

The `@theme` directive lets you define custom colors, fonts, and spacing that automatically generate Tailwind utility classes.

### Setup (CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">
    @theme {
        --color-brand: #8B1A1A;
        --color-sage: #7C9070;
        --color-cream: #FFF8F0;
        --font-display: 'Playfair Display', serif;
        --font-body: 'Inter', sans-serif;
    }
</style>
```

**Critical:** The `<style>` tag MUST have `type="text/tailwindcss"` for `@theme` and `@apply` to work with the CDN.

### Namespace System

| `@theme` Variable | Generated Utilities | Example |
|--------------------|--------------------|---------|
| `--color-brand: #8B1A1A` | `bg-brand`, `text-brand`, `border-brand`, `ring-brand`, `shadow-brand` | `<div class="bg-brand text-cream">` |
| `--color-sage: #7C9070` | `bg-sage`, `text-sage`, `border-sage`, `ring-sage` | `<span class="text-sage">` |
| `--font-display: ...` | `font-display` | `<h1 class="font-display">` |
| `--font-body: ...` | `font-body` | `<body class="font-body">` |

**Pattern:** `--color-*` → all color utilities, `--font-*` → `font-*` utility, `--spacing-*` → spacing utilities

**Pro Tip**: Name tokens by PURPOSE (`brand`, `sage`, `cream`) not appearance (`dark-red`, `green`). If the client changes from maroon to navy, `--color-brand` still makes sense.

---

## Custom Colors

### Defining a Palette

```css
@theme {
    --color-brand: #8B1A1A;        /* Primary brand */
    --color-brand-light: #A52A2A;  /* Hover/accent */
    --color-brand-dark: #6B1010;   /* Gradients/emphasis */
    --color-sage: #7C9070;         /* Secondary accent */
    --color-sage-light: #A3B898;   /* Subtle backgrounds */
    --color-cream: #FFF8F0;        /* Page background */
    --color-cream-dark: #F5EDE0;   /* Section alternation */
    --color-charcoal: #2C2C2C;     /* Text color */
    --color-warm-gray: #6B6360;    /* Muted text */
}
```

### Using Custom Colors

```html
<!-- All these are auto-generated from @theme -->
<body class="bg-cream text-charcoal">
<h1 class="text-brand">Heading</h1>
<button class="bg-brand text-cream border-sage">Button</button>
<div class="ring-2 ring-brand">Focused element</div>
```

### `:root` (Lecture 5) vs `@theme` (Lecture 7)

| Feature | `:root` CSS Variables | `@theme` Directive |
|---------|----------------------|-------------------|
| Creates CSS variable | Yes | Yes |
| Generates Tailwind utilities | No | Yes |
| Use with `var()` | Yes | Yes |
| Use as `bg-*`, `text-*` | No | Yes |
| Requires Tailwind | No | Yes |

**`@theme` is `:root` on steroids** — it speaks Tailwind's language.

---

## Custom Fonts

### Google Fonts Integration

```html
<!-- Step 1: Load fonts in <head> (before Tailwind script) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
/* Step 2: Register in @theme */
@theme {
    --font-display: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
}
```

```html
<!-- Step 3: Use in HTML -->
<body class="font-body">                    <!-- Inter everywhere -->
<h1 class="font-display text-4xl">Title</h1>  <!-- Playfair Display for headings -->
```

**Pro Tip**: Two fonts is the sweet spot — one display (headings), one body (text). Three fonts is messy. One font is boring.

---

## `@apply` — Component Extraction

### Syntax

```css
.nav-link {
    @apply text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200;
}
```

```html
<!-- Before: 7 classes × 4 links = 28 class instances -->
<a class="text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200">

<!-- After: 1 class × 4 links = 4 class instances -->
<a class="nav-link">
```

### When to Use `@apply`

| Scenario | Decision |
|----------|----------|
| Nav link repeated 4+ times | `@apply` |
| Menu card repeated 9+ times | `@apply` |
| Unique hero section padding | Keep as utility |
| One-off text color on heading | Keep as utility |
| Button style used across sections | `@apply` |

**Rule of 3+:** If a utility pattern repeats 3 or more times, extract with `@apply`.

### All Modifiers Work Inside `@apply`

```css
.menu-card {
    @apply bg-white rounded-xl shadow-md overflow-hidden
           hover:-translate-y-1 hover:shadow-xl
           transition duration-300;
}
```

`hover:`, `focus:`, `md:`, `lg:`, `dark:`, `active:` — all work inside `@apply`.

### Base + Variant Pattern

```css
/* Base class */
.badge {
    @apply text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide;
}

/* Variants (use both classes in HTML) */
.badge-spicy {
    @apply bg-red-100 text-red-700;
}
.badge-veg {
    @apply bg-green-100 text-green-700;
}
.badge-popular {
    @apply bg-amber-100 text-amber-700;
}
```

### Overriding `@apply` with Inline Utilities

```html
<!-- .btn-primary has @apply bg-brand text-cream -->
<!-- Inline utilities OVERRIDE the @apply defaults -->
<button class="btn-primary bg-cream text-brand">Inverted Button</button>
```

Inline utilities always win over `@apply` defaults.

---

## Gradients

### Syntax

```html
<div class="bg-gradient-to-br from-brand via-brand-dark to-charcoal">
```

### Gradient Directions

| Class | Direction |
|-------|-----------|
| `bg-gradient-to-t` | Bottom → Top |
| `bg-gradient-to-r` | Left → Right |
| `bg-gradient-to-b` | Top → Bottom |
| `bg-gradient-to-l` | Right → Left |
| `bg-gradient-to-tr` | Bottom-left → Top-right |
| `bg-gradient-to-br` | Top-left → Bottom-right |
| `bg-gradient-to-bl` | Top-right → Bottom-left |
| `bg-gradient-to-tl` | Bottom-right → Top-left |

### Gradient Color Stops

| Class | Role | Example |
|-------|------|---------|
| `from-*` | Start color | `from-brand` |
| `via-*` | Middle color (optional) | `via-brand-dark` |
| `to-*` | End color | `to-charcoal` |

**Pro Tip**: Always include a `via-*` color for smoother, more professional gradients. Without `via-*`, the transition can look harsh.

---

## Dark Mode Basics

### The `dark:` Variant

```html
<body class="bg-cream text-charcoal dark:bg-charcoal dark:text-cream">
<h1 class="text-brand dark:text-brand-light">Title</h1>
```

### How to Activate

Add `class="dark"` to the `<html>` element:

```html
<html lang="en" class="dark">
```

**Note:** Toggling dark mode dynamically requires JavaScript (covered in Module 2). For now, know the `dark:` prefix exists and plan your inverse palette.

---

## Button Components

```css
.btn-primary {
    @apply bg-brand text-cream font-semibold py-3 px-8 rounded-lg
           hover:bg-brand-light transition duration-300;
}

.btn-outline {
    @apply border-2 border-brand text-brand font-semibold py-3 px-8 rounded-lg
           hover:bg-brand hover:text-cream transition duration-300;
}
```

```html
<button class="btn-primary">Book a Table</button>
<button class="btn-outline">View Menu</button>

<!-- Override for dark section -->
<button class="btn-primary bg-cream text-brand hover:bg-cream-dark">Light Button</button>
```

---

## Badge Pattern

```css
.badge {
    @apply text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide;
}
.badge-spicy { @apply bg-red-100 text-red-700; }
.badge-veg { @apply bg-green-100 text-green-700; }
.badge-popular { @apply bg-amber-100 text-amber-700; }
```

```html
<span class="badge badge-spicy">Spicy</span>
<span class="badge badge-veg">Vegetarian</span>
<span class="badge badge-popular">Popular</span>
```

---

## Common Mistakes to Avoid

### 1. Missing `type="text/tailwindcss"`
```html
<!-- WRONG — @theme and @apply don't work -->
<style>
    @theme { --color-brand: #8B1A1A; }
</style>

<!-- CORRECT — Tailwind processes this block -->
<style type="text/tailwindcss">
    @theme { --color-brand: #8B1A1A; }
</style>
```

### 2. Wrong Namespace
```css
/* WRONG — no --color- prefix, utilities won't generate */
@theme {
    --brand: #8B1A1A;
}

/* CORRECT — --color- prefix generates bg-brand, text-brand, etc. */
@theme {
    --color-brand: #8B1A1A;
}
```

### 3. Over-Extracting with `@apply`
```css
/* WRONG — pointless extraction */
.red-text { @apply text-red-500; }
.big-padding { @apply p-8; }

/* CORRECT — meaningful component extraction */
.menu-card { @apply bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 transition duration-300; }
```

### 4. Missing `--` Prefix
```css
/* WRONG — not a valid CSS custom property */
@theme {
    color-brand: #8B1A1A;
}

/* CORRECT — CSS custom properties require -- prefix */
@theme {
    --color-brand: #8B1A1A;
}
```

---

## VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Space` | Trigger Tailwind class autocomplete (including custom classes) |
| `Ctrl + D` | Select next occurrence (great for renaming @apply classes) |
| `Alt + Up/Down` | Move line up/down |
| `Shift + Alt + Down` | Duplicate line (great for menu card repetition) |
| Hover over class | See generated CSS in tooltip (works for custom tokens too) |

---

## Quick Reference Table

| What you want | How to do it |
|---------------|--------------|
| Custom brand color | `@theme { --color-brand: #HEX; }` → `bg-brand` |
| Custom font | `@theme { --font-display: 'Font', serif; }` → `font-display` |
| Reusable component class | `.nav-link { @apply ...; }` → `class="nav-link"` |
| Diagonal gradient | `bg-gradient-to-br from-brand to-charcoal` |
| Smooth gradient | Add `via-brand-dark` between `from-*` and `to-*` |
| Dark mode style | `dark:bg-charcoal dark:text-cream` |
| Badge system | `.badge` base + `.badge-spicy` variant, use both classes |
| Override @apply default | Add inline utility: `class="btn-primary bg-cream"` |
| Frosted glass nav | `bg-white/90 backdrop-blur-md` |
| Button pair (CTA) | `.btn-primary` + `.btn-outline` side by side |

---

## Restaurant Menu Component Library

```css
/* Full @apply components from this lecture */
.nav-link        { @apply text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200; }
.section-title   { @apply font-display text-3xl md:text-4xl font-bold text-charcoal text-center mb-2; }
.section-subtitle{ @apply text-warm-gray text-center text-lg mb-12 max-w-2xl mx-auto; }
.menu-card       { @apply bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300; }
.menu-card-image { @apply w-full h-48 object-cover; }
.price-tag       { @apply font-display text-xl font-bold text-brand; }
.badge           { @apply text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide; }
.badge-spicy     { @apply bg-red-100 text-red-700; }
.badge-veg       { @apply bg-green-100 text-green-700; }
.badge-popular   { @apply bg-amber-100 text-amber-700; }
.btn-primary     { @apply bg-brand text-cream font-semibold py-3 px-8 rounded-lg hover:bg-brand-light transition duration-300; }
.btn-outline     { @apply border-2 border-brand text-brand font-semibold py-3 px-8 rounded-lg hover:bg-brand hover:text-cream transition duration-300; }
```

---

## What's Next?

### Module Assignment: Fashion E-commerce Homepage
Combines EVERYTHING from Lectures 1-7:
- Semantic HTML structure (Lectures 1-2)
- Responsive design (Lecture 5)
- Tailwind customization with `@theme` and `@apply` (Lectures 6-7)
- Custom brand colors, fonts, gradients, and component extraction

### Module 2: Programming Logic with JavaScript
Your pages are beautiful — but they don't DO anything yet:
- Can't add items to a cart
- Can't filter the menu
- Can't toggle dark mode
- Can't validate a reservation form
- JavaScript brings your pages to **life**

> *"Module 1 complete. 7 lectures. Zero to production-quality websites you can sell. Module 2 adds the logic that makes them interactive."*

---

*Keep this cheatsheet handy while working on your assignment!*
