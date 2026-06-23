import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const conversations = [
  {
    id: "C-1042",
    visitor: "Guest-8A2D",
    state: "OPEN",
    priority: "HIGH",
    mode: "AI",
    snippet: "How do I upgrade my plan for the law firm site?",
  },
  {
    id: "C-1043",
    visitor: "Guest-B7F1",
    state: "PENDING",
    priority: "URGENT",
    mode: "HUMAN",
    snippet: "The checkout flow is broken on mobile.",
  },
];

export default function InboxPage() {
  return (
    <section className="w-full space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Inbox
        </p>
        <h2 className="text-3xl font-semibold">Live conversations</h2>
        <p className="mt-2 text-muted-foreground">
          The inbox now supports state, priority, and takeover modes from the
          first phase.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Conversation queue</CardTitle>
            <CardDescription>
              Realtime-ready conversation states and priorities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversations.map((conversation) => (
              <article
                key={conversation.id}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {conversation.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {conversation.visitor}
                    </p>
                  </div>
                  <Badge>{conversation.state}</Badge>
                </div>
                <p className="mt-3 text-sm text-foreground">
                  {conversation.snippet}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <Badge variant="secondary">
                    Priority: {conversation.priority}
                  </Badge>
                  <Badge variant="outline">Mode: {conversation.mode}</Badge>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operator controls</CardTitle>
            <CardDescription>
              Support for notes, escalation, and presence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              • Internal notes are private and attached to the conversation.
            </p>
            <p>
              • AI confidence must be deterministic and measurable before
              escalation.
            </p>
            <p>
              • Presence states will drive fallback and human takeover behavior.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
