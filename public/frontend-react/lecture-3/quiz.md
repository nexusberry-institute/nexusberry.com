# Lecture 3: Portal Quiz (10 MCQs)

**Instructions:** Complete this quiz on the online portal **before Lecture 4**.
These questions evaluate your understanding of the concepts covered in Lecture 3.
You may refer to the cheatsheet and lecture recording while attempting.

---

## Question 1

**Question:** Which of the following correctly shows the structure of a CSS rule?

- A) `h1 = color: red;`
- B) `h1 { color: red; }`
- C) `h1 (color: red;)`
- D) `h1 [color = red]`

**Answer:** B) `h1 { color: red; }`

**Explanation:** A CSS rule consists of a selector (`h1`), followed by curly braces `{ }` containing property-value pairs separated by colons and terminated with semicolons. Option A uses an equals sign (not CSS syntax). Option C uses parentheses (not valid). Option D uses square brackets and equals (that's attribute selector syntax, not a rule declaration).

---

## Question 2

**Question:** Where should the `<style>` tag be placed in an HTML document for internal CSS?

- A) Inside the `<body>` tag
- B) Inside the `<head>` tag
- C) After the closing `</html>` tag
- D) Inside a `<div>` tag

**Answer:** B) Inside the `<head>` tag

**Explanation:** The `<style>` tag belongs inside `<head>` so the browser can load CSS rules before rendering content. While placing it in `<body>` (A) may technically work in some browsers, it's invalid HTML and can cause a "flash of unstyled content." Options C and D are invalid placements.

---

## Question 3

**Context:**
```html
<p class="highlight">Important text</p>
```

**Question:** Which CSS selector correctly targets this element using its class?

- A) `#highlight { color: red; }`
- B) `highlight { color: red; }`
- C) `.highlight { color: red; }`
- D) `class.highlight { color: red; }`

**Answer:** C) `.highlight { color: red; }`

**Explanation:** Class selectors in CSS use a dot (`.`) prefix. Option A uses `#`, which is an ID selector. Option B has no prefix, making it an element selector looking for a `<highlight>` tag (which doesn't exist). Option D is invalid CSS syntax — you don't write the word "class" in the selector.

---

## Question 4

**Question:** What are the four layers of the CSS Box Model, from inside to outside?

- A) Margin → Border → Padding → Content
- B) Content → Padding → Border → Margin
- C) Content → Border → Padding → Margin
- D) Padding → Content → Border → Margin

**Answer:** B) Content → Padding → Border → Margin

**Explanation:** The Box Model layers from inside to outside are: Content (the text/images), Padding (space between content and border), Border (the visible edge), and Margin (space between this element and others). Option A is reversed. Options C and D have the layers in incorrect order.

---

## Question 5

**Context:**
```css
p { color: blue; }
.intro { color: green; }
```
```html
<p class="intro">Welcome!</p>
```

**Question:** What color will the text "Welcome!" be?

- A) Blue — element selectors always win
- B) Green — class selector has higher specificity
- C) Purple — the colors mix together
- D) Black — conflicting rules cancel out

**Answer:** B) Green — class selector has higher specificity

**Explanation:** A class selector (`.intro`) has a specificity of 0-1-0, which is higher than an element selector (`p`) with specificity 0-0-1. Higher specificity always wins regardless of source order. Options C and D are incorrect — CSS doesn't mix colors or cancel rules; one rule wins based on specificity.

---

## Question 6

**Context:**
```css
.box {
    width: 200px;
    padding: 20px;
    border: 5px solid black;
    /* box-sizing: content-box (default) */
}
```

**Question:** What is the total rendered width of this element?

- A) 200px
- B) 225px
- C) 250px
- D) 245px

**Answer:** C) 250px

**Explanation:** With the default `content-box` sizing: total width = content (200px) + left padding (20px) + right padding (20px) + left border (5px) + right border (5px) = 250px. Padding and border are added on BOTH sides. Option A ignores padding and border. Option B only adds one side. Option D miscalculates.

---

## Question 7

**Context:**
```css
.card {
    width: 400px;
    margin: 0 auto;
}
```

**Question:** What does `margin: 0 auto` do?

- A) Adds zero margin on all sides
- B) Sets top/bottom margin to 0 and centers the element horizontally
- C) Automatically adds equal margin on all sides
- D) Makes the element take the full width of the page

**Answer:** B) Sets top/bottom margin to 0 and centers the element horizontally

**Explanation:** When `margin` has two values, the first applies to top/bottom (0) and the second to left/right (`auto`). `auto` on left and right distributes remaining space equally, centering the element. This only works when the element has a set width. Option A would be `margin: 0;` (single value). Options C and D describe incorrect behavior.

---

## Question 8

**Context:**
```css
p { color: blue; }
p { color: red; }
```

**Question:** Both rules target the same element with the same specificity. What color will the text be?

- A) Blue — the first rule takes priority
- B) Red — the last rule wins when specificity is equal
- C) Purple — the colors blend together
- D) Black — the browser ignores both conflicting rules

**Answer:** B) Red — the last rule wins when specificity is equal

**Explanation:** This is the "Cascade" in Cascading Style Sheets. When two rules have identical specificity, the one that appears last in the source code wins. The browser doesn't blend colors (C) or ignore conflicts (D) — it applies a clear, deterministic resolution: last one wins.

---

## Question 9

**Context:**
```css
.box-a {
    width: 300px;
    padding: 20px;
    border: 5px solid red;
    box-sizing: content-box;
}
.box-b {
    width: 300px;
    padding: 20px;
    border: 5px solid green;
    box-sizing: border-box;
}
```

**Question:** Which statement is correct about the rendered widths?

- A) Both boxes are 300px wide
- B) `.box-a` is 350px wide, `.box-b` is 300px wide
- C) `.box-a` is 300px wide, `.box-b` is 250px wide
- D) `.box-a` is 300px wide, `.box-b` is 350px wide

**Answer:** B) `.box-a` is 350px wide, `.box-b` is 300px wide

**Explanation:** With `content-box`, width only covers content, so `.box-a` total = 300 + 20×2 + 5×2 = 350px. With `border-box`, width includes content + padding + border, so `.box-b` total = exactly 300px (padding and border are subtracted from the content area). This is why professionals always use `border-box`.

---

## Question 10

**Context:**
```html
<style>
    body { background-color: #080D2B; }
    .card {
        width: 350px;
        padding: 30px;
        margin: 0 auto;
        background-color: #0F1642;
        border-radius: 12px;
        box-sizing: border-box;
    }
    h1 { color: #E04A7A; font-size: 24px; }
    .subtitle { color: #6B7094; font-size: 14px; }
    a { color: #4D70FF; text-decoration: none; }
    a:hover { color: #E04A7A; }
</style>

<body>
    <div class="card">
        <h1>NexusBerry</h1>
        <p class="subtitle">Training & Solutions</p>
        <a href="https://nexusberry.com">Visit Website</a>
    </div>
</body>
```

**Question:** Which of the following statements about this code is TRUE?

- A) The card will be wider than 350px because of the 30px padding
- B) The link text will be underlined by default
- C) The card is horizontally centered and exactly 350px wide
- D) The `h1` color will be overridden by the body background color

**Answer:** C) The card is horizontally centered and exactly 350px wide

**Explanation:** The card uses `box-sizing: border-box`, so the 30px padding is included within the 350px width (not added to it), making Option A wrong. `margin: 0 auto` centers it horizontally. The link has `text-decoration: none`, so it won't be underlined (B is wrong). `background-color` on `body` affects the background, not text color, so D is wrong. The `h1` color is set explicitly to `#E04A7A`.

---

## Self-Assessment

After completing the quiz, rate your understanding:

| Topic | Confident | Need Review | Lost |
|-------|-----------|-------------|------|
| CSS rule syntax (selector, property, value) | [ ] | [ ] | [ ] |
| Selector types (element, class, ID, pseudo-class) | [ ] | [ ] | [ ] |
| Specificity & the cascade | [ ] | [ ] | [ ] |
| The Box Model (content, padding, border, margin) | [ ] | [ ] | [ ] |
| box-sizing: content-box vs border-box | [ ] | [ ] | [ ] |

If you marked "Need Review" or "Lost" on any topic, revisit the cheatsheet and lecture recording before the next class.
