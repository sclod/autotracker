import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, getCurrentStage } from "@/lib/orders";
import { formatDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { ChatWidget } from "@/components/tracker/chat-widget";
import { RouteMap } from "@/components/tracker/route-map";
import { CopyTrackingLink } from "@/components/admin/copy-tracking-link";
import { CopyValueButton } from "@/components/admin/copy-value-button";
import { OrderStagesEditor } from "@/components/admin/order-stages-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addRoutePointAction,
  advanceStageAction,
  completeCurrentStageAction,
  deleteRoutePointAction,
  regenerateAccessCodeAction,
  reorderStagesAction,
  setCurrentRoutePointAction,
  shiftEtaAction,
  updateOrderSummaryAction,
  updateRoutePointAction,
  updateStageAction,
  uploadAttachmentsAction,
} from "@/app/admin/(protected)/orders/actions";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "tracker", label: "Трекер" },
  { key: "overview", label: "Обзор" },
  { key: "stages", label: "Этапы" },
  { key: "map", label: "Маршрут" },
  { key: "chat", label: "Чат" },
  { key: "files", label: "Файлы" },
];

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; created?: string; upload?: string; message?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const currentStage = getCurrentStage(order.stages);
  const chatMessages = order.messages.map((message) => ({
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
  }));
  const activeTab = resolvedSearchParams.tab ?? "tracker";
  const uploadStatus = resolvedSearchParams.upload;
  const uploadMessage = resolvedSearchParams.message;

  const summaryPanel = (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Публичная сводка</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action={updateOrderSummaryAction}
          className="grid gap-4 md:grid-cols-[1fr_1fr_2fr_auto]"
        >
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
          <Input name="etaText" placeholder="ETA (текст)" defaultValue={order.etaText || ""} />
          <Input
            name="publicStatus"
            placeholder="Публичный статус (опционально)"
            defaultValue={order.publicStatus || ""}
          />
          <Textarea
            name="lastUpdateNote"
            placeholder="Короткая заметка для клиента"
            defaultValue={order.lastUpdateNote || ""}
            className="min-h-[54px]"
            maxLength={200}
          />
          <Button variant="accent" type="submit">
            Сохранить
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const quickActionsPanel = (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Быстрые действия</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <form action={completeCurrentStageAction}>
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
          <Button variant="outline" size="sm" type="submit">
            Завершить текущий
          </Button>
        </form>
        <form action={advanceStageAction}>
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
          <Button variant="accent" size="sm" type="submit">
            Следующий — в работе
          </Button>
        </form>
        <form action={shiftEtaAction}>
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
          <input type="hidden" name="days" value="3" />
          <Button variant="outline" size="sm" type="submit">
            Сдвинуть ETA +3 дня
          </Button>
        </form>
        <form action={shiftEtaAction}>
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
          <input type="hidden" name="days" value="7" />
          <Button variant="outline" size="sm" type="submit">
            Сдвинуть ETA +7 дней
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const sendToClientPanel = (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Отправить клиенту</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">
              Ссылка трекинга
            </div>
            <div className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-foreground">
              {`/track/${order.trackingNumber}`}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">
              Код доступа
            </div>
            <div className="rounded-xl border border-border/60 bg-card px-3 py-2 text-sm text-foreground">
              {order.accessCode || "—"}
            </div>
            <p className="text-xs text-muted">Код нужен для чата и файлов.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
          <CopyTrackingLink trackingNumber={order.trackingNumber} />
          {order.accessCode && (
            <CopyValueButton
              value={order.accessCode}
              label="Скопировать код"
              copiedLabel="Код скопирован"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const stagesPanel = (
    <Card className="bg-card/80">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle>Этапы доставки</CardTitle>
        <Button variant="outline" size="sm" type="button" disabled>
          Добавить этап (P1)
        </Button>
      </CardHeader>
      <CardContent>
        <OrderStagesEditor
          stages={order.stages.map((stage) => ({
            id: stage.id,
            title: stage.title,
            status: stage.status,
            dateText: stage.dateText,
            comment: stage.comment,
          }))}
          orderId={order.id}
          trackingNumber={order.trackingNumber}
          updateStageAction={updateStageAction}
          reorderStagesAction={reorderStagesAction}
        />
      </CardContent>
    </Card>
  );

  const mapPanel = (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Маршрут</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RouteMap points={routePoints} />
        <form
          action={addRoutePointAction}
          className="grid gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
        >
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
          <Input name="label" placeholder="Подпись точки" required />
          <Input name="lat" placeholder="Широта" required />
          <Input name="lng" placeholder="Долгота" required />
          <select
            name="type"
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="checkpoint">Чекпоинт</option>
            <option value="current">Текущая</option>
            <option value="start">Старт</option>
            <option value="end">Финиш</option>
          </select>
          <Button variant="accent" type="submit">
            Добавить
          </Button>
        </form>
        <div className="space-y-3">
          {order.routePoints.length === 0 ? (
            <div className="text-sm text-muted">Точки не добавлены.</div>
          ) : (
            order.routePoints.map((point) => (
              <div
                key={point.id}
                className="grid gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto_auto_auto]"
              >
                <form action={updateRoutePointAction} className="contents">
                  <input type="hidden" name="pointId" value={point.id} />
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
                  <Input name="label" defaultValue={point.label} />
                  <Input name="lat" defaultValue={point.lat} />
                  <Input name="lng" defaultValue={point.lng} />
                  <select
                    name="type"
                    defaultValue={point.type}
                    className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
                  >
                    <option value="checkpoint">Чекпоинт</option>
                    <option value="current">Текущая</option>
                    <option value="start">Старт</option>
                    <option value="end">Финиш</option>
                  </select>
                  <Button variant="outline" type="submit">
                    Сохранить
                  </Button>
                </form>
                <form action={setCurrentRoutePointAction}>
                  <input type="hidden" name="pointId" value={point.id} />
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
                  <Button variant="ghost" type="submit">
                    Сделать текущей
                  </Button>
                </form>
                <form action={deleteRoutePointAction}>
                  <input type="hidden" name="pointId" value={point.id} />
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
                  <Button variant="ghost" type="submit">
                    Удалить
                  </Button>
                </form>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const chatPanel = (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Чат с клиентом</CardTitle>
      </CardHeader>
      <CardContent>
        <ChatWidget orderId={order.id} isAdmin initialMessages={chatMessages} />
      </CardContent>
    </Card>
  );

  const filesPanel = (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Файлы и документы</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadStatus === "success" && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Файлы успешно загружены.
          </div>
        )}
        {uploadStatus === "error" && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {uploadMessage || "Не удалось загрузить файлы."}
          </div>
        )}
        <form
          action={uploadAttachmentsAction}
          className="grid gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 md:grid-cols-[2fr_1fr_auto]"
        >
          <input type="hidden" name="orderId" value={order.id} />
          <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
          <select
            name="stageId"
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground"
            defaultValue=""
          >
            <option value="">Без этапа</option>
            {order.stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.title}
              </option>
            ))}
          </select>
          <Input type="file" name="files" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" />
          <Button variant="accent" type="submit">
            Загрузить
          </Button>
        </form>
        {order.attachments.length === 0 ? (
          <div className="text-sm text-muted">Файлы пока не загружены.</div>
        ) : (
          <div className="space-y-2">
            {order.attachments.map((file) => (
              <Link
                key={file.id}
                href={`/api/files/${file.id}`}
                className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-4 py-3 text-sm"
              >
                <span className="text-foreground">{file.originalName}</span>
                <span className="text-xs text-muted">{file.mime}</span>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {resolvedSearchParams.created === "1" && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Заказ создан</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted md:flex-row md:items-center md:justify-between">
            <div>
              Номер трекинга:{" "}
              <span className="text-foreground">{order.trackingNumber}</span>
            </div>
            <CopyTrackingLink trackingNumber={order.trackingNumber} />
          </CardContent>
        </Card>
      )}

      {sendToClientPanel}

      <Card className="bg-card/80">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Заказ {order.trackingNumber}</CardTitle>
            <p className="text-sm text-muted">
              Создан {formatDateTime(order.createdAt)} · Обновлён {formatDateTime(order.updatedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/track/${order.trackingNumber}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Открыть трекер
            </Link>
            <CopyTrackingLink trackingNumber={order.trackingNumber} />
            {order.accessCode && (
              <CopyValueButton
                value={order.accessCode}
                label="Скопировать код"
                copiedLabel="Код скопирован"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Авто</div>
            <div className="text-sm text-foreground">{order.vehicleSummary}</div>
            <div className="text-xs text-muted">VIN: {order.vehicleVin || "—"}</div>
            <div className="text-xs text-muted">Лот: {order.vehicleLot || "—"}</div>
            <div className="text-xs text-muted">ETA: {order.etaText || "—"}</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Клиент</div>
            <div className="text-sm text-foreground">{order.clientName || "—"}</div>
            <div className="text-xs text-muted">Телефон: {order.clientPhone || "—"}</div>
            <div className="text-xs text-muted">Код доступа: {order.accessCode || "—"}</div>
            <form action={regenerateAccessCodeAction}>
              <input type="hidden" name="orderId" value={order.id} />
              <input type="hidden" name="trackingNumber" value={order.trackingNumber} />
              <Button variant="outline" size="sm" type="submit">
                Сгенерировать новый код
              </Button>
            </form>
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Текущий этап</div>
            {currentStage ? (
              <div className="space-y-2">
                <div className="text-sm text-foreground">{currentStage.title}</div>
                <StatusBadge status={currentStage.status} />
              </div>
            ) : (
              <div className="text-sm text-muted">Этапы не заданы</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/orders/${order.id}?tab=${tab.key}`}
            className={cn(
              buttonVariants({
                variant: activeTab === tab.key ? "accent" : "outline",
                size: "sm",
              })
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "overview" && (
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Обзор</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <div>
              Код доступа для чата:{" "}
              <span className="text-foreground">{order.accessCode || "—"}</span>
            </div>
            <div>
              Сообщений в чате:{" "}
              <span className="text-foreground">{order.messages.length}</span>
            </div>
            <div>
              Файлов прикреплено:{" "}
              <span className="text-foreground">{order.attachments.length}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "stages" && stagesPanel}
      {activeTab === "map" && mapPanel}
      {activeTab === "chat" && chatPanel}
      {activeTab === "files" && filesPanel}

      {activeTab === "tracker" && (
        <div className="space-y-6">
          {summaryPanel}
          {quickActionsPanel}
          {stagesPanel}
          {mapPanel}
          {filesPanel}
          {chatPanel}
        </div>
      )}
    </div>
  );
}
