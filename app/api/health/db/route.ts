import { connectDB } from "@/lib/db";
import { dbHealthCheck } from "@/lib/db.health";


export async function GET() {
    try {
        await connectDB();
        const status = dbHealthCheck();
        return new Response(status, { status: 200 });
    } catch (error) {
        console.log("DB Health Check Error", error);
        return new Response("DB Health Check Error", { status: 500 });
    }
}
