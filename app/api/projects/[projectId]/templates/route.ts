import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Template from "@/modals/Templates";
import Project from "@/modals/Projects";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await params;
        await connectDB();

        // Verify project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const templates = await Template.find({ projectId }).sort({ createdAt: -1 });
        return NextResponse.json(templates);
    } catch (error) {
        console.error("Failed to fetch templates:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const { projectId } = await params;
        const body = await request.json();
        const { name, subject, content } = body;

        if (!name || !subject || !content) {
            return NextResponse.json(
                { error: "Name, subject, and content are required" },
                { status: 400 }
            );
        }

        await connectDB();

        // Verify project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const template = await Template.create({
            projectId,
            name,
            subject,
            content,
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error("Failed to create template:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
