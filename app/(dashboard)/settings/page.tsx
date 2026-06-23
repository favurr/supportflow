import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <section className="w-full space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Settings
        </p>
        <h2 className="text-3xl font-semibold">Versioned widget settings</h2>
        <p className="mt-2 text-muted-foreground">
          Draft and published settings will prevent active chats from changing
          behavior mid-session.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>
              Control offline, online, busy, and AFK states.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• ONLINE → human escalation when confidence is low.</p>
            <p>• BUSY → let AI handle longer contexts.</p>
            <p>• AFK → use fallback contact messaging.</p>
            <p>• OFFLINE → capture contact details and queue follow-up.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Published settings</CardTitle>
            <CardDescription>
              Draft-to-publish management is part of the first implementation
              slice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>Welcome message</span>
              <Badge variant="secondary">Published</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>Theme colors</span>
              <Badge variant="outline">Draft</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
              <span>AI prompt</span>
              <Badge variant="secondary">Published</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
