import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Template from "@/modals/Templates";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ templateId: string }> }
) {
    try {
        const { templateId } = await params;
        await connectDB();

        const template = await Template.findById(templateId);
        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error("Failed to fetch template:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ templateId: string }> }
) {
    try {
        const { templateId } = await params;
        const body = await request.json();
        const { name, subject, content } = body;

        await connectDB();

        const template = await Template.findByIdAndUpdate(
            templateId,
            { name, subject, content },
            { new: true }
        );

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json(template);
    } catch (error) {
        console.error("Failed to update template:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ templateId: string }> }
) {
    try {
        const { templateId } = await params;
        await connectDB();

        const template = await Template.findByIdAndDelete(templateId);

        if (!template) {
            return NextResponse.json({ error: "Template not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Template deleted" });
    } catch (error) {
        console.error("Failed to delete template:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
