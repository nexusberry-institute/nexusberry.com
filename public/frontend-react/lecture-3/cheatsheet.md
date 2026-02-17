# CSS Fundamentals & The Box Model Cheatsheet

Quick reference for all CSS concepts covered in Lecture 3.

---

## CSS Rule Anatomy

Every CSS rule follows this structure:

```css
selector {
    property: value;
    property: value;
}
```

**Example:**
```css
h1 {
    color: #E04A7A;
    font-size: 32px;
    text-align: center;
}
```

**Key:** selector → targets HTML elements | property → what to change | value → how to change it

---

## 3 Ways to Add CSS

| Method | Syntax | When to Use |
|--------|--------|-------------|
| **Inline** | `<p style="color: red;">` | Quick testing only — avoid in production |
| **Internal** | `<style>` in `<head>` | Single-page projects, learning |
| **External** | `<link rel="stylesheet" href="style.css">` | Production — best practice |

---

## Selector Types Reference

| Selector | Syntax | Example | Specificity |
|----------|--------|---------|-------------|
| **Element** | `tagname` | `p { }` | 0-0-1 |
| **Class** | `.classname` | `.highlight { }` | 0-1-0 |
| **ID** | `#idname` | `#header { }` | 1-0-0 |
| **Grouping** | `sel1, sel2` | `h1, h2 { }` | Individual |
| **Pseudo-class** | `sel:state` | `a:hover { }` | 0-1-1 |

**Remember:** Dot `.` goes in CSS, NOT in HTML!
```html
<!-- HTML — no dot -->
<p class="highlight">Text</p>
```
```css
/* CSS — dot required */
.highlight { color: red; }
```

---

## Specificity Scoring (0-0-0)

```
Inline styles    →  1-0-0-0  (highest — avoid!)
ID selectors     →  0-1-0-0
Class selectors  →  0-0-1-0
Element selectors→  0-0-0-1  (lowest)
```

**Rules:**
1. Higher specificity ALWAYS wins
2. Equal specificity → last rule wins (the cascade)
3. `!important` overrides everything (never use it)

**Example:**
```css
p { color: blue; }           /* 0-0-1 */
.special { color: red; }     /* 0-1-0 ← WINS */
#unique { color: green; }    /* 1-0-0 ← WINS over both */
```

---

## The Box Model

```
┌──────────────────────────────────────┐
│              MARGIN                  │
│  ┌────────────────────────────────┐  │
│  │           BORDER               │  │
│  │  ┌──────────────────────────┐  │  │
│  │  │        PADDING           │  │  │
│  │  │  ┌──────────────────┐   │  │  │
│  │  │  │     CONTENT      │   │  │  │
│  │  │  │  (text, images)  │   │  │  │
│  │  │  └──────────────────┘   │  │  │
│  │  └──────────────────────────┘  │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Analogy:** Photo (content) → Matting (padding) → Frame (border) → Wall space (margin)

### The Professional Reset

```css
*, *::before, *::after {
    box-sizing: border-box;
}
```

| Box Sizing | Width Includes | Total Width |
|-----------|----------------|-------------|
| `content-box` (default) | Content only | content + padding + border |
| `border-box` (professional) | Content + padding + border | Exactly what you set |

**Example:** `width: 300px; padding: 20px; border: 5px solid;`
- `content-box` → total = 300 + 40 + 10 = **350px**
- `border-box` → total = **300px** (padding + border eat into content)

---

## CSS Colors

| Format | Syntax | Example |
|--------|--------|---------|
| **Named** | `color: red;` | 140+ named colors |
| **Hex** | `color: #RRGGBB;` | `#990147` (NexusBerry) |
| **RGB** | `color: rgb(R, G, B);` | `rgb(153, 1, 71)` |
| **RGBA** | `color: rgba(R, G, B, A);` | `rgba(0, 0, 0, 0.5)` — 50% transparent |

**Pro Tip**: Hex is used ~70% of the time in production. Learn to read hex values.

---

## Common CSS Properties Quick Reference

| What You Want | Property | Example |
|---------------|----------|---------|
| Text color | `color` | `color: #333;` |
| Background color | `background-color` | `background-color: #080D2B;` |
| Font size | `font-size` | `font-size: 18px;` |
| Font family | `font-family` | `font-family: 'Segoe UI', sans-serif;` |
| Bold text | `font-weight` | `font-weight: bold;` or `700` |
| Text alignment | `text-align` | `text-align: center;` |
| Line spacing | `line-height` | `line-height: 1.6;` |
| Letter spacing | `letter-spacing` | `letter-spacing: 0.05em;` |
| Inner spacing | `padding` | `padding: 20px;` |
| Outer spacing | `margin` | `margin: 10px;` |
| Center horizontally | `margin` | `margin: 0 auto;` (needs set width) |
| Border | `border` | `border: 2px solid #990147;` |
| Rounded corners | `border-radius` | `border-radius: 10px;` |
| Circle shape | `border-radius` | `border-radius: 50%;` (on square element) |
| Drop shadow | `box-shadow` | `box-shadow: 4px 8px 16px rgba(0,0,0,0.3);` |
| Remove underlines | `text-decoration` | `text-decoration: none;` |
| Remove list bullets | `list-style` | `list-style: none;` |
| Width | `width` | `width: 350px;` |

---

## Common Mistakes to Avoid

### 1. Missing Semicolons
```css
/* WRONG — font-size also breaks! */
h1 {
    color: blue
    font-size: 24px;
}

/* CORRECT */
h1 {
    color: blue;
    font-size: 24px;
}
```

### 2. Dot in HTML Class Attribute
```html
<!-- WRONG -->
<p class=".highlight">Text</p>

<!-- CORRECT -->
<p class="highlight">Text</p>
```

### 3. Misspelling Properties
```css
/* WRONG — CSS fails silently! */
h1 { colour: red; }

/* CORRECT */
h1 { color: red; }
```

### 4. Forgetting border-box
```css
/* WRONG — element will be wider than 300px */
.box {
    width: 300px;
    padding: 20px;
    border: 5px solid black;
    /* Total: 350px! */
}

/* CORRECT — element is exactly 300px */
*, *::before, *::after {
    box-sizing: border-box;
}
.box {
    width: 300px;
    padding: 20px;
    border: 5px solid black;
    /* Total: 300px */
}
```

---

## VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Space` | CSS property autocomplete |
| `Ctrl + /` | Toggle comment (CSS: `/* */`) |
| `Ctrl + D` | Select next occurrence |
| `Alt + Up/Down` | Move line up/down |
| `Shift + Alt + Down` | Duplicate line |
| Type `bgc` + Tab | Emmet: `background-color: #fff;` |
| Type `fz` + Tab | Emmet: `font-size: ;` |
| Type `bd` + Tab | Emmet: `border: ;` |
| Type `m0a` + Tab | Emmet: `margin: 0 auto;` |

---

## Chrome DevTools: CSS Inspection

### Opening DevTools
- `F12` or `Ctrl + Shift + I`
- Right-click any element → "Inspect"

### Styles Panel
- Shows ALL CSS rules applied to the selected element
- **Strikethrough** = overridden by a more specific rule
- Click any value to edit live
- Toggle checkboxes to enable/disable properties

### Box Model Visualizer
- Located in the "Computed" tab (or bottom of Styles panel)
- **Blue** = content, **Green** = padding, **Yellow** = border, **Orange** = margin
- Hover over each section to highlight it on the page

### Contrast Checker
- Click any `color` value in Styles panel
- Shows contrast ratio against background
- Green checkmark = passes WCAG, Red = fails

---

## What's Next?

In **Lecture 4: Modern Dashboard Layout**, you'll learn:
- **Flexbox** — One-dimensional layout (rows OR columns)
- **CSS Grid** — Two-dimensional layout (rows AND columns)
- **Responsive design basics** — Making layouts adapt to screen sizes
- Building a dashboard with multiple cards side by side

---

*Keep this cheatsheet handy while working on your assignment!*
