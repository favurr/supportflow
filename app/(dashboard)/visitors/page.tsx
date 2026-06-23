import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const visitors = [
  {
    name: "Guest-8A2D",
    page: "/pricing",
    country: "US",
    device: "Mobile",
    status: "Active",
    lastSeen: "2m ago",
  },
  {
    name: "Guest-B7F1",
    page: "/checkout",
    country: "GB",
    device: "Desktop",
    status: "Needs help",
    lastSeen: "7m ago",
  },
];

export default function VisitorsPage() {
  return (
    <section className="w-full space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Visitors
        </p>
        <h2 className="text-3xl font-semibold">Visitor intelligence</h2>
        <p className="mt-2 text-muted-foreground">
          The visitor model now includes identity persistence, page context, and
          session signals for the live feed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Live visitor feed</CardTitle>
            <CardDescription>
              Anonymous identity and session context stay attached across
              refreshes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {visitors.map((visitor) => (
              <article
                key={visitor.name}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {visitor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {visitor.page}
                    </p>
                  </div>
                  <Badge>{visitor.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">{visitor.country}</Badge>
                  <Badge variant="outline">{visitor.device}</Badge>
                  <Badge variant="ghost">Last seen {visitor.lastSeen}</Badge>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identity model</CardTitle>
            <CardDescription>
              Supports visitor_key, fingerprint, and anonymous_name.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Visitor identity survives refreshes.</p>
            <p>• Session and page history feed the inbox panel.</p>
            <p>• Events can be attached to anonymous visitor profiles.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
