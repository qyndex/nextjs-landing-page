import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Testimonials } from "@/components/Testimonials";
import type { Testimonial } from "@/types/database";

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    author_name: "Sarah Chen",
    author_role: "CTO",
    author_company: "TechCorp",
    author_avatar_url: null,
    content: "This platform cut our development time in half.",
    rating: 5,
    featured: true,
    sort_order: 1,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    author_name: "Marcus Johnson",
    author_role: "Founder",
    author_company: "StartupXYZ",
    author_avatar_url: "https://example.com/avatar.jpg",
    content: "The best investment we made this year.",
    rating: 4,
    featured: false,
    sort_order: 2,
    created_at: "2024-01-01T00:00:00Z",
  },
];

describe("Testimonials", () => {
  it("renders the section heading", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(
      screen.getByRole("heading", { name: /loved by builders worldwide/i })
    ).toBeInTheDocument();
  });

  it("renders testimonial content", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText(/this platform cut our development time/i)).toBeInTheDocument();
    expect(screen.getByText(/the best investment we made/i)).toBeInTheDocument();
  });

  it("renders author names and roles", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("CTO at TechCorp")).toBeInTheDocument();
    expect(screen.getByText("Marcus Johnson")).toBeInTheDocument();
    expect(screen.getByText("Founder at StartupXYZ")).toBeInTheDocument();
  });

  it("renders initials fallback when no avatar URL", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    expect(screen.getByText("SC")).toBeInTheDocument();
  });

  it("renders avatar image when URL is provided", () => {
    render(<Testimonials testimonials={mockTestimonials} />);
    const img = screen.getByAltText("Marcus Johnson");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("renders the section with id='testimonials' for anchor navigation", () => {
    const { container } = render(<Testimonials testimonials={mockTestimonials} />);
    expect(container.querySelector("section#testimonials")).toBeInTheDocument();
  });

  it("handles star ratings correctly", () => {
    const { container } = render(<Testimonials testimonials={mockTestimonials} />);
    // Total stars across both testimonials: 5 + 4 = 9
    const stars = container.querySelectorAll(".fill-amber-400");
    expect(stars.length).toBe(9);
  });
});
