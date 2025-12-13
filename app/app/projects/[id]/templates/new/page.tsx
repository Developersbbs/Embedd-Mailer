"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateEditor from "@/components/projects/template-editor";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LayoutTemplate, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface GlobalTemplate {
    _id: string;
    name: string;
    subject: string;
    content: string;
}

export default function NewTemplatePage() {
    const params = useParams();
    const projectId = params.id as string;

    const [step, setStep] = useState<"select" | "editor">("select");
    const [globalTemplates, setGlobalTemplates] = useState<GlobalTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

    useEffect(() => {
        async function fetchGlobals() {
            try {
                const res = await fetch("/api/templates/global");
                if (res.ok) {
                    const data = await res.json();
                    setGlobalTemplates(data);
                }
            } catch (error) {
                console.error("Failed to fetch global templates");
            } finally {
                setLoading(false);
            }
        }
        fetchGlobals();
    }, []);

    const handleSelect = (template: GlobalTemplate | null) => {
        if (template) {
            // Clone the template content/subject but reset name (or keep generic)
            setSelectedTemplate({
                subject: template.subject,
                content: template.content,
                name: `${template.name} (Copy)`
            });
        } else {
            // Blank template
            setSelectedTemplate(undefined);
        }
        setStep("editor");
    };

    if (step === "editor") {
        return (
            <div className="p-6 h-full">
                <Button
                    variant="ghost"
                    onClick={() => setStep("select")}
                    className="mb-4"
                >
                    &larr; Back to Library
                </Button>
                <TemplateEditor
                    projectId={projectId}
                    mode="create"
                    initialData={selectedTemplate}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Create New Template</h1>
            <p className="text-muted-foreground mb-8">
                Start from scratch or choose a pre-made template from the library.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Blank Option */}
                <Card
                    className="cursor-pointer hover:border-primary transition-all flex flex-col items-center justify-center text-center h-64 border-dashed"
                    onClick={() => handleSelect(null)}
                >
                    <div className="p-4 rounded-full bg-secondary mb-4">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="mb-2">Blank Template</CardTitle>
                    <CardDescription>Start with a clean slate</CardDescription>
                </Card>

                {/* Global Templates */}
                {globalTemplates.map((t) => (
                    <Card
                        key={t._id}
                        className="cursor-pointer hover:border-primary transition-all relative overflow-hidden group h-64 flex flex-col"
                        onClick={() => handleSelect(t)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />

                        {/* Preview iframe (scaled down) - Optional visual enhancement */}
                        <div className="flex-1 overflow-hidden bg-white relative">
                            <iframe
                                srcDoc={t.content}
                                className="w-[200%] h-[200%] transform scale-50 origin-top-left pointer-events-none border-none"
                                title="preview"
                            />
                        </div>

                        <div className="relative z-20 p-4 pt-2">
                            <CardTitle className="text-lg mb-1">{t.name}</CardTitle>
                            <CardDescription className="line-clamp-1">{t.subject}</CardDescription>

                            <Button size="sm" className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                Use Template
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
