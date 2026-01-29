import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookieName, verifySessionValue } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(getSessionCookieName())?.value;
  const isValid = await verifySessionValue(cookieValue);

  if (!isValid) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
