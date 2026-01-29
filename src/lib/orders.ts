import prisma from "@/lib/prisma";
import { defaultStages } from "@/lib/stages";
import { generateAccessCode } from "@/lib/tracking";
import type { Stage, StageStatus } from "@prisma/client";

export const stageStatusLabels: Record<StageStatus, string> = {
  done: "Завершён",
  in_progress: "В процессе",
  pending: "Ожидается",
};

export function getCurrentStage(stages: Stage[]) {
  if (!stages.length) return undefined;
  const inProgress = stages.find((stage) => stage.status === "in_progress");
  if (inProgress) return inProgress;
  const pending = stages.find((stage) => stage.status === "pending");
  if (pending) return pending;
  return stages[stages.length - 1];
}

export async function getOrderByTrackingNumber(trackingNumber: string) {
  return prisma.order.findUnique({
    where: { trackingNumber },
    include: {
      stages: { orderBy: { sortOrder: "asc" } },
      routePoints: { orderBy: { sortOrder: "asc" } },
      messages: { orderBy: { createdAt: "asc" } },
      attachments: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      stages: { orderBy: { sortOrder: "asc" } },
      routePoints: { orderBy: { sortOrder: "asc" } },
      messages: { orderBy: { createdAt: "asc" } },
      attachments: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function listOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      stages: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function createOrder(payload: {
  clientName?: string;
  clientPhone?: string;
  vehicleSummary: string;
  vehicleVin?: string;
  vehicleLot?: string;
  etaText?: string;
  trackingNumber: string;
}) {
  const accessCode = await generateAccessCode();
  return prisma.order.create({
    data: {
      trackingNumber: payload.trackingNumber,
      accessCode,
      clientName: payload.clientName || null,
      clientPhone: payload.clientPhone || null,
      vehicleSummary: payload.vehicleSummary,
      vehicleVin: payload.vehicleVin || null,
      vehicleLot: payload.vehicleLot || null,
      etaText: payload.etaText || null,
      stages: {
        create: defaultStages.map((title, index) => ({
          title,
          status: "pending",
          dateText: "-",
          comment: "",
          sortOrder: index,
        })),
      },
    },
  });
}
