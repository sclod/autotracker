import { redirect } from "next/navigation";
import { getOrderByTrackingNumber, getCurrentStage } from "@/lib/orders";
import { TrackingView } from "@/components/tracker/tracking-view";
import { isChatCodeRequired } from "@/lib/chat";
import { formatDateTime } from "@/lib/format";
import { isValidTrackingNumber, normalizeTrackingNumber } from "@/lib/validation";

function resolveStatusLabel(stageTitle?: string, stageStatus?: string) {
  if (!stageTitle) return "Статус уточняется";
  const lower = stageTitle.toLowerCase();
  if (lower.includes("тамож")) {
    return "На таможне";
  }
  if (lower.includes("достав") || lower.includes("передач")) {
    return "Доставляется";
  }
  if (stageStatus === "done") {
    return "Выдано";
  }
  return "В пути";
}

export default async function TrackResultPage({
  params,
}: {
  params: Promise<{ trackingNumber: string }>;
}) {
  const { trackingNumber: rawTracking } = await params;
  const trackingNumber = normalizeTrackingNumber(decodeURIComponent(rawTracking));

  if (!isValidTrackingNumber(trackingNumber)) {
    redirect("/track?error=invalid");
  }

  const order = await getOrderByTrackingNumber(trackingNumber);

  if (!order) {
    redirect("/track?error=not_found");
  }

  const currentStage = getCurrentStage(order.stages);
  const getDateText = (value?: string | null) => (!value || value === "-" ? "—" : value);
  const requireCode = isChatCodeRequired();
  const originLabel =
    order.routePoints.find((point) => point.type === "start")?.label ||
    order.routePoints[0]?.label ||
    "—";
  const updatedAtText = formatDateTime(order.updatedAt);
  const statusLabel =
    order.publicStatus || resolveStatusLabel(currentStage?.title, currentStage?.status);
  const chatMessages = requireCode
    ? []
    : order.messages.map((message) => ({
        id: message.id,
        author: message.author,
        text: message.text,
        createdAt: message.createdAt.toISOString(),
      }));
  const routePoints = order.routePoints.map((point) => ({
    id: point.id,
    lat: point.lat,
    lng: point.lng,
    label: point.label,
    type: point.type,
    timestamp: formatDateTime(point.createdAt),
  }));
  const attachments = requireCode
    ? []
    : order.attachments.map((file) => ({
        id: file.id,
        originalName: file.originalName,
        mime: file.mime,
        size: file.size,
        createdAt: file.createdAt.toISOString(),
      }));

  return (
    <section className="container mx-auto px-6 py-10">
      <TrackingView
        summary={{
          trackingNumber: order.trackingNumber,
          currentStageTitle: currentStage?.title,
          statusLabel,
          statusTone: currentStage?.status ?? "pending",
          updatedAtText,
          etaText: order.etaText,
          vehicleSummary: order.vehicleSummary,
          vehicleVin: order.vehicleVin,
          vehicleLot: order.vehicleLot,
          originLabel,
          lastUpdateNote: order.lastUpdateNote,
        }}
        stages={order.stages.map((stage) => ({
          id: stage.id,
          title: stage.title,
          status: stage.status,
          dateText: getDateText(stage.dateText),
          comment: stage.comment,
        }))}
        currentStageId={currentStage?.id}
        routePoints={routePoints}
        messages={chatMessages}
        attachments={attachments}
        trackingNumber={order.trackingNumber}
        requireCode={requireCode}
      />
    </section>
  );
}
