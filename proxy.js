import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: await headers(), // headers containing the user's session token
  });
  if (!session) return NextResponse.redirect(new URL("/login", request.url));
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

export const config = {
  matcher: ["/dashboard/:path*", "/freelancers/:path"],
};

// export const config = {
//   matcher: ["/dashboard/:path*", "/login", "/register", "/freelancers/:path*"],
// };
