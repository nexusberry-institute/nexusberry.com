is 7 multiple of something in max-w-7xl

--- 

To answer your question: **No, the "7" in `max-w-7xl` is not a mathematical multiple of a base value.**

Instead, the "7" follows a **t-shirt sizing convention**. In Tailwind CSS, `xl` stands for Extra Large. Just like `2xl` means "Double Extra Large," `7xl` simply means the 7th level of Extra Large. It is an arbitrary (but carefully designed) scale created by the Tailwind team, not a strict mathematical formula.

If it were a strict multiple, `max-w-7xl` (80rem) would be exactly 7 times the size of `max-w-xl` (36rem)—which it isn't.

Here is a look at how the `max-w-*` scale progresses once it hits the extra-large sizes. You can see how the widths jump by specific increments rather than multiplying:

| Class | Rem Value | Pixel Value | The Increment |
| --- | --- | --- | --- |
| `max-w-xl` | 36rem | 576px | — |
| `max-w-2xl` | 42rem | 672px | + 6rem (96px) |
| `max-w-3xl` | 48rem | 768px | + 6rem (96px) |
| `max-w-4xl` | 56rem | 896px | + 8rem (128px) |
| `max-w-5xl` | 64rem | 1024px | + 8rem (128px) |
| `max-w-6xl` | 72rem | 1152px | + 8rem (128px) |
| **`max-w-7xl`** | **80rem** | **1280px** | **+ 8rem (128px)** |

*(Note: Tailwind v4 also recently added `max-w-8xl` (88rem) and `max-w-9xl` (96rem) to this scale, following the exact same 8rem jump!)*

---

Would you like me to show you how to override this scale and create your own custom `max-w-*` values in Tailwind v4?