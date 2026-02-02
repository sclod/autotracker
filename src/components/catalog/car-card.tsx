import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { carStatusLabels, type Car } from "@/data/cars";
import { formatMileage, formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const statusStyles: Record<Car["status"], string> = {
  available: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  in_transit: "border-amber-400/40 bg-amber-400/10 text-amber-200",
};


export function CarCard({ car }: { car: Car }) {
  const preview = car.images[0] ?? "/placeholders/media.svg";

  return (
    <Card className="bg-card/80">
      <CardContent className="space-y-4 p-5">
        <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-border/60 bg-card-muted">
          <Image
            src={preview}
            alt={car.name}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 768px) 33vw, 100vw"
            className="object-cover"
            priority={false}
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold",
                statusStyles[car.status]
              )}
            >
              {carStatusLabels[car.status]}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-lg font-semibold text-foreground">{car.name}</div>
          <div className="text-xs text-muted">{car.location}</div>
          <div className="text-lg font-semibold text-accent">
            {formatPrice(car.price)}
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>{car.year} г.</span>
            <span>{formatMileage(car.mileageKm)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "subtle", size: "sm" }))}
          >
            Подробнее
          </Link>
          <Link
            href="/track"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Трекинг
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
