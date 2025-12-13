"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Loader2, Mail, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

interface Template {
    _id: string;
    name: string;
    subject: string;
    updatedAt: string;
}

export default function GlobalTemplatesPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    async function fetchTemplates() {
        try {
            const res = await fetch(`/api/templates`);
            if (!res.ok) throw new Error("Failed to fetch templates");
            const data = await res.json();
            setTemplates(data);
        } catch (error) {
            toast.error("Failed to load templates");
        } finally {
            setLoading(false);
        }
    }

    async function deleteTemplate(templateId: string) {
        if (!confirm("Are you sure you want to delete this template?")) return;

        try {
            const res = await fetch(`/api/templates/${templateId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Template deleted");
            fetchTemplates();
        } catch (error) {
            toast.error("Failed to delete template");
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Your Template Library</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your global templates. You can import these into any project.
                    </p>
                </div>
                <Link href={`/app/templates/new`}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Template
                    </Button>
                </Link>
            </div>

            {templates.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-12 text-center border-dashed">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No global templates yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        Create templates here to reuse them across multiple projects.
                    </p>
                    <Link href={`/app/templates/new`}>
                        <Button variant="outline">Create Template</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card key={template._id} className="group relative overflow-hidden transition-all hover:border-primary/50">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="truncate">{template.name}</span>
                                </CardTitle>
                                <CardDescription className="line-clamp-1">
                                    Subject: {template.subject}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xs text-muted-foreground mb-4">
                                    Last updated: {new Date(template.updatedAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={`/app/templates/${template._id}`} className="flex-1">
                                        <Button variant="secondary" className="w-full text-xs h-8">
                                            <Pencil className="mr-2 h-3 w-3" /> Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => deleteTemplate(template._id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
