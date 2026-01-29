"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AttachmentItem = {
  id: string;
  originalName: string;
  mime: string;
  size: number;
  createdAt: string;
};

export function FilesList({
  attachments,
  trackingNumber,
  requireCode = false,
  accessCode,
  onAccessCodeChange,
  showAccessInput = true,
}: {
  attachments: AttachmentItem[];
  trackingNumber: string;
  requireCode?: boolean;
  accessCode?: string;
  onAccessCodeChange?: (value: string) => void;
  showAccessInput?: boolean;
}) {
  const storageKey = `chat-code-${trackingNumber}`;
  const [items, setItems] = useState<AttachmentItem[]>(attachments);
  const isControlled = typeof accessCode === "string";
  const [internalAccessCode, setInternalAccessCode] = useState(() => {
    if (!requireCode || typeof window === "undefined") {
      return "";
    }
    return window.localStorage.getItem(storageKey) || "";
  });
  const accessCodeValue = isControlled ? accessCode : internalAccessCode;
  const [status, setStatus] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!requireCode || isControlled) return;
    if (internalAccessCode) {
      window.localStorage.setItem(storageKey, internalAccessCode);
    }
  }, [internalAccessCode, requireCode, storageKey, isControlled]);

  const visibleItems = requireCode ? items : attachments;

  useEffect(() => {
    if (!requireCode) return;
    if (!accessCodeValue) return;

    let active = true;
    const fetchFiles = async () => {
      setStatus(null);
      const params = new URLSearchParams({
        trackingNumber,
        accessCode: accessCodeValue,
      });
      const res = await fetch(`/api/files/list?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "invalid_code") {
          setStatus("Неверный код доступа.");
        } else if (data.error === "locked") {
          setStatus("Слишком много попыток. Попробуйте позже.");
        } else if (data.error === "rate_limited") {
          setStatus("Слишком много запросов. Попробуйте позже.");
        } else {
          setStatus("Не удалось получить список файлов.");
        }
        return;
      }
      const data = await res.json();
      if (active) {
        setItems(data.attachments || []);
      }
    };

    fetchFiles();
    return () => {
      active = false;
    };
  }, [accessCodeValue, requireCode, trackingNumber]);

  const formatSize = (value: number) => {
    if (!value) return "—";
    const kb = value / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleAccessCodeChange = (value: string) => {
    if (onAccessCodeChange) {
      onAccessCodeChange(value);
      return;
    }
    setInternalAccessCode(value);
  };

  const buildFileUrl = (fileId: string) => {
    if (requireCode && accessCodeValue) {
      return `/api/files/${fileId}?trackingNumber=${trackingNumber}&accessCode=${accessCodeValue}`;
    }
    return `/api/files/${fileId}?trackingNumber=${trackingNumber}`;
  };

  const [images, documents] = useMemo(() => {
    const imageItems: AttachmentItem[] = [];
    const docItems: AttachmentItem[] = [];
    visibleItems.forEach((file) => {
      if (file.mime.startsWith("image/")) {
        imageItems.push(file);
      } else {
        docItems.push(file);
      }
    });
    return [imageItems, docItems];
  }, [visibleItems]);

  return (
    <div className="space-y-4">
      {requireCode && showAccessInput && (
        <Input
          value={accessCodeValue}
          onChange={(event) => handleAccessCodeChange(event.target.value)}
          placeholder="Код доступа для файлов"
          maxLength={6}
        />
      )}
      {status && <div className="text-sm text-amber-200">{status}</div>}
      {requireCode && !accessCodeValue ? (
        <div className="text-sm text-muted">
          Файлы доступны после ввода кода доступа.
        </div>
      ) : (
        <>
          {visibleItems.length === 0 ? (
            <div className="text-sm text-muted">Файлов пока нет.</div>
          ) : (
            <div className="space-y-6">
              {images.length > 0 && (
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-muted">
                    Фото
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {images.map((file) => (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => setActiveImage(buildFileUrl(file.id))}
                        className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70"
                      >
                        <div className="relative h-28 w-full">
                          <Image
                            src={buildFileUrl(file.id)}
                            alt={file.originalName}
                            fill
                            sizes="(min-width: 1024px) 200px, (min-width: 640px) 25vw, 50vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                            unoptimized
                          />
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white">
                          {file.originalName}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {documents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-[0.3em] text-muted">
                    Документы
                  </div>
                  {documents.map((file) => (
                    <a
                      key={file.id}
                      href={buildFileUrl(file.id)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 text-sm transition",
                        requireCode && !accessCodeValue
                          ? "pointer-events-none opacity-60"
                          : "hover:border-ring"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-foreground">{file.originalName}</span>
                        <span className="text-xs text-muted">{file.mime || "файл"}</span>
                      </div>
                      <span className="text-xs text-muted">{formatSize(file.size)}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6"
              onClick={() => setActiveImage(null)}
            >
              <div className="relative h-[85vh] w-[90vw]">
                <Image
                  src={activeImage}
                  alt="Просмотр файла"
                  fill
                  sizes="90vw"
                  className="rounded-2xl border border-white/10 object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
