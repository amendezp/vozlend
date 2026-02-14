// ============================================
// Echo Bank — Route Protection Middleware
// Lightweight check that doesn't import Prisma (Edge-compatible)
// ============================================

import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check for NextAuth session token cookie
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect dashboard routes
    "/dashboard/:path*",
    // Protect application API routes (not auth routes)
    "/api/applications/:path*",
  ],
};
