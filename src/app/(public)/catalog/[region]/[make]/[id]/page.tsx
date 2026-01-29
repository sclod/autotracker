import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MAKES, REGION_LABELS, type RegionKey } from "@/data/makes";
import { cars, carStatusLabels } from "@/data/cars";
import { formatMileage, formatPrice } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isRegion(value: string): value is RegionKey {
  return value === "eu" || value === "cn" || value === "kr";
}

export default async function CatalogDetailPage({
  params,
}: {
  params: Promise<{ region: string; make: string; id: string }>;
}) {
  const { region, make, id } = await params;
  if (!isRegion(region)) {
    notFound();
  }

  const regionLabel = REGION_LABELS[region];
  const makeItem = MAKES[region].find((item) => item.slug === make);
  if (!makeItem) {
    notFound();
  }

  const car = cars.find(
    (item) => item.id === id && item.region === region && item.makeSlug === make
  );
  if (!car) {
    notFound();
  }

  const gallery = car.images.length > 0 ? car.images : ["/placeholders/media.svg"];
  const preview = gallery[0];
  const thumbs = gallery.slice(1, 5);
  const leadMessage = `Интересует ${car.name} (${car.year} г., ${car.location}). Прошу уточнить стоимость и условия доставки.`;

  return (
    <section className="container mx-auto flex flex-col gap-10 px-6">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Каталог", href: "/catalog" },
          { label: regionLabel, href: `/catalog/${region}` },
          { label: makeItem.title, href: `/catalog/${region}/${makeItem.slug}` },
          { label: car.name },
        ]}
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">
            Карточка авто
          </div>
          <h1 className="text-4xl font-semibold">{car.name}</h1>
          <p className="text-muted">{car.description}</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            <span className="rounded-full border border-border/60 bg-card px-3 py-1 text-foreground">
              {carStatusLabels[car.status]}
            </span>
            <span className="rounded-full border border-border/60 bg-card px-3 py-1 text-foreground">
              {regionLabel}
            </span>
            <span className="rounded-full border border-border/60 bg-card px-3 py-1">
              {car.location}
            </span>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card-muted p-4">
            <div className="relative h-72 w-full overflow-hidden rounded-2xl">
              <Image
                src={preview}
                alt={car.name}
                fill
                sizes="(min-width: 1024px) 720px, 100vw"
                className="object-cover"
              />
            </div>
            {thumbs.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {thumbs.map((image, index) => (
                  <div
                    key={`${car.id}-thumb-${index}`}
                    className="relative h-24 w-full overflow-hidden rounded-xl border border-border/60 bg-card"
                  >
                    <Image
                      src={image}
                      alt={`${car.name} ${index + 2}`}
                      fill
                      sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Card className="bg-card/80">
          <CardHeader>
            <CardTitle>Характеристики</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted">
            <div className="flex items-center justify-between">
              <span>Цена</span>
              <span className="text-foreground">{formatPrice(car.price)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Год</span>
              <span>{car.year}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Пробег</span>
              <span>{formatMileage(car.mileageKm)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Регион</span>
              <span>{regionLabel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Статус</span>
              <span className="text-foreground">{carStatusLabels[car.status]}</span>
            </div>
            <Link href="#lead" className={cn(buttonVariants({ variant: "accent" }))}>
              Запросить подбор
            </Link>
          </CardContent>
        </Card>
      </div>

      <div id="lead">
        <LeadForm
          source={`catalog-${region}-${makeItem.slug}-${id}`}
          title="Получить подбор и расчёт"
          description="Уточним доступность, сроки и стоимость. Ответим быстро."
          buttonLabel="Отправить заявку"
          defaultValues={{ message: leadMessage }}
        />
      </div>
    </section>
  );
}
