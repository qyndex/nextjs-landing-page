import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const boundary = vi.hoisted(() => ({ create: vi.fn(), order: vi.fn(), from: vi.fn(), select: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: boundary.create }));
vi.mock("next/link", () => ({ default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  boundary.create.mockReturnValue({ from: boundary.from });
  boundary.from.mockReturnValue({ select: boundary.select });
  boundary.select.mockReturnValue({ order: boundary.order });
});
afterEach(() => { vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe("Content availability without a live database", () => {
  it("renders the complete landing page using usable fallback content with no credentials", async () => {
    const { default: Page } = await import("@/app/page");
    render(await Page());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/build something amazing/i);
    for (const id of ["features", "pricing", "testimonials", "faq", "signup"]) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /what is included in the free trial/i })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toHaveTextContent("Acme");
    expect(screen.getAllByLabelText(/email address/i)).toHaveLength(2);
    expect(boundary.create).not.toHaveBeenCalled();
  });

  it("does not contact the placeholder project even when a synthetic key is present", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://your-project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fixture-only-not-a-key");
    const { getTestimonials, getFAQs } = await import("@/lib/queries");
    expect(await getTestimonials()).toHaveLength(6);
    expect(await getFAQs()).toHaveLength(8);
    expect(boundary.create).not.toHaveBeenCalled();
  });

  it("does not initialize a client when the public key is absent", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.invalid");
    const { getFAQs } = await import("@/lib/queries");
    expect(await getFAQs()).toHaveLength(8);
    expect(boundary.create).not.toHaveBeenCalled();
  });

  it("displays successful ordered remote content instead of fallback text", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.invalid");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fixture-only-not-a-key");
    const testimonial = { id: "remote", author_name: "Fixture author", author_role: "Engineer", author_company: "Fixture", author_avatar_url: null, content: "Verified remote content", rating: 5, featured: true, sort_order: 1, created_at: "2026-10-19T00:00:00Z" };
    const faq = { id: "remote", question: "Fixture question?", answer: "Fixture answer", category: "product", sort_order: 1, created_at: "2026-10-19T00:00:00Z" };
    boundary.order.mockResolvedValueOnce({ data: [testimonial], error: null }).mockResolvedValueOnce({ data: [faq], error: null });
    const { default: Page } = await import("@/app/page");
    render(await Page());
    expect(screen.getByText("Fixture author")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fixture question?" })).toBeInTheDocument();
    expect(screen.queryByText("Sarah Chen")).not.toBeInTheDocument();
    expect(boundary.order).toHaveBeenCalledWith("sort_order", { ascending: true });
    expect(boundary.from.mock.calls.map(call => call[0])).toEqual(["testimonials", "faqs"]);
  });

  it.each([
    { data: null, error: { message: "fixture unavailable" } },
    { data: null, error: null },
    { data: [], error: null },
  ])("retains useful testimonials and FAQs when the remote result is unavailable: %j", async result => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.invalid");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fixture-only-not-a-key");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    boundary.order.mockResolvedValue(result);
    const { getTestimonials, getFAQs } = await import("@/lib/queries");
    expect((await getTestimonials())[0].author_name).toBe("Sarah Chen");
    expect((await getFAQs())[0].question).toMatch(/free trial/i);
  });

  it("fails closed for the standalone client when configuration is missing", async () => {
    await expect(import("@/lib/supabase")).rejects.toThrow(/Missing NEXT_PUBLIC_SUPABASE/);
    expect(boundary.create).not.toHaveBeenCalled();
  });

  it("initializes the standalone client only through its configured SDK boundary", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://fixture.invalid");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "fixture-only-not-a-key");
    const { supabase } = await import("@/lib/supabase");
    expect(supabase).toHaveProperty("from", boundary.from);
    expect(boundary.create).toHaveBeenCalledWith("https://fixture.invalid", "fixture-only-not-a-key");
  });
});
