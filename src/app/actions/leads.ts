"use server";

import prisma from "@/lib/prisma";
import type { LeadFormState } from "@/lib/lead-state";
import { isValidPhone, normalizeText } from "@/lib/validation";

export async function createLeadAction(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const name = normalizeText(formData.get("name")?.toString(), 80);
  const phone = normalizeText(formData.get("phone")?.toString(), 32);
  const messageRaw = normalizeText(formData.get("message")?.toString(), 1000);
  const message = messageRaw ? messageRaw : null;
  const source = normalizeText(formData.get("source")?.toString(), 50) || "website";

  if (!name || name.length < 2) {
    return { ok: false, message: "Укажите имя (минимум 2 символа).", resetKey: 0 };
  }

  if (!phone) {
    return { ok: false, message: "Заполните телефон.", resetKey: 0 };
  }

  if (!isValidPhone(phone)) {
    return { ok: false, message: "Введите корректный номер телефона.", resetKey: 0 };
  }

  if (!source) {
    return { ok: false, message: "Заполните имя и телефон.", resetKey: 0 };
  }

  await prisma.lead.create({
    data: {
      name,
      phone,
      message,
      source,
    },
  });

  return { ok: true, message: "Спасибо! Заявка отправлена.", resetKey: Date.now() };
}
