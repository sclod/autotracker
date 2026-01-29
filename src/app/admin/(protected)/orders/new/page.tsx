import { createOrderAction } from "@/app/admin/(protected)/orders/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function NewOrderPage() {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Создать заказ</CardTitle>
        <p className="text-sm text-muted">
          Номер заказа генерируется автоматически и используется в трекере.
        </p>
      </CardHeader>
      <CardContent>
        <form action={createOrderAction} className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Имя клиента</Label>
              <Input id="clientName" name="clientName" placeholder="Иван П." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Телефон клиента</Label>
              <Input id="clientPhone" name="clientPhone" placeholder="+7 (999) 000-00-00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicleSummary">Авто (обязательное поле)</Label>
            <Input
              id="vehicleSummary"
              name="vehicleSummary"
              placeholder="Например, BMW X5 xDrive40i, 2022"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="vehicleVin">VIN</Label>
              <Input id="vehicleVin" name="vehicleVin" placeholder="WBA..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleLot">Лот</Label>
              <Input id="vehicleLot" name="vehicleLot" placeholder="Лот #12345" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="etaText">ETA</Label>
              <Input id="etaText" name="etaText" placeholder="08–10.02.2026" />
            </div>
          </div>
          <Button variant="accent" type="submit">
            Создать заказ
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
