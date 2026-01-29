import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const uploadDir = path.join(process.cwd(), "data", "uploads");
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

function resolveAttachmentType(mime: string) {
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("image")) return "image";
  return "other";
}

function sanitizeOriginalName(name: string) {
  const base = path.basename(name);
  const cleaned = base.replace(/[^A-Za-z0-9.\-_\s()]/g, "").trim();
  if (!cleaned) return "file";
  if (cleaned.length > 120) return cleaned.slice(0, 120);
  return cleaned;
}

export async function saveAttachments({
  orderId,
  stageId,
  files,
}: {
  orderId: string;
  stageId?: string | null;
  files: File[];
}) {
  if (!files.length) {
    throw new Error("Нет файлов");
  }

  await fs.mkdir(uploadDir, { recursive: true });

  const saved = [] as Array<{ id: string; originalName: string }>;

  for (const entry of files) {
    if (!(entry instanceof File)) continue;
    if (!entry.size) continue;
    if (entry.size > MAX_FILE_SIZE) {
      throw new Error("Файл слишком большой. Максимум 20MB.");
    }

    const arrayBuffer = await entry.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = path.extname(entry.name).toLowerCase() || "";
    const inferredMime = entry.type || EXT_TO_MIME[ext] || "";
    if (!ALLOWED_MIME.has(inferredMime)) {
      throw new Error("Недопустимый тип файла. Разрешены JPG, PNG, WEBP, PDF.");
    }
    const filename = `${crypto.randomBytes(12).toString("hex")}${ext}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const attachment = await prisma.attachment.create({
      data: {
        orderId,
        stageId: stageId || null,
        filename,
        originalName: sanitizeOriginalName(entry.name),
        mime: inferredMime,
        size: buffer.length,
        type: resolveAttachmentType(inferredMime),
      },
    });

    saved.push({ id: attachment.id, originalName: attachment.originalName });
  }

  if (saved.length === 0) {
    throw new Error("Нет файлов для загрузки.");
  }

  return saved;
}
