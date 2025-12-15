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
    Copy,
    Check,
    Calendar,
    FileText,
    Globe,
    Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Submission {
    _id: string;
    projectId: string;
    data: any;
    ip?: string;
    userAgent?: string;
    referrer?: string;
    spamDetected: boolean;
    createdAt: string;
}

interface FormField {
    id: string;
    label: string;
    type: string;
}

interface SubmissionsViewerProps {
    submissions: Submission[];
    formSchema?: FormField[];
}

export function SubmissionsViewer({ submissions, formSchema = [] }: SubmissionsViewerProps) {
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleRowClick = (submission: Submission) => {
        setSelectedSubmission(submission);
        setOpen(true);
        setCopied(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    // Determine columns to show
    // We prioritize fields from schema, but if no schema, we pick top 3 keys from first submission data
    const columns = formSchema.length > 0
        ? formSchema
        : (submissions.length > 0 ? Object.keys(submissions[0].data).map(k => ({ id: k, label: k })) : []);

    return (
        <>
            <div className="rounded-md border p-5 bg-background shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Time</TableHead>
                                {columns.map((col) => (
                                    <TableHead key={col.id} className="min-w-[150px]">{col.label}</TableHead>
                                ))}
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 2} className="h-32 text-center text-muted-foreground">
                                        No submissions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((sub) => (
                                    <TableRow
                                        key={sub._id}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => handleRowClick(sub)}
                                    >
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {new Date(sub.createdAt).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })}
                                        </TableCell>

                                        {columns.map((col: any) => (
                                            <TableCell key={col.id} className="max-w-[200px] truncate text-sm">
                                                {typeof sub.data[col.id] === 'object'
                                                    ? JSON.stringify(sub.data[col.id])
                                                    : String(sub.data[col.id] || "-")}
                                            </TableCell>
                                        ))}

                                        <TableCell className="text-right">
                                            {sub.spamDetected ? (
                                                <Badge variant="destructive" className="text-xs px-2 py-0.5">Spam</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-500/10 text-green-700 hover:bg-green-500/20 border-green-200">Valid</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="w-[600px] sm:w-[640px] p-0 flex flex-col">
                    <SheetHeader className="px-6 py-6 border-b bg-muted/10">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <SheetTitle className="flex items-center gap-2 text-xl">
                                    <FileText className="w-5 h-5 text-muted-foreground" />
                                    Submission Details
                                </SheetTitle>
                                <SheetDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {selectedSubmission && new Date(selectedSubmission.createdAt).toLocaleString()}
                                </SheetDescription>
                            </div>
                            {selectedSubmission && (
                                <Badge variant={selectedSubmission.spamDetected ? "destructive" : "outline"} className={cn("text-sm px-3 py-1", !selectedSubmission.spamDetected && "bg-green-500/10 text-green-700 border-green-200")}>
                                    {selectedSubmission.spamDetected ? "Spam Detected" : "Valid Submission"}
                                </Badge>
                            )}
                        </div>
                    </SheetHeader>

                    {selectedSubmission && (
                        <div className="flex-1 overflow-hidden">
                            <Tabs defaultValue="data" className="h-full flex flex-col">
                                <div className="px-6 border-b">
                                    <TabsList className="w-full justify-start h-12 bg-transparent p-0">
                                        <TabsTrigger
                                            value="data"
                                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-full"
                                        >
                                            Form Data
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="metadata"
                                            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-full"
                                        >
                                            Metadata
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
                                        <TabsContent value="data" className="mt-0 space-y-6">
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-semibold tracking-tight">Submitted Fields</h3>
                                                <div className="rounded-md border overflow-hidden">
                                                    <Table>
                                                        <TableBody>
                                                            {Object.entries(selectedSubmission.data).map(([key, value]) => (
                                                                <TableRow key={key} className="hover:bg-transparent">
                                                                    <TableCell className="w-[180px] font-medium text-muted-foreground bg-muted/30 py-3 text-xs capitalize">
                                                                        {key.replace(/_/g, ' ')}
                                                                    </TableCell>
                                                                    <TableCell className="font-mono text-sm break-all py-3">
                                                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="metadata" className="mt-0 space-y-6">
                                            <div className="grid gap-4 p-4 rounded-lg border bg-card">
                                                <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Globe className="w-4 h-4" /> IP Address
                                                    </div>
                                                    <div className="text-sm font-medium font-mono">{selectedSubmission.ip || "N/A"}</div>
                                                </div>
                                                <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Monitor className="w-4 h-4" /> User Agent
                                                    </div>
                                                    <div className="text-sm text-muted-foreground break-all">{selectedSubmission.userAgent || "N/A"}</div>
                                                </div>
                                                <div className="grid grid-cols-[100px_1fr] items-start gap-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <FileText className="w-4 h-4" /> Referrer
                                                    </div>
                                                    <div className="text-sm text-muted-foreground break-all">{selectedSubmission.referrer || "N/A"}</div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="json" className="mt-0 relative group">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => copyToClipboard(JSON.stringify(selectedSubmission, null, 2))}
                                            >
                                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                <span className="sr-only">Copy JSON</span>
                                            </Button>
                                            <div className="rounded-lg bg-zinc-950 text-zinc-50 border p-4 text-xs font-mono overflow-auto max-h-[600px]">
                                                <pre className="whitespace-pre-wrap break-words">
                                                    {JSON.stringify(selectedSubmission, null, 2)}
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
