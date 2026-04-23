import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailSignup } from "@/components/EmailSignup";

// next/link renders a plain <a> in test environments without the Next.js router
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock global fetch for API calls
const mockFetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = mockFetch;
  mockFetch.mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => ({ message: "Successfully joined the waitlist!" }),
  });
});

describe("EmailSignup", () => {
  it("renders email input and submit button", () => {
    render(<EmailSignup />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get early access/i })).toBeInTheDocument();
  });

  it("applies optional className prop to the form wrapper", () => {
    const { container } = render(<EmailSignup className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("shows validation error when submitted with empty email", async () => {
    render(<EmailSignup />);
    fireEvent.submit(screen.getByRole("button", { name: /get early access/i }).closest("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/email address is required/i);
    });
    // Should NOT call the API for validation errors
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("shows validation error for malformed email", async () => {
    const user = userEvent.setup();
    render(<EmailSignup />);
    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/valid email address/i);
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("marks the input as aria-invalid when there is a validation error", async () => {
    render(<EmailSignup />);
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => {
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute("aria-invalid", "true");
    });
  });

  it("clears the error message when the user starts typing again", async () => {
    const user = userEvent.setup();
    render(<EmailSignup />);
    // Trigger error
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    // Start typing -- error should clear
    await user.type(screen.getByLabelText(/email address/i), "a");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("disables input and button while loading", async () => {
    // Make fetch hang so we can observe loading state
    mockFetch.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    render(<EmailSignup />);
    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    // Immediately after submit the button/input should be disabled
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows success state after a valid submission", async () => {
    const user = userEvent.setup();
    render(<EmailSignup />);
    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(
      () => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument(),
      { timeout: 2000 }
    );
    // Form is no longer rendered in success state
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("calls /api/waitlist with the email", async () => {
    const user = userEvent.setup();
    render(<EmailSignup />);
    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com" }),
      });
    });
  });

  it("treats 409 (already on waitlist) as success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: "Already on the waitlist" }),
    });
    const user = userEvent.setup();
    render(<EmailSignup />);
    await user.type(screen.getByLabelText(/email address/i), "dup@example.com");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => {
      expect(screen.getByText(/you're on the list/i)).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: "Server error" }),
    });
    const user = userEvent.setup();
    render(<EmailSignup />);
    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/server error/i);
    });
  });

  it("shows generic error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    const user = userEvent.setup();
    render(<EmailSignup />);
    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/something went wrong/i);
    });
  });
});
