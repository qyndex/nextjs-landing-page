import { test, expect } from "@playwright/test";

test("licensed Inter faces load locally with unchanged document font usage", async ({ page }) => {
  const externalFontRequests: string[] = [];
  page.on("request", request => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFontRequests.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.load('700 16px "Inter"', "ABC Ā Ạ Ω ἀ Ё Ѡ"));
  const observed = await page.evaluate(() => ({
    faces: Array.from(document.fonts).filter(face => face.family.replaceAll('"', "") === "Inter").map(face => ({
      style: face.style, weight: face.weight, display: face.display, status: face.status, unicodeRange: face.unicodeRange,
    })),
    variable: getComputedStyle(document.documentElement).getPropertyValue("--font-inter"),
    body: getComputedStyle(document.body).fontFamily,
    heading: getComputedStyle(document.querySelector("h1")!).fontFamily,
    preload: document.querySelector('link[rel="preload"][as="font"]')?.getAttribute("href"),
  }));
  expect(observed.faces).toHaveLength(7);
  for (const face of observed.faces) {
    expect(face.style).toBe("normal");
    expect(face.weight).toBe("100 900");
    expect(face.display).toBe("swap");
    expect(face.status).toBe("loaded");
  }
  expect(observed.variable).toMatch(/Inter.*Inter Fallback/);
  // Exact stack observed by real Chromium loading the retained baseline CSS.
  expect(observed.body).toBe("-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"");
  expect(observed.heading).toBe(observed.body);
  expect(observed.preload).toBe("/fonts/inter/inter-baseline-latin.woff2");
  expect(externalFontRequests).toEqual([]);
  console.log("LOCAL_FONT_OBSERVATION " + JSON.stringify(observed));
});
