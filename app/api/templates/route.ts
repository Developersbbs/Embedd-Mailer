import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Template from "@/modals/Templates";

export async function GET(req: NextRequest) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        // Fetch templates belonging to this user
        // We exclude templates that are linked to a specific project to keep this list clean?
        // OR we show all. "My Templates" usually implies everything I own.
        // But the sidebar is for "Global/Reusable" templates. 
        // Let's allow filtering? For now, fetch ALL templates owned by user.
        // Fetch templates belonging to this user OR are global system templates
        const templates = await Template.find({
            $or: [
                { userId: user.uid },
                { isGlobal: true }
            ]
        }).sort({ createdAt: -1 });
        return NextResponse.json(templates);
    } catch (error) {
        console.error("Failed to fetch templates:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const body = await req.json();
        const { name, subject, content } = body;

        if (!name || !subject || !content) {
            return NextResponse.json(
                { error: "Name, subject, and content are required" },
                { status: 400 }
            );
        }

        const template = await Template.create({
            userId: user.uid,
            name,
            subject,
            content,
            // No projectId -> It's a global user template
            isGlobal: false // It's not a SYSTEM global template, just a user one
        });

        return NextResponse.json(template, { status: 201 });
    } catch (error) {
        console.error("Failed to create template:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
