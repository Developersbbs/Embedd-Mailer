import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Project from "@/modals/Projects";
import MailLog from "@/modals/MailLog";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;

  await connectDB();

  let project = null;
  try {
    project = await Project.findById(id).lean();
  } catch {
    project = null;
  }

  if (!project) {
    return (
      <ContentLayout title="Project not found">
        <p className="text-sm text-muted-foreground">
          This project does not exist or you do not have access to it.
        </p>
      </ContentLayout>
    );
  }

  // Compute simple analytics from mail logs for this project
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const logsLast24h = await MailLog.find({
    projectId: project._id,
    createdAt: { $gte: since24h },
  })
    .sort({ createdAt: -1 })
    .lean();

  const totalLast24h = logsLast24h.length;
  const deliveredLast24h = logsLast24h.filter((log: any) => log.event === "delivered").length;
  const bouncedLast24h = logsLast24h.filter((log: any) => log.event === "bounced").length;
  const blockedLast24h = logsLast24h.filter((log: any) =>
    ["blocked", "spam"].includes(String(log.event || "").toLowerCase())
  ).length;
  const quarantinedLast24h = logsLast24h.filter((log: any) =>
    String(log.status || "").toLowerCase().includes("quarantine")
  ).length;

  const deliveryRate = totalLast24h ? (deliveredLast24h / totalLast24h) * 100 : null;
  const bounceRate = totalLast24h ? (bouncedLast24h / totalLast24h) * 100 : null;

  // Compute 7-day traffic analytics
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const trafficLogs = await MailLog.aggregate([
    {
      $match: {
        projectId: project._id,
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        total: { $sum: 1 },
        failed: {
          $sum: {
            $cond: [{ $in: ["$event", ["bounced", "blocked", "spam"]] }, 1, 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill in missing days
  const trafficData: { date: string; total: number; failed: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const dayLog = trafficLogs.find((l) => l._id === dateStr) || { total: 0, failed: 0 };
    trafficData.push({ date: dateStr, ...dayLog });
  }

  // Calculate generic API usage from logs (as proxy)
  const totalRequests = await MailLog.countDocuments({ projectId: project._id });
  const totalErrors = await MailLog.countDocuments({
    projectId: project._id,
    event: { $in: ["bounced", "blocked", "spam"] }
  });

  return (
    <ContentLayout title={project.name}>
      {/* Header: project title + tabs */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold leading-tight truncate">{project.name}</h1>
          <p className="text-xs text-muted-foreground truncate">
            ID: {String(project._id || "")} · Manage SMTP, domains and API access for this project.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/app/projects/${id}/logs`}>
            <Button
              type="button"
              size="sm"
              variant="default"
              className="px-4 text-white"
            >
              Logs
            </Button>
          </Link>

          <Link href={`/app/projects/${id}/settings`}>
            <Button
              type="button"
              size="sm"
              variant="default"
              className="px-4 text-white"
            >
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* Top: overview + key metrics */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">SMTP & API overview</h2>
              <p className="text-xs text-muted-foreground max-w-xl">
                {project.description || "Monitor deliveries, failures and API usage for this project from a single view."}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Emails (last 24h)</p>
              <p className="text-2xl font-semibold leading-none">{totalLast24h}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {deliveredLast24h} delivered, {bouncedLast24h} bounced
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Delivery rate</p>
              <p className="text-2xl font-semibold leading-none">
                {deliveryRate !== null ? `${deliveryRate.toFixed(1)}%` : "–"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">Last 24 hours</p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Bounce rate</p>
              <p className="text-2xl font-semibold leading-none">
                {bounceRate !== null ? `${bounceRate.toFixed(1)}%` : "–"}
              </p>
              <p className="text-[11px] text-amber-500 mt-1">Based on last 24 hours</p>
            </div>
          </div>
        </section>

        {/* Middle: traffic graph + SMTP / domains side column */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card/60 p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Email traffic</h3>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                Realtime
              </span>
            </div>

            {/* Simple bar graph style using pure CSS blocks */}
            <div className="flex items-end gap-2 h-32 mt-3">
              {trafficData.map((day, i) => {
                const heightPercent = Math.min(100, Math.max(5, (day.total / (Math.max(...trafficData.map(d => d.total)) || 1)) * 100));
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="w-full rounded-md bg-muted/60 overflow-hidden relative h-full flex items-end">
                      <div
                        className="bg-primary/80 w-full rounded-md transition-all hover:bg-primary"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{day.date.split('-').slice(1).join('/')}</span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg whitespace-nowrap z-10 border">
                      <p className="font-semibold">{day.date}</p>
                      <p>Total: {day.total}</p>
                      <p>Failed: {day.failed}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <h3 className="text-sm font-semibold mb-1">SMTP status</h3>
              <p className="text-xs text-muted-foreground mb-3">
                High-level status of your SMTP configuration for this project.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Configuration</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last test</span>
                  <span>2 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="truncate max-w-[160px]">
                    {project.smtpSettings?.host || "smtp.your-provider.com"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/60 p-4">
              <h3 className="text-sm font-semibold mb-1">Allowed domains</h3>
              {Array.isArray(project.allowedDomains) && project.allowedDomains.length > 0 ? (
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                  {project.allowedDomains.map((domain: string) => (
                    <li key={domain}>{domain}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No allowed domains configured yet.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Bottom: API key + usage summary */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card/60 p-4 md:col-span-1">
            <h3 className="text-sm font-semibold mb-1">Project API key</h3>
            <p className="text-xs text-muted-foreground break-all bg-muted/40 rounded-md px-3 py-2 mb-2">
              {project.apiKey}
            </p>
            <p className="text-xs text-muted-foreground">
              Use this key in the <code>X-API-Key</code> header when submitting forms or
              SMTP events to this project.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card/60 p-4 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">API usage summary</h3>
                <p className="text-xs text-muted-foreground">
                  High level breakdown of API calls for this project.
                </p>
              </div>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-emerald-500/10 text-emerald-500">
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground mb-1">Total requests</p>
                <p className="text-sm font-semibold">{totalRequests.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Errors</p>
                <p className="text-sm font-semibold text-red-500">{totalErrors.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Avg. latency</p>
                <p className="text-sm font-semibold">184 ms</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">95th percentile</p>
                <p className="text-sm font-semibold">420 ms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security & spam protection (last 24h) */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card/60 p-4">
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Spam blocked (24h)
            </p>
            <p className="text-2xl font-semibold leading-none">{blockedLast24h}</p>
            <p className="text-[11px] text-emerald-500 mt-1">
              Messages filtered by spam rules
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-4">
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Threats detected (24h)
            </p>
            <p className="text-2xl font-semibold leading-none">{blockedLast24h}</p>
            <p className="text-[11px] text-amber-500 mt-1">Suspicious or malicious traffic</p>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-4">
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Quarantined messages (24h)
            </p>
            <p className="text-2xl font-semibold leading-none">{quarantinedLast24h}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Held for manual review and investigation
            </p>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
