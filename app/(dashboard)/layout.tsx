import Link from "next/link";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/inbox", label: "Inbox" },
  { href: "/visitors", label: "Visitors" },
  { href: "/analytics", label: "Analytics" },
  { href: "/knowledge-base", label: "Knowledge Base" },
  { href: "/install", label: "Install" },
  { href: "/settings", label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Relay Core
            </p>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/widget"
              className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              Widget Preview
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
