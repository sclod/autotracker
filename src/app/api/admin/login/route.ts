import { NextResponse } from "next/server";
import {
  createSessionValue,
  getSessionCookieName,
  getSessionCookieOptions,
} from "@/lib/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = rateLimit(`admin-login:${ip}`, RATE_LIMIT);
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  if (!rate.ok) {
    return NextResponse.json(
      { error: "Слишком много попыток" },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const password = formData.get("password")?.toString() ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD не задан" },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    const url = new URL("/admin/login", origin);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url);
  }

  const response = NextResponse.redirect(new URL("/admin", origin));
  response.cookies.set(
    getSessionCookieName(),
    createSessionValue(),
    getSessionCookieOptions()
  );
  return response;
}
