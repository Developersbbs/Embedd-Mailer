"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteProjectCardProps {
    projectId: string;
    projectName: string;
}

export function DeleteProjectCard({ projectId, projectName }: DeleteProjectCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [confirmName, setConfirmName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    async function handleDelete() {
        if (confirmName !== projectName) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete project");
            }

            toast.success("Project deleted successfully");
            router.push("/app/projects");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
            setLoading(false);
            setIsOpen(false);
        }
    }

    return (
        <Card className="border-destructive/50 bg-destructive/5 mt-8">
            <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                </CardTitle>
                <CardDescription>
                    Deleting this project is irreversible. All data, including logs and submissions, will be permanently removed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the project
                                <span className="font-bold text-foreground mx-1">{projectName}</span>
                                and all associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4 space-y-2">
                            <Label htmlFor="confirm-name">
                                Please type <span className="font-bold">{projectName}</span> to confirm.
                            </Label>
                            <Input
                                id="confirm-name"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                                placeholder={projectName}
                                className="font-mono"
                                autoComplete="off"
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}
                                disabled={confirmName !== projectName || loading}
                                className="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
                            >
                                {loading ? "Deleting..." : "I understand, delete this project"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
