"use client";

import type { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Newsletter signup for the footer — the only interactive footer piece. */
export function NewsletterSignup() {
  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("newsletter-email");
    if (!(input instanceof HTMLInputElement)) return;

    toast.success(
      `Subscribed — studio updates will land in ${input.value}. Thanks for joining!`,
    );
    form.reset();
  }

  return (
    <form onSubmit={handleSubscribe} className="flex gap-2">
      <label htmlFor="footer-newsletter" className="sr-only">
        Email address
      </label>
      <Input
        id="footer-newsletter"
        name="newsletter-email"
        type="email"
        placeholder="you@example.com"
        required
        className="max-w-48 flex-1"
      />
      <Button type="submit" variant="outline" size="sm">
        Subscribe
      </Button>
    </form>
  );
}
