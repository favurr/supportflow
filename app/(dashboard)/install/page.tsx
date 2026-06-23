import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const snippets = {
  react: `import { RelayWidget } from "@relay/widget";\n\nexport default function App() {\n  return <RelayWidget projectKey="rel_prod_8a2d" />;\n}`,
  script: `<script src="https://relay.mydomain.com/widget.js"></script>\n<script>\n  window.LiveChat?.init({ projectKey: "rel_prod_8a2d" });\n</script>`,
};

export default function InstallPage() {
  return (
    <section className="w-full space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Install
        </p>
        <h2 className="text-3xl font-semibold">
          Installation wizard foundation
        </h2>
        <p className="mt-2 text-muted-foreground">
          This phase wires the installation experience, public keys, and domain
          validation that the widget depends on.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>React install</CardTitle>
            <CardDescription>
              Embed the widget directly in a React app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs text-foreground">
              {snippets.react}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Script install</CardTitle>
            <CardDescription>
              Use the hosted widget for static or non-React sites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs text-foreground">
              {snippets.script}
            </pre>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification checklist</CardTitle>
          <CardDescription>
            Required installation metadata for the first release.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <p className="text-muted-foreground">Widget key</p>
            <p className="mt-1 font-mono text-foreground">rel_prod_8a2d</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-muted-foreground">Domain whitelist</p>
            <p className="mt-1 text-foreground">alex.dev, www.alex.dev</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-muted-foreground">Install status</p>
            <Badge className="mt-1">Verified</Badge>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
