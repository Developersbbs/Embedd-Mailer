import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Template from "@/modals/Templates";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { templateId } = await params;

        const template = await Template.findOne({ _id: templateId, userId: user.uid });
        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { templateId } = await params;
        const body = await req.json();
        const { name, subject, content } = body;

        const template = await Template.findOneAndUpdate(
            { _id: templateId, userId: user.uid },
            { name, subject, content },
            { new: true }
        );

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ templateId: string }> }
) {
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { templateId } = await params;

        const template = await Template.findOneAndDelete({ _id: templateId, userId: user.uid });

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Template deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
