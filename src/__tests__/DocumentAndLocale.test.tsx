import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// No font network request in this unit boundary; the real build tests font provisioning.
vi.mock("next/font/google", () => ({ Inter: () => ({ variable: "fixture-inter-font" }) }));
beforeEach(() => vi.resetModules());

describe("Document and translation availability", () => {
  it("renders an English document containing the supplied page and usable metadata", async () => {
    const { default: Layout, metadata } = await import("@/app/layout");
    const html = renderToStaticMarkup(<Layout><main>Fixture page content</main></Layout>);
    expect(html).toContain('<html lang="en"');
    expect(html).toContain('<main>Fixture page content</main>');
    const parsed = new DOMParser().parseFromString(html, "text/html");
    for (const name of ["font-sans", "antialiased", "bg-background", "text-foreground"]) {
      expect(parsed.body.classList.contains(name)).toBe(true);
    }
    expect(metadata.title).toMatch(/acme/i);
    expect(metadata.description).toBeTruthy();
  });

  it("uses explicit fallback text before loading, then loads English without losing unknown-key fallback", async () => {
    const { loadLocale, t } = await import("@/lib/i18n");
    expect(t("fixture.unknown", "Readable fallback")).toBe("Readable fallback");
    expect(t("fixture.unknown")).toBe("fixture.unknown");
    await loadLocale();
    expect(t("common.save", "unused fallback")).toBe("Save");
    expect(t("fixture.unknown", "Readable fallback")).toBe("Readable fallback");
    expect(t("fixture.unknown")).toBe("fixture.unknown");
  });
});
