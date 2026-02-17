# Assignment: Interactive Team Directory Layout

## Overview
Build a professional team directory page using both CSS Grid (page structure) and Flexbox (component layout), applying the layout techniques learned in Lecture 4. The directory should display team member cards in a responsive grid.

---

## Requirements

Your team directory must include:

### 1. Page Layout (Grid)
- Full-page Grid structure with **header**, **main content area**, and **footer**
- Header and footer must span the full width using `grid-column: 1 / -1`
- Use `min-height: 100vh` for a full-screen layout
- Optional: include a sidebar for extra challenge

### 2. Navigation Bar (Flexbox)

| Element | Requirement |
|---------|-------------|
| **Container** | `display: flex` with `justify-content: space-between` and `align-items: center` |
| **Logo** | Company/team name on the left side |
| **Nav links** | At least 3 navigation links on the right side (use a nested flex container) |
| **Hover effects** | Links change color on hover |
| **Gap** | Use `gap` property for spacing between nav links |

### 3. Team Cards Grid
- Display team member cards using CSS Grid
- Use `repeat(auto-fit, minmax(250px, 1fr))` for responsive wrapping
- Each card must include: profile image, name, role/title, and a short bio or contact info
- Use `gap` for spacing between cards

### 4. Card Internals (Flexbox)
- Each card's content must be laid out using Flexbox
- `flex-direction: column` for vertical arrangement
- `align-items: center` for centered content
- Consistent padding and spacing within cards

### 5. Grid Spanning
- At least **one card** must span 2 columns (e.g., a "Team Lead" or "Featured" card)
- Use `grid-column: span 2` for the spanning card

### 6. Technical Requirements
- Single HTML file with internal CSS
- Universal `box-sizing: border-box` reset
- Semantic HTML structure (`<header>`, `<main>`, `<footer>`, `<nav>`)
- NexusBerry dark theme or your own professional color scheme

---

## Example Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Team Directory</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Page Grid */
        .page {
            display: grid;
            grid-template-rows: auto 1fr auto;
            min-height: 100vh;
        }

        /* Header with Flexbox nav */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            /* ... */
        }

        /* Team Cards Grid */
        .team-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            /* ... */
        }

        /* Individual Card (Flexbox) */
        .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            /* ... */
        }

        /* Featured card spans 2 columns */
        .card.featured {
            grid-column: span 2;
        }

        /* Footer */
        .footer {
            /* centered text */
        }
    </style>
</head>
<body>
    <div class="page">
        <header class="header">
            <span class="logo">Team Name</span>
            <nav><!-- flex nav links --></nav>
        </header>
        <main>
            <div class="team-grid">
                <div class="card featured"><!-- Team Lead --></div>
                <div class="card"><!-- Member --></div>
                <div class="card"><!-- Member --></div>
                <!-- ... more cards ... -->
            </div>
        </main>
        <footer class="footer"><!-- copyright --></footer>
    </div>
</body>
</html>
```

---

## Resources

- **Placeholder images**: `https://picsum.photos/200/200` (or use `https://picsum.photos/id/{N}/200/200` for consistent images)
- **Color picker**: Search "color picker" in Google for a hex color tool
- **CSS Grid guide**: [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)
- **Flexbox guide**: [MDN Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
- **Grid visual tool**: [CSS Grid Generator](https://cssgrid-generator.netlify.app/)

---

## Submission Instructions

1. Create a single HTML file named `team-directory.html`
2. Test it in your browser at full width AND resized (test responsive wrapping)
3. Open Chrome DevTools — verify Grid and Flexbox overlays show correct layout
4. Upload to Google Classroom

---

## Pre-Submission Checklist

Before submitting, verify:

- [ ] `box-sizing: border-box` universal reset is present
- [ ] Page uses CSS Grid for overall layout (header, main, footer)
- [ ] Header/footer span full width with `grid-column: 1 / -1` or similar
- [ ] Navigation bar uses Flexbox with `justify-content: space-between`
- [ ] Team cards use Grid with `repeat(auto-fit, minmax(...))` pattern
- [ ] Card internals use Flexbox with `flex-direction: column`
- [ ] At least one card spans 2 columns
- [ ] Nav links have hover effects
- [ ] Cards have hover effects
- [ ] Resizing the browser causes cards to reflow (responsive)
- [ ] Semantic HTML elements used (`<header>`, `<main>`, `<footer>`, `<nav>`)
- [ ] Code has comments explaining Grid and Flexbox sections
- [ ] Creative addition is included

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| Grid page layout (header, main, footer spanning) | 15 |
| Flexbox navigation bar (logo + links, space-between, hover) | 15 |
| Team cards grid (auto-fit + minmax, responsive) | 15 |
| Card internals using Flexbox (centered, vertical layout) | 10 |
| Grid spanning (at least one card spans 2 columns) | 5 |
| Visual styling (colors, border-radius, box-shadow, typography) | 10 |
| Hover effects (nav links + cards) | 5 |
| Semantic HTML structure | 5 |
| box-sizing: border-box reset | 5 |
| Code organization (comments, indentation) | 5 |
| Creative addition (feature beyond in-class demo) | 10 |
| **Total** | **100** |

---

## Tips for Success

1. **Start with the Grid skeleton** — get header, main, footer working before adding content
2. **Add the nav bar next** — Flexbox with space-between for logo + links
3. **Build one card first** — then duplicate it for the grid
4. **Test responsiveness** — resize the browser at every step to verify auto-fit wrapping
5. **Use DevTools Grid inspector** — toggle the overlay to verify your grid lines

---

## Creative Addition Ideas (10 points)

- Add a sidebar with team statistics or department filters
- Include a search bar in the header (styled with Flexbox)
- Create a "department" color coding system for card borders
- Add a footer with multiple columns using Grid
- Use CSS transitions for smooth hover effects (e.g., card lift on hover)
- Add a "view profile" button inside each card (styled with Flexbox)
- Make the featured card visually distinct with a glow effect or gradient border

---

## Common Mistakes to Avoid

- **Flexbox properties on Grid containers**: `justify-content` works differently in Grid vs Flexbox
- **Forgetting `display: grid` or `display: flex`**: template/flex properties do nothing without them
- **Using `fr` units outside of Grid**: `fr` only works in `grid-template-columns/rows`
- **Fixed widths on all cards**: Use `auto-fit` + `minmax` instead for responsiveness
- **Not testing at different widths**: Resize your browser to verify the layout adapts
- **Missing `min-height: 100vh`**: Without it, the page won't fill the screen

---

## Need Help?

- Review the lecture recording
- Check the `cheatsheet.md` file for quick reference
- Open Chrome DevTools on the in-class dashboard project and inspect the Grid/Flexbox layout
- Post questions in the Google Classroom comments
- Attend office hours (schedule TBA)

You've mastered two of the most powerful CSS layout systems today. Now combine them into something you're proud of!
