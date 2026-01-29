import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionCookieName, verifySessionValue } from "@/lib/auth";
import { requireAccessCode } from "@/lib/access-control";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  isValidTrackingNumber,
  normalizeText,
  normalizeTrackingNumber,
} from "@/lib/validation";

const RATE_LIMIT = { limit: 15, windowMs: 5 * 60 * 1000 };

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rate = rateLimit(`chat-send:${ip}`, RATE_LIMIT);
    if (!rate.ok) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const rawText = body.text?.toString() ?? "";
    const text = normalizeText(rawText, 1000);
    const orderId = body.orderId?.toString();
    const trackingNumber = normalizeTrackingNumber(body.trackingNumber?.toString());
    const accessCode = body.accessCode?.toString();

    if (!text) {
      return NextResponse.json({ error: "Текст пустой" }, { status: 400 });
    }
    if (rawText.trim().length > 1000) {
      return NextResponse.json({ error: "too_long" }, { status: 400 });
    }

    if (orderId) {
      const cookieValue = request.cookies.get(getSessionCookieName())?.value;
      if (!verifySessionValue(cookieValue)) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }

      const message = await prisma.message.create({
        data: {
          orderId,
          author: "admin",
          text,
        },
      });
      return NextResponse.json({ message });
    }

    if (!trackingNumber) {
      return NextResponse.json(
        { error: "trackingNumber обязателен" },
        { status: 400 }
      );
    }
    if (!isValidTrackingNumber(trackingNumber)) {
      return NextResponse.json({ error: "invalid_tracking" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { trackingNumber },
      select: { id: true, accessCode: true },
    });

    if (!order) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const access = requireAccessCode({
      trackingNumber,
      providedCode: accessCode,
      orderAccessCode: order.accessCode,
      ip,
    });
    if (!access.ok) {
      return NextResponse.json(
        { error: access.error },
        { status: access.error === "locked" ? 429 : 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        orderId: order.id,
        author: "client",
        text,
      },
    });

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
