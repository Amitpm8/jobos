type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
  );
}

function Logo() {
  return (
    <a
      href="/"
      className="group inline-flex items-center gap-2 rounded-lg px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
      aria-label="JobOS Home"
    >
      <span className="grid size-8 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
        <span className="size-3.5 rounded-full bg-gradient-to-br from-violet-400 to-cyan-300 shadow-[0_0_20px_rgba(139,92,246,0.35)]" />
      </span>
      <span className="text-sm font-semibold tracking-tight text-white">
        JobOS
      </span>
      <span className="hidden rounded-full bg-white/5 px-2 py-0.5 text-[11px] font-medium text-white/70 ring-1 ring-white/10 sm:inline-block">
        Smart tracker
      </span>
    </a>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70"
    >
      {children}
    </a>
  );
}

function Button({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70";
  const styles =
    variant === "primary"
      ? "bg-white text-black shadow-[0_12px_40px_rgba(255,255,255,0.12)] ring-1 ring-white/15 hover:bg-white/95 hover:shadow-[0_16px_60px_rgba(255,255,255,0.14)]"
      : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/15";

  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}

function Section({ id, eyebrow, title, description, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-16 sm:py-24">
      <Container>
        <div className="max-w-2xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-white/70">
              {description}
            </p>
          ) : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition-all hover:bg-white/7 hover:ring-white/15">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-56 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/20 via-cyan-400/10 to-transparent blur-3xl" />
      </div>
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-black/30 ring-1 ring-white/10">
            {icon}
          </div>
          <h3 className="text-base font-semibold tracking-tight text-white">
            {title}
          </h3>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/70">{description}</p>
      </div>
    </div>
  );
}

function IconTracker() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-white/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 7h11" />
      <path d="M8 12h11" />
      <path d="M8 17h11" />
      <path d="M5 7h.01M5 12h.01M5 17h.01" />
    </svg>
  );
}

function IconReminder() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-white/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22a2.5 2.5 0 0 0 2.4-2H9.6A2.5 2.5 0 0 0 12 22Z" />
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 text-white/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15v-4" />
      <path d="M12 15V8" />
      <path d="M16 15v-6" />
    </svg>
  );
}

export default function Home() {
  return (
    <div
      id="top"
      className="min-h-screen bg-[#07080b] text-white selection:bg-violet-500/30"
    >
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(700px_300px_at_20%_-10%,rgba(139,92,246,0.25),transparent_60%),radial-gradient(600px_260px_at_80%_10%,rgba(34,211,238,0.16),transparent_60%),radial-gradient(500px_240px_at_40%_110%,rgba(16,185,129,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/70" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Logo />
            <nav className="hidden items-center gap-1 sm:flex">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#why">Why JobOS</NavLink>
              <NavLink href="#cta">Get Started</NavLink>
            </nav>
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className="hidden rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/8 hover:ring-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 sm:inline-flex"
              >
                Dashboard
              </a>
              <Button href="/dashboard">Start Free</Button>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <section className="pt-14 sm:pt-20">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                  <span className="size-1.5 rounded-full bg-violet-400/90" />
                  Smart Job Application Tracker
                </p>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Track Every Job Application in One Place
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">
                  Manage applications, interviews, follow-ups and career progress
                  with clarity.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button href="/dashboard">Start Free</Button>
                  <Button href="#demo" variant="secondary">
                    View Demo
                  </Button>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
                  <p className="inline-flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-400/80" />
                    Fast setup
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-cyan-300/80" />
                    Clean workflow
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-violet-400/80" />
                    Insightful analytics
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-2 -z-10 rounded-3xl bg-gradient-to-r from-violet-500/20 via-cyan-400/10 to-emerald-400/10 blur-2xl" />
                <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/85">
                      Today’s pipeline
                    </p>
                    <p className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                      JobOS
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {[
                      {
                        role: "Frontend Engineer",
                        company: "Aurora Labs",
                        status: "Interview",
                      },
                      {
                        role: "Product Designer",
                        company: "Northwind",
                        status: "Follow-up",
                      },
                      {
                        role: "Full-stack Engineer",
                        company: "Helio",
                        status: "Applied",
                      },
                    ].map((item) => (
                      <div
                        key={`${item.company}-${item.role}`}
                        className="group flex items-center justify-between rounded-2xl bg-black/20 px-4 py-3 ring-1 ring-white/10 transition-colors hover:bg-black/30"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white/90">
                            {item.role}
                          </p>
                          <p className="mt-0.5 text-xs text-white/60">
                            {item.company}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white/85">
                        Weekly momentum
                      </p>
                      <p className="text-xs font-semibold text-white/60">
                        +18%
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-7 items-end gap-2">
                      {[4, 7, 6, 9, 8, 12, 10].map((h, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg bg-gradient-to-t from-violet-500/50 to-cyan-300/40 ring-1 ring-white/10"
                          style={{ height: `${h * 6}px` }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/60">
                      Keep track of what you applied to, what’s next, and what’s
                      working.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Section
          id="features"
          eyebrow="Features"
          title="Everything you need to stay on top of your search"
          description="JobOS keeps your pipeline organized and nudges you at the right time — without feeling like another app to manage."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Application Tracker"
              description="Capture roles, companies, links, notes, and status — in a workflow that stays tidy as volume grows."
              icon={<IconTracker />}
            />
            <FeatureCard
              title="Interview Reminders"
              description="Never miss a follow-up. Get lightweight reminders that respect your focus and help you build momentum."
              icon={<IconReminder />}
            />
            <FeatureCard
              title="Smart Analytics"
              description="See what’s converting. Understand where you’re getting traction and adjust your strategy with confidence."
              icon={<IconAnalytics />}
            />
          </div>
        </Section>

        <Section
          id="why"
          eyebrow="Why JobOS"
          title="Built for real job seekers, not spreadsheets"
          description="Most people lose opportunities because details live in tabs, inboxes, and memory. JobOS brings calm to the chaos — a single place to capture every application, prepare for interviews, and follow up on time."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-white">Clarity</p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Know what you applied to, where you stand, and what’s next — at
                a glance.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-white">Consistency</p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Follow-ups happen on schedule, so you stay visible without being
                overwhelmed.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="text-sm font-semibold text-white">Progress</p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Small improvements compound. Analytics show you what to keep and
                what to change.
              </p>
            </div>
          </div>
        </Section>

        <section id="demo" className="py-16 sm:py-24">
          <Container>
            <div className="rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 sm:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                    Demo
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    A premium workflow — without the clutter
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    Visit the dashboard to add applications, track status, and
                    keep momentum.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button href="/dashboard">Open Dashboard</Button>
                  <Button href="#features" variant="secondary">
                    Explore Features
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section id="cta" className="py-16 sm:py-24">
          <Container>
            <div className="relative overflow-hidden rounded-3xl bg-white/5 p-10 ring-1 ring-white/10 sm:p-14">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 -top-24 size-[26rem] rounded-full bg-violet-500/20 blur-3xl" />
                <div className="absolute -bottom-28 -right-24 size-[26rem] rounded-full bg-cyan-400/14 blur-3xl" />
              </div>
              <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Stop losing job opportunities.
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/70">
                    Bring your job search into one calm system. Track, follow
                    up, and learn what works.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button href="/dashboard">Start Free Today</Button>
                  <Button href="#features" variant="secondary">
                    View Features
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </section>
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
