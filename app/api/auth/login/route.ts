import { firebaseAdmin } from "@/lib/firebaseAdmin";
import { connectDB } from "@/lib/db";
import { userService } from "@/services/userServices";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { idToken } = await req.json();

    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);

    // Demo Mode Check
    if (process.env.NEXT_PUBLIC_APP_MODE === 'demo') {
      const allowedEmails = (process.env.DEMO_ALLOWED_EMAILS || "").split(",").map(e => e.trim());
      if (decoded.email && !allowedEmails.includes(decoded.email)) {
        return Response.json(
          { success: false, error: "Access restricted! Authorized users only...." },
          { status: 403 }
        );
      }
    }

    const user = await userService(
      decoded.uid,
      decoded.email,
      decoded.name || "",
      decoded.picture || ""
    );

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await firebaseAdmin.auth().createSessionCookie(idToken, {
      expiresIn,
    });

    const cookieOptions = {
      name: "auth_session",
      value: sessionCookie,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: expiresIn / 1000,
    };

    return new Response(
      JSON.stringify({ success: true, user }),
      {
        status: 200,
        headers: {
          "Set-Cookie": `${cookieOptions.name}=${cookieOptions.value}; HttpOnly; Secure; Path=/; Max-Age=${cookieOptions.maxAge}`,
        },
      }
    );
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
