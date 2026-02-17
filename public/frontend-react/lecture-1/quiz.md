# Lecture 1: Portal Quiz (10 MCQs)

**Instructions:** Complete this quiz on the online portal **before Lecture 2**.
These questions evaluate your understanding of the concepts covered in Lecture 1.
You may refer to the cheatsheet and lecture recording while attempting.

---

## Question 1

**Question:** What does `<!DOCTYPE html>` tell the browser?

- A) The page uses HTML4
- B) The page uses HTML5 standards mode
- C) The page requires JavaScript
- D) The page has no CSS styling

**Answer:** B) The page uses HTML5 standards mode

**Explanation:** `<!DOCTYPE html>` is the HTML5 document type declaration. It tells the browser to render the page in standards mode. Without it, the browser may use "quirks mode," which can cause inconsistent rendering. Options A is wrong because this is specifically the HTML5 DOCTYPE (HTML4 had a much longer declaration). C and D are unrelated to DOCTYPE.

---

## Question 2

**Question:** Which section of an HTML document contains metadata that is NOT visible to the user?

- A) `<body>`
- B) `<footer>`
- C) `<head>`
- D) `<html>`

**Answer:** C) `<head>`

**Explanation:** The `<head>` element contains metadata like the page title, character encoding, and viewport settings — none of which appear as content on the page. The `<body>` (A) contains all visible content. `<footer>` (B) is a visible section within the body. `<html>` (D) is the root element that contains both `<head>` and `<body>`.

---

## Question 3

**Question:** What is the correct way to add an image in HTML?

- A) `<image src="photo.jpg" alt="A photo">`
- B) `<img src="photo.jpg" alt="A photo">`
- C) `<img src="photo.jpg" alt="A photo"></img>`
- D) `<img href="photo.jpg" alt="A photo">`

**Answer:** B) `<img src="photo.jpg" alt="A photo">`

**Explanation:** The `<img>` tag is a self-closing (void) element — it has no closing tag. Option A uses the wrong tag name (`<image>` doesn't exist). Option C adds an unnecessary closing tag (`</img>`). Option D uses `href` instead of `src` — `href` is for links (`<a>`), while `src` is for images.

---

## Question 4

**Question:** What does the `<title>` tag control?

- A) The main heading on the page
- B) The text shown in the browser tab
- C) The font size of the page
- D) The page's background color

**Answer:** B) The text shown in the browser tab

**Explanation:** The `<title>` tag (placed inside `<head>`) sets the text that appears in the browser tab and is also used by search engines as the page title in search results. It does NOT display as visible content on the page. For a visible heading, you would use `<h1>` (option A is describing `<h1>`, not `<title>`).

---

## Question 5

**Context:**
```html
<a href="nexusberry.com">Visit NexusBerry</a>
```

**Question:** This link won't work as expected. Why?

- A) The tag should be `<link>` instead of `<a>`
- B) Link text cannot contain spaces
- C) Missing `https://` protocol — browser treats it as a relative file path
- D) The `href` attribute should be `url` instead

**Answer:** C) Missing `https://` protocol — browser treats it as a relative file path

**Explanation:** Without `https://` (or `http://`), the browser interprets `nexusberry.com` as a relative path on the current server, not as an external website. The correct href would be `https://nexusberry.com`. Option A is wrong because `<link>` is for stylesheets in the head, not for clickable links. Options B and D describe things that don't exist in HTML.

---

## Question 6

**Context:**
```html
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>
```

**Question:** What type of list does this code create?

- A) A numbered list (1, 2, 3)
- B) A bulleted list (dots/circles)
- C) A definition list
- D) A checkbox list

**Answer:** B) A bulleted list (dots/circles)

**Explanation:** `<ul>` stands for "unordered list," which renders with bullet points. For a numbered list (option A), you would use `<ol>` (ordered list). A definition list (C) uses `<dl>`, `<dt>`, and `<dd>`. Checkbox lists (D) require `<input type="checkbox">` elements and are not created with `<ul>` alone.

---

## Question 7

**Context:**
```html
<h1>My Blog</h1>
<h3>About Me</h3>
<p>Welcome to my blog.</p>
```

**Question:** What is wrong with this heading structure?

- A) You cannot use `<h3>` on a page
- B) `<h1>` should come after `<h3>`
- C) Heading levels should not skip — `<h2>` is missing between `<h1>` and `<h3>`
- D) You need a `<p>` between every heading

**Answer:** C) Heading levels should not skip — `<h2>` is missing between `<h1>` and `<h3>`

**Explanation:** Heading levels should follow a logical hierarchy without skipping. After `<h1>`, the next heading should be `<h2>`, not `<h3>`. While the browser will still render it, skipping levels is bad for accessibility (screen readers use headings for navigation) and SEO. Options A and D describe rules that don't exist. Option B has the order backwards.

---

## Question 8

**Context:**
```html
<p>This is <strong>bold and <em>italic</p></em></strong>
```

**Question:** What is wrong with this code?

- A) `<strong>` and `<em>` cannot be used together
- B) The closing tags are in the wrong order — tags must close in reverse order
- C) `<em>` should be `<i>` instead
- D) The `<p>` tag doesn't support nested elements

**Answer:** B) The closing tags are in the wrong order — tags must close in reverse order

**Explanation:** HTML tags must be properly nested — they close in the reverse order they were opened. The correct nesting would be: `<p>This is <strong>bold and <em>italic</em></strong></p>`. Think of it like stacking boxes: the last one opened must be the first one closed. Option A is wrong — you can absolutely combine `<strong>` and `<em>`. Option C is misleading — while `<i>` exists, it's not the issue here. Option D is wrong — `<p>` can contain inline elements.

---

## Question 9

**Context:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Welcome</h1>
</body>
</html>
```

**Question:** This page is missing two recommended elements. Which are they?

- A) `<meta charset="UTF-8">` and `lang="en"` on `<html>`
- B) `<footer>` and `<nav>`
- C) `<link>` and `<script>`
- D) `<h2>` and `<p>`

**Answer:** A) `<meta charset="UTF-8">` and `lang="en"` on `<html>`

**Explanation:** While this page will render, it's missing two important elements: `<meta charset="UTF-8">` ensures special characters display correctly, and `lang="en"` on the `<html>` tag helps screen readers pronounce content correctly and aids search engines. Options B, C, and D describe elements that are useful but not part of the essential document structure we covered.

---

## Question 10

**Context:**
```html
<img src="https://picsum.photos/400/300">
```

**Question:** This image tag will work in the browser, but it has a professional best practice issue. What is it?

- A) The image URL is too long
- B) Missing `alt` attribute — needed for accessibility and SEO
- C) Images must always have `width` and `height` attributes
- D) The `src` should use `http://` not `https://`

**Answer:** B) Missing `alt` attribute — needed for accessibility and SEO

**Explanation:** The `alt` attribute provides a text description of the image for screen readers (used by visually impaired users), displays as fallback text if the image fails to load, and helps search engines understand the image content. While the image will display without `alt`, it's a professional requirement — in some countries, missing alt text on public websites can have legal consequences. Option A is irrelevant. Option C is good practice but not required. Option D is wrong — `https://` is preferred over `http://`.

---

## Self-Assessment

After completing the quiz, rate your understanding:

| Topic | Confident | Need Review | Lost |
|-------|-----------|-------------|------|
| HTML Document Structure | [ ] | [ ] | [ ] |
| Head vs Body sections | [ ] | [ ] | [ ] |
| Headings and Paragraphs | [ ] | [ ] | [ ] |
| Links and Images | [ ] | [ ] | [ ] |
| Lists (ordered/unordered) | [ ] | [ ] | [ ] |

If you marked "Need Review" or "Lost" on any topic, revisit the cheatsheet and lecture recording before the next class.
