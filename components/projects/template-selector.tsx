"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface TemplateSelectorProps {
    projectId: string;
    initialTemplateId?: string;
}

interface Template {
    _id: string;
    name: string;
}

export function TemplateSelector({ projectId, initialTemplateId }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string>(initialTemplateId || "default");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch all user templates (global + project specific ones are all under 'my templates' now in /api/templates)
        // Or should we specific endpoint? /api/templates returns all user templates. 
        // We can use that.
        async function loadTemplates() {
            try {
                const res = await fetch("/api/templates");
                if (res.ok) {
                    const data = await res.json();
                    setTemplates(data);
                }
            } catch (e) {
                console.error("Failed to load templates");
            } finally {
                setLoading(false);
            }
        }
        loadTemplates();
    }, []);

    async function handleSelect(value: string) {
        setSelectedId(value);
        setSaving(true);

        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailTemplateId: value === "default" ? null : value
                }),
            });

            if (!res.ok) throw new Error("Failed to update project");
            toast.success("Email template updated");
        } catch (error) {
            toast.error("Failed to save selection");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;

    return (
        <div className="space-y-2">
            <Label>Active Email Template</Label>
            <Select
                disabled={saving}
                onValueChange={handleSelect}
                value={selectedId || "default"}
            >
                <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="default">Default System Email</SelectItem>
                    {templates.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                            {t.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                Choose which HTML template to use for new submissions.
            </p>
        </div>
    );
}
