import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { LeadStatus } from "@prisma/client";
import {
  updateLeadNoteAction,
  updateLeadStatusAction,
} from "@/app/admin/(protected)/leads/actions";
import { LeadConvertModal } from "@/components/admin/lead-convert-modal";
import { CopyTrackingLink } from "@/components/admin/copy-tracking-link";
import { CopyValueButton } from "@/components/admin/copy-value-button";

const leadStatuses: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "converted",
  "closed",
  "spam",
];

const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Новый",
  contacted: "Связались",
  qualified: "Квалифицирован",
  converted: "Конвертирован",
  closed: "Закрыт",
  spam: "Спам",
};

const leadStatusStyles: Record<LeadStatus, string> = {
  new: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  contacted: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  qualified: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  converted: "border-accent/40 bg-accent/10 text-accent",
  closed: "border-border/60 bg-card/50 text-muted",
  spam: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const statusFilter = resolvedSearchParams?.status as LeadStatus | undefined;
  const where = statusFilter ? { status: statusFilter } : undefined;
  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      order: {
        select: { id: true, trackingNumber: true, accessCode: true },
      },
    },
  });

  return (
    <Card className="bg-card/80">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Лиды</CardTitle>
          <p className="text-sm text-muted">
            Управление статусами заявок и конвертация в заказ.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/leads"
            className={cn(
              buttonVariants({
                variant: !statusFilter ? "accent" : "outline",
                size: "sm",
              })
            )}
          >
            Все
          </Link>
          {leadStatuses.map((status) => (
            <Link
              key={status}
              href={`/admin/leads?status=${status}`}
              className={cn(
                buttonVariants({
                  variant: statusFilter === status ? "accent" : "outline",
                  size: "sm",
                })
              )}
            >
              {leadStatusLabels[status]}
            </Link>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="text-sm text-muted">Заявок пока нет.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Сообщение</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Заметка</TableHead>
                <TableHead>Источник</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium text-foreground">{lead.name}</TableCell>
                  <TableCell className="text-muted">{lead.phone}</TableCell>
                  <TableCell className="text-muted">{lead.message || "—"}</TableCell>
                  <TableCell>
                    <form action={updateLeadStatusAction} className="flex flex-col gap-2">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <div
                        className={cn(
                          "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                          leadStatusStyles[lead.status]
                        )}
                      >
                        {leadStatusLabels[lead.status]}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <select
                          name="status"
                          defaultValue={lead.status}
                          className="h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground"
                        >
                          {leadStatuses.map((status) => (
                            <option key={status} value={status}>
                              {leadStatusLabels[status]}
                            </option>
                          ))}
                        </select>
                        <Button variant="outline" size="sm" type="submit">
                          Сохранить
                        </Button>
                      </div>
                    </form>
                  </TableCell>
                  <TableCell className="min-w-[220px]">
                    <form action={updateLeadNoteAction} className="space-y-2">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <Textarea
                        name="adminNote"
                        defaultValue={lead.adminNote || ""}
                        placeholder="Комментарий менеджера"
                        className="min-h-[80px]"
                        maxLength={1000}
                      />
                      <Button variant="outline" size="sm" type="submit">
                        Сохранить заметку
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell className="text-muted">{lead.source}</TableCell>
                  <TableCell className="text-muted">{formatDateTime(lead.createdAt)}</TableCell>
                  <TableCell className="space-y-2">
                    {lead.order ? (
                      <div className="space-y-2">
                        <Link
                          href={`/admin/orders/${lead.order.id}`}
                          className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
                        >
                          Открыть заказ
                        </Link>
                        <CopyTrackingLink trackingNumber={lead.order.trackingNumber} />
                        {lead.order.accessCode && (
                          <CopyValueButton
                            value={lead.order.accessCode}
                            label="Скопировать код"
                            copiedLabel="Код скопирован"
                          />
                        )}
                      </div>
                    ) : (
                      <LeadConvertModal
                        leadId={lead.id}
                        defaultSummary={lead.message}
                      />
                    )}
                    <Link
                      href="/contact"
                      className="text-xs text-muted hover:text-foreground"
                    >
                      Страница контактов
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
