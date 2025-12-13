import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("auth_session");
  const isAuthenticated = Boolean(sessionCookie?.value);

  // Protect /app routes: require auth_session
  if (pathname.startsWith("/app")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Prevent logged-in users from visiting /login and /signup
  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    const appUrl = new URL("/app", request.url);
    return NextResponse.redirect(appUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/signup"],
};
