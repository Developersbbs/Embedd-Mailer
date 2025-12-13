import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/modals/User";

export async function GET(req: NextRequest) {
    const userAuth = await getCurrentUserFromRequest(req);
    if (!userAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        let user = await User.findOne({ firebaseUid: userAuth.uid });

        // If user doesn't exist in MongoDB (first time), create them?
        // Or return 404? Better to create or sync.
        if (!user) {
            user = await User.create({
                firebaseUid: userAuth.uid,
                email: userAuth.email,
                name: userAuth.name || "",
                avatar: userAuth.picture || "",
            });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to fetch account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const userAuth = await getCurrentUserFromRequest(req);
    if (!userAuth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const body = await req.json();
        const { name, avatar, preferences } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (preferences) {
            // Merge preferences using dot notation or explicit assignment
            // Mongoose handles deep merge if we use $set with dot notation usually, 
            // OR we can just replace the object if we send the full object.
            // Let's assume we handle partial updates:
            if (preferences.theme) updateData["preferences.theme"] = preferences.theme;
            if (preferences.notifications) {
                if (preferences.notifications.emailDigest !== undefined)
                    updateData["preferences.notifications.emailDigest"] = preferences.notifications.emailDigest;
                if (preferences.notifications.securityAlerts !== undefined)
                    updateData["preferences.notifications.securityAlerts"] = preferences.notifications.securityAlerts;
            }
        }

        const user = await User.findOneAndUpdate(
            { firebaseUid: userAuth.uid },
            { $set: updateData },
            { new: true, upsert: true } // Upsert just in case
        );

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to update account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
