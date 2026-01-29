import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionCookieName, verifySessionValue } from "@/lib/auth";
import { requireAccessCode } from "@/lib/access-control";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isValidTrackingNumber, normalizeTrackingNumber } from "@/lib/validation";

const RATE_LIMIT = { limit: 90, windowMs: 5 * 60 * 1000 };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const trackingNumber = normalizeTrackingNumber(searchParams.get("trackingNumber"));
    const orderId = searchParams.get("orderId");
    const accessCode = searchParams.get("accessCode");
    const ip = getClientIp(request);
    const rate = rateLimit(`chat-list:${ip}`, RATE_LIMIT);

    if (!rate.ok) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    if (!trackingNumber && !orderId) {
      return NextResponse.json(
        { error: "Нужен trackingNumber или orderId" },
        { status: 400 }
      );
    }

    let resolvedOrderId = orderId;

    if (orderId) {
      const cookieValue = request.cookies.get(getSessionCookieName())?.value;
      if (!verifySessionValue(cookieValue)) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }
    }

    if (trackingNumber) {
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

      resolvedOrderId = order.id;
    }

    const messages = await prisma.message.findMany({
      where: { orderId: resolvedOrderId ?? undefined },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
