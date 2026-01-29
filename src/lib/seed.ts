import type { PrismaClient } from "@prisma/client";
import { defaultStages } from "@/lib/stages";

function buildStages(statuses: Array<"done" | "in_progress" | "pending">) {
  return defaultStages.map((title, index) => ({
    title,
    status: statuses[index] ?? "pending",
    dateText:
      statuses[index] === "done"
        ? "12.01.2026"
        : statuses[index] === "in_progress"
        ? "20–24.01.2026"
        : "-",
    comment: statuses[index] === "done" ? "Этап завершён" : "",
    sortOrder: index,
  }));
}

export async function seedDemoOrders(prisma: PrismaClient) {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  const existing = await prisma.order.findMany({
    take: 1,
    select: { id: true },
  });
  if (existing.length > 0) return;

  await prisma.order.create({
    data: {
      trackingNumber: "123456",
      accessCode: "111111",
      clientName: "Демо Клиент",
      clientPhone: "+7 (900) 111-22-33",
      vehicleSummary: "BMW X5 xDrive40i, 2022",
      vehicleVin: "WBA00000000000000",
      vehicleLot: "LOT-5567",
      etaText: "10–14.02.2026",
      stages: {
        create: buildStages([
          "done",
          "done",
          "in_progress",
          "pending",
          "pending",
          "pending",
          "pending",
          "pending",
        ]),
      },
      routePoints: {
        create: [
          {
            label: "Германия",
            lat: 52.52,
            lng: 13.405,
            type: "start",
            sortOrder: 0,
          },
          {
            label: "Польша",
            lat: 52.2297,
            lng: 21.0122,
            type: "checkpoint",
            sortOrder: 1,
          },
          {
            label: "Москва",
            lat: 55.751244,
            lng: 37.618423,
            type: "current",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      trackingNumber: "654321",
      accessCode: "222222",
      clientName: "Тестовый Клиент",
      clientPhone: "+7 (900) 222-33-44",
      vehicleSummary: "Mercedes-Benz E 220d, 2021",
      vehicleVin: "WDB00000000000000",
      vehicleLot: "LOT-8891",
      etaText: "—",
      stages: {
        create: buildStages([
          "pending",
          "pending",
          "pending",
          "pending",
          "pending",
          "pending",
          "pending",
          "pending",
        ]),
      },
    },
  });
}
