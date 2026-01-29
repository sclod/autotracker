import Link from "next/link";
import { listOrders } from "@/lib/orders";
import { formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { getCurrentStage } from "@/lib/orders";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <Card className="bg-card/80">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>Заказы</CardTitle>
          <p className="text-sm text-muted">Управление заказами и этапами доставки.</p>
        </div>
        <Link
          href="/admin/orders/new"
          className={cn(buttonVariants({ variant: "accent" }))}
        >
          Создать заказ
        </Link>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-sm text-muted">Заказов пока нет.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Авто</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const currentStage = getCurrentStage(order.stages);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-foreground">
                      {order.trackingNumber}
                    </TableCell>
                    <TableCell className="text-muted">{order.vehicleSummary}</TableCell>
                    <TableCell>
                      {currentStage ? (
                        <StatusBadge status={currentStage.status} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-muted">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className={cn(buttonVariants({ variant: "subtle", size: "sm" }))}
                      >
                        Открыть
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
