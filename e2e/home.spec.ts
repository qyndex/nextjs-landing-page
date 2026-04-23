import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads and has correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/acme/i);
  });

  test("hero section is visible with main headline", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/build something amazing/i);
  });

  test("hero email signup form is present", async ({ page }) => {
    const emailInput = page.getByLabel(/email address/i);
    await expect(emailInput).toBeVisible();
    await expect(page.getByRole("button", { name: /get early access/i })).toBeVisible();
  });

  test("features section is visible", async ({ page }) => {
    await page.getByRole("link", { name: /features/i }).first().click();
    const featuresSection = page.locator("section#features");
    await expect(featuresSection).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /everything you need to ship faster/i })
    ).toBeVisible();
  });

  test("all 6 feature cards are rendered", async ({ page }) => {
    const featureHeadings = [
      "Lightning Fast",
      "Secure by Default",
      "Real-time Analytics",
      "Global CDN",
      "Ship in Days",
      "World-class Support",
    ];
    for (const name of featureHeadings) {
      await expect(page.getByRole("heading", { name, level: 3 })).toBeVisible();
    }
  });

  test("pricing section is visible with three plans", async ({ page }) => {
    await page.getByRole("link", { name: /pricing/i }).first().click();
    const pricingSection = page.locator("section#pricing");
    await expect(pricingSection).toBeVisible();
    await expect(page.getByRole("heading", { name: /starter/i, level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /pro/i, level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /enterprise/i, level: 3 })).toBeVisible();
  });

  test("testimonials section displays testimonial content", async ({ page }) => {
    const section = page.locator("section#testimonials");
    await expect(section).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /loved by builders worldwide/i })
    ).toBeVisible();
    // At least one testimonial name should be visible
    await expect(page.getByText("Sarah Chen")).toBeVisible();
  });

  test("FAQ section is visible and interactive", async ({ page }) => {
    const faqSection = page.locator("section#faq");
    await expect(faqSection).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /frequently asked questions/i })
    ).toBeVisible();

    // Click first FAQ to expand it
    const firstQuestion = faqSection.getByRole("button").first();
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  });

  test("navigation links are present and functional", async ({ page }) => {
    const nav = page.getByRole("navigation");
    await expect(nav.getByRole("link", { name: /features/i })).toHaveAttribute(
      "href",
      "#features"
    );
    await expect(nav.getByRole("link", { name: /pricing/i })).toHaveAttribute(
      "href",
      "#pricing"
    );
    await expect(nav.getByRole("link", { name: /testimonials/i })).toHaveAttribute(
      "href",
      "#testimonials"
    );
  });

  test("Get Started CTA button links to signup", async ({ page }) => {
    const ctaButtons = page.getByRole("link", { name: /get started/i });
    // At least one CTA should point at #signup
    const hrefs = await ctaButtons.evaluateAll((els) =>
      els.map((el) => el.getAttribute("href"))
    );
    expect(hrefs).toContain("#signup");
  });

  test("footer is visible and contains brand name", async ({ page }) => {
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText(/acme/i);
  });

  test("email signup shows validation error for empty submit", async ({ page }) => {
    await page.getByRole("button", { name: /get early access/i }).click();
    await expect(page.getByRole("alert")).toContainText(/email address is required/i);
  });

  test("mobile hamburger menu opens on small screen", async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    const toggleButton = page.getByRole("button", { name: /open menu/i });
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();
    await expect(page.getByRole("button", { name: /close menu/i })).toBeVisible();
  });
});
