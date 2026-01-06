import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Project from "@/modals/Projects";
import MailLog from "@/modals/MailLog";
import { ArrowLeft } from "lucide-react";
import { DateFilter } from "@/components/dashboard/date-filter";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
  }>;
}

function getDateRange(range: string, from?: string, to?: string) {
  const end = new Date(); // Default to now
  let start = new Date();

  if (range === "custom" && from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    // Set to start of day and end of day respectively
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);
    return { start: fromDate, end: toDate, label: `${from} to ${to}` };
  }

  // Preset ranges
  switch (range) {
    case "7d":
      start.setDate(end.getDate() - 7);
      return { start, end, label: "Last 7 days" };
    case "30d":
      start.setDate(end.getDate() - 30);
      return { start, end, label: "Last 30 days" };
    case "90d":
      start.setDate(end.getDate() - 90);
      return { start, end, label: "Last 3 months" };
    case "24h":
    default:
      start = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return { start, end, label: "Last 24 hours" };
  }
}

export default async function ProjectPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const { start, end, label } = getDateRange(
    resolvedSearchParams.range || "24h",
    resolvedSearchParams.from,
    resolvedSearchParams.to
  );

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

  // Fetch logs for the selected period
  const logsInPeriod = await MailLog.find({
    projectId: project._id,
    createdAt: { $gte: start, $lte: end },
  })
    .sort({ createdAt: -1 })
    .lean();

  const total = logsInPeriod.length;
  const delivered = logsInPeriod.filter((log: any) => log.event === "delivered").length;
  const bounced = logsInPeriod.filter((log: any) => log.event === "bounced").length;
  const blocked = logsInPeriod.filter((log: any) =>
    ["blocked", "spam"].includes(String(log.event || "").toLowerCase())
  ).length;
  const quarantined = logsInPeriod.filter((log: any) =>
    String(log.status || "").toLowerCase().includes("quarantine")
  ).length;

  const deliveryRate = total ? (delivered / total) * 100 : null;
  const bounceRate = total ? (bounced / total) * 100 : null;

  // Compute Traffic Graph Data
  // We want to show a reasonable number of bars based on the range
  // For < 48h, maybe hourly? For now let's stick to daily aggregation but respect the range.

  // Create a copy of start for iteration
  const iterDate = new Date(start);
  iterDate.setHours(0, 0, 0, 0);

  // Aggregate data by date
  const trafficLogs = await MailLog.aggregate([
    {
      $match: {
        projectId: project._id,
        createdAt: { $gte: start, $lte: end },
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

  // Fill in missing days between start and end
  const trafficData: { date: string; total: number; failed: number }[] = [];
  const trafficMap = new Map(trafficLogs.map(l => [l._id, l]));

  // Calculate generic API usage from logs (as proxy)
  // This is strictly project total, not filtered by date, as it's an "API usage" summary?
  // Usually API usage limits are monthly. Let's show TOTAL ALL TIME for now as per original design, 
  // or should it filter? The label says "Total requests", implies lifecycle. 
  // Let's keep distinct: Top sections follow filter, Bottom section "API Usage" is usually billing related so maybe all time or monthly.
  // The user asked for reports "in this dashboard", implying the main metrics. 
  // I will make the top cards and graph reactive. I will keep API usage summary as "All time" unless specified otherwise, 
  // but to be consistent, let's make the "Errors" count reactive too if it's in the filtered view.
  // Actually, let's keep the bottom section as "All Time" context for now to differentiate "Current View" vs "Project Lifecycle".

  const totalRequestsAllTime = await MailLog.countDocuments({ projectId: project._id });
  const totalErrorsAllTime = await MailLog.countDocuments({
    projectId: project._id,
    event: { $in: ["bounced", "blocked", "spam"] }
  });

  // Generate date points for the graph
  // If range is large (e.g. 90d), 90 bars is fine.
  // If range is small (24h), we ideally want hours, but the aggregation above is by day.
  // Let's switch to hourly if range <= 24h?
  // Complexity: 24h range traverses 2 calendar days usually.

  const isShortRange = (end.getTime() - start.getTime()) <= 24 * 60 * 60 * 1000;

  if (isShortRange) {
    // Hourly aggregation
    // We need a new aggregation for hourly if we want to show it. 
    // For simplicity in this iteration, I'll stick to Daily bars. 
    // If the user selects "24h", they see 1 or 2 bars (today/yesterday).
    // Let's stick to daily for consistency first to ensure 7d/30d works well.
    // Filling days loop:

    const dayDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    // Cap at 90 days for visual sanity if someone puts crazy custom range
    const daysToShow = Math.min(dayDiff, 90);

    for (let i = 0; i <= daysToShow; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      if (new Date(dateStr) > end) break;

      const dayLog = trafficMap.get(dateStr) || { total: 0, failed: 0 };
      trafficData.push({ date: dateStr, total: dayLog.total, failed: dayLog.failed });
    }
  } else {
    // Standard daily fill
    // We iterate from start to end
    const current = new Date(start);
    current.setHours(0, 0, 0, 0);
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    while (current <= endDay) {
      const dateStr = current.toISOString().split("T")[0];
      const dayLog = trafficMap.get(dateStr) || { total: 0, failed: 0 };
      trafficData.push({ date: dateStr, total: dayLog.total, failed: dayLog.failed });
      current.setDate(current.getDate() + 1);
    }
  }

  return (
    <ContentLayout title={project.name}>
      {/* Header: project title + tabs */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex items-center gap-2">
          <Link href="/app">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-semibold leading-tight truncate">{project.name}</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <DateFilter />
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
            <span className="text-xs text-muted-foreground font-medium">
              {label}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Emails</p>
              <p className="text-2xl font-semibold leading-none">{total}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {delivered} delivered, {bounced} bounced
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Delivery rate</p>
              <p className="text-2xl font-semibold leading-none">
                {deliveryRate !== null ? `${deliveryRate.toFixed(1)}%` : "–"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">For selected period</p>
            </div>
            <div className="rounded-lg border border-border bg-card/60 p-4">
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Bounce rate</p>
              <p className="text-2xl font-semibold leading-none">
                {bounceRate !== null ? `${bounceRate.toFixed(1)}%` : "–"}
              </p>
              <p className="text-[11px] text-amber-500 mt-1">For selected period</p>
            </div>
          </div>
        </section>

        {/* Middle: traffic graph + SMTP / domains side column */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card/60 p-4 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">Email traffic</h3>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                Realtime
              </span>
            </div>

            {/* Simple bar graph style using pure CSS blocks */}
            <div className="flex items-end gap-2 h-32 mt-3 overflow-x-auto pb-2">
              {trafficData.length > 0 ? trafficData.map((day, i) => {
                const maxTotal = Math.max(...trafficData.map(d => d.total)) || 1;
                const heightPercent = Math.min(100, Math.max(5, (day.total / maxTotal) * 100));

                return (
                  <div key={day.date} className="min-w-[20px] flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="w-full rounded-md bg-muted/60 overflow-hidden relative h-full flex items-end">
                      <div
                        className="bg-primary/80 w-full rounded-md transition-all hover:bg-primary"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    {/* Show label only for specific intervals to avoid clutter if many bars */}
                    <span className="text-[10px] text-muted-foreground hidden sm:block truncate w-full text-center">
                      {trafficData.length <= 14 || i % Math.ceil(trafficData.length / 7) === 0
                        ? day.date.split('-').slice(1).join('/')
                        : ''}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs p-2 rounded shadow-lg whitespace-nowrap z-10 border">
                      <p className="font-semibold">{day.date}</p>
                      <p>Total: {day.total}</p>
                      <p>Failed: {day.failed}</p>
                    </div>
                  </div>
                )
              }) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No traffic data for this period
                </div>
              )}
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
                  High level breakdown of API calls for this project (All Time).
                </p>
              </div>
              <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-emerald-500/10 text-emerald-500">
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground mb-1">Total requests</p>
                <p className="text-sm font-semibold">{totalRequestsAllTime.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Errors</p>
                <p className="text-sm font-semibold text-red-500">{totalErrorsAllTime.toLocaleString()}</p>
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

        {/* Security & spam protection (selected period) */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card/60 p-4">
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Spam blocked
            </p>
            <p className="text-2xl font-semibold leading-none">{blocked}</p>
            <p className="text-[11px] text-emerald-500 mt-1">
              Messages filtered by spam rules
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-4">
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Threats detected
            </p>
            <p className="text-2xl font-semibold leading-none">{blocked}</p>
            <p className="text-[11px] text-amber-500 mt-1">Suspicious or malicious traffic</p>
          </div>
          <div className="rounded-lg border border-border bg-card/60 p-4">
            <p className="text-[11px] font-medium text-muted-foreground mb-1">
              Quarantined messages
            </p>
            <p className="text-2xl font-semibold leading-none">{quarantined}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Held for manual review and investigation
            </p>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
