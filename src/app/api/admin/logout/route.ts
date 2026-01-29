import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/auth";

export async function GET(request: Request) {
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/admin/login", origin));
  response.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 0,
  });
  return response;
}
