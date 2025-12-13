"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";

interface DomainListProps {
    projectId: string;
    initialDomains?: string[];
}

export function DomainList({ projectId, initialDomains = [] }: DomainListProps) {
    const [domains, setDomains] = useState<string[]>(initialDomains);
    const [newDomain, setNewDomain] = useState("");
    const [loading, setLoading] = useState(false);

    async function updateDomains(updatedDomains: string[]) {
        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ allowedDomains: updatedDomains }),
            });

            if (!res.ok) throw new Error("Failed to update domains");

            setDomains(updatedDomains);
            toast.success("Allowed domains updated");
        } catch (error) {
            toast.error("Failed to update domains");
        } finally {
            setLoading(false);
        }
    }

    function handleAdd() {
        if (!newDomain.trim()) return;
        // Basic validation
        if (domains.includes(newDomain.trim())) {
            toast.error("Domain already exists");
            return;
        }

        const updated = [...domains, newDomain.trim()];
        updateDomains(updated);
        setNewDomain("");
    }

    function handleRemove(domainToRemove: string) {
        const updated = domains.filter((d) => d !== domainToRemove);
        updateDomains(updated);
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="example.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                />
                <Button onClick={handleAdd} disabled={loading || !newDomain.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </div>

            <div className="space-y-2">
                {domains.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        No domains configured. Submissions will be accepted from any origin (not recommended for production).
                    </p>
                )}
                {domains.map((domain) => (
                    <div
                        key={domain}
                        className="flex items-center justify-between p-2 rounded-md border bg-card"
                    >
                        <span className="text-sm font-medium">{domain}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(domain)}
                            disabled={loading}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
