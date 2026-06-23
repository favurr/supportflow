import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const projects = [
  {
    name: "Portfolio Site",
    environment: "Production",
    widgetKey: "rel_prod_8a2d",
    allowedDomains: ["alex.dev", "www.alex.dev"],
    status: "Live",
  },
  {
    name: "Law Firm Landing Page",
    environment: "Staging",
    widgetKey: "rel_stg_91ff",
    allowedDomains: ["staging.lawfirm.example"],
    status: "Testing",
  },
];

export default function ProjectsPage() {
  return (
    <section className="w-full space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Projects
          </p>
          <h2 className="text-3xl font-semibold">Multi-project foundation</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Each project now carries its own environment, widget key, and
            allowed domains to keep production and test traffic clean.
          </p>
        </div>
        <Button>New project</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.name}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.environment} environment
                  </CardDescription>
                </div>
                <Badge
                  variant={project.status === "Live" ? "default" : "secondary"}
                >
                  {project.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Widget key</p>
                <p className="font-mono text-foreground">{project.widgetKey}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Allowed domains</p>
                <ul className="mt-1 space-y-1 text-foreground">
                  {project.allowedDomains.map((domain) => (
                    <li key={domain}>• {domain}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
