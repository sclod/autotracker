"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { createOrder } from "@/lib/orders";
import { generateAccessCode, generateTrackingNumber } from "@/lib/tracking";
import { getSessionCookieName, verifySessionValue } from "@/lib/auth";
import { saveAttachments } from "@/lib/uploads";
import { isValidLabel, isValidLatLng, normalizeText } from "@/lib/validation";
import type { RoutePointType, StageStatus } from "@prisma/client";

export async function createOrderAction(formData: FormData) {
  const vehicleSummary = formData.get("vehicleSummary")?.toString().trim();
  if (!vehicleSummary) {
    throw new Error("Не указано описание авто");
  }

  const trackingNumber = await generateTrackingNumber();

  const order = await createOrder({
    trackingNumber,
    clientName: formData.get("clientName")?.toString().trim() || undefined,
    clientPhone: formData.get("clientPhone")?.toString().trim() || undefined,
    vehicleSummary,
    vehicleVin: formData.get("vehicleVin")?.toString().trim() || undefined,
    vehicleLot: formData.get("vehicleLot")?.toString().trim() || undefined,
    etaText: formData.get("etaText")?.toString().trim() || undefined,
  });

  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${order.id}?created=1`);
}

export async function updateStageAction(formData: FormData) {
  const stageId = formData.get("stageId")?.toString();
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  const status = formData.get("status")?.toString() as StageStatus | undefined;
  const dateText = formData.get("dateText")?.toString() || "-";
  const comment = formData.get("comment")?.toString() || "";

  if (!stageId || !orderId || !status) {
    throw new Error("Неверные данные этапа");
  }

  await prisma.stage.update({
    where: { id: stageId },
    data: {
      status,
      dateText,
      comment,
    },
  });
  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function reorderStagesAction(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  const orderedIdsRaw = formData.get("orderedIds")?.toString();

  if (!orderId || !orderedIdsRaw) {
    throw new Error("Неверные данные порядка этапов");
  }

  const orderedIds = orderedIdsRaw.split(",").map((id) => id.trim()).filter(Boolean);
  if (!orderedIds.length) {
    throw new Error("Неверные данные порядка этапов");
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.stage.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );
  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function regenerateAccessCodeAction(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  if (!orderId) {
    throw new Error("Не найден заказ");
  }
  const accessCode = await generateAccessCode();
  await prisma.order.update({
    where: { id: orderId },
    data: { accessCode },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function updateOrderSummaryAction(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  if (!orderId) {
    throw new Error("Не найден заказ");
  }

  const etaText = normalizeText(formData.get("etaText")?.toString(), 40);
  const publicStatus = normalizeText(formData.get("publicStatus")?.toString(), 40);
  const lastUpdateNote = normalizeText(formData.get("lastUpdateNote")?.toString(), 200);

  await prisma.order.update({
    where: { id: orderId },
    data: {
      etaText: etaText || null,
      publicStatus: publicStatus || null,
      lastUpdateNote: lastUpdateNote || null,
      updatedAt: new Date(),
    },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

async function getOrderedStages(orderId: string) {
  return prisma.stage.findMany({
    where: { orderId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function completeCurrentStageAction(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  if (!orderId) {
    throw new Error("Не найден заказ");
  }

  const stages = await getOrderedStages(orderId);
  const current = stages.find((stage) => stage.status === "in_progress");
  if (!current) {
    return;
  }

  await prisma.stage.update({
    where: { id: current.id },
    data: { status: "done" },
  });
  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function advanceStageAction(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  if (!orderId) {
    throw new Error("Не найден заказ");
  }

  const stages = await getOrderedStages(orderId);
  const currentIndex = stages.findIndex((stage) => stage.status === "in_progress");
  if (currentIndex >= 0) {
    await prisma.stage.update({
      where: { id: stages[currentIndex].id },
      data: { status: "done" },
    });
  }

  const nextStage =
    currentIndex >= 0
      ? stages.slice(currentIndex + 1).find((stage) => stage.status === "pending")
      : stages.find((stage) => stage.status === "pending");

  if (nextStage) {
    await prisma.stage.update({
      where: { id: nextStage.id },
      data: { status: "in_progress" },
    });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

function formatDate(value: Date) {
  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();
  return `${day}.${month}.${year}`;
}

function parseDatePart(value: string) {
  const [day, month, year] = value.split(".").map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

function shiftEtaText(etaText: string | null, days: number) {
  if (!etaText) {
    const next = new Date();
    next.setDate(next.getDate() + days);
    return formatDate(next);
  }

  const cleaned = etaText.replace(/\s/g, "");
  const fullRange = cleaned.match(
    /^(\d{2})\.(\d{2})\.(\d{4})[–-](\d{2})\.(\d{2})\.(\d{4})$/
  );
  if (fullRange) {
    const start = parseDatePart(`${fullRange[1]}.${fullRange[2]}.${fullRange[3]}`);
    const end = parseDatePart(`${fullRange[4]}.${fullRange[5]}.${fullRange[6]}`);
    if (start && end) {
      start.setDate(start.getDate() + days);
      end.setDate(end.getDate() + days);
      return `${formatDate(start)}–${formatDate(end)}`;
    }
  }

  const sameMonthRange = cleaned.match(
    /^(\d{2})[–-](\d{2})\.(\d{2})\.(\d{4})$/
  );
  if (sameMonthRange) {
    const start = parseDatePart(
      `${sameMonthRange[1]}.${sameMonthRange[3]}.${sameMonthRange[4]}`
    );
    const end = parseDatePart(
      `${sameMonthRange[2]}.${sameMonthRange[3]}.${sameMonthRange[4]}`
    );
    if (start && end) {
      start.setDate(start.getDate() + days);
      end.setDate(end.getDate() + days);
      return `${formatDate(start)}–${formatDate(end)}`;
    }
  }

  const single = cleaned.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (single) {
    const date = parseDatePart(`${single[1]}.${single[2]}.${single[3]}`);
    if (date) {
      date.setDate(date.getDate() + days);
      return formatDate(date);
    }
  }

  const fallback = new Date();
  fallback.setDate(fallback.getDate() + days);
  return formatDate(fallback);
}

export async function shiftEtaAction(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  const days = Number(formData.get("days") ?? 7);

  if (!orderId || Number.isNaN(days)) {
    throw new Error("Неверные данные ETA");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { etaText: true },
  });

  const nextEta = shiftEtaText(order?.etaText ?? null, days);

  await prisma.order.update({
    where: { id: orderId },
    data: { etaText: nextEta, updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function addRoutePointAction(formData: FormData) {
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  const label = formData.get("label")?.toString().trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const type = formData.get("type")?.toString() as RoutePointType | undefined;

  if (!orderId || !label || Number.isNaN(lat) || Number.isNaN(lng) || !type) {
    throw new Error("Неверные данные точки");
  }
  if (!isValidLabel(label)) {
    throw new Error("Подпись точки должна быть от 2 до 80 символов");
  }
  if (!isValidLatLng(lat, lng)) {
    throw new Error("Координаты вне допустимого диапазона");
  }

  if (type === "current") {
    await prisma.routePoint.updateMany({
      where: { orderId, type: "current" },
      data: { type: "checkpoint" },
    });
  }

  const count = await prisma.routePoint.count({ where: { orderId } });

  await prisma.routePoint.create({
    data: {
      orderId,
      label,
      lat,
      lng,
      type,
      sortOrder: count,
    },
  });
  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function updateRoutePointAction(formData: FormData) {
  const pointId = formData.get("pointId")?.toString();
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  const label = formData.get("label")?.toString().trim();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));
  const type = formData.get("type")?.toString() as RoutePointType | undefined;

  if (!pointId || !orderId || !label || Number.isNaN(lat) || Number.isNaN(lng) || !type) {
    throw new Error("Неверные данные точки");
  }
  if (!isValidLabel(label)) {
    throw new Error("Подпись точки должна быть от 2 до 80 символов");
  }
  if (!isValidLatLng(lat, lng)) {
    throw new Error("Координаты вне допустимого диапазона");
  }

  if (type === "current") {
    await prisma.routePoint.updateMany({
      where: { orderId, type: "current" },
      data: { type: "checkpoint" },
    });
  }

  await prisma.routePoint.update({
    where: { id: pointId },
    data: { label, lat, lng, type },
  });
  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function setCurrentRoutePointAction(formData: FormData) {
  const pointId = formData.get("pointId")?.toString();
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  if (!pointId || !orderId) {
    throw new Error("Не найдена точка");
  }

  await prisma.routePoint.updateMany({
    where: { orderId, type: "current" },
    data: { type: "checkpoint" },
  });
  await prisma.routePoint.update({
    where: { id: pointId },
    data: { type: "current" },
  });
  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function deleteRoutePointAction(formData: FormData) {
  const pointId = formData.get("pointId")?.toString();
  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  if (!pointId || !orderId) {
    throw new Error("Не найдена точка");
  }

  await prisma.routePoint.delete({ where: { id: pointId } });
  await prisma.order.update({
    where: { id: orderId },
    data: { updatedAt: new Date() },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }
}

export async function uploadAttachmentsAction(formData: FormData) {
  const cookieValue = (await cookies()).get(getSessionCookieName())?.value;
  if (!verifySessionValue(cookieValue)) {
    redirect("/admin/login");
  }

  const orderId = formData.get("orderId")?.toString();
  const trackingNumber = formData.get("trackingNumber")?.toString();
  const stageId = formData.get("stageId")?.toString() || null;
  const files = formData
    .getAll("files")
    .filter((entry): entry is File => entry instanceof File);

  if (!orderId) {
    throw new Error("orderId обязателен");
  }

  const params = new URLSearchParams({ tab: "files" });

  try {
    await saveAttachments({ orderId, stageId, files });
    await prisma.order.update({
      where: { id: orderId },
      data: { updatedAt: new Date() },
    });
    params.set("upload", "success");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось загрузить файлы.";
    params.set("upload", "error");
    params.set("message", message);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  if (trackingNumber) {
    revalidatePath(`/track/${trackingNumber}`);
  }

  redirect(`/admin/orders/${orderId}?${params.toString()}`);
}
