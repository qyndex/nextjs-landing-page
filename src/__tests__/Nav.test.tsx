import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nav } from "@/components/Nav";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
  }) => (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}));

describe("Nav", () => {
  it("renders the logo link", () => {
    render(<Nav />);
    const logoLink = screen.getByRole("link", { name: /acme/i });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders all desktop nav links", () => {
    render(<Nav />);
    // Links appear in both desktop and mobile menus, so use getAllByRole
    expect(screen.getAllByRole("link", { name: /features/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /pricing/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /testimonials/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /blog/i }).length).toBeGreaterThanOrEqual(1);
  });

  it("renders Log in and Get Started CTA links", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
    // Multiple "Get Started" links exist (desktop + mobile menu) — at least one present
    const ctaLinks = screen.getAllByRole("link", { name: /get started/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("mobile toggle button has aria-label and aria-expanded=false by default", () => {
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the mobile menu when the toggle is clicked", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
  });

  it("closes the mobile menu when toggle is clicked a second time", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    await user.click(toggle);
    const closeToggle = screen.getByRole("button", { name: /close menu/i });
    await user.click(closeToggle);
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
