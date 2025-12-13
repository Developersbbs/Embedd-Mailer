"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from "@/components/ui/empty";
import { LayoutGrid, Trash2 } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Project title is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create project");
      }

      toast.success("Project created");

      setIsModalOpen(false);
      setName("");
      setDescription("");

      const projectId = data.project?._id || data.project?.id;
      if (projectId) {
        router.push(`/app/projects/${projectId}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load projects");
        }

        setProjects(data.projects || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load projects");
      } finally {
        setProjectsLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <ContentLayout title="Projects">
      {/* board heading */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Boards</h2>
          <p className="text-sm text-muted-foreground">
            Manage your projects and jump into a workspace.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Create project
        </Button>
      </div>

      {projectsLoading ? null : projects.length === 0 ? (
        <Empty className="border border-dashed border-border mt-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LayoutGrid />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project to start accepting and managing form submissions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => setIsModalOpen(true)}>Create project</Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {projects.map((project: any) => {
            const id = project._id || project.id;
            const hasSmtp = Boolean(project.smtpSettings?.host || project.smtpSettings?.username);

            return (
              <div
                key={id}
                className="group rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[160px]"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold mb-1 truncate flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {project.name?.charAt(0)?.toUpperCase() || "P"}
                      </span>
                      <span className="truncate">{project.name}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {project.description || "No description"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 " +
                        (hasSmtp
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground")
                      }
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {hasSmtp ? "Mail configured" : "Mail not configured"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs"
                      onClick={() => router.push(`/app/projects/${id}`)}
                    >
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      // TODO: wire up delete project
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create new project</h2>
            <form className="space-y-4" onSubmit={handleCreateProject}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="project-name">
                  Project title
                </label>
                <Input
                  id="project-name"
                  placeholder="My awesome project"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="project-description">
                  Description <span className="text-xs text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="project-description"
                  placeholder="Briefly describe this project"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                  disabled={loading}
                  rows={3}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => !loading && setIsModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ContentLayout>
  );
}


