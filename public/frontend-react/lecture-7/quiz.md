# Lecture 7: Portal Quiz (10 MCQs)

**Instructions:** Complete this quiz on the online portal **before Lecture 8**.
These questions evaluate your understanding of the concepts covered in Lecture 7: Advanced Tailwind & Customization.
You may refer to the cheatsheet and lecture recording while attempting.

---

## Question 1

**Context:**
```html
<style type="text/tailwindcss">
    @theme {
        --color-primary: #2563EB;
    }
</style>
```

**Question:** What Tailwind utility classes does this `@theme` definition automatically generate?

- A) Only `bg-primary`
- B) `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, and all other color utilities
- C) Nothing — `@theme` only creates CSS variables, not utility classes
- D) Only `color-primary` as a single class

**Answer:** B) `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, and all other color utilities

**Explanation:** The `@theme` directive with the `--color-*` namespace generates the ENTIRE family of color utility classes — `bg-primary`, `text-primary`, `border-primary`, `ring-primary`, `shadow-primary`, etc. This is the key difference between `@theme` and regular `:root` CSS variables — `@theme` speaks Tailwind's language and auto-generates utilities.

---

## Question 2

**Context:**
```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style>
    @theme {
        --color-brand: #8B1A1A;
    }
</style>
<body>
    <h1 class="text-brand">Hello</h1>
</body>
```

**Question:** The heading does NOT show the brand color. What's wrong?

- A) The hex code `#8B1A1A` is invalid
- B) `text-brand` is not a valid Tailwind class
- C) The `<style>` tag is missing `type="text/tailwindcss"` — should be `<style type="text/tailwindcss">`
- D) `@theme` only works with the npm version, not CDN

**Answer:** C) The `<style>` tag is missing `type="text/tailwindcss"` — should be `<style type="text/tailwindcss">`

**Explanation:** For the Tailwind CSS CDN to process `@theme` and `@apply` directives, the `<style>` tag MUST have `type="text/tailwindcss"`. Without it, the browser treats `@theme` as an unknown CSS at-rule and ignores it. This is the #1 setup mistake with Tailwind v4 CDN customization.

---

## Question 3

**Context:**
```css
@theme {
    --brand: #8B1A1A;
    --sage: #7C9070;
}
```

**Question:** Why won't `bg-brand` and `text-sage` work with this `@theme` block?

- A) The hex codes are wrong
- B) The variable names are missing the `--color-` namespace prefix — should be `--color-brand` and `--color-sage`
- C) You can only define one color per `@theme` block
- D) `@theme` doesn't support color definitions

**Answer:** B) The variable names are missing the `--color-` namespace prefix — should be `--color-brand` and `--color-sage`

**Explanation:** Tailwind v4's `@theme` uses namespaces to know what type of utility to generate. `--color-*` generates color utilities (`bg-*`, `text-*`, `border-*`). `--font-*` generates font utilities (`font-*`). Without the correct namespace prefix, Tailwind doesn't know these are colors and won't generate any utility classes.

---

## Question 4

**Context:**
```css
.btn-primary {
    @apply bg-brand text-cream font-semibold py-3 px-8 rounded-lg;
}
```

**Question:** How do you use this extracted component in HTML?

- A) `<button apply="btn-primary">Click</button>`
- B) `<button class="@apply btn-primary">Click</button>`
- C) `<button class="btn-primary">Click</button>`
- D) `<button style="btn-primary">Click</button>`

**Answer:** C) `<button class="btn-primary">Click</button>`

**Explanation:** `@apply` extracts Tailwind utility combinations into a regular CSS class. You use it exactly like any CSS class — with the `class` attribute. The `@apply` directive only appears in the `<style>` block definition, not in HTML. The class `btn-primary` now contains all those utility styles packed into one name.

---

## Question 5

**Context:**
```css
@theme {
    --font-display: 'Playfair Display', serif;
    --font-body: 'Inter', sans-serif;
}
```

**Question:** What Tailwind classes do these generate, and what do you need besides `@theme` for the fonts to actually render?

- A) `font-display` and `font-body` — and that's all you need
- B) `font-display` and `font-body` — but you also need Google Fonts `<link>` tags to load the font files
- C) `text-display` and `text-body` — with Google Fonts links
- D) `family-display` and `family-body` — with a font CSS file

**Answer:** B) `font-display` and `font-body` — but you also need Google Fonts `<link>` tags to load the font files

**Explanation:** `@theme` with `--font-*` generates `font-*` utility classes (same namespace pattern as colors). But `@theme` only REGISTERS the font name with Tailwind — it doesn't download the font files. You still need `<link>` tags to Google Fonts (or another font source) to actually load Playfair Display and Inter into the browser. Without those links, the browser falls back to the fallback font (serif/sans-serif).

---

## Question 6

**Context:**
```html
<section class="bg-gradient-to-br from-brand via-brand-dark to-charcoal">
```

**Question:** What does this gradient create?

- A) A horizontal gradient from left to right
- B) A diagonal gradient from top-left to bottom-right, transitioning from brand → brand-dark → charcoal
- C) A radial gradient from center outward
- D) A vertical gradient from top to bottom

**Answer:** B) A diagonal gradient from top-left to bottom-right, transitioning from brand → brand-dark → charcoal

**Explanation:** `bg-gradient-to-br` creates a gradient going "to bottom-right" — meaning it starts at the top-left and ends at the bottom-right (diagonal). `from-brand` is the start color, `via-brand-dark` is the middle color (for smooth transition), and `to-charcoal` is the end color. The `via-*` color prevents a harsh direct transition between brand and charcoal.

---

## Question 7

**Context:**
You have 6 menu cards on your page, each with these identical classes:
```html
<div class="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300">
```

**Question:** Should you extract this into an `@apply` component?

- A) No — `@apply` should never be used for layout classes
- B) Yes — this pattern repeats 6 times, exceeding the "Rule of 3+" threshold
- C) No — you should only use `@apply` for colors
- D) Yes — every single class should always be extracted with `@apply`

**Answer:** B) Yes — this pattern repeats 6 times, exceeding the "Rule of 3+" threshold

**Explanation:** The "Rule of 3+" says: if a utility pattern repeats 3 or more times, extract it with `@apply`. With 6 cards sharing identical classes (90 class instances!), this is a perfect candidate: `.menu-card { @apply bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-300; }`. Now each card just needs `class="menu-card"` — and changing the hover effect means editing ONE line, not six.

---

## Question 8

**Context:**
```css
.btn-primary {
    @apply bg-brand text-cream py-3 px-8 rounded-lg;
}
```

```html
<button class="btn-primary bg-sage text-charcoal">Special Button</button>
```

**Question:** What background and text color will this button have?

- A) `bg-brand` and `text-cream` — `@apply` always wins
- B) `bg-sage` and `text-charcoal` — inline utilities override `@apply` defaults
- C) Error — you can't mix `@apply` classes with inline utilities
- D) Both colors combine (brand + sage background, cream + charcoal text)

**Answer:** B) `bg-sage` and `text-charcoal` — inline utilities override `@apply` defaults

**Explanation:** When inline utility classes conflict with `@apply` defaults, the inline utilities win. The `@apply` in `.btn-primary` sets `bg-brand text-cream` as the default, but `bg-sage text-charcoal` on the element overrides those specific properties. This is intentional — it lets you create a base component with `@apply` and then customize specific instances with inline utilities.

---

## Question 9

**Context:**
```html
<style type="text/tailwindcss">
    @theme {
        --color-ocean: #1E3A5F;
        --color-sand: #F5E6CC;
        --color-coral: #FF6B6B;
        --font-heading: 'Merriweather', serif;
        --font-text: 'Open Sans', sans-serif;
    }

    .card {
        @apply bg-sand rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300;
    }
    .btn {
        @apply bg-ocean text-sand font-semibold py-2 px-6 rounded-lg hover:bg-coral transition duration-300;
    }
</style>

<body class="bg-sand text-ocean font-text">
    <h1 class="font-heading text-4xl text-ocean">Beach Cafe</h1>
    <div class="card">
        <h3 class="font-heading text-coral">Fish Tacos</h3>
        <button class="btn">Order Now</button>
    </div>
</body>
```

**Question:** How many Tailwind customization techniques are used correctly in this code?

- A) 1 — only `@theme` colors
- B) 2 — `@theme` colors and `@apply`
- C) 3 — `@theme` colors, `@theme` fonts, and `@apply` component extraction
- D) 0 — there are errors preventing anything from working

**Answer:** C) 3 — `@theme` colors, `@theme` fonts, and `@apply` component extraction

**Explanation:** This code correctly uses three Lecture 7 techniques: (1) `@theme` custom colors (`--color-ocean`, `--color-sand`, `--color-coral`) generating utilities like `bg-ocean`, `text-sand`, `text-coral`; (2) `@theme` custom fonts (`--font-heading`, `--font-text`) generating `font-heading` and `font-text` classes; (3) `@apply` component extraction (`.card` and `.btn` with hover modifiers). All inside `<style type="text/tailwindcss">` — the setup is correct.

---

## Question 10

**Context:**
```html
<style type="text/tailwindcss">
    @theme {
        --color-forest: #2D5016;
        --font-brand: 'Georgia', serif;
    }

    .hero-btn {
        @apply bg-forest text-white py-3 px-8 rounded-full
               hover:bg-green-700 transition duration-300;
    }
</style>

<section class="bg-gradient-to-b from-forest to-green-900 min-h-screen">
    <h1 class="font-brand text-5xl text-white">Welcome</h1>
    <button class="hero-btn">Explore</button>
    <button class="hero-btn bg-white text-forest">Learn More</button>
</section>
```

**Question:** Which statement is TRUE about this code?

- A) The gradient won't work because `from-forest` is a custom color but `to-green-900` is a default color — you can't mix them
- B) The second button ("Learn More") will have a white background and forest text because inline utilities override `@apply`
- C) `font-brand` won't work because `--font-brand` uses a system font (Georgia), not a Google Font
- D) The `.hero-btn` class won't apply `hover:bg-green-700` because you can't mix custom and default colors in `@apply`

**Answer:** B) The second button ("Learn More") will have a white background and forest text because inline utilities override `@apply`

**Explanation:** Option B is correct: inline utilities (`bg-white text-forest`) override the `@apply` defaults (`bg-forest text-white`) on the second button. Option A is wrong — you CAN mix custom `@theme` colors with default Tailwind colors in gradients and everywhere else. Option C is wrong — `--font-brand` works with any font (Google, system, or custom) as long as it's available. Option D is wrong — mixing custom and default colors in `@apply` works perfectly fine.

---

## Self-Assessment

After completing the quiz, rate your understanding:

| Topic | Confident | Need Review | Lost |
|-------|-----------|-------------|------|
| `@theme` directive syntax | [ ] | [ ] | [ ] |
| `type="text/tailwindcss"` requirement | [ ] | [ ] | [ ] |
| Color namespace (`--color-*`) | [ ] | [ ] | [ ] |
| Font namespace (`--font-*`) | [ ] | [ ] | [ ] |
| `@apply` component extraction | [ ] | [ ] | [ ] |
| When to use `@apply` (Rule of 3+) | [ ] | [ ] | [ ] |
| Gradient syntax (from, via, to) | [ ] | [ ] | [ ] |
| Overriding `@apply` with inline utilities | [ ] | [ ] | [ ] |

If you marked "Need Review" or "Lost" on any topic, revisit the cheatsheet and lecture recording before the next class.
