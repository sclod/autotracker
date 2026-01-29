import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isValidTrackingNumber, normalizeTrackingNumber } from "@/lib/validation";

const RATE_LIMIT = { limit: 20, windowMs: 5 * 60 * 1000 };

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = rateLimit(`track:${ip}`, RATE_LIMIT);

    if (!rate.ok) {
      return NextResponse.json(
        { error: "Слишком много запросов" },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const trackingNumber = normalizeTrackingNumber(body.trackingNumber?.toString());

    if (!trackingNumber) {
      return NextResponse.json({ error: "Номер обязателен" }, { status: 400 });
    }
    if (!isValidTrackingNumber(trackingNumber)) {
      return NextResponse.json({ error: "invalid_tracking" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { trackingNumber },
      include: { stages: { orderBy: { sortOrder: "asc" } } },
    });

    if (!order) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        trackingNumber: order.trackingNumber,
        vehicleSummary: order.vehicleSummary,
        vehicleVin: order.vehicleVin,
        vehicleLot: order.vehicleLot,
        etaText: order.etaText,
        stages: order.stages,
        updatedAt: order.updatedAt,
      },
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
