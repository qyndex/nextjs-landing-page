import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @supabase/supabase-js before importing the route
const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
const mockCreateClient = vi.fn(() => ({ from: mockFrom }));

vi.mock("@supabase/supabase-js", () => ({
  createClient: mockCreateClient,
}));

// Set env vars before importing the route module
vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");

// Dynamically import after mocking
const { POST } = await import("@/app/api/waitlist/route");

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:3000/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsert.mockResolvedValue({ error: null });
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({}) as never);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/email is required/i);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }) as never);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/valid email/i);
  });

  it("returns 201 for valid email", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }) as never);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.message).toMatch(/successfully/i);
  });

  it("normalizes email to lowercase and trims whitespace", async () => {
    await POST(makeRequest({ email: "  Test@Example.COM  " }) as never);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "test@example.com" })
    );
  });

  it("passes name and referral_source when provided", async () => {
    await POST(
      makeRequest({
        email: "test@example.com",
        name: "Test User",
        referral_source: "twitter",
      }) as never
    );
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        name: "Test User",
        referral_source: "twitter",
      })
    );
  });

  it("returns 409 for duplicate email", async () => {
    mockInsert.mockResolvedValueOnce({ error: { code: "23505", message: "duplicate" } });
    const res = await POST(makeRequest({ email: "dup@example.com" }) as never);
    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data.error).toMatch(/already on the waitlist/i);
  });

  it("returns 500 for other database errors", async () => {
    mockInsert.mockResolvedValueOnce({ error: { code: "42P01", message: "relation not found" } });
    const res = await POST(makeRequest({ email: "test@example.com" }) as never);
    expect(res.status).toBe(500);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost:3000/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });
});
