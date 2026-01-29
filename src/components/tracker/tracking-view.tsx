"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ChatWidget } from "@/components/tracker/chat-widget";
import { FilesList } from "@/components/tracker/files-list";
import { RouteMap } from "@/components/tracker/route-map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StageStatus = "done" | "in_progress" | "pending";

type TrackingStage = {
  id: string;
  title: string;
  status: StageStatus;
  dateText: string;
  comment: string;
};

type TrackingRoutePoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: "checkpoint" | "current" | "start" | "end";
  timestamp?: string;
};

type TrackingMessage = {
  id: string;
  author: "client" | "admin";
  text: string;
  createdAt: string;
};

type TrackingAttachment = {
  id: string;
  originalName: string;
  mime: string;
  size: number;
  createdAt: string;
};

type TrackingSummary = {
  trackingNumber: string;
  currentStageTitle?: string | null;
  statusLabel: string;
  statusTone?: StageStatus;
  updatedAtText: string;
  etaText?: string | null;
  vehicleSummary: string;
  vehicleVin?: string | null;
  vehicleLot?: string | null;
  originLabel?: string | null;
  lastUpdateNote?: string | null;
};

type TrackingViewProps = {
  summary: TrackingSummary;
  stages: TrackingStage[];
  currentStageId?: string | null;
  routePoints: TrackingRoutePoint[];
  messages: TrackingMessage[];
  attachments: TrackingAttachment[];
  trackingNumber: string;
  requireCode: boolean;
};

const statusLabel: Record<StageStatus, string> = {
  done: "Завершён",
  in_progress: "В процессе",
  pending: "Ожидается",
};

const routeTypeLabel: Record<TrackingRoutePoint["type"], string> = {
  checkpoint: "Чекпоинт",
  current: "Текущая",
  start: "Старт",
  end: "Финиш",
};

const COMMENT_TRIM = 140;

function TrackerStatusPill({
  status,
  label,
}: {
  status: StageStatus;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "tracker-pill",
        status === "done" && "tracker-pill--done",
        status === "in_progress" && "tracker-pill--progress",
        status === "pending" && "tracker-pill--pending"
      )}
    >
      {label ?? statusLabel[status]}
    </span>
  );
}

function StageComment({ text }: { text: string }) {
  const trimmed = text?.trim();
  const [expanded, setExpanded] = useState(false);

  if (!trimmed) {
    return <div className="text-xs text-muted">Комментарий: —</div>;
  }

  const isLong = trimmed.length > COMMENT_TRIM;
  const visibleText = isLong && !expanded ? `${trimmed.slice(0, COMMENT_TRIM)}…` : trimmed;

  return (
    <div className="text-xs text-muted">
      Комментарий:{" "}
      <span className={cn(!expanded && isLong && "tracker-clamp")}>{visibleText}</span>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="ml-2 text-accent hover:underline"
        >
          {expanded ? "Скрыть" : "Показать ещё"}
        </button>
      )}
    </div>
  );
}

function TrackerCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("tracker-card", className)}>
      <div className="tracker-card__header">
        <div>
          <div className="tracker-h2">{title}</div>
          {subtitle && <div className="mt-1 text-sm text-muted">{subtitle}</div>}
        </div>
        {action && <div className="tracker-card__action">{action}</div>}
      </div>
      <div className="tracker-card__content">{children}</div>
    </section>
  );
}

function TrackingSummaryCard({
  summary,
  requireCode,
  accessCode,
  onAccessCodeChange,
}: {
  summary: TrackingSummary;
  requireCode: boolean;
  accessCode: string;
  onAccessCodeChange: (value: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/track/${summary.trackingNumber}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="tracker-card">
      <div className="tracker-card__header">
        <div>
          <div className="tracker-label">Трекер заказа</div>
          <div className="tracker-title mt-3">{summary.trackingNumber}</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <TrackerStatusPill
              status={summary.statusTone ?? "in_progress"}
              label={summary.statusLabel}
            />
            <span className="text-xs text-muted">
              Последнее обновление: {summary.updatedAtText}
            </span>
          </div>
          {summary.lastUpdateNote && (
            <div className="mt-3 text-sm text-muted">{summary.lastUpdateNote}</div>
          )}
        </div>
        <div className="flex flex-col items-start gap-3">
          <Button variant="outline" size="sm" type="button" onClick={handleCopy}>
            {copied ? "Ссылка скопирована" : "Скопировать ссылку"}
          </Button>
          {requireCode && (
            <input
              value={accessCode}
              onChange={(event) => onAccessCodeChange(event.target.value)}
              placeholder="Код доступа для чата и файлов"
              maxLength={6}
              className="tracker-input md:w-64"
            />
          )}
        </div>
      </div>
      <div className="tracker-card__content grid gap-4 text-sm text-muted md:grid-cols-4">
        <div>
          <div className="tracker-label">Авто</div>
          <div className="mt-2 text-sm text-foreground">{summary.vehicleSummary}</div>
        </div>
        <div>
          <div className="tracker-label">Детали</div>
          <div className="mt-2 space-y-1">
            <div>VIN: {summary.vehicleVin || "—"}</div>
            <div>Лот: {summary.vehicleLot || "—"}</div>
            <div>Страна: {summary.originLabel || "—"}</div>
          </div>
        </div>
        <div>
          <div className="tracker-label">ETA</div>
          <div className="mt-2 text-foreground">
            {summary.etaText && summary.etaText !== "-" ? summary.etaText : "—"}
          </div>
        </div>
        <div>
          <div className="tracker-label">Текущий этап</div>
          <div className="mt-2 text-foreground">{summary.currentStageTitle || "—"}</div>
        </div>
      </div>
    </section>
  );
}

function TimelineRow({
  stage,
  isCurrent,
  isLast,
}: {
  stage: TrackingStage;
  isCurrent: boolean;
  isLast: boolean;
}) {
  const marker =
    stage.status === "done" ? "✓" : stage.status === "in_progress" ? "●" : "○";
  return (
    <div className="relative pl-9">
      <span
        className={cn(
          "tracker-timeline-dot",
          stage.status === "done" && "tracker-timeline-dot--done",
          stage.status === "in_progress" && "tracker-timeline-dot--progress",
          stage.status === "pending" && "tracker-timeline-dot--pending"
        )}
      >
        {marker}
      </span>
      {!isLast && <span className="tracker-timeline-line" />}
      <div
        className={cn(
          "tracker-timeline-card",
          isCurrent && "tracker-timeline-card--current"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-semibold text-foreground">{stage.title}</div>
          <TrackerStatusPill status={stage.status} />
        </div>
        <div className="mt-2 text-xs text-muted">Дата: {stage.dateText || "—"}</div>
        <StageComment text={stage.comment} />
      </div>
    </div>
  );
}

function TrackingTimeline({
  stages,
  currentStageId,
}: {
  stages: TrackingStage[];
  currentStageId?: string | null;
}) {
  return (
    <TrackerCard
      title="Этапы доставки"
      subtitle="Понятный статус каждого шага маршрута."
    >
      <div className="hidden space-y-4 md:block">
        {stages.map((stage, index) => (
          <TimelineRow
            key={stage.id}
            stage={stage}
            isCurrent={stage.id === currentStageId}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>
      <div className="space-y-3 md:hidden">
        {stages.map((stage) => (
          <details
            key={stage.id}
            className={cn(
              "tracker-timeline-accordion",
              stage.id === currentStageId && "tracker-timeline-card--current"
            )}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">{stage.title}</span>
              <TrackerStatusPill status={stage.status} />
            </summary>
            <div className="mt-3 text-xs text-muted">Дата: {stage.dateText || "—"}</div>
            <StageComment text={stage.comment} />
          </details>
        ))}
      </div>
    </TrackerCard>
  );
}

function TrackingMapCard({
  points,
  activePointId,
  onSelectPoint,
}: {
  points: TrackingRoutePoint[];
  activePointId?: string | null;
  onSelectPoint: (id: string) => void;
}) {
  const hasRoute = points.length >= 2;

  return (
    <TrackerCard title="Маршрут на карте" subtitle="Где находится автомобиль сейчас.">
      <div className="space-y-4">
        <RouteMap points={points} focusPointId={activePointId} />
        <div className="space-y-2 text-sm text-muted">
          {!hasRoute ? (
            <div>Маршрут еще не задан.</div>
          ) : (
            points.map((point) => (
              <button
                key={point.id}
                type="button"
                onClick={() => onSelectPoint(point.id)}
                className={cn(
                  "tracker-checkpoint",
                  point.id === activePointId && "tracker-checkpoint--active"
                )}
              >
                <span>{point.label}</span>
                <span className="text-xs text-muted">{routeTypeLabel[point.type]}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </TrackerCard>
  );
}

export function TrackingView({
  summary,
  stages,
  currentStageId,
  routePoints,
  messages,
  attachments,
  trackingNumber,
  requireCode,
}: TrackingViewProps) {
  const storageKey = `chat-code-${trackingNumber}`;
  const [accessCode, setAccessCode] = useState(() => {
    if (typeof window === "undefined" || !requireCode) {
      return "";
    }
    return window.localStorage.getItem(storageKey) || "";
  });
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const currentPointId =
    routePoints.find((point) => point.type === "current")?.id ?? null;
  const fallbackPointId = routePoints[0]?.id ?? null;
  const activePointId =
    selectedPointId && routePoints.some((point) => point.id === selectedPointId)
      ? selectedPointId
      : currentPointId ?? fallbackPointId;

  useEffect(() => {
    if (!requireCode) return;
    if (accessCode) {
      window.localStorage.setItem(storageKey, accessCode);
    }
  }, [accessCode, requireCode, storageKey]);

  return (
    <div className="tracker-theme space-y-8">
      <TrackingSummaryCard
        summary={summary}
        requireCode={requireCode}
        accessCode={accessCode}
        onAccessCodeChange={setAccessCode}
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="order-2 space-y-8 lg:order-1">
          <TrackingTimeline stages={stages} currentStageId={currentStageId} />

          <TrackerCard title="Файлы и документы">
            <FilesList
              attachments={attachments}
              trackingNumber={trackingNumber}
              requireCode={requireCode}
              accessCode={accessCode}
              onAccessCodeChange={setAccessCode}
              showAccessInput={false}
            />
          </TrackerCard>

          <TrackerCard title="Чат с менеджером">
            <ChatWidget
              trackingNumber={trackingNumber}
              requireCode={requireCode}
              accessCode={accessCode}
              onAccessCodeChange={setAccessCode}
              showAccessInput={false}
              initialMessages={messages}
            />
          </TrackerCard>
        </div>

        <div className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          <TrackingMapCard
            points={routePoints}
            activePointId={activePointId}
            onSelectPoint={setSelectedPointId}
          />
        </div>
      </div>
    </div>
  );
}
