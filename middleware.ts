import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("__session");

  if (!token && request.nextUrl.pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/LoginAndRegister", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
