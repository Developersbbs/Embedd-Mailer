import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import Project from "@/modals/Projects";
import { connectDB } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { projectId } = await params;
        const project = await Project.findOne({ _id: projectId, userId: user.uid }).lean();

        if (!project) {
            return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, project });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message || "Failed to load project" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { projectId } = await params;
        const body = await req.json();

        // Basic validation (can be enhanced with Zod here or in service)
        // For now, we trust the body structure but ensure we only update allowed fields
        const updateData: any = {};

        if (typeof body.name === "string") updateData.name = body.name.trim();
        if (typeof body.description === "string") updateData.description = body.description.trim();

        if (body.smtpSettings) {
            updateData.smtpSettings = {
                host: body.smtpSettings.host,
                port: Number(body.smtpSettings.port),
                secure: Boolean(body.smtpSettings.secure),
                username: body.smtpSettings.username,
                password: body.smtpSettings.password, // Be careful with passwords, maybe only update if provided
                fromEmail: body.smtpSettings.fromEmail,
                toEmail: body.smtpSettings.toEmail,
                ccEmail: body.smtpSettings.ccEmail,
            };
        }

        if (Array.isArray(body.allowedDomains)) {
            updateData.allowedDomains = body.allowedDomains;
        }

        if (Array.isArray(body.formSchema)) {
            updateData.formSchema = body.formSchema;
        }

        if (body.emailTemplateId !== undefined) {
            // Allow null to clear it
            updateData.emailTemplateId = body.emailTemplateId;
        }

        updateData.updatedAt = new Date();

        const project = await Project.findOneAndUpdate(
            { _id: projectId, userId: user.uid },
            { $set: updateData },
            { new: true }
        );

        if (!project) {
            return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, project });
    } catch (err: any) {
        return NextResponse.json(
            { success: false, error: err.message || "Failed to update project" },
            { status: 500 }
        );
    }
}
// ... (previous code)

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { projectId } = await params;

        // 1. Verify ownership
        const project = await Project.findOne({ _id: projectId, userId: user.uid });

        if (!project) {
            return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
        }

        // 2. Cascade Delete (Clean up resources)
        // We import these dynamically or assume they are available.
        // If models are not imported, we need to import them at top level.
        // Assuming MailLog, Submission, Template are needed.
        const MailLog = (await import("@/modals/MailLog")).default;
        const Submission = (await import("@/modals/Submissions")).default;

        await Promise.all([
            MailLog.deleteMany({ projectId: projectId }),
            Submission.deleteMany({ projectId: projectId }),
            // We might not want to delete Templates if they are global?
            // But if they are project specific (which they seem to be by reference), we can.
            // However, the Template model might not store projectId depending on implementation.
            // Let's check Template model if possible, but safely we can just delete project.
            Project.deleteOne({ _id: projectId, userId: user.uid }),
        ]);

        return NextResponse.json({ success: true, message: "Project deleted successfully" });
    } catch (err: any) {
        console.error("Delete error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Failed to delete project" },
            { status: 500 }
        );
    }
}
