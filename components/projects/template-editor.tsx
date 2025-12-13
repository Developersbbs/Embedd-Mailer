"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, Code2, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const templateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "HTML Content is required"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

interface TemplateEditorProps {
    projectId?: string; // Optional now
    initialData?: TemplateFormValues & { _id?: string };
    mode: "create" | "edit";
    apiEndpoint?: string; // Override default project API
    redirectUrl?: string; // Override default redirect
}

export default function TemplateEditor({
    projectId,
    initialData,
    mode,
    apiEndpoint,
    redirectUrl
}: TemplateEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            name: initialData?.name || "",
            subject: initialData?.subject || "",
            content: initialData?.content || "<html>\n<body>\n  <h1>Hello {{name}}</h1>\n</body>\n</html>",
        },
    });

    const watchedContent = form.watch("content");

    async function onSubmit(data: TemplateFormValues) {
        setLoading(true);
        try {
            let url = "";
            let finalRedirect = "";

            if (apiEndpoint) {
                // Use custom endpoint
                url = mode === "create" ? apiEndpoint : `${apiEndpoint}/${initialData?._id}`;
                finalRedirect = redirectUrl || "/app";
            } else if (projectId) {
                // Default project logic
                url = mode === "create"
                    ? `/api/projects/${projectId}/templates`
                    : `/api/projects/${projectId}/templates/${initialData?._id}`;
                finalRedirect = `/app/projects/${projectId}/templates`;
            } else {
                throw new Error("Missing configuration: projectId or apiEndpoint required");
            }

            const method = mode === "create" ? "POST" : "PUT";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save template");

            toast.success(mode === "create" ? "Template created" : "Template updated");
            router.push(finalRedirect);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const backLink = redirectUrl || (projectId ? `/app/projects/${projectId}/templates` : "/app");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={backLink}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {mode === "create" ? "Create Template" : "Edit Template"}
                    </h1>
                </div>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Saving..." : "Save Template"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
                {/* Editor Column */}
                <Card className="flex flex-col h-full border-muted-foreground/20">
                    <CardHeader className="py-4 border-b">
                        <CardTitle className="text-sm font-medium">Editor</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-4 overflow-y-auto">
                        <Form {...form}>
                            <form className="space-y-4 h-full flex flex-col">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Template Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Welcome Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Welcome to our platform!" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 flex flex-col">
                                            <FormLabel>HTML Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="flex-1 font-mono text-sm min-h-[400px] max-h-[600px] resize-none overflow-y-scroll"
                                                    placeholder="<html>...</html>"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Preview Column */}
                <Card className="flex flex-col h-full border-muted-foreground/20 bg-muted/30">
                    <CardHeader className="py-4 border-b flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Live Preview</CardTitle>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500/50"></div>
                            <div className="h-2 w-2 rounded-full bg-yellow-500/50"></div>
                            <div className="h-2 w-2 rounded-full bg-green-500/50"></div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden relative">
                        <div className="absolute inset-4 bg-white rounded shadow-sm border overflow-hidden">
                            <iframe
                                srcDoc={watchedContent}
                                title="Preview"
                                className="w-full h-full border-0"
                                sandbox="allow-same-origin"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
