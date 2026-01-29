import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { carStatusLabels, type Car } from "@/data/cars";
import { REGION_LABELS } from "@/data/makes";
import { formatMileage, formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const statusStyles: Record<Car["status"], string> = {
  available: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  in_transit: "border-amber-400/40 bg-amber-400/10 text-amber-200",
};

const regionStyles: Record<Car["region"], string> = {
  eu: "border-sky-400/40 bg-sky-400/10 text-sky-100",
  cn: "border-red-400/40 bg-red-400/10 text-red-100",
  kr: "border-indigo-400/40 bg-indigo-400/10 text-indigo-100",
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
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold",
                regionStyles[car.region]
              )}
            >
              {REGION_LABELS[car.region]}
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
            href={`/catalog/${car.region}/${car.makeSlug}/${car.id}`}
            className={cn(buttonVariants({ variant: "subtle", size: "sm" }))}
          >
            Подробнее
          </Link>
          <Link
            href={`/catalog/${car.region}/${car.makeSlug}/${car.id}#lead`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Запросить подбор
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
