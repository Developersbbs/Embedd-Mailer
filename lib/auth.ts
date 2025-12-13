import { firebaseAdmin } from "@/lib/firebaseAdmin";

// Verify a raw session cookie string with Firebase Admin
export async function verifySessionCookie(sessionCookie: string) {
  try {
    const decoded = await firebaseAdmin
      .auth()
      .verifySessionCookie(sessionCookie, true);

    return decoded;
  } catch (err) {
    return null;
  }
}

// For use inside Route Handlers / API routes with Web Fetch Request
// Example usage in a route.ts:
//   const user = await getCurrentUserFromRequest(req);
//   if (!user) return new Response("Unauthorized", { status: 401 });
export async function getCurrentUserFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookiesMap = Object.fromEntries(
    cookieHeader.split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const [name, ...rest] = c.split("=");
        return [name, rest.join("=")];
      })
  );

  const sessionCookie = cookiesMap["auth_session"];
  if (!sessionCookie) return null;

  return verifySessionCookie(sessionCookie);
}

// For use in Server Components / Server Actions
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_session")?.value;
  if (!sessionCookie) return null;
  return verifySessionCookie(sessionCookie);
}
