# Lecture 7: Advanced Tailwind & Customization

## PRESENTER ONLY (Not shared with students)

### Overview
- **Format**: Live Google Meet session
- **Style**: Presentation-driven (reveal.js) + live coding (VS Code)
- **Project**: Restaurant Digital Menu & Ordering
- **Goal**: Students can customize Tailwind CSS with `@theme` (brand colors, fonts), extract reusable components with `@apply`, and build a complete branded restaurant page

---

## Pre-Class Setup Checklist

- [ ] VS Code with clean theme (dark mode recommended)
- [ ] Large font size (18-20px) for screen share visibility
- [ ] Browser ready (Chrome DevTools accessible)
- [ ] Blank project folder created: `restaurant-digital-menu/`
- [ ] Presentation loaded: `presentation/index.html` open in browser
- [ ] reveal.js CDN verified (test slides load correctly)
- [ ] Tailwind CSS 4 CDN verified: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>` loads in a test file
- [ ] Verify `<style type="text/tailwindcss">` works with `@theme` in browser
- [ ] Google Fonts test page ready — Playfair Display + Inter loaded
- [ ] Lecture 6 `code/index.html` open in a second tab for side-by-side comparison
- [ ] Prepare placeholder food images: `https://picsum.photos/id/292/600/400`, `https://picsum.photos/id/312/600/400`, etc.
- [ ] Disable notifications on all devices

---

## Phase 0: Before Lecture (0:00 – 10:00)

### Portal Quiz Review (from Lecture 6)
- Review portal quiz results from Lecture 6
- Likely missed questions:
  - **Q3 (missing shade number + dash):** Students wrote `bg-blue` instead of `bg-blue-500` and `p4` instead of `p-4` — reinforce: colors ALWAYS need shade numbers (50-950), spacing ALWAYS needs a dash separator
  - **Q6 (hover colon syntax):** `hover-bg-blue-700` vs `hover:bg-blue-700` — reinforce: Tailwind modifiers use COLONS, not dashes. The colon is what triggers conditional application.
  - **Q2 (spacing math):** `p-6` = 6 × 4 = 24px — some students said `6px` or `6rem` — reinforce: multiply the number by 4 for pixels
  - **Q8 (missing transition):** Cards jumping instead of animating — reinforce: ALWAYS pair hover transforms with `transition duration-300`
- Reinforce: The utility-first workflow — think in classes, not CSS rules

### Assignment Feedback
- Common mistakes observed:
  - **Adding `<style>` tags** when the assignment specifically required pure Tailwind utility classes — "If you found yourself writing `<style>`, that's traditional CSS mindset. Tailwind replaces it entirely."
  - **Repeating long class strings** — copy-pasting `text-gray-400 text-sm uppercase tracking-widest hover:text-amber-500 transition duration-200` on every nav link — "Annoying, right? What if there was a way to name that pattern once? That's EXACTLY what we learn today."
  - **Missing responsive prefixes** — pages look great on desktop but break on mobile
  - **Hover without transition** — effects jump instead of animating smoothly
- Good examples to highlight: students with strong responsive grids, creative hover card effects, gradient text usage
- Questions to address: "Is there a way to avoid repeating the same 10 classes on every card?" → Perfect bridge to today's `@apply`!

### Bridge to Today
> *"Last lecture, your page looked like every Tailwind project — amber-500, slate-950, the default palette. If I showed 10 student submissions side by side, they'd all look the same. Today, your page becomes YOUR brand — custom colors, custom fonts, reusable components. No more copy-paste class lists."*

---

## Phase 1: Today's Lecture (90 Minutes)

### Part 1: Custom Theme with `@theme` Directive (10:00 – 28:00)

**Background / Motivation (Presentation)**
- "In Lecture 6, everyone used `bg-amber-500` and `bg-slate-950`. Professional websites don't use default palettes — they have BRAND colors. A restaurant uses warm maroons and sage greens. A tech startup uses bold blues. A fashion brand uses elegant neutrals."
- Show comparison: Lecture 6 landing page (amber/slate/generic) vs what we'll build today (maroon/sage/cream — unique restaurant brand)
- "Tailwind v4 introduced a game-changer: the `@theme` directive. It lets you define custom design tokens — colors, fonts, spacing — right in your CSS. And Tailwind automatically generates ALL the utility classes for them."
- Recall Lecture 5: We used `:root` CSS variables. `@theme` is the Tailwind evolution — it creates variables AND utility classes.

**Illustrations / Animations (Presentation)**

1. **Comparison** (`.nb-compare`): Left — Lecture 6 defaults (amber-500, slate-900, generic palette). Right — Custom brand (maroon, sage, cream, unique identity). Winner: Custom. "Same framework. Completely different impression."

2. **Anatomy** (`.nb-anatomy`): Break down `@theme { --color-brand: #8B1A1A; }` — label each part: `@theme` = directive, `--color-` = namespace prefix, `brand` = token name, `#8B1A1A` = value.

3. **Process Flow** (`.nb-flow`): "Define in @theme" → "Tailwind generates utilities" → "Use as `bg-brand`" → "Change once, updates everywhere"

4. **Callout** (`.nb-callout nb-tip`): "Define `--color-sage: #7C9070;` and you instantly get `bg-sage`, `text-sage`, `border-sage`, `ring-sage` — the ENTIRE utility ecosystem, automatically."

**"Let's see in Code now" (VS Code)**

Start the restaurant project scaffold:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Savory Bites | Restaurant Digital Menu</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
        @theme {
            --color-brand: #8B1A1A;
            --color-brand-light: #A52A2A;
            --color-brand-dark: #6B1010;
            --color-sage: #7C9070;
            --color-sage-light: #A3B898;
            --color-cream: #FFF8F0;
            --color-cream-dark: #F5EDE0;
            --color-charcoal: #2C2C2C;
            --color-warm-gray: #6B6360;
        }
    </style>
</head>
<body class="bg-cream text-charcoal">
    <h1 class="text-4xl font-bold text-brand text-center py-8">
        Savory Bites Restaurant
    </h1>
    <button class="bg-brand text-cream py-3 px-8 rounded-lg mx-auto block">
        View Our Menu
    </button>
</body>
</html>
```

**Talking points while typing:**
- "Notice `<style type="text/tailwindcss">` — this tells the Tailwind CDN to process this style block. Regular `<style>` won't work with `@theme`."
- "Every `--color-*` variable automatically creates ALL color utilities. Watch: I type `bg-cream` and it works. `text-brand` works. `border-sage` works. We didn't write ANY of those utility classes — Tailwind generated them."
- "The body is `bg-cream text-charcoal` — light theme! Lecture 6 was dark. Tailwind is equally powerful for both."

**Interactive Questions (Presentation/Verbal)**

1. **Concept-check:** "What does `@theme { --color-sage: #7C9070; }` do?"
   - Students answer in chat
   - Answer: "It creates a CSS variable AND generates ALL Tailwind utilities — `bg-sage`, `text-sage`, `border-sage`, `ring-sage`, `shadow-sage`... the whole family. ONE line, unlimited utilities."

2. **Spot-the-error:** Show this code:
   ```css
   @theme {
       color-brand: #8B1A1A;
   }
   ```
   "What's wrong?" — Answer: Missing `--` prefix. Must be `--color-brand`. CSS custom properties ALWAYS start with `--`. Without them, it's just an invalid CSS property.

3. **Hidden-fact-reveal:** ":root from Lecture 5 vs @theme — what's the real difference?"
   - `:root { --brand: #8B1A1A; }` → Creates a variable. You manually use it with `var(--brand)`. No utilities generated.
   - `@theme { --color-brand: #8B1A1A; }` → Creates a variable AND generates `bg-brand`, `text-brand`, `border-brand`, `ring-brand`... the entire utility ecosystem.
   - "@theme is :root on steroids. It speaks Tailwind."

**Live Debugging (VS Code)**
- Intentionally use `<style>` without `type="text/tailwindcss"` — show that `bg-brand` doesn't work
- Fix: Add `type="text/tailwindcss"` — everything works
- Intentionally use `--brand` without the `--color-` namespace — show that `bg-brand` doesn't generate
- Fix: Change to `--color-brand` — now `bg-brand` works

**Part Closing (Presentation)**
- Common Mistakes:
  - Forgetting `type="text/tailwindcss"` on the `<style>` tag
  - Missing `--` prefix on custom properties
  - Using wrong namespace (`--brand` instead of `--color-brand`)
- Best Practices:
  - Name tokens semantically: `brand`, `sage`, `cream` — not `red`, `green`, `beige`
  - Define light AND dark variants: `brand`, `brand-light`, `brand-dark`
  - Keep palette to 5-7 colors maximum for consistency
- Pro Tip: "Name your colors by PURPOSE, not by what they look like. `--color-brand` stays meaningful if the client changes from maroon to navy. `--color-dark-red` becomes a lie."

---

### Part 2: Custom Fonts, Gradients & Dark Mode Intro (28:00 – 48:00)

**Background / Motivation (Presentation)**
- "You have custom colors. Now let's add custom fonts. Typography is 90% of web design — the font you choose transforms 'student project' into 'professional website.'"
- "Plus: gradients. We mentioned `bg-gradient-to-r` briefly in Lecture 6's creative section. Today you master the gradient system — direction, start, middle, end."
- "And a preview: dark mode. The `dark:` variant exists in Tailwind — we'll see how it works conceptually. Full toggle requires JavaScript, which starts in Module 2."

**Illustrations / Animations (Presentation)**

1. **Icon Cards** (`.nb-cards`): Three concepts — Custom Fonts (`--font-*` namespace), Gradients (`bg-gradient-to-*` system), Dark Mode (`dark:` variant)

2. **Comparison** (`.nb-compare`): Light mode (cream bg, charcoal text) vs Dark mode (charcoal bg, cream text) — same brand, two contexts. "Your restaurant website works for bright daylight AND dim evening browsing."

3. **Process Flow** (`.nb-flow`): Gradient anatomy — Direction `to-br` → Start `from-brand` → Middle `via-brand-dark` → End `to-charcoal`

4. **Callout** (`.nb-callout nb-pro`): "Typography is 90% of web design. System fonts say 'student project.' Playfair Display says 'fine dining.'"

**"Let's see in Code now" (VS Code)**

Add Google Fonts and font theme:

```html
<!-- Add in <head> before Tailwind script -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Add to `@theme`:

```css
@theme {
    /* ...existing colors... */
    --font-display: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
}
```

Build the navigation and hero:

```html
<body class="bg-cream text-charcoal font-body">

    <!-- Navigation -->
    <nav class="bg-white/90 backdrop-blur-md border-b border-brand/10 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#" class="font-display text-2xl font-bold text-brand">
                Savory Bites
            </a>
            <ul class="hidden md:flex gap-8">
                <li><a href="#starters" class="text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200">Starters</a></li>
                <li><a href="#mains" class="text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200">Mains</a></li>
                <li><a href="#desserts" class="text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200">Desserts</a></li>
                <li><a href="#reserve" class="text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200">Reserve</a></li>
            </ul>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center text-center bg-gradient-to-br from-brand via-brand-dark to-charcoal">
        <div class="relative z-10 max-w-3xl px-6">
            <p class="text-cream/70 text-sm uppercase tracking-[0.3em] mb-4 font-body">
                Est. 2024 &bull; Lahore, Pakistan
            </p>
            <h1 class="font-display text-5xl md:text-7xl font-bold text-cream leading-tight mb-6">
                Savory Bites
            </h1>
            <p class="text-cream/80 text-lg md:text-xl mb-8 font-body leading-relaxed">
                Experience the finest flavors of Lahore — from smoky grills to delicate desserts, every dish tells a story.
            </p>
            <button class="bg-cream text-brand font-semibold py-3 px-10 rounded-lg hover:bg-cream-dark transition duration-300 text-lg">
                Explore Our Menu
            </button>
        </div>
    </section>
```

**Talking points while typing:**
- "`font-body` on `<body>` — Inter applies everywhere. `font-display` on headings — Playfair Display for elegance."
- "The hero uses `bg-gradient-to-br from-brand via-brand-dark to-charcoal` — diagonal gradient from our custom brand colors! Not default Tailwind colors."
- "`backdrop-blur-md` on the nav — the frosted glass effect. Combined with `bg-white/90` for a semi-transparent white background."
- "Notice `dark:bg-charcoal dark:text-cream` — conceptually, dark mode inverts our palette. But toggling requires JavaScript, so we'll revisit this in Module 2."

Brief dark mode demo (add to body temporarily):

```html
<!-- Quick demo: add class="dark" to <html> to trigger dark mode -->
<html lang="en" class="dark">
<!-- Show: dark:bg-charcoal dark:text-cream on body -->
<body class="bg-cream text-charcoal dark:bg-charcoal dark:text-cream font-body">
```

"See? Same page, dark palette. But removing/adding the `dark` class needs JavaScript — that's Module 2. For now, know the `dark:` prefix exists."

Remove the `class="dark"` from `<html>` and continue with light theme.

**Interactive Questions (Presentation/Verbal)**

1. **Predict-output:** "Given `@theme { --font-display: 'Playfair Display', serif; }`, what Tailwind class applies this font?"
   - Answer: `font-display` — same namespace pattern as colors! `--color-*` → `bg-*`, `text-*`. `--font-*` → `font-*`.

2. **Concept-check:** "What does `bg-gradient-to-br from-brand to-charcoal` create?"
   - Answer: A diagonal gradient from brand maroon (top-left) to charcoal (bottom-right). `to-br` = to bottom-right.

3. **Quick-fire namespace matching:** "I say the `@theme` variable, you say the Tailwind utility class."
   - `--color-sage` → `bg-sage`, `text-sage`, `border-sage`
   - `--font-display` → `font-display`
   - `--color-brand-light` → `bg-brand-light`, `text-brand-light`
   - Pattern: The namespace prefix (`--color-`, `--font-`) becomes the utility prefix (`bg-`/`text-`/`border-`, `font-`)

**Live Debugging (VS Code)**
- Remove one Google Font `<link>` tag — show that `font-display` falls back to serif
- Fix: Restore the link. "Always verify your fonts load. The fallback font (serif/sans-serif) is your safety net."
- Type wrong gradient direction `bg-gradient-to-xy` — nothing happens
- Fix: Use valid direction `bg-gradient-to-br`. Valid: `to-t`, `to-r`, `to-b`, `to-l`, `to-tr`, `to-br`, `to-bl`, `to-tl`

**Part Closing (Presentation)**
- Common Mistakes:
  - Forgetting Google Fonts `<link>` tags (font-display shows default serif)
  - Invalid gradient direction suffixes (`to-xy` is not valid)
  - Using `dark:` without understanding it needs a toggle mechanism
- Best Practices:
  - Use `font-display: swap` in Google Fonts URL (included by default with `&display=swap`)
  - Pair a serif display font with a sans-serif body font for contrast
  - Always include a `via-*` color for smoother gradients
- Pro Tip: "Two fonts is the professional sweet spot. One display (headings), one body (everything else). Three fonts is messy. One font is boring."

---

### Part 3: Component Extraction with `@apply` (48:00 – 68:00)

**Background / Motivation (Presentation)**
- "Look at our nav links. FOUR links, each with the SAME seven classes: `text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200`. That's 28 class instances for identical styling."
- "Now imagine menu cards — you'll have 9+ cards, each with 15+ classes. That's 135+ class instances of the same thing. Change the hover color? Edit 9 places. Miss one? Bug."
- "This is the DRY problem — Don't Repeat Yourself. `@apply` solves it."
- "`@apply` lets you extract repeated utility combinations into a named class. Write once, use everywhere, change once."

**Illustrations / Animations (Presentation)**

1. **Comparison** (`.nb-compare`): Left — Repetition (15 classes × 6 cards = 90 class instances, change hover = edit 6 places). Right — `@apply` (1 `.menu-card` class × 6 cards = same styles, change hover = edit 1 place). Winner: `@apply`.

2. **Anatomy** (`.nb-anatomy`): Break down `.menu-card { @apply bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 transition duration-300; }` — label: selector, directive, utility classes, modifiers work inside @apply.

3. **Vertical Flow** (`.nb-flow-v`): "Identify repeated pattern" → "Create named class" → "Use `@apply`" → "Apply class in HTML" → "Change once, updates everywhere"

4. **Callout** (`.nb-callout nb-warning`): "Use `@apply` for patterns that repeat 3+ times. Don't `@apply` everything — that defeats the purpose of utility-first CSS. IMPORTANT: In Tailwind v4, `@apply` can ONLY reference Tailwind utilities, never your own custom classes. For base + variant patterns (like badges), use BOTH classes in HTML: `class='badge badge-spicy'`."

**"Let's see in Code now" (VS Code)**

Add component classes inside the `<style type="text/tailwindcss">` block (after `@theme`):

```css
/* Navigation Links */
.nav-link {
    @apply text-warm-gray text-sm uppercase tracking-widest hover:text-brand transition duration-200;
}

/* Section Titles */
.section-title {
    @apply font-display text-3xl md:text-4xl font-bold text-charcoal text-center mb-2;
}
.section-subtitle {
    @apply text-warm-gray text-center text-lg mb-12 max-w-2xl mx-auto;
}

/* Menu Card */
.menu-card {
    @apply bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300;
}
.menu-card-image {
    @apply w-full h-48 object-cover;
}

/* Price Tag */
.price-tag {
    @apply font-display text-xl font-bold text-brand;
}

/* Badges */
.badge {
    @apply text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide;
}
.badge-spicy {
    @apply bg-red-100 text-red-700;
}
.badge-veg {
    @apply bg-green-100 text-green-700;
}
.badge-popular {
    @apply bg-amber-100 text-amber-700;
}

/* Buttons */
.btn-primary {
    @apply bg-brand text-cream font-semibold py-3 px-8 rounded-lg hover:bg-brand-light transition duration-300;
}
.btn-outline {
    @apply border-2 border-brand text-brand font-semibold py-3 px-8 rounded-lg hover:bg-brand hover:text-cream transition duration-300;
}
```

Now update the nav to use `.nav-link`:

```html
<ul class="hidden md:flex gap-8">
    <li><a href="#starters" class="nav-link">Starters</a></li>
    <li><a href="#mains" class="nav-link">Mains</a></li>
    <li><a href="#desserts" class="nav-link">Desserts</a></li>
    <li><a href="#reserve" class="nav-link">Reserve</a></li>
</ul>
```

Build the Starters section using extracted components:

```html
<!-- Starters Section -->
<section id="starters" class="py-16 md:py-20 px-6 bg-cream">
    <div class="max-w-7xl mx-auto">
        <p class="text-sage text-sm uppercase tracking-[0.3em] text-center mb-4">From Our Kitchen</p>
        <h2 class="section-title">Starters</h2>
        <p class="section-subtitle">Light bites to awaken your palate</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="menu-card">
                <img src="https://picsum.photos/id/292/600/400" alt="Seekh Kebab platter with mint chutney" class="menu-card-image">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-display text-xl font-semibold text-charcoal">Seekh Kebab</h3>
                        <span class="price-tag">PKR 650</span>
                    </div>
                    <p class="text-warm-gray text-sm mb-3 leading-relaxed">Hand-minced lamb kebabs with fresh mint chutney, served on a sizzling plate</p>
                    <div class="flex gap-2">
                        <span class="badge badge-spicy">Spicy</span>
                        <span class="badge badge-popular">Popular</span>
                    </div>
                </div>
            </div>

            <!-- Card 2 -->
            <div class="menu-card">
                <img src="https://picsum.photos/id/312/600/400" alt="Crispy samosas with tamarind sauce" class="menu-card-image">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-display text-xl font-semibold text-charcoal">Chicken Samosa</h3>
                        <span class="price-tag">PKR 350</span>
                    </div>
                    <p class="text-warm-gray text-sm mb-3 leading-relaxed">Crispy pastry shells stuffed with spiced chicken and herbs, served with tamarind dip</p>
                    <div class="flex gap-2">
                        <span class="badge badge-popular">Popular</span>
                    </div>
                </div>
            </div>

            <!-- Card 3 -->
            <div class="menu-card">
                <img src="https://picsum.photos/id/429/600/400" alt="Fresh garden salad with pomegranate" class="menu-card-image">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-display text-xl font-semibold text-charcoal">Garden Fresh Salad</h3>
                        <span class="price-tag">PKR 450</span>
                    </div>
                    <p class="text-warm-gray text-sm mb-3 leading-relaxed">Seasonal greens with pomegranate, walnuts, and house-made citrus vinaigrette</p>
                    <div class="flex gap-2">
                        <span class="badge badge-veg">Vegetarian</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

**Talking points while typing:**
- "`.nav-link` — ONE class instead of seven. Four nav links? 4 class instances instead of 28."
- "`.menu-card` — ONE class for all that hover, shadow, rounded, overflow. Every card gets the same treatment."
- "`.badge-spicy`, `.badge-veg`, `.badge-popular` — base + variant pattern. Important: In Tailwind v4, `@apply` CANNOT reference custom classes, only Tailwind utilities. So `.badge-spicy` doesn't do `@apply badge bg-red-100` — that would fail. Instead, we use BOTH classes in HTML: `class='badge badge-spicy'`. Like Bootstrap's `btn btn-primary` pattern. The `.badge` base class handles sizing and shape. The variant `.badge-spicy` adds colors."
- "Notice: `hover:` modifiers work INSIDE `@apply`. So do `md:`, `lg:`, `focus:`, `dark:` — ALL modifiers."
- "You can still use inline utilities alongside `@apply` classes. The card content padding `p-6` is inline — it's unique to the card body, not worth extracting."

**Interactive Questions (Presentation/Verbal)**

1. **Concept-check:** "Can you use `hover:` modifiers inside `@apply`?"
   - Answer: Yes! `@apply hover:bg-brand-light transition duration-300;` works perfectly. ALL Tailwind modifiers work inside `@apply` — hover, focus, md:, lg:, dark:, etc.

2. **Predict-output:** "You have `.btn-primary { @apply bg-brand text-cream py-3 px-8 rounded-lg; }`. What HTML do you write to use it?"
   - Answer: `<button class="btn-primary">Order Now</button>` — just the ONE class. All styles applied.

3. **Quick-fire when-to-@apply:**
   - "Nav link used 4+ times?" → `@apply` it!
   - "Unique hero section padding?" → Keep as utility (one-off)
   - "Menu card used 12 times?" → Definitely `@apply`!
   - "One-off text color on a heading?" → Keep as utility
   - **Rule of 3+:** If a pattern repeats 3 or more times, extract with `@apply`.

**Live Debugging (VS Code)**
- Intentionally write `@apply` outside the `<style type="text/tailwindcss">` block — doesn't work
- Fix: Move inside the Tailwind style block
- Misspell a utility inside `@apply` — `@apply bg-bramd` — class doesn't apply correctly
- Fix: Correct to `bg-brand`. "Same typo rules as inline — misspelled utilities just don't work."

**Part Closing (Presentation)**
- Common Mistakes:
  - Over-extracting: Making `.red-text { @apply text-red-500; }` — pointless, just use `text-red-500`
  - Extracting one-off styles that only appear once
  - Placing `@apply` rules outside the `<style type="text/tailwindcss">` block
  - Trying to use `@apply badge` inside `.badge-spicy` — **Tailwind v4 limitation**: `@apply` cannot reference custom classes, only Tailwind utilities
- Best Practices:
  - Rule of 3+: Extract only when a pattern repeats 3+ times
  - Name by purpose: `.menu-card`, `.btn-primary`, `.nav-link` — not `.rounded-shadow-hover`
  - Use base + variant pattern for families: define `.badge` base, then use BOTH classes in HTML: `class="badge badge-spicy"` (not just `badge-spicy` alone)
- Pro Tip: "Don't `@apply` everything. If you extract every single class combination, you've just recreated traditional CSS with extra steps. `@apply` is for REPEATED PATTERNS, not for every div. And remember: `@apply` only accepts Tailwind utilities, never your own custom classes — that's a Tailwind v4 architectural decision."

---

### Part 4: Building the Complete Restaurant Menu (68:00 – 85:00)

**Background / Motivation (Presentation)**
- "We have our custom theme, fonts, and extracted components. Now let's assemble the complete restaurant menu — Mains with a featured item, Desserts, a reservation CTA, and a professional footer."
- "This is the Module 1 culmination. Everything from Lectures 1-7 in one project: semantic HTML, spacing, layout, responsive design, Tailwind customization."
- Show page architecture tree: Nav → Hero → Starters → Mains → Desserts → CTA/Reservation → Footer

**Illustrations / Animations (Presentation)**

1. **Tree** (`.nb-tree`): Page architecture — Restaurant Menu (root) → Nav (sticky, backdrop-blur), Hero (gradient), Starters (@apply cards), Mains (featured + grid), Desserts (grid), CTA (gradient + buttons), Footer (3-col)

2. **Stats** (`.nb-stats`): Module 1 Progress — HTML Structure 100%, CSS Fundamentals 100%, Responsive Design 100%, Tailwind Basics 100%, Tailwind Customization 100%

3. **Callout** (`.nb-callout nb-pro`): "A restaurant digital menu is one of the most common freelance projects in Pakistan. QR code menus are everywhere. You can build AND charge for this skill today."

**"Let's see in Code now" (VS Code)**

Build the Mains section with featured item:

```html
<!-- Mains Section -->
<section id="mains" class="py-16 md:py-20 px-6 bg-cream-dark">
    <div class="max-w-7xl mx-auto">
        <p class="text-sage text-sm uppercase tracking-[0.3em] text-center mb-4">Signature Dishes</p>
        <h2 class="section-title">Main Course</h2>
        <p class="section-subtitle">Our chef's proudest creations, prepared with passion</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Featured Item (spans 2 columns) -->
            <div class="menu-card lg:col-span-2 lg:flex">
                <img src="https://picsum.photos/id/488/800/600" alt="Signature Lamb Biryani with raita" class="menu-card-image lg:w-1/2 lg:h-auto">
                <div class="p-6 lg:p-8 flex flex-col justify-center">
                    <span class="badge badge-popular w-fit mb-3">Chef's Special</span>
                    <h3 class="font-display text-2xl font-bold text-charcoal mb-2">Signature Lamb Biryani</h3>
                    <p class="text-warm-gray mb-4 leading-relaxed">Slow-cooked lamb layered with aged basmati rice, saffron, and our secret 12-spice blend. Served with raita and mirchi ka salan.</p>
                    <div class="flex items-center gap-4">
                        <span class="price-tag text-2xl">PKR 1,200</span>
                        <span class="badge badge-spicy">Medium Spice</span>
                    </div>
                </div>
            </div>

            <!-- Regular Card -->
            <div class="menu-card">
                <img src="https://picsum.photos/id/326/600/400" alt="Grilled chicken karahi" class="menu-card-image">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-display text-xl font-semibold text-charcoal">Chicken Karahi</h3>
                        <span class="price-tag">PKR 950</span>
                    </div>
                    <p class="text-warm-gray text-sm mb-3 leading-relaxed">Traditional wok-cooked chicken with tomatoes, green chilies, and fresh ginger</p>
                    <div class="flex gap-2">
                        <span class="badge badge-spicy">Spicy</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

Build the Desserts section:

```html
<!-- Desserts Section -->
<section id="desserts" class="py-16 md:py-20 px-6 bg-cream">
    <div class="max-w-7xl mx-auto">
        <p class="text-sage text-sm uppercase tracking-[0.3em] text-center mb-4">Sweet Endings</p>
        <h2 class="section-title">Desserts</h2>
        <p class="section-subtitle">Traditional sweets with a modern twist</p>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Dessert cards (same .menu-card pattern) -->
        </div>
    </div>
</section>
```

Build the CTA/Reservation section:

```html
<!-- Reservation CTA -->
<section id="reserve" class="py-16 md:py-24 px-6 bg-gradient-to-br from-brand via-brand-dark to-charcoal text-center">
    <div class="max-w-3xl mx-auto">
        <p class="text-cream/60 text-sm uppercase tracking-[0.3em] mb-4">Join Us Tonight</p>
        <h2 class="font-display text-3xl md:text-5xl font-bold text-cream mb-6">Reserve Your Table</h2>
        <p class="text-cream/80 text-lg mb-10 leading-relaxed">
            Experience the warmth of Lahore's finest dining. Book your table and let us take care of the rest.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="btn-primary bg-cream text-brand hover:bg-cream-dark">
                Book a Table
            </button>
            <button class="btn-outline border-cream text-cream hover:bg-cream hover:text-brand">
                Call: 0328-4500073
            </button>
        </div>
    </div>
</section>
```

**Talking points while typing:**
- "The featured item uses `lg:col-span-2 lg:flex` — spans 2 grid columns on desktop and becomes a horizontal layout. On mobile, it stacks normally."
- "Notice the CTA buttons: `btn-primary` from `@apply` BUT with inline overrides: `bg-cream text-brand` instead of the default `bg-brand text-cream`. Inline utilities OVERRIDE `@apply` defaults. This is how you create contextual variants."
- "The gradient reuses our custom brand colors — `from-brand via-brand-dark to-charcoal`. Same gradient pattern from the hero, creating visual consistency."

Build the Footer:

```html
<!-- Footer -->
<footer class="bg-charcoal text-cream/70 py-12 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
            <h3 class="font-display text-xl font-bold text-cream mb-4">Savory Bites</h3>
            <p class="text-sm leading-relaxed">Bringing the authentic flavors of Lahore to your table since 2024. Every dish prepared with love and tradition.</p>
        </div>
        <div>
            <h4 class="font-semibold text-cream mb-4 uppercase text-sm tracking-wide">Hours</h4>
            <p class="text-sm">Mon – Thu: 12:00 PM – 11:00 PM</p>
            <p class="text-sm">Fri – Sun: 12:00 PM – 12:00 AM</p>
        </div>
        <div>
            <h4 class="font-semibold text-cream mb-4 uppercase text-sm tracking-wide">Contact</h4>
            <p class="text-sm">College Road, Near Akbar Chowk</p>
            <p class="text-sm">Faisal Town, Lahore</p>
            <p class="text-sm mt-2">Tel: 042-36440443</p>
            <p class="text-sm">WhatsApp: 0328-4500073</p>
        </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-cream/10 mt-8 pt-8 text-center text-sm">
        <p>&copy; 2026 Savory Bites. A NexusBerry Demo Project.</p>
    </div>
</footer>
```

Brief production mention (conceptual only):

> *"Right now we're using the CDN — great for learning. In production, you'd use `npm install tailwindcss` and a build tool like Vite. That removes unused CSS, making your file tiny. But npm and Vite need Node.js — which is exactly where Module 2 starts. For now, the CDN is perfect."*

**Interactive Questions (Presentation/Verbal)**

1. **Predict-output:** "`.menu-card` has `@apply bg-white`. You write `<div class='menu-card bg-sage'>`. What background color?"
   - Answer: Sage green! Inline utilities override `@apply` defaults. Think of `@apply` as the base — inline utilities are the override.

2. **Concept-check:** "What makes this restaurant menu 'advanced' compared to Lecture 6's landing page?"
   - Answer: Custom brand colors via `@theme`, custom fonts via `--font-*`, reusable components via `@apply`, gradient backgrounds — a complete branded design system, not just default Tailwind.

3. **Hidden-fact-reveal:** Module 1 journey recap:
   - Lecture 1: Plain HTML blog article
   - Lecture 2: Semantic HTML portfolio
   - Lecture 3: CSS box model business card
   - Lecture 4: Flexbox & Grid dashboard
   - Lecture 5: Responsive design with media queries
   - Lecture 6: Tailwind basics with defaults
   - Lecture 7: Branded, custom, professional restaurant menu
   - "7 lectures. Zero to production-quality websites you can sell. That's Module 1."

**Live Debugging (VS Code)**
- Show that inline utility `bg-sage` on a `.menu-card` element changes the background — proving inline overrides @apply
- Intentionally break the footer grid by removing `md:grid-cols-3` — show it stacks on all screens
- Fix: Add `md:grid-cols-3` back — responsive footer works

**Part Closing (Presentation)**
- Common Mistakes:
  - Forgetting `lg:col-span-2` on featured items (they stay single-column)
  - Not testing at multiple breakpoints (375px, 768px, 1024px, 1440px)
  - Inconsistent section padding (some sections `py-16`, others `py-8`)
- Best Practices:
  - Consistent section structure: category label → title → subtitle → content
  - Use `.btn-primary` + `.btn-outline` for CTA pairs
  - Footer with 3-column grid collapses cleanly to single column on mobile
- Pro Tip: "A restaurant digital menu is one of the most common freelance projects in Pakistan. QR code menus are everywhere now. This exact project — with a client's branding — is a real-world gig you can charge PKR 15,000-50,000 for."

---

### Lecture Ending (85:00 – 90:00)

**Cheat Sheet Slides (Presentation)**
- Walk through key reference slides (synced with `cheatsheet.md`):
  - `@theme` directive syntax and namespaces
  - Custom colors: define once, use everywhere
  - Custom fonts: `--font-*` namespace
  - `@apply` extraction: syntax, when to use, base + variant
  - Gradients: direction, from, via, to
  - Dark mode: `dark:` variant (requires toggle)
  - Button components: `.btn-primary`, `.btn-outline`
  - Badge pattern: `.badge` base + variant classes → use BOTH: `class="badge badge-spicy"` (dual-class pattern, not composition)

**Assignment Introduction (Presentation)**
- **"Branded Restaurant Website"** — create YOUR OWN restaurant concept
- Must include: custom `@theme` colors (5+), Google Fonts (2), `@apply` components (4+), gradient section, responsive layout, menu cards, badges
- 100-point rubric — walk through key criteria
- "Use a DIFFERENT restaurant concept than Savory Bites. Pick your own name, cuisine, color scheme."
- Due: Before next lecture. Submit via Google Classroom.

**Module Assignment Teaser**
> *"After this assignment, you'll get the Module Assignment: Fashion E-commerce Homepage. It combines EVERYTHING from Lectures 1-7: semantic HTML, responsive design, Tailwind customization, custom themes. The big one. But first, nail this restaurant assignment."*

**Q&A**
- Open floor for questions
- Address any confusion about `@theme` vs `:root`, `@apply` usage, or gradients

**Next Module Teaser**
> *"Module 1 is complete. Your pages are BEAUTIFUL. But they don't DO anything yet. Can't add items to a cart. Can't filter the menu. Can't toggle dark mode. Can't validate a reservation form. That requires LOGIC — JavaScript. Module 2 brings your pages to life. See you Monday."*

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
| Part 1 | Concept-check | `@theme` color generation | Verify understanding of auto-generated utilities |
| Part 1 | Spot-the-error | Missing `--` prefix in `@theme` | Reinforce CSS custom property syntax |
| Part 1 | Hidden-fact-reveal | `:root` vs `@theme` comparison | Show `@theme` generates utilities, not just variables |
| Part 2 | Predict-output | `--font-display` → `font-display` class | Verify namespace pattern understanding |
| Part 2 | Concept-check | Gradient direction and colors | Ensure gradient anatomy comprehension |
| Part 2 | Quick-fire | Namespace matching drill | Reinforce `--color-*` → `bg-*`/`text-*`, `--font-*` → `font-*` |
| Part 3 | Concept-check | `hover:` modifiers inside `@apply` | Confirm `@apply` supports all modifiers |
| Part 3 | Predict-output | `.btn-primary` usage in HTML | Verify students understand component consumption |
| Part 3 | Quick-fire | When to `@apply` vs inline | Build judgment about extraction threshold |
| Part 4 | Predict-output | Inline override of `@apply` styles | Key concept: inline utilities beat `@apply` |
| Part 4 | Concept-check | Advanced vs basic Tailwind comparison | Module perspective on progression |
| Part 4 | Hidden-fact-reveal | Module 1 lecture journey recap | Celebrate progress, build confidence |

---

## Teaching Tips Summary

| Moment | Tip Type | Purpose |
|--------|----------|---------|
| Part 1 opening | Before/After comparison | Show impact of custom branding |
| Part 1 @theme demo | "Aha" moment | One @theme line = entire utility family |
| Part 2 font swap | Visual transformation | System fonts → Playfair Display = dramatic |
| Part 2 gradient | Live coding wow | Custom brand gradient across hero |
| Part 3 nav refactor | DRY relief | 28 class instances → 4 clean references |
| Part 3 @apply rule | Decision framework | "Rule of 3+" — practical threshold |
| Part 4 featured item | Layout mastery | col-span-2 + flex = professional layout |
| Part 4 inline override | Power user tip | @apply base + inline context override |
| Ending module recap | Confidence builder | Lecture 1 → 7 journey celebration |
| Ending freelance tip | Career motivation | Real PKR earning potential |

---

## Emergency Recovery

| Problem | Solution |
|---------|----------|
| reveal.js CDN fails | Use local fallback copy or switch to screen-sharing code directly |
| Tailwind CDN fails | Have offline version or use local CSS file with key utilities |
| Google Fonts fail | Continue with system fonts, show the concept with fallback serif/sans |
| `@theme` not working | Verify `<style type="text/tailwindcss">` — most common issue |
| `@apply` not generating | Check placement inside Tailwind style block, verify utility names |
| Running behind | Skip desserts section (structure identical to starters), summarize footer |
| Running ahead | Add bonus: `ring-*` utilities, gradient text (`bg-clip-text text-transparent`), additional menu section |

---

## Conversion Phrases (Sprinkle Throughout)

- *"This is the difference between a student project and a freelance deliverable — custom branding."*
- *"YouTube tutorials use amber-500. Your CLIENT wants their exact brand hex code. @theme gives them that."*
- *"In 25 years, I've never seen a production site using default framework colors. Customization is non-negotiable."*
- *"7 lectures in, you can build websites people pay for. That's the NexusBerry difference."*

---

## Never Say
- "This is easy/simple" → Say "foundational"
- "You should know this" → Say "Let me show you"
- "Obviously..." → Just explain it
