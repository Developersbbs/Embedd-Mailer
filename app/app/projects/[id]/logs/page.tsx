import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Project from "@/modals/Projects";
import MailLog from "@/modals/MailLog";

interface LogsPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: {
    page?: string;
  };
}

export default async function ProjectLogsPage({ params, searchParams }: LogsPageProps) {
  const { id } = await params;

  const page = Math.max(parseInt(searchParams?.page || "1", 10) || 1, 1);
  const pageSize = 20;

  await connectDB();

  const project = await Project.findById(id).lean();

  if (!project) {
    return (
      <ContentLayout title="Project not found">
        <p className="text-sm text-muted-foreground">
          This project does not exist or you do not have access to it.
        </p>
      </ContentLayout>
    );
  }

  const [logs, total] = await Promise.all([
    MailLog.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    MailLog.countDocuments({ projectId: project._id }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <ContentLayout title={`${project.name} – Logs`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Mail activity log</h1>
            <p className="text-sm text-muted-foreground">
              Recent email events for this project.
            </p>
          </div>
          <Link href={`/app/projects/${id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              Back to project
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-card/60 overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-2 text-[11px] font-medium text-muted-foreground border-b border-border bg-muted/60">
            <div>Time</div>
            <div>Event</div>
            <div>Subject</div>
            <div>Recipient</div>
            <div>Status</div>
          </div>

          {logs.length === 0 ? (
            <div className="px-4 py-6 text-xs text-muted-foreground">No log entries yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {logs.map((log: any) => (
                <div
                  key={log._id?.toString() || log.id}
                  className="grid grid-cols-5 px-4 py-2 text-xs hover:bg-muted/40 transition-colors"
                >
                  <div className="truncate font-mono text-[11px] text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                  <div className="capitalize">{log.event}</div>
                  <div className="truncate">{log.subject || "(no subject)"}</div>
                  <div className="truncate text-muted-foreground">{log.to || "-"}</div>
                  <div className="truncate">{log.status || ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                disabled={page <= 1}
                asChild={! (page <= 1) as any}
              >
                {page <= 1 ? (
                  <span>Previous</span>
                ) : (
                  <Link href={`/app/projects/${id}/logs?page=${page - 1}`}>Previous</Link>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                disabled={page >= totalPages}
                asChild={! (page >= totalPages) as any}
              >
                {page >= totalPages ? (
                  <span>Next</span>
                ) : (
                  <Link href={`/app/projects/${id}/logs?page=${page + 1}`}>Next</Link>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
