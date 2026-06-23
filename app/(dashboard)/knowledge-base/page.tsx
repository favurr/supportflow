import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const articles = [
  { title: "Pricing overview", type: "Markdown", status: "Indexed" },
  { title: "Returns policy", type: "PDF", status: "Queued" },
  { title: "Support checklist", type: "TXT", status: "Indexed" },
];

export default function KnowledgeBasePage() {
  return (
    <section className="w-full space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Knowledge Base
        </p>
        <h2 className="text-3xl font-semibold">RAG-ready content pipeline</h2>
        <p className="mt-2 text-muted-foreground">
          The content base now reflects upload, parse, chunk, index, and
          retrieval planning for AI answers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              Upload and status tracking for the KB.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {articles.map((article) => (
              <article
                key={article.title}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {article.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {article.type}
                    </p>
                  </div>
                  <Badge>{article.status}</Badge>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retrieval flow</CardTitle>
            <CardDescription>How AI context is assembled.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Parse content and normalize formatting.</p>
            <p>2. Chunk and embed into vector search.</p>
            <p>3. Retrieve top-k context before every AI response.</p>
            <p>4. Re-index on update and report stale content.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
