import { NextResponse } from "next/server";

// 🚨 Next.js 16 uses 'proxy' instead of 'middleware'
export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Better Auth stores the session token in this cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");

  // 1. Protect Dashboard Routes (Challenge 2 Requirement)
  // If trying to access /dashboard without a cookie -> Redirect to Login
  if (pathname.startsWith("/dashboard") && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect logged-in users away from Auth pages
  // If logged-in user tries to access /login or /register -> Redirect to Home
  if ((pathname === "/login" || pathname === "/register") && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Define which routes this proxy should run on
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
