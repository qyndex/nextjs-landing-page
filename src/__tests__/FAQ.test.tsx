import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQSection } from "@/components/FAQ";
import type { FAQ } from "@/types/database";

const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "What is included in the free trial?",
    answer: "Everything is included for 14 days.",
    category: "billing",
    sort_order: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    question: "Can I change plans later?",
    answer: "Yes, you can upgrade or downgrade at any time.",
    category: "billing",
    sort_order: 2,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    question: "Is my data secure?",
    answer: "We use end-to-end encryption and SOC 2 certification.",
    category: "security",
    sort_order: 3,
    created_at: "2024-01-01T00:00:00Z",
  },
];

describe("FAQSection", () => {
  it("renders the section heading", () => {
    render(<FAQSection faqs={mockFAQs} />);
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i })
    ).toBeInTheDocument();
  });

  it("renders all FAQ questions", () => {
    render(<FAQSection faqs={mockFAQs} />);
    expect(screen.getByText("What is included in the free trial?")).toBeInTheDocument();
    expect(screen.getByText("Can I change plans later?")).toBeInTheDocument();
    expect(screen.getByText("Is my data secure?")).toBeInTheDocument();
  });

  it("answers are hidden by default", () => {
    render(<FAQSection faqs={mockFAQs} />);
    // All buttons should have aria-expanded=false
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("expands a FAQ item when clicked", async () => {
    const user = userEvent.setup();
    render(<FAQSection faqs={mockFAQs} />);
    const firstButton = screen.getByText("What is included in the free trial?").closest("button")!;
    await user.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Everything is included for 14 days.")).toBeVisible();
  });

  it("collapses a FAQ item when clicked again", async () => {
    const user = userEvent.setup();
    render(<FAQSection faqs={mockFAQs} />);
    const firstButton = screen.getByText("What is included in the free trial?").closest("button")!;
    await user.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "true");
    await user.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
  });

  it("renders with id='faq' for anchor navigation", () => {
    const { container } = render(<FAQSection faqs={mockFAQs} />);
    expect(container.querySelector("section#faq")).toBeInTheDocument();
  });

  it("renders empty state gracefully with no FAQs", () => {
    render(<FAQSection faqs={[]} />);
    expect(
      screen.getByRole("heading", { name: /frequently asked questions/i })
    ).toBeInTheDocument();
  });
});
