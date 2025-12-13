import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Project from "@/modals/Projects";
import MailLog from "@/modals/MailLog";
import Submission from "@/modals/Submissions";
import { LogViewer } from "@/components/projects/log-viewer";
import { SubmissionsViewer } from "@/components/projects/submissions-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { page: pageParam } = await searchParams || {};
  const page = Math.max(parseInt(pageParam || "1", 10) || 1, 1);
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

  const [logs, logsTotal, submissions, submissionsTotal] = await Promise.all([
    MailLog.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    MailLog.countDocuments({ projectId: project._id }),
    Submission.find({ projectId: project._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Submission.countDocuments({ projectId: project._id }),
  ]);

  const totalPages = Math.max(1, Math.ceil(Math.max(logsTotal, submissionsTotal) / pageSize));

  return (
    <ContentLayout title={`${project.name} – Logs`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Activity & Submissions</h1>
            <p className="text-sm text-muted-foreground">
              Monitor email delivery and form submissions.
            </p>
          </div>
          <Link href={`/app/projects/${id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              Back to project
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="logs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
            <TabsTrigger value="logs">Mail Logs</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <div className="rounded-lg bg-card/60 overflow-hidden">
              <LogViewer logs={JSON.parse(JSON.stringify(logs))} />
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-4">
            <div className="rounded-lg bg-card/60 overflow-hidden">
              <SubmissionsViewer
                submissions={JSON.parse(JSON.stringify(submissions))}
                formSchema={project.formSchema || []}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination - Shared for simplified navigation for now */}
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
                asChild={!(page <= 1) as any}
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
                asChild={!(page >= totalPages) as any}
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
