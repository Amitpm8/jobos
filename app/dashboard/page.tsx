"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";

type ApplicationStatus =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

type ApplicationRow = {
  id?: string | number;
  company: string;
  role: string;
  platform: string;
  status: ApplicationStatus | string;
  created_at?: string;
};

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
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

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`mt-2 w-full rounded-xl bg-black/30 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-violet-400/60 ${
        props.className ?? ""
      }`}
    />
  );
}

function Button({
  children,
  type = "button",
  disabled,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-white text-black shadow-[0_12px_40px_rgba(255,255,255,0.12)] ring-1 ring-white/15 hover:bg-white/95"
      : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/15";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "Offer"
      ? "bg-emerald-400/15 text-emerald-200 ring-emerald-400/25"
      : status === "Interview"
        ? "bg-cyan-300/15 text-cyan-100 ring-cyan-300/25"
        : status === "Follow-up"
          ? "bg-violet-400/15 text-violet-200 ring-violet-400/25"
          : status === "Rejected"
            ? "bg-rose-400/15 text-rose-200 ring-rose-400/25"
            : "bg-white/8 text-white/75 ring-white/15";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${variant}`}
    >
      {status}
    </span>
  );
}

function formatCreatedAt(created_at?: string) {
  if (!created_at) return null;
  const dt = new Date(created_at);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const [company, setCompany] = React.useState("");
  const [role, setRole] = React.useState("");
  const [platform, setPlatform] = React.useState("");
  const [status, setStatus] = React.useState<ApplicationStatus>("Applied");
  const [search, setSearch] = React.useState("");

  const [items, setItems] = React.useState<ApplicationRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [mutatingIds, setMutatingIds] = React.useState<Record<string, true>>(
    {},
  );

  const loadApplications = React.useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setItems([]);
      setError(fetchError.message);
      return;
    }

    setItems((data ?? []) as ApplicationRow[]);
  }, []);

  const filteredItems = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const c = (it.company ?? "").toLowerCase();
      const r = (it.role ?? "").toLowerCase();
      return c.includes(q) || r.includes(q);
    });
  }, [items, search]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await loadApplications();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadApplications]);

  async function updateStatus(id: string | number | undefined, next: string) {
    if (id === undefined || id === null) return;
    const key = String(id);
    const prev = items;

    setSuccess(null);
    setError(null);
    setMutatingIds((m) => ({ ...m, [key]: true }));
    setItems((curr) =>
      curr.map((it) => (String(it.id) === key ? { ...it, status: next } : it)),
    );

    const { error: updateError } = await supabase
      .from("applications")
      .update({ status: next })
      .eq("id", id);

    if (updateError) {
      setItems(prev);
      setError(updateError.message);
    }

    setMutatingIds((m) => {
      const { [key]: _, ...rest } = m;
      return rest;
    });
  }

  async function deleteApplication(id: string | number | undefined) {
    if (id === undefined || id === null) return;
    const key = String(id);
    const prev = items;

    setSuccess(null);
    setError(null);
    setMutatingIds((m) => ({ ...m, [key]: true }));
    setItems((curr) => curr.filter((it) => String(it.id) !== key));

    const { error: deleteError } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setItems(prev);
      setError(deleteError.message);
    } else {
      setSuccess("Deleted.");
    }

    setMutatingIds((m) => {
      const { [key]: _, ...rest } = m;
      return rest;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        company: company.trim(),
        role: role.trim(),
        platform: platform.trim(),
        status,
      };

      if (!payload.company || !payload.role || !payload.platform) {
        setError("Please fill out company, role, and platform.");
        return;
      }

      const { error: insertError } = await supabase
        .from("applications")
        .insert(payload);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setCompany("");
      setRole("");
      setPlatform("");
      setStatus("Applied");
      setSuccess("Application added.");
      await loadApplications();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07080b] text-white selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_20%_-10%,rgba(139,92,246,0.25),transparent_60%),radial-gradient(600px_260px_at_80%_10%,rgba(34,211,238,0.16),transparent_60%),radial-gradient(500px_240px_at_40%_110%,rgba(16,185,129,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/70" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                <span className="size-3.5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 shadow-[0_0_20px_rgba(139,92,246,0.35)]" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-white">
                  JobOS
                </p>
                <p className="text-xs text-white/55">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/"
                className="hidden rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/8 hover:ring-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 sm:inline-flex"
              >
                Marketing
              </a>
              <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10 sm:inline-flex">
                Applications: {items.length}
              </span>
              <button
                type="button"
                onClick={() => loadApplications()}
                className="rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/8 hover:ring-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
              >
                Refresh
              </button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
            <Card>
              <div>
                <h1 className="text-lg font-semibold tracking-tight text-white">
                  Add application
                </h1>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Capture each job in seconds and keep the pipeline clean.
                </p>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="e.g. Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoComplete="organization"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="e.g. Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    name="platform"
                    placeholder="e.g. LinkedIn / Company site"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as ApplicationStatus)
                    }
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </Select>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Add Application"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={submitting}
                    onClick={() => {
                      setCompany("");
                      setRole("");
                      setPlatform("");
                      setStatus("Applied");
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    Clear
                  </Button>
                </div>

                {error ? (
                  <p className="rounded-xl bg-rose-400/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-400/20">
                    {error}
                  </p>
                ) : null}
                {success ? (
                  <p className="rounded-xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200 ring-1 ring-emerald-400/20">
                    {success}
                  </p>
                ) : null}
              </form>
            </Card>

            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-white">
                    Your applications
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    A single view of what you applied to and what’s next.
                  </p>
                </div>
                <div className="grid gap-3 sm:w-[360px]">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      name="search"
                      placeholder="Search by company or role..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      loadApplications();
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/8 hover:ring-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 sm:hidden"
                  >
                    Refresh
                  </a>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[132px] animate-pulse rounded-2xl bg-white/5 ring-1 ring-white/10"
                    />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card className="p-10">
                  <p className="text-sm text-white/70">
                    {items.length === 0
                      ? "No applications yet. Add your first one to start tracking."
                      : "No matches. Try a different search."}
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredItems.map((app) => {
                    const idKey = app.id === undefined ? null : String(app.id);
                    const isMutating = idKey ? Boolean(mutatingIds[idKey]) : false;

                    return (
                    <div
                      key={`${app.id ?? app.company}-${app.role}-${app.created_at ?? ""}`}
                      className="group relative overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/7 hover:ring-white/15"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="absolute -top-24 left-1/2 h-56 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-cyan-400/10 to-transparent blur-3xl" />
                      </div>
                      <div className="relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white/90">
                              {app.role}
                            </p>
                            <p className="mt-1 text-xs text-white/60">
                              {app.company}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="hidden sm:inline-flex">
                              <StatusBadge status={String(app.status)} />
                            </span>
                            <select
                              aria-label="Update status"
                              value={String(app.status)}
                              disabled={!idKey || isMutating}
                              onChange={(e) =>
                                updateStatus(app.id, e.target.value)
                              }
                              className="rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10 outline-none transition hover:bg-black/40 focus:ring-2 focus:ring-violet-400/60 disabled:opacity-60"
                            >
                              {["Applied", "Interview", "Offer", "Rejected"].includes(
                                String(app.status),
                              ) ? null : (
                                <option value={String(app.status)}>
                                  {String(app.status)}
                                </option>
                              )}
                              <option>Applied</option>
                              <option>Interview</option>
                              <option>Offer</option>
                              <option>Rejected</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-5 space-y-2 text-sm text-white/70">
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-white/55">Platform</span>
                            <span className="font-medium text-white/75">
                              {app.platform}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-4">
                            <span className="text-white/55">Added</span>
                            <span className="font-medium text-white/75">
                              {formatCreatedAt(app.created_at) ?? "—"}
                            </span>
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3">
                          <p className="text-xs text-white/55">
                            {isMutating ? "Syncing…" : " "}
                          </p>
                          <button
                            type="button"
                            disabled={!idKey || isMutating}
                            onClick={() => deleteApplication(app.id)}
                            className="rounded-full bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-200 ring-1 ring-rose-400/20 transition hover:bg-rose-400/15 hover:ring-rose-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <footer className="border-t border-white/5 py-10">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-white">JobOS</p>
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} JobOS. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

