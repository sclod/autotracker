"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { createOrder } from "@/lib/orders";
import { generateTrackingNumber } from "@/lib/tracking";
import { normalizeText } from "@/lib/validation";
import type { LeadStatus } from "@prisma/client";

const DEFAULT_VEHICLE_SUMMARY = "?????? ? ?????";

export type ConvertLeadState = {
  ok: boolean;
  message?: string;
  orderId?: string;
  trackingNumber?: string;
  accessCode?: string | null;
};

export async function updateLeadStatusAction(formData: FormData) {
  const leadId = formData.get("leadId")?.toString();
  const status = formData.get("status")?.toString() as LeadStatus | undefined;

  if (!leadId || !status) {
    throw new Error("???????? ?????? ???????");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  revalidatePath("/admin/leads");
}

export async function updateLeadNoteAction(formData: FormData) {
  const leadId = formData.get("leadId")?.toString();
  const adminNote = normalizeText(formData.get("adminNote")?.toString(), 1000);

  if (!leadId) {
    throw new Error("?? ?????? ???");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { adminNote: adminNote || null },
  });

  revalidatePath("/admin/leads");
}

export async function convertLeadAction(
  _prevState: ConvertLeadState,
  formData: FormData
): Promise<ConvertLeadState> {
  const leadId = formData.get("leadId")?.toString();
  const region = normalizeText(formData.get("region")?.toString(), 40);
  const make = normalizeText(formData.get("make")?.toString(), 60);
  const summary = normalizeText(formData.get("summary")?.toString(), 120);
  const etaText = normalizeText(formData.get("etaText")?.toString(), 40);

  if (!leadId) {
    return { ok: false, message: "?? ?????? ???" };
  }

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { order: true },
    });

    if (!lead) {
      return { ok: false, message: "??? ?? ??????" };
    }

    if (lead.order) {
      return {
        ok: true,
        orderId: lead.order.id,
        trackingNumber: lead.order.trackingNumber,
        accessCode: lead.order.accessCode,
      };
    }

    const trackingNumber = await generateTrackingNumber();
    const messageSummary =
      normalizeText(lead.message ?? "", 120) || DEFAULT_VEHICLE_SUMMARY;
    const baseSummary = summary || messageSummary;
    const withMake = make ? `${make} ${baseSummary}` : baseSummary;
    const vehicleSummary = region ? `${withMake} ? ${region}` : withMake;

    const order = await createOrder({
      trackingNumber,
      clientName: lead.name,
      clientPhone: lead.phone,
      vehicleSummary,
      etaText: etaText || undefined,
    });

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "converted", orderId: order.id },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${order.id}`);

    return {
      ok: true,
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      accessCode: order.accessCode,
    };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "?? ??????? ?????????????? ???" };
  }
}
