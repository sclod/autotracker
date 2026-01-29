import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { requireAccessCode } from "@/lib/access-control";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isValidTrackingNumber, normalizeTrackingNumber } from "@/lib/validation";

const RATE_LIMIT = { limit: 30, windowMs: 5 * 60 * 1000 };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const trackingNumber = normalizeTrackingNumber(searchParams.get("trackingNumber"));
    const accessCode = searchParams.get("accessCode");
    const ip = getClientIp(request);
    const rate = rateLimit(`files-list:${ip}`, RATE_LIMIT);

    if (!rate.ok) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
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

    const attachments = await prisma.attachment.findMany({
      where: { orderId: order.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        originalName: true,
        mime: true,
        size: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ attachments });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
