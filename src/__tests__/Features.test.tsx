import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Features } from "@/components/Features";

describe("Features", () => {
  it("renders the section heading", () => {
    render(<Features />);
    expect(
      screen.getByRole("heading", { name: /everything you need to ship faster/i })
    ).toBeInTheDocument();
  });

  it("renders the section subheading label", () => {
    render(<Features />);
    expect(screen.getByText(/why teams choose us/i)).toBeInTheDocument();
  });

  it("renders all 6 feature cards", () => {
    render(<Features />);
    const expectedFeatures = [
      "Lightning Fast",
      "Secure by Default",
      "Real-time Analytics",
      "Global CDN",
      "Ship in Days",
      "World-class Support",
    ];
    expectedFeatures.forEach((name) => {
      expect(screen.getByRole("heading", { name, level: 3 })).toBeInTheDocument();
    });
  });

  it("renders descriptions for each feature", () => {
    render(<Features />);
    // Spot-check a couple of descriptions
    expect(screen.getByText(/p99 latency under 50ms/i)).toBeInTheDocument();
    expect(screen.getByText(/soc 2 type ii/i)).toBeInTheDocument();
  });

  it("renders the section with id='features' for anchor navigation", () => {
    const { container } = render(<Features />);
    const section = container.querySelector("section#features");
    expect(section).toBeInTheDocument();
  });

  it("renders exactly 6 feature icons", () => {
    const { container } = render(<Features />);
    // Each card has an icon wrapper div with a gradient background class
    const iconWrappers = container.querySelectorAll('[class*="bg-gradient-to-br"]');
    // The grid renders 6 icon wrappers (one per feature card)
    expect(iconWrappers.length).toBe(6);
  });
});
