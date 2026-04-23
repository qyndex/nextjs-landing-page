"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function EmailSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function validateEmail(value: string): string {
    if (!value.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Please enter a valid email address.";
    return "";
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStatus("loading");

    try {
      // Replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("flex items-center justify-center gap-2 text-sm text-foreground", className)}>
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>You&apos;re on the list! We&apos;ll be in touch soon.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor="hero-email" className="sr-only">
            Email address
          </label>
          <input
            id="hero-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="Enter your email"
            className={cn(
              "w-full h-10 rounded-md border bg-background px-4 py-2 text-sm",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/60 focus:border-transparent",
              "transition-shadow duration-200",
              error ? "border-red-500 ring-1 ring-red-500" : "border-border"
            )}
            disabled={status === "loading"}
            aria-describedby={error ? "email-error" : undefined}
            aria-invalid={!!error}
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading"}
          className="h-10 px-5 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white border-0 hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          {status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Get early access <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {error && (
        <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-500 text-left">
          {error}
        </p>
      )}
    </form>
  );
}
