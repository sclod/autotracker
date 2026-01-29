"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StageStatus } from "@prisma/client";

type StageItem = {
  id: string;
  title: string;
  status: StageStatus;
  dateText: string;
  comment: string;
};

type OrderStagesEditorProps = {
  stages: StageItem[];
  orderId: string;
  trackingNumber?: string;
  updateStageAction: (formData: FormData) => Promise<void>;
  reorderStagesAction: (formData: FormData) => Promise<void>;
};

const commentTemplates = [
  "Документы получены и проверяются",
  "Ожидаем подтверждение от перевозчика",
  "Назначена дата отправки",
  "Проходит таможенное оформление",
  "Требуются дополнительные документы",
  "Авто готово к выдаче",
];

function formatRuDate(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatRuRange(start: Date, end: Date) {
  const sameMonth =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth();
  const startDay = start.toLocaleDateString("ru-RU", { day: "2-digit" });
  if (sameMonth) {
    const endPart = end.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${startDay}–${endPart}`;
  }
  return `${formatRuDate(start)}–${formatRuDate(end)}`;
}

export function OrderStagesEditor({
  stages,
  orderId,
  trackingNumber,
  updateStageAction,
  reorderStagesAction,
}: OrderStagesEditorProps) {
  const [items, setItems] = useState<StageItem[]>(() => stages);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const orderedIds = useMemo(() => items.map((stage) => stage.id), [items]);

  const updateItem = (id: string, patch: Partial<StageItem>) => {
    setItems((prev) =>
      prev.map((stage) => (stage.id === id ? { ...stage, ...patch } : stage))
    );
  };

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    setItems((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((stage) => stage.id === draggingId);
      const toIndex = next.findIndex((stage) => stage.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);

      startTransition(() => {
        const formData = new FormData();
        formData.set("orderId", orderId);
        if (trackingNumber) {
          formData.set("trackingNumber", trackingNumber);
        }
        formData.set("orderedIds", next.map((stage) => stage.id).join(","));
        void reorderStagesAction(formData);
      });

      return next;
    });
    setDraggingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs uppercase tracking-[0.2em] text-muted">
        Перетащите этапы, чтобы изменить порядок.
      </div>
      <div className="hidden gap-3 text-xs uppercase tracking-[0.2em] text-muted md:grid md:grid-cols-[2fr_1fr_1fr_2fr_auto]">
        <div>Этап</div>
        <div>Статус</div>
        <div>Дата</div>
        <div>Комментарий</div>
        <div></div>
      </div>
      {items.map((stage) => (
        <div
          key={stage.id}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => handleDrop(stage.id)}
          className={cn(
            "rounded-2xl border border-border/60 bg-card/70 p-4",
            draggingId === stage.id ? "border-accent/60" : ""
          )}
        >
          <form
            action={updateStageAction}
            className="grid items-center gap-3 md:grid-cols-[2fr_1fr_1fr_2fr_auto]"
          >
            <input type="hidden" name="stageId" value={stage.id} />
            <input type="hidden" name="orderId" value={orderId} />
            {trackingNumber && (
              <input type="hidden" name="trackingNumber" value={trackingNumber} />
            )}
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="mt-1 cursor-grab text-muted"
                draggable
                onDragStart={() => setDraggingId(stage.id)}
                onDragEnd={() => setDraggingId(null)}
                title="Перетащить"
              >
                ⋮⋮
              </button>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {stage.title}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border border-border/60 px-3 py-1",
                      stage.status === "done" && "bg-accent text-black"
                    )}
                    onClick={() => updateItem(stage.id, { status: "done" })}
                  >
                    Готово
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border border-border/60 px-3 py-1",
                      stage.status === "in_progress" && "bg-accent text-black"
                    )}
                    onClick={() =>
                      updateItem(stage.id, { status: "in_progress" })
                    }
                  >
                    В процессе
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "rounded-full border border-border/60 px-3 py-1",
                      stage.status === "pending" && "bg-accent text-black"
                    )}
                    onClick={() => updateItem(stage.id, { status: "pending" })}
                  >
                    Ожидается
                  </button>
                </div>
              </div>
            </div>
            <select
              name="status"
              value={stage.status}
              onChange={(event) =>
                updateItem(stage.id, {
                  status: event.target.value as StageStatus,
                })
              }
              className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            >
              <option value="done">Завершён</option>
              <option value="in_progress">В процессе</option>
              <option value="pending">Ожидается</option>
            </select>
            <div className="space-y-2">
              <Input
                name="dateText"
                value={stage.dateText}
                onChange={(event) =>
                  updateItem(stage.id, { dateText: event.target.value })
                }
              />
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                <button
                  type="button"
                  className="rounded-full border border-border/60 px-3 py-1"
                  onClick={() =>
                    updateItem(stage.id, { dateText: formatRuDate(new Date()) })
                  }
                >
                  Сегодня
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border/60 px-3 py-1"
                  onClick={() => {
                    const start = new Date();
                    const end = new Date();
                    end.setDate(start.getDate() + 3);
                    updateItem(stage.id, {
                      dateText: formatRuRange(start, end),
                    });
                  }}
                >
                  Диапазон
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                name="comment"
                value={stage.comment}
                onChange={(event) =>
                  updateItem(stage.id, { comment: event.target.value })
                }
              />
              <select
                className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground"
                defaultValue=""
                onChange={(event) => {
                  if (event.target.value) {
                    updateItem(stage.id, { comment: event.target.value });
                  }
                  event.currentTarget.value = "";
                }}
              >
                <option value="">Шаблон комментария</option>
                {commentTemplates.map((template) => (
                  <option key={template} value={template}>
                    {template}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="accent" size="sm" type="submit" disabled={isPending}>
              Сохранить
            </Button>
          </form>
        </div>
      ))}
      {orderedIds.length === 0 && (
        <div className="text-sm text-muted">Этапов пока нет.</div>
      )}
    </div>
  );
}
