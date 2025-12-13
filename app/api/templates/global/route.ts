import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Template from "@/modals/Templates";

export async function GET() {
    try {
        await connectDB();

        // Fetch all templates marked as global, sorted by creation date
        const templates = await Template.find({ isGlobal: true }).sort({ createdAt: -1 });

        return NextResponse.json(templates);
    } catch (error) {
        console.error("Failed to fetch global templates:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
