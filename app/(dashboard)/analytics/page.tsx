import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const metrics = [
  { label: "Conversations Started", value: "128" },
  { label: "Conversations Resolved", value: "91" },
  { label: "Human Takeovers", value: "17" },
  { label: "AI Resolution Rate", value: "71%" },
  { label: "Avg. Response Time", value: "18s" },
  { label: "Avg. Conversation Length", value: "6.4 msgs" },
];

export default function AnalyticsPage() {
  return (
    <section className="w-full space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Analytics
        </p>
        <h2 className="text-3xl font-semibold">Operator and AI performance</h2>
        <p className="mt-2 text-muted-foreground">
          This phase adds the analytics backbone needed for resolution tracking,
          human handoffs, and AI confidence reporting.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardTitle>{metric.label}</CardTitle>
              <CardDescription>
                Derived from conversations and visitor events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top questions</CardTitle>
          <CardDescription>
            Knowledge base and AI routing insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary">Pricing</Badge>
          <Badge variant="secondary">Refund policy</Badge>
          <Badge variant="secondary">Meeting availability</Badge>
          <Badge variant="secondary">Checkout issue</Badge>
        </CardContent>
      </Card>
    </section>
  );
}
