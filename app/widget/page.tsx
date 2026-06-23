import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function WidgetPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Widget SDK
        </p>
        <h2 className="text-3xl font-semibold">Widget product surface</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The widget is now treated as a first-class product with an explicit
          API, show/hide behavior, and event hooks.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>SDK surface</CardTitle>
            <CardDescription>
              Methods the widget runtime must support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-foreground">
            <p>LiveChat.init(config)</p>
            <p>LiveChat.open()</p>
            <p>LiveChat.close()</p>
            <p>LiveChat.show()</p>
            <p>LiveChat.hide()</p>
            <p>
              LiveChat.identify({"{"} id, name, email {"}"})
            </p>
            <p>LiveChat.track("course_purchased")</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Runtime capabilities</CardTitle>
            <CardDescription>
              Foundation for the widget experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• Persisted minimized state</p>
            <p>• Unread counters and typing indicators</p>
            <p>• Reconnect handling and AI fallback</p>
            <p>• Human takeover and versioned theme settings</p>
            <Badge className="mt-2">Phase 1 foundation</Badge>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
