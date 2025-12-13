"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    XCircle,
    Ban,
    AlertCircle,
    Copy,
    Check,
    Calendar,
    Mail,
    Tag,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface LogEntry {
    _id: string;
    createdAt: string;
    event: string;
    subject?: string;
    to?: string;
    status?: string;
    meta?: any;
}

interface LogViewerProps {
    logs: LogEntry[];
}

export function LogViewer({ logs }: LogViewerProps) {
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRowClick = (log: LogEntry) => {
        setSelectedLog(log);
        setOpen(true);
        setCopied(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusColor = (event: string) => {
        switch (event.toLowerCase()) {
            case "delivered":
                return "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20";
            case "bounced":
            case "blocked":
                return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20";
            case "spam":
                return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    const getEventIcon = (event: string) => {
        switch (event.toLowerCase()) {
            case "delivered": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case "bounced": return <XCircle className="w-5 h-5 text-red-500" />;
            case "blocked": return <Ban className="w-5 h-5 text-red-500" />;
            default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
        }
    };

    return (
        <>
            <div className="rounded-md border p-5 bg-background shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Time</TableHead>
                            <TableHead className="w-[140px]">Event</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Recipient</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No log entries found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow
                                    key={log._id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleRowClick(log)}
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {new Date(log.createdAt).toLocaleString(undefined, {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium capitalize">
                                            {getEventIcon(log.event)}
                                            {log.event}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-sm" title={log.subject}>
                                        {log.subject || <span className="text-muted-foreground italic text-xs">(no subject)</span>}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm" title={log.to}>
                                        {log.to || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={cn("capitalize font-normal text-xs px-2 py-0.5", getStatusColor(log.event))}>
                                            {log.status || log.event}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="bottom" className="p-0 flex flex-col">
                    <SheetHeader className="px-6 py-6 border-b bg-muted/10">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1 flex flex-col ">
                                <SheetTitle className="flex items-center gap-2 text-xl">
                                    {selectedLog && getEventIcon(selectedLog.event)}
                                    <span className="capitalize">{selectedLog?.event} Event</span>
                                </SheetTitle>
                                <SheetDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {selectedLog && new Date(selectedLog.createdAt).toLocaleString()}
                                </SheetDescription>
                            </div>
                            {selectedLog && (
                                <Badge variant="outline" className={cn("text-sm px-3 py-1 mr-5", getStatusColor(selectedLog.event))}>
                                    {selectedLog.status}
                                </Badge>
                            )}
                        </div>
                    </SheetHeader>

                    {selectedLog && (
                        <div className="flex-1 overflow-hidden">
                            <Tabs defaultValue="overview" className="h-full flex flex-col">
                                <div className="px-6 border-b">
                                    <TabsList className="w-full justify-start h-12 bg-transparent p-0">
                                        <TabsTrigger
                                            value="overview"
                                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-full"
                                        >
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="json"
                                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-full"
                                        >
                                            Raw JSON
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <ScrollArea className="flex-1">
                                    <div className="p-6">
                                        <TabsContent value="overview" className="mt-0 space-y-6">

                                            {/* Key Details Card */}
                                            <div className="grid gap-4 p-4 rounded-lg border bg-card">
                                                <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Mail className="w-4 h-4" /> To
                                                    </div>
                                                    <div className="text-sm font-medium break-all">{selectedLog.to || "N/A"}</div>
                                                </div>
                                                <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Tag className="w-4 h-4" /> Subject
                                                    </div>
                                                    <div className="text-sm font-medium">{selectedLog.subject || "N/A"}</div>
                                                </div>
                                                <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Activity className="w-4 h-4" /> Message ID
                                                    </div>
                                                    <div className="text-sm font-mono text-muted-foreground break-all">
                                                        {selectedLog.meta?.messageId || "N/A"}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Technical Metadata Table */}
                                            {selectedLog.meta && Object.keys(selectedLog.meta).length > 0 && (
                                                <div className="space-y-3">
                                                    <h3 className="text-sm font-semibold tracking-tight">Technical details</h3>
                                                    <div className="rounded-md border overflow-hidden">
                                                        <Table>
                                                            <TableBody>
                                                                {Object.entries(selectedLog.meta).map(([key, value]) => (
                                                                    <TableRow key={key} className="hover:bg-transparent">
                                                                        <TableCell className="w-[140px] font-medium text-muted-foreground bg-muted/30 py-3 text-xs">
                                                                            {key}
                                                                        </TableCell>
                                                                        <TableCell className="font-mono text-xs break-all py-3">
                                                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value="json" className="mt-0 relative group">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => copyToClipboard(JSON.stringify(selectedLog, null, 2))}
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                <span className="sr-only">Copy JSON</span>
                                            </Button>
                                            <div className="rounded-lg bg-zinc-950 text-zinc-50 border p-4 text-xs font-mono overflow-auto max-h-[600px]">
                                                <pre className="whitespace-pre-wrap break-words">
                                                    {JSON.stringify(selectedLog, null, 2)}
                                                </pre>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </ScrollArea>
                            </Tabs>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}

