import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionCookieName, verifySessionValue } from "@/lib/auth";
import { saveAttachments } from "@/lib/uploads";

export async function POST(request: NextRequest) {
  const cookieValue = request.cookies.get(getSessionCookieName())?.value;
  if (!verifySessionValue(cookieValue)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const orderId = formData.get("orderId")?.toString();
  const stageId = formData.get("stageId")?.toString() || null;
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);

  if (!orderId) {
    return NextResponse.json({ error: "orderId обязателен" }, { status: 400 });
  }

  try {
    const saved = await saveAttachments({ orderId, stageId, files });
    await prisma.order.update({
      where: { id: orderId },
      data: { updatedAt: new Date() },
    });
    return NextResponse.json({ files: saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "upload_failed" },
      { status: 400 }
    );
  }
}
