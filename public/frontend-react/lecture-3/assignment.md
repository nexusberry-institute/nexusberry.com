# Assignment: Styled Contact Card

## Overview
Create your own styled contact card using CSS, applying the selectors, Box Model properties, and visual styling techniques learned in Lecture 3. This card should represent a real or fictional person with professional styling.

---

## Requirements

Your styled contact card must include:

### 1. HTML Structure
- Valid HTML5 document (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`)
- Semantic elements where appropriate (building on Lectures 1-2)
- At least: one heading, two paragraphs, one list, and one image
- All content inside a card container element

### 2. CSS Implementation

| Element | Requirement |
|---------|-------------|
| **Placement** | Internal `<style>` tag in `<head>` |
| **Element selectors** | At least 3 different element selectors (e.g., `h1`, `p`, `body`) |
| **Class selectors** | At least 3 different class selectors |
| **Pseudo-class** | At least 1 pseudo-class (`:hover` on links or buttons) |
| **Box Model** | Visible use of `padding`, `margin`, and `border` |
| **box-sizing reset** | Universal `*, *::before, *::after { box-sizing: border-box; }` |

### 3. Visual Styling

| Property | Requirement |
|----------|-------------|
| **Colors** | At least 3 colors using hex format (`#RRGGBB`) |
| **Typography** | `font-family` with fallback stack, size hierarchy (heading vs body) |
| **font-weight** | At least 2 different weights |
| **border-radius** | Rounded corners on the card |
| **box-shadow** | Drop shadow on the card |
| **Hover effect** | Visual change on at least one interactive element |

### 4. Technical Requirements
- Single HTML file with internal CSS (no external stylesheets)
- All CSS must be syntactically valid (proper semicolons, braces, colons)
- Card should be horizontally centered on the page
- Code must be well-organized with comments explaining sections

---

## Example Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Contact Card</title>
    <style>
        /* Universal reset */
        *, *::before, *::after {
            box-sizing: border-box;
        }

        /* Body styling */
        body {
            /* your styles */
        }

        /* Card container */
        .card {
            /* width, padding, margin, border-radius, box-shadow */
        }

        /* Profile image */
        .profile-img {
            /* border-radius: 50% for circular */
        }

        /* Name */
        h1 {
            /* font-size, color, font-weight */
        }

        /* Contact links */
        a {
            /* color, text-decoration */
        }

        a:hover {
            /* hover effect */
        }

        /* ... more styles ... */
    </style>
</head>
<body>
    <div class="card">
        <img src="https://picsum.photos/200/200" alt="Your Name" class="profile-img">
        <h1>Your Name</h1>
        <p class="title">Your Role</p>
        <p class="bio">A short bio about yourself...</p>
        <ul class="contact-list">
            <li><a href="mailto:you@example.com">you@example.com</a></li>
            <li><a href="tel:+123456789">+1 234-567-89</a></li>
        </ul>
    </div>
</body>
</html>
```

---

## Resources

- **Placeholder images**: `https://picsum.photos/200/200` (or any size)
- **Color picker**: Search "color picker" in Google for a hex color tool
- **Color contrast checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **CSS reference**: [MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Named colors**: Search "CSS named colors" for the full list of 140+ colors

---

## Submission Instructions

1. Create a single HTML file named `contact-card.html`
2. Test it in your browser — make sure everything displays correctly
3. Open Chrome DevTools and verify the Box Model is as expected
4. Upload to Google Classroom

---

## Pre-Submission Checklist

Before submitting, verify:

- [ ] HTML document is valid (`<!DOCTYPE html>`, proper `<head>` and `<body>`)
- [ ] `<style>` tag is inside `<head>`, not `<body>`
- [ ] `box-sizing: border-box` universal reset is present
- [ ] At least 3 element selectors used
- [ ] At least 3 class selectors used
- [ ] At least 1 pseudo-class (`:hover`) used
- [ ] Padding, margin, and border are all visibly applied
- [ ] At least 3 hex colors used
- [ ] `font-family` has a fallback font
- [ ] Card has `border-radius` and `box-shadow`
- [ ] Hover effect works on at least one element
- [ ] Card is centered on the page
- [ ] Code has comments explaining sections
- [ ] Creative addition is included

---

## Grading Criteria

| Criteria | Points |
|----------|--------|
| CSS syntax correctness (valid rules, semicolons, selectors) | 10 |
| Selector usage (element, class, at least 1 pseudo-class `:hover`) | 15 |
| Box Model application (padding, margin, border all visible) | 15 |
| `box-sizing: border-box` reset applied | 5 |
| Color scheme (3+ colors, hex format) | 10 |
| Typography (font-family with fallback, size hierarchy, weight) | 10 |
| Visual polish (border-radius, box-shadow, hover effects) | 10 |
| Semantic HTML structure (proper elements, valid document) | 10 |
| Code organization (comments, indentation, readability) | 5 |
| Creative addition (feature beyond in-class demo) | 10 |
| **Total** | **100** |

---

## Tips for Success

1. **Start with HTML first** — get all your content structured before adding any CSS
2. **Style one section at a time** — body first, then card, then typography, then colors
3. **Refresh your browser after every change** — catch issues immediately
4. **Use Chrome DevTools** — inspect elements to verify your Box Model values
5. **Don't copy the in-class code exactly** — make it YOUR card with your own design choices

---

## Creative Addition Ideas (10 points)

Want inspiration? Here are some ideas for the creative addition:

- A gradient background (`background: linear-gradient(...)`)
- A decorative top/bottom border with a different color
- A "dark mode / light mode" look (dark card on light background or vice versa)
- An emoji-based skill bar or rating system
- Custom styled horizontal rule (`<hr>`) as a divider
- A second card with different styling (colleague, friend, etc.)

---

## Common Mistakes to Avoid

- **Dot in HTML**: `class=".card"` is WRONG → `class="card"` is correct
- **Missing semicolons**: `color: blue` without `;` breaks the next property too
- **Misspelled properties**: `colour`, `backgorund-color` fail silently
- **No fallback font**: `font-family: 'Fancy Font';` without sans-serif fallback
- **content-box math**: Without `border-box`, padding adds to your width unexpectedly
- **Poor contrast**: Light text on light background (or dark on dark) is hard to read

---

## Need Help?

- Review the lecture recording
- Check the `cheatsheet.md` file for quick reference
- Open Chrome DevTools on ANY website and inspect how professional sites use CSS
- Post questions in the Google Classroom comments
- Attend office hours (schedule TBA)

You've written your first CSS today — that's a huge milestone. Now make it yours! &#127912;
