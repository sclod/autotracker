import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { getSessionCookieName, verifySessionValue } from "@/lib/auth";
import { requireAccessCode } from "@/lib/access-control";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isValidTrackingNumber, normalizeTrackingNumber } from "@/lib/validation";

const uploadDir = path.join(process.cwd(), "data", "uploads");
const RATE_LIMIT = { limit: 60, windowMs: 5 * 60 * 1000 };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rate = rateLimit(`files:${ip}`, RATE_LIMIT);
    if (!rate.ok) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: (await params).id },
      include: { order: true },
    });

    if (!attachment) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const cookieValue = request.cookies.get(getSessionCookieName())?.value;
    const isAdmin = verifySessionValue(cookieValue);

    if (!isAdmin) {
      const { searchParams } = request.nextUrl;
      const trackingNumber = normalizeTrackingNumber(searchParams.get("trackingNumber"));
      const accessCode = searchParams.get("accessCode");

      if (!trackingNumber || !isValidTrackingNumber(trackingNumber)) {
        return NextResponse.json({ error: "invalid_tracking" }, { status: 400 });
      }

      if (trackingNumber !== attachment.order.trackingNumber) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
      }

      const access = requireAccessCode({
        trackingNumber,
        providedCode: accessCode,
        orderAccessCode: attachment.order.accessCode,
        ip,
      });
      if (!access.ok) {
        return NextResponse.json(
          { error: access.error },
          { status: access.error === "locked" ? 429 : 403 }
        );
      }
    }

    const filePath = path.join(uploadDir, attachment.filename);
    let buffer: Buffer;
    try {
      buffer = await fs.readFile(filePath);
    } catch {
      return NextResponse.json({ error: "file_missing" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": attachment.mime || "application/octet-stream",
        "Content-Disposition": `inline; filename="${attachment.originalName}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
