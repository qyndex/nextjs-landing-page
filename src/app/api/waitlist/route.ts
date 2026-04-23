import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * POST /api/waitlist
 * Inserts a new email into the waitlist table.
 * Body: { email: string; name?: string; referral_source?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email: rawEmail, name, referral_source } = body as {
      email?: string;
      name?: string;
      referral_source?: string;
    };

    // Validate email
    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // Normalize before validation
    const email = rawEmail.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Create a server-side Supabase client (uses service role if available, falls back to anon)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    const { error } = await supabase.from("waitlist").insert({
      email,
      name: name?.trim() || null,
      referral_source: referral_source?.trim() || null,
    });

    if (error) {
      // Unique constraint violation — email already exists
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already on the waitlist." },
          { status: 409 }
        );
      }
      console.error("Waitlist insert error:", error);
      return NextResponse.json(
        { error: "Failed to join waitlist. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }
}
