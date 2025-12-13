"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateEditor from "@/components/projects/template-editor";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditGlobalTemplatePage() {
    const params = useParams();
    const templateId = params.templateId as string;
    const [template, setTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTemplate() {
            try {
                const res = await fetch(`/api/templates/${templateId}`);
                if (!res.ok) throw new Error("Failed to fetch template");
                const data = await res.json();
                setTemplate(data);
            } catch (error) {
                toast.error("Failed to load template");
            } finally {
                setLoading(false);
            }
        }
        fetchTemplate();
    }, [templateId]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!template) {
        return <div>Template not found</div>;
    }

    return (
        <div className="p-6 h-full">
            <TemplateEditor
                mode="edit"
                initialData={template}
                apiEndpoint="/api/templates"
                redirectUrl="/app/templates"
            />
        </div>
    );
}
