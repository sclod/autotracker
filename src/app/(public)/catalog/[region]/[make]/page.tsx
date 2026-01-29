import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { CarCard } from "@/components/catalog/car-card";
import { MAKES, REGION_LABELS, type RegionKey } from "@/data/makes";
import { cars } from "@/data/cars";
import {
  applyCatalogFilters,
  parseNumber,
  sortOptions,
  statusOptions,
  type CatalogSort,
} from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isRegion(value: string): value is RegionKey {
  return value === "eu" || value === "cn" || value === "kr";
}

export default async function CatalogMakePage({
  params,
  searchParams,
}: {
  params: Promise<{ region: string; make: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const { region, make } = await params;
  if (!isRegion(region)) {
    notFound();
  }

  const regionLabel = REGION_LABELS[region];
  const makeItem = MAKES[region].find((item) => item.slug === make);
  if (!makeItem) {
    notFound();
  }

  const resolvedParams = (await searchParams) ?? {};
  const baseCars = cars.filter(
    (car) => car.region === region && car.makeSlug === makeItem.slug
  );

  const filters = {
    minPrice: parseNumber(resolvedParams.minPrice),
    maxPrice: parseNumber(resolvedParams.maxPrice),
    minYear: parseNumber(resolvedParams.minYear),
    maxYear: parseNumber(resolvedParams.maxYear),
    status: statusOptions.find((option) => option.value === resolvedParams.status)?.value,
    sort: sortOptions.find((option) => option.value === resolvedParams.sort)?.value as
      | CatalogSort
      | undefined,
  };

  const filteredCars = applyCatalogFilters(baseCars, filters);

  return (
    <section className="container mx-auto flex flex-col gap-10 px-6">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Каталог", href: "/catalog" },
          { label: regionLabel, href: `/catalog/${region}` },
          { label: makeItem.title },
        ]}
      />
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.4em] text-muted">Каталог</div>
        <h1 className="text-4xl font-semibold">{makeItem.title}</h1>
        <p className="text-muted">
          Реальные параметры и статус лотов. Отфильтруйте список под свой запрос.
        </p>
      </div>

      <form
        method="GET"
        className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 lg:grid-cols-[2fr_2fr_2fr_2fr_2fr_auto]"
      >
        <div className="space-y-2">
          <label className="text-xs text-muted">Цена от</label>
          <input
            type="number"
            name="minPrice"
            defaultValue={resolvedParams.minPrice ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">Цена до</label>
          <input
            type="number"
            name="maxPrice"
            defaultValue={resolvedParams.maxPrice ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">Год от</label>
          <input
            type="number"
            name="minYear"
            defaultValue={resolvedParams.minYear ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">Год до</label>
          <input
            type="number"
            name="maxYear"
            defaultValue={resolvedParams.maxYear ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">Статус</label>
          <select
            name="status"
            defaultValue={resolvedParams.status ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="">Все статусы</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">Сортировка</label>
          <select
            name="sort"
            defaultValue={resolvedParams.sort ?? "price-desc"}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
          >
            Применить
          </button>
          <Link
            href={`/catalog/${region}/${makeItem.slug}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Сбросить
          </Link>
        </div>
      </form>

      {filteredCars.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-card/80 p-10 text-sm text-muted">
          Пока нет авто в этой марке. Оставьте заявку — подберём предложения.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      <LeadForm
        source={`catalog-${region}-${makeItem.slug}`}
        title="Получить консультацию"
        description="Подскажем по срокам, стоимости и доступным лотам."
        buttonLabel="Отправить запрос"
      />
    </section>
  );
}
