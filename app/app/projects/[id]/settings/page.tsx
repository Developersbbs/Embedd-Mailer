import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { connectDB } from "@/lib/db";
import Project from "@/modals/Projects";
import { SmtpForm } from "@/components/projects/smtp-form";
import { DomainList } from "@/components/projects/domain-list";
import { FormBuilder } from "@/components/projects/form-builder";
import { TemplateSelector } from "@/components/projects/template-selector";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface SettingsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
    const { id } = await params;
    await connectDB();

    const project = await Project.findById(id).lean();

    if (!project) {
        return (
            <ContentLayout title="Project not found">
                <p>Project not found</p>
            </ContentLayout>
        );
    }

    // Serialize for client component
    const serializedProject = JSON.parse(JSON.stringify(project));

    return (
        <ContentLayout title="Project Settings">
            <div className="mb-6">
                <Link
                    href={`/app/projects/${id}`}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">{project.name} Settings</h1>
                <p className="text-muted-foreground">
                    Manage your project configuration, SMTP, and security settings.
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="schema">Form Schema</TabsTrigger>
                    <TabsTrigger value="security">Security &amp; Domains</TabsTrigger>
                    <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Basic project information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Project Name</label>
                                    <div className="p-2 border rounded-md bg-muted text-sm">{project.name}</div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Project ID</label>
                                    <div className="p-2 border rounded-md bg-muted text-sm font-mono">{id}</div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">API Key</label>
                                    <div className="p-2 border rounded-md bg-muted text-sm font-mono break-all">{project.apiKey}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="schema">
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Schema</CardTitle>
                            <CardDescription>
                                Define the expected fields and validation rules for your form.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormBuilder
                                projectId={id}
                                initialSchema={serializedProject.formSchema}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Allowed Domains</CardTitle>
                            <CardDescription>
                                Restrict form submissions to specific domains (CORS &amp; Origin check).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DomainList
                                projectId={id}
                                initialDomains={serializedProject.allowedDomains}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="smtp">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Template</CardTitle>
                                <CardDescription>
                                    Select the HTML template to use for email notifications.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TemplateSelector
                                    projectId={id}
                                    initialTemplateId={serializedProject.emailTemplateId}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>SMTP Settings</CardTitle>
                                <CardDescription>
                                    Configure the email server used to send form submissions.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SmtpForm
                                    projectId={id}
                                    initialData={serializedProject.smtpSettings}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </ContentLayout>
    );
}
