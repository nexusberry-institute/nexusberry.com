/**
 * Generate OG image for Frontend React — Lecture 1
 * Output: public/frontend-react/lecture-1/og.png (1200×630)
 *
 * Run: npx tsx scripts/generate-og-lecture1.ts
 */

import { renderToPng } from "@json-render/image/render";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Font fetching
// ---------------------------------------------------------------------------

// Old iOS Safari UA → Google Fonts returns static TTF (required by Satori)
const OLD_IOS_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 4_3 like Mac OS X) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5";

async function fetchGoogleFontTTF(
  family: string,
  weight: number
): Promise<Buffer> {
  const cssUrl = `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${weight}`;
  const cssRes = await fetch(cssUrl, { headers: { "User-Agent": OLD_IOS_UA } });
  if (!cssRes.ok) throw new Error(`CSS fetch failed: ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/);
  if (!match) throw new Error(`No TTF URL found in CSS for "${family}" ${weight}`);
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) throw new Error(`Font fetch failed: ${fontRes.status} ${match[1]}`);
  return Buffer.from(await fontRes.arrayBuffer());
}

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------

const C = {
  bg: "#080D2B",
  surface: "#0F1642",
  surfaceAlt: "#1A2258",
  border: "#2A3370",
  berry: "#E04A7A",
  blue: "#4D70FF",
  green: "#00C896",
  text: "#F0F0F5",
  dim: "#6B7094",
  white: "#FFFFFF",
} as const;

// ---------------------------------------------------------------------------
// Spec
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pill(id: string, label: string): Record<string, any> {
  return {
    [`${id}Box`]: {
      type: "Box",
      props: {
        backgroundColor: C.surfaceAlt,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        paddingLeft: 14,
        paddingRight: 14,
        paddingTop: 6,
        paddingBottom: 6,
      },
      children: [`${id}Text`],
    },
    [`${id}Text`]: {
      type: "Text",
      props: { text: label, fontSize: 13, color: C.text },
      children: [],
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function codeLine(id: string, text: string, color: string): Record<string, any> {
  return {
    [id]: {
      type: "Text",
      props: { text, fontSize: 14, color, lineHeight: 1.7 },
      children: [],
    },
  };
}

async function main() {
  // ── Fonts ────────────────────────────────────────────────────────────────
  console.log("Fetching fonts…");
  const [montserratBold, openSansRegular] = await Promise.all([
    fetchGoogleFontTTF("Montserrat", 700),
    fetchGoogleFontTTF("Open Sans", 400),
  ]);

  // ── Spec ─────────────────────────────────────────────────────────────────
  const spec = {
    root: "frame",
    elements: {
      // Root frame ───────────────────────────────────────────────────────────
      frame: {
        type: "Frame",
        props: {
          width: 1200,
          height: 630,
          backgroundColor: C.bg,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
        },
        children: ["leftPanel", "rightPanel"],
      },

      // ── Left panel ────────────────────────────────────────────────────────
      leftPanel: {
        type: "Box",
        props: {
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: 56,
          paddingLeft: 64,
          paddingRight: 48,
          paddingBottom: 48,
        },
        children: ["leftTop", "wordmark"],
      },

      leftTop: {
        type: "Column",
        props: { gap: 0, alignItems: "flex-start" },
        children: [
          "courseBadgeRow",
          "spacer1",
          "lectureBadgeRow",
          "spacer2",
          "titleText",
          "spacer3",
          "accentDivider",
          "spacer4",
          "topicsRow",
        ],
      },

      // Course badge
      courseBadgeRow: {
        type: "Row",
        props: { gap: 0, alignItems: "center" },
        children: ["courseBadgeBox"],
      },
      courseBadgeBox: {
        type: "Box",
        props: {
          backgroundColor: C.green,
          borderRadius: 20,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 7,
          paddingBottom: 7,
        },
        children: ["courseBadgeText"],
      },
      courseBadgeText: {
        type: "Text",
        props: {
          text: "Modern Frontend React Course",
          fontSize: 13,
          color: C.white,
          fontWeight: "bold",
        },
        children: [],
      },

      spacer1: { type: "Spacer", props: { height: 14 }, children: [] },

      // Lecture badge
      lectureBadgeRow: {
        type: "Row",
        props: { gap: 0, alignItems: "center" },
        children: ["lectureBadgeBox"],
      },
      lectureBadgeBox: {
        type: "Box",
        props: {
          backgroundColor: C.berry,
          borderRadius: 20,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 7,
          paddingBottom: 7,
        },
        children: ["lectureBadgeText"],
      },
      lectureBadgeText: {
        type: "Text",
        props: {
          text: "Lecture 1",
          fontSize: 13,
          color: C.white,
          fontWeight: "bold",
        },
        children: [],
      },

      spacer2: { type: "Spacer", props: { height: 22 }, children: [] },

      // Title
      titleText: {
        type: "Text",
        props: {
          text: "HTML Fundamentals\n& Document Structure",
          fontSize: 46,
          color: C.text,
          fontWeight: "bold",
          lineHeight: 1.15,
        },
        children: [],
      },

      spacer3: { type: "Spacer", props: { height: 24 }, children: [] },

      // Blue accent divider (60×3)
      accentDivider: {
        type: "Box",
        props: { width: 60, height: 3, backgroundColor: C.blue },
        children: [],
      },

      spacer4: { type: "Spacer", props: { height: 22 }, children: [] },

      // Topic pills
      topicsRow: {
        type: "Row",
        props: { gap: 8, wrap: true, alignItems: "center" },
        children: [
          "tDocBox",
          "tElemBox",
          "tSemBox",
          "tHeadBox",
          "tBuildBox",
        ],
      },

      ...pill("tDoc", "Document Structure"),
      ...pill("tElem", "HTML Elements"),
      ...pill("tSem", "Semantic HTML"),
      ...pill("tHead", "Headings & Lists"),
      ...pill("tBuild", "Practical Build"),

      // Wordmark
      wordmark: {
        type: "Text",
        props: {
          text: "nexusberry.com  ·  Pakistan's IT Training Institute",
          fontSize: 12,
          color: C.dim,
        },
        children: [],
      },

      // ── Right panel ───────────────────────────────────────────────────────
      rightPanel: {
        type: "Box",
        props: {
          width: 456,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 56,
          paddingTop: 48,
          paddingBottom: 48,
        },
        children: ["codeBox"],
      },

      codeBox: {
        type: "Box",
        props: {
          backgroundColor: C.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: C.border,
          paddingTop: 28,
          paddingBottom: 28,
          paddingLeft: 28,
          paddingRight: 28,
          flexDirection: "column",
        },
        children: ["cl1", "cl2", "cl3", "cl4", "cl5", "cl6", "cl7", "cl8", "cl9"],
      },

      ...codeLine("cl1", "<!DOCTYPE html>", C.dim),
      ...codeLine("cl2", '<html lang="en">', C.blue),
      ...codeLine("cl3", "  <head>", C.blue),
      ...codeLine("cl4", "    <title>My Blog</title>", C.green),
      ...codeLine("cl5", "  </head>", C.blue),
      ...codeLine("cl6", "  <body>", C.blue),
      ...codeLine("cl7", "    <h1>Hello World</h1>", C.berry),
      ...codeLine("cl8", "  </body>", C.blue),
      ...codeLine("cl9", "</html>", C.blue),
    },
  };

  // ── Render ────────────────────────────────────────────────────────────────
  console.log("Rendering PNG…");
  const png = await renderToPng(spec as Parameters<typeof renderToPng>[0], {
    fonts: [
      { name: "Montserrat", data: montserratBold, weight: 700, style: "normal" },
      { name: "Open Sans", data: openSansRegular, weight: 400, style: "normal" },
    ],
  });

  // ── Write ─────────────────────────────────────────────────────────────────
  const outDir = path.join("public", "frontend-react", "lecture-1");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "og.png");
  fs.writeFileSync(outPath, png);

  const stats = fs.statSync(outPath);
  console.log(`✓ Written: ${outPath} (${(stats.size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
