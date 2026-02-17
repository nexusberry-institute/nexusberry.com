# Lecture 4: Portal Quiz (10 MCQs)

**Instructions:** Complete this quiz on the online portal **before Lecture 5**.
These questions evaluate your understanding of the concepts covered in Lecture 4.
You may refer to the cheatsheet and lecture recording while attempting.

---

## Question 1

**Question:** What does `display: flex` do to an element's direct children?

- A) Nothing — it only changes the element itself
- B) Makes them float left
- C) Arranges them in a row (by default) as flex items
- D) Stacks them on top of each other

**Answer:** C) Arranges them in a row (by default) as flex items

**Explanation:** `display: flex` turns the element into a flex container, and its direct children become flex items. By default (`flex-direction: row`), items are arranged in a horizontal row. Option A is wrong because flex affects the children's layout. Option B describes the old `float` behavior, not Flexbox. Option D describes absolute positioning, not Flexbox.

---

## Question 2

**Question:** What is the default value of `flex-direction`?

- A) `column`
- B) `row`
- C) `wrap`
- D) `inline`

**Answer:** B) `row`

**Explanation:** The default `flex-direction` is `row`, which arranges items from left to right along the horizontal main axis. `column` (A) would need to be set explicitly. `wrap` (C) is a value for `flex-wrap`, not `flex-direction`. `inline` (D) is not a valid `flex-direction` value.

---

## Question 3

**Question:** Which CSS property creates a grid container?

- A) `grid-template-columns: 1fr 1fr`
- B) `display: grid`
- C) `grid: on`
- D) `layout: grid`

**Answer:** B) `display: grid`

**Explanation:** Just like `display: flex` creates a flex container, `display: grid` creates a grid container. Option A defines columns but without `display: grid`, it does nothing. Options C and D are not valid CSS properties. You must always set `display: grid` before using any `grid-template-*` properties.

---

## Question 4

**Question:** What does the `fr` unit represent in CSS Grid?

- A) A fixed size of 1 pixel
- B) A percentage of the viewport width
- C) A fraction of the remaining available space
- D) A font-relative unit like `em`

**Answer:** C) A fraction of the remaining available space

**Explanation:** The `fr` unit stands for "fraction" and distributes the remaining space in the grid container proportionally. For example, `1fr 2fr` gives the second column twice the space of the first. It's not a fixed unit (A), not viewport-based (B), and not font-relative (D). The `fr` unit only works inside `grid-template-columns` and `grid-template-rows`.

---

## Question 5

**Context:**
```css
.container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    /* Container width: 400px, gap: 0 */
}
```

**Question:** How wide is each column?

- A) 200px and 200px
- B) 133px and 267px
- C) 100px and 300px
- D) 50px and 350px

**Answer:** C) 100px and 300px

**Explanation:** Total fr = 1 + 3 = 4 parts. Each fr = 400px ÷ 4 = 100px. First column: 1fr = 100px. Second column: 3fr = 300px. Option A splits evenly (ignoring the ratio). Option B uses division by 3 instead of 4. Option D miscalculates the ratio.

---

## Question 6

**Context:**
```css
.item-a { flex-grow: 1; }
.item-b { flex-grow: 3; }
```

**Question:** If there is 200px of extra space in the flex container, how is it distributed?

- A) A gets 100px, B gets 100px (split equally)
- B) A gets 50px, B gets 150px
- C) B gets all 200px, A gets nothing
- D) A gets 67px, B gets 133px

**Answer:** B) A gets 50px, B gets 150px

**Explanation:** Total flex-grow = 1 + 3 = 4 parts. A gets 1/4 of 200px = 50px. B gets 3/4 of 200px = 150px. `flex-grow` distributes extra space proportionally based on the ratio, not equally (A) and not exclusively to the highest value (C). Option D divides by 3 instead of 4.

---

## Question 7

**Context:**
```css
.container {
    display: flex;
    align-items: space-between;
}
```

**Question:** What is wrong with this code?

- A) Nothing — this is valid CSS
- B) `space-between` is not a valid value for `align-items`
- C) `align-items` should be `align-content`
- D) `display: flex` doesn't support `align-items`

**Answer:** B) `space-between` is not a valid value for `align-items`

**Explanation:** `align-items` accepts `stretch`, `flex-start`, `flex-end`, `center`, and `baseline`. The `space-between` value only works with `justify-content` (and `align-content` for multi-line flex). This is a common confusion — `space-*` values distribute space along an axis, while `align-items` positions items at a specific point on the cross axis.

---

## Question 8

**Context:**
```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
}
```

**Question:** What does this code achieve?

- A) Creates exactly 4 equal columns that never change
- B) Creates a responsive grid where columns automatically adjust from multiple columns to 1 column as the screen shrinks
- C) Creates columns that are always exactly 250px wide
- D) Only works with JavaScript to detect screen size

**Answer:** B) Creates a responsive grid where columns automatically adjust from multiple columns to 1 column as the screen shrinks

**Explanation:** `auto-fit` creates as many columns as will fit in the container. `minmax(250px, 1fr)` ensures each column is at least 250px and grows to fill remaining space. As the container shrinks, columns drop to the next row — from 4 to 3 to 2 to 1 — with no media queries or JavaScript needed. Option A describes fixed columns. Option C ignores the `1fr` maximum. Option D is wrong — this is pure CSS.

---

## Question 9

**Context:**
```css
.dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: 60px 1fr 40px;
    min-height: 100vh;
}

.header { grid-column: 1 / -1; }
.sidebar { /* no grid-column set */ }
.main { /* no grid-column set */ }
.footer { grid-column: 1 / -1; }
```

**Question:** Which statement correctly describes this layout?

- A) The header and footer are in the sidebar column only
- B) The sidebar is 1fr wide and the main content is 250px
- C) The header and footer span full width; sidebar is 250px; main content fills the rest
- D) All elements stack vertically in a single column

**Answer:** C) The header and footer span full width; sidebar is 250px; main content fills the rest

**Explanation:** `grid-column: 1 / -1` makes header and footer span from the first to last grid line (full width). The sidebar naturally falls into the first column (250px) and main into the second column (1fr = remaining space). Three rows are defined: 60px header, flexible middle, 40px footer. Option A ignores the spanning. Option B reverses the column sizes. Option D ignores the 2-column grid definition.

---

## Question 10

**Question:** You need to build a page with a fixed sidebar, a header across the top, and a main content area. Inside the main area, you have a navigation bar with a logo and links. Which layout approach is best?

- A) Use Flexbox for everything — it handles all layouts
- B) Use CSS Grid for everything — it's more powerful
- C) Use Grid for the page structure (sidebar, header, main) and Flexbox for the nav bar inside main
- D) Use HTML tables for the page layout and CSS for the nav bar

**Answer:** C) Use Grid for the page structure (sidebar, header, main) and Flexbox for the nav bar inside main

**Explanation:** CSS Grid excels at two-dimensional page layouts (defining rows AND columns for headers, sidebars, and content areas). Flexbox excels at one-dimensional component layouts (arranging items in a single row or column, like a nav bar). Using both together — Grid for macro layout, Flexbox for micro components — is the professional best practice. Option A would work but is harder for 2D page layouts. Option B would work but is overkill for a simple nav bar. Option D uses outdated table-based layouts.

---

## Self-Assessment

After completing the quiz, rate your understanding:

| Topic | Confident | Need Review | Lost |
|-------|-----------|-------------|------|
| Flexbox container properties (display, direction, justify, align, gap) | [ ] | [ ] | [ ] |
| Flex item properties (flex-grow, flex-shrink, flex-basis, flex: 1) | [ ] | [ ] | [ ] |
| CSS Grid container (display, grid-template-columns/rows, gap) | [ ] | [ ] | [ ] |
| Grid placement (grid-column, spanning, fr unit) | [ ] | [ ] | [ ] |
| Flexbox vs Grid decision (when to use which) | [ ] | [ ] | [ ] |

If you marked "Need Review" or "Lost" on any topic, revisit the cheatsheet and lecture recording before the next class.
