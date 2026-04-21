"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-xl px-5 sm:px-8">{children}</div>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55"
    >
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`mt-2 w-full rounded-xl bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-violet-400/60 ${
        props.className ?? ""
      }`}
    />
  );
}

function Button({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-white text-black shadow-[0_12px_40px_rgba(255,255,255,0.12)] ring-1 ring-white/15 hover:bg-white/95"
      : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/15";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session) router.replace("/dashboard");
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/dashboard");
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  async function signInWithGoogle() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/dashboard`,
        },
      });
      if (error) setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const trimmed = email.trim();
      if (!trimmed) {
        setError("Please enter your email.");
        return;
      }

      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${origin}/dashboard`,
        },
      });
      if (error) {
        setError(error.message);
        return;
      }
      setMessage("Magic link sent. Check your inbox.");
      setEmail("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-white selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_20%_-10%,rgba(139,92,246,0.25),transparent_60%),radial-gradient(600px_260px_at_80%_10%,rgba(34,211,238,0.16),transparent_60%),radial-gradient(500px_240px_at_40%_110%,rgba(16,185,129,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/70" />
      </div>

      <header className="border-b border-white/5 bg-black/20">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
              aria-label="JobOS Home"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <span className="size-3.5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 shadow-[0_0_20px_rgba(139,92,246,0.35)]" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-white">
                JobOS
              </span>
            </a>
            <a
              href="/"
              className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/8 hover:ring-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
            >
              Back
            </a>
          </div>
        </Container>
      </header>

      <main className="py-10 sm:py-14">
        <Container>
          <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.55)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              Sign in
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back to JobOS
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Sign in to access your dashboard and keep your job search
              organized.
            </p>

            <div className="mt-8 space-y-3">
              <Button onClick={signInWithGoogle} disabled={busy}>
                Continue with Google
              </Button>
              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-white/10" />
                <p className="text-xs font-semibold text-white/45">or</p>
                <div className="h-px flex-1 bg-white/10" />
              </div>
              <form onSubmit={sendMagicLink} className="space-y-3">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" variant="secondary" disabled={busy}>
                  Send magic link
                </Button>
              </form>
            </div>

            {error ? (
              <p className="mt-6 rounded-2xl bg-rose-400/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-400/20">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="mt-6 rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-400/20">
                {message}
              </p>
            ) : null}

            <p className="mt-8 text-xs leading-5 text-white/55">
              By continuing, you agree to use JobOS responsibly. (Terms + policy
              pages can be added later.)
            </p>
          </div>
        </Container>
      </main>
    </div>
  );
}

