"use client";

import {
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Circle } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { GoogleAuthButton } from "@/components/auth/google-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api";
import { cn } from "cn";

/** The three password rules the assignment mandates. */
const PASSWORD_RULES = [
  {
    key: "upper",
    label: "At least one uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    key: "lower",
    label: "At least one lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    key: "length",
    label: "Minimum 6 characters",
    test: (value: string) => value.length >= 6,
  },
] as const;

function isValidPhotoUrl(value: string): boolean {
  try {
    return new URL(value).protocol.startsWith("http");
  } catch {
    return false;
  }
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (isRegister) {
      // Gate on every rule client-side — the server is the authority, but
      // invalid passwords are never sent.
      const failed = PASSWORD_RULES.filter((rule) => !rule.test(password));
      if (failed.length > 0) {
        const message = `Password needs ${failed
          .map((rule) => rule.label.toLowerCase())
          .join(", ")}.`;
        setError(message);
        return;
      }
    }

    setPending(true);

    try {
      if (isRegister) {
        await register(name, email, password, photoUrl.trim() || undefined);
      } else {
        await login(email, password);
      }

      toast.success(
        mode === "register"
          ? "Account created — welcome to StudioSpace!"
          : "You are now signed in.",
      );

      // Read `next` at submit time to avoid useSearchParams + Suspense.
      const next = new URLSearchParams(window.location.search).get("next");
      const target =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
      router.push(target);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message, {
        description: mode === "register" ? "Registration failed." : "Login failed.",
      });
      setError(message);
      setPending(false);
    }
  }

  return (
    <Card>
      <CardContent>
        <GoogleAuthButton />

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            or {(isRegister ? "sign up" : "log in") + " with email"}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>
                Could not {isRegister ? "register" : "log in"}
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="auth-name">Name</Label>
              <Input
                id="auth-name"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={
                isRegister ? "new-password" : "current-password"
              }
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {isRegister && (
              /* Live rule checklist — every item must pass before submit. */
              <ul className="space-y-1 pt-1" aria-live="polite">
                {PASSWORD_RULES.map((rule) => {
                  const ok = rule.test(password);
                  return (
                    <li
                      key={rule.key}
                      className={cn(
                        "flex items-center gap-1.5 text-xs",
                        ok ? "text-emerald-600" : "text-muted-foreground",
                      )}
                    >
                      {ok ? (
                        <CheckCircle2 className="size-3 shrink-0" aria-hidden />
                      ) : (
                        <Circle
                          className="size-3 shrink-0 opacity-40"
                          aria-hidden
                        />
                      )}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="auth-photo">Photo URL</Label>
              <Input
                id="auth-photo"
                type="url"
                autoComplete="url"
                placeholder="https://example.com/me.jpg"
                required
                value={photoUrl}
                onChange={(event) => setPhotoUrl(event.target.value)}
              />
              {!isValidPhotoUrl(photoUrl) && photoUrl.length > 0 && (
                <p className="text-xs text-destructive">
                  Enter a full http(s) image URL.
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Spinner aria-hidden />}
            {isRegister ? "Create account" : "Log in"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isRegister ? "Already have an account? " : "No account yet? "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="text-primary underline-offset-4 hover:underline"
          >
            {isRegister ? "Log in" : "Register"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
