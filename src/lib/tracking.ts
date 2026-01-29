import crypto from "crypto";
import prisma from "@/lib/prisma";

const TRACKING_LENGTH = 10;
const TRACKING_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function hasSequentialRun(value: string, runLength = 3) {
  if (value.length < runLength) return false;
  for (let i = 0; i <= value.length - runLength; i += 1) {
    const slice = value.slice(i, i + runLength);
    const isDigits = /^[0-9]+$/.test(slice);
    const isLetters = /^[A-Z]+$/.test(slice);
    if (!isDigits && !isLetters) continue;
    const codes = slice.split("").map((char) => char.charCodeAt(0));
    const ascending = codes.every(
      (code, idx) => idx === 0 || code === codes[idx - 1] + 1
    );
    const descending = codes.every(
      (code, idx) => idx === 0 || code === codes[idx - 1] - 1
    );
    if (ascending || descending) return true;
  }
  return false;
}

function generateCandidate(length: number) {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += TRACKING_ALPHABET[bytes[i] % TRACKING_ALPHABET.length];
  }
  return result;
}

export async function generateTrackingNumber() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = generateCandidate(TRACKING_LENGTH);
    if (hasSequentialRun(candidate)) continue;
    const existing = await prisma.order.findUnique({
      where: { trackingNumber: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  throw new Error("Не удалось сгенерировать уникальный номер заказа");
}

export async function generateAccessCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = Math.floor(100000 + Math.random() * 900000).toString();
    const existing = await prisma.order.findFirst({
      where: { accessCode: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  throw new Error("Не удалось сгенерировать код доступа");
}
