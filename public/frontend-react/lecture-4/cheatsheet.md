# Flexbox & CSS Grid Mastery Cheatsheet

Quick reference for all layout concepts covered in Lecture 4.

---

## Flexbox Container Properties

Apply these to the **parent** element (`display: flex`).

| Property | Values | Example |
|----------|--------|---------|
| `display` | `flex` | `display: flex;` |
| `flex-direction` | `row` (default), `column`, `row-reverse`, `column-reverse` | `flex-direction: column;` |
| `flex-wrap` | `nowrap` (default), `wrap`, `wrap-reverse` | `flex-wrap: wrap;` |
| `justify-content` | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` | `justify-content: space-between;` |
| `align-items` | `stretch` (default), `flex-start`, `flex-end`, `center`, `baseline` | `align-items: center;` |
| `gap` | Any length value | `gap: 16px;` |

**Key Rule:** `justify-content` = main axis (horizontal in row). `align-items` = cross axis (vertical in row).

---

## Flexbox Item Properties

Apply these to the **child** elements inside a flex container.

| Property | Values | Example |
|----------|--------|---------|
| `flex-grow` | Number (default: 0) | `flex-grow: 1;` |
| `flex-shrink` | Number (default: 1) | `flex-shrink: 0;` |
| `flex-basis` | Length or `auto` (default) | `flex-basis: 200px;` |
| `flex` | Shorthand for grow/shrink/basis | `flex: 1;` (= `1 1 0%`) |
| `align-self` | `auto`, `flex-start`, `flex-end`, `center`, `stretch` | `align-self: flex-end;` |
| `order` | Integer (default: 0) | `order: -1;` (moves first) |

**The 90% Shorthand:**
```css
.item { flex: 1; }
/* Expands to: flex-grow: 1; flex-shrink: 1; flex-basis: 0%; */
```

---

## CSS Grid Container Properties

Apply these to the **parent** element (`display: grid`).

| Property | Values | Example |
|----------|--------|---------|
| `display` | `grid` | `display: grid;` |
| `grid-template-columns` | Sizes (px, fr, %, auto) | `grid-template-columns: 250px 1fr;` |
| `grid-template-rows` | Sizes (px, fr, %, auto) | `grid-template-rows: 60px 1fr 40px;` |
| `gap` | Any length value | `gap: 16px;` |

**Shorthand with `repeat()`:**
```css
grid-template-columns: repeat(3, 1fr);
/* Same as: 1fr 1fr 1fr */
```

---

## CSS Grid Item Properties

Apply these to **child** elements inside a grid container.

| Property | Values | Example |
|----------|--------|---------|
| `grid-column` | start / end | `grid-column: 1 / 3;` (spans 2 cols) |
| `grid-column` | `1 / -1` | Full width (first to last line) |
| `grid-column` | `span N` | `grid-column: span 2;` |
| `grid-row` | start / end | `grid-row: 1 / 3;` (spans 2 rows) |

---

## The `fr` Unit

The `fr` unit represents a **fraction of the remaining space** in the grid container.

```css
grid-template-columns: 1fr 2fr 1fr;
/* On an 800px container (no gap):
   Total fr = 1 + 2 + 1 = 4
   1fr = 800 / 4 = 200px
   Columns: 200px | 400px | 200px */
```

**Mix with fixed values:**
```css
grid-template-columns: 250px 1fr;
/* 250px sidebar, remaining space for main content */
```

---

## The Magic Responsive Pattern

One line. No media queries. Responsive card grid:

```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
}
```

**How it works:**
- `auto-fit`: Create as many columns as will fit
- `minmax(250px, 1fr)`: Each column is at least 250px, grows to fill remaining space
- **Result:** 4 columns on wide screens → 3 → 2 → 1 on narrow screens — automatically!

---

## Flexbox vs Grid Decision Guide

| Scenario | Use | Why |
|----------|-----|-----|
| Navigation bar (logo + links) | **Flexbox** | One-dimensional row |
| Page layout (header, sidebar, main, footer) | **Grid** | Two-dimensional structure |
| Equal-width card row | **Flexbox** | `flex: 1` on items |
| Responsive card grid (auto-wrapping) | **Grid** | `auto-fit` + `minmax()` |
| Centering a single element | **Both** | Flexbox or Grid — both work |
| Sidebar + main content | **Grid** | `grid-template-columns: 250px 1fr` |
| Button group / tag list | **Flexbox** | Wrapping row of items |
| Full page dashboard | **Grid + Flexbox** | Grid for layout, Flex for components |

**Rule of thumb:** Grid for the big picture (macro layout), Flexbox for the details (micro layout).

---

## Common Mistakes to Avoid

### 1. Flex Properties on Wrong Element
```css
/* WRONG — justify-content goes on the CONTAINER */
.item { justify-content: center; }

/* CORRECT — put it on the parent */
.container {
    display: flex;
    justify-content: center;
}
```

### 2. Invalid align-items Value
```css
/* WRONG — space-between is for justify-content only */
.container {
    display: flex;
    align-items: space-between;
}

/* CORRECT — use a valid value */
.container {
    display: flex;
    align-items: center; /* or flex-start, flex-end, stretch, baseline */
}
```

### 3. Using fr Outside of Grid
```css
/* WRONG — fr only works with grid-template-columns/rows */
.item { width: 1fr; }

/* CORRECT — use fr in grid templates */
.container {
    display: grid;
    grid-template-columns: 1fr 2fr;
}
```

### 4. Forgetting display: grid/flex
```css
/* WRONG — template properties do nothing without display: grid */
.container {
    grid-template-columns: 1fr 1fr 1fr;
}

/* CORRECT */
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}
```

---

## VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| Type `df` + Tab | Emmet: `display: flex;` |
| Type `dg` + Tab | Emmet: `display: grid;` |
| Type `jcc` + Tab | Emmet: `justify-content: center;` |
| Type `aic` + Tab | Emmet: `align-items: center;` |
| `Ctrl + Space` | CSS property autocomplete |
| `Ctrl + /` | Toggle comment |
| `Ctrl + D` | Select next occurrence |
| `Alt + Up/Down` | Move line up/down |
| `Shift + Alt + Down` | Duplicate line |

---

## Chrome DevTools Layout Tools

### Flexbox Inspector
- Select a flex container in Elements panel
- Look for the **flex** badge next to the element
- Click the badge to toggle the Flexbox overlay
- Shows main axis direction, item boundaries, and gap visualization

### Grid Inspector
- Select a grid container in Elements panel
- Look for the **grid** badge next to the element
- Click the badge to toggle the Grid overlay
- Shows grid lines, track sizes, line numbers, and area names

### Layout Panel
- Open DevTools → **Layout** tab
- Lists all Flex and Grid containers on the page
- Toggle overlays for multiple containers simultaneously
- Customize overlay colors and display options

---

## What's Next?

In **Lecture 5: Advanced CSS & Responsive Design**, you'll learn:
- Media queries for different screen sizes
- Mobile-first vs desktop-first strategy
- Responsive units (rem, em, vw, vh)
- Making your dashboard truly responsive on every device

---

*Keep this cheatsheet handy while working on your assignment!*
