import Image from "next/image";
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

export default async function CatalogRegionPage({
  params,
  searchParams,
}: {
  params: Promise<{ region: string }>;
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const { region } = await params;
  if (!isRegion(region)) {
    notFound();
  }

  const resolvedParams = (await searchParams) ?? {};
  const regionLabel = REGION_LABELS[region];
  const makes = MAKES[region];

  const filters = {
    minPrice: parseNumber(resolvedParams.minPrice),
    maxPrice: parseNumber(resolvedParams.maxPrice),
    minYear: parseNumber(resolvedParams.minYear),
    maxYear: parseNumber(resolvedParams.maxYear),
    status: statusOptions.find((option) => option.value === resolvedParams.status)?.value,
    make: makes.find((make) => make.slug === resolvedParams.make)?.slug,
    sort: sortOptions.find((option) => option.value === resolvedParams.sort)?.value as
      | CatalogSort
      | undefined,
  };

  const regionCars = cars.filter((car) => car.region === region);
  const filteredCars = applyCatalogFilters(regionCars, filters);

  return (
    <section className="container mx-auto flex flex-col gap-10 px-6">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Каталог", href: "/catalog" },
          { label: regionLabel },
        ]}
      />
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.4em] text-muted">Каталог</div>
        <h1 className="text-4xl font-semibold">Автомобили из {regionLabel}</h1>
        <p className="text-muted">
          Выберите марку или отфильтруйте предложения по параметрам.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-8">
        {makes.map((make) => (
          <Link
            key={make.slug}
            href={`/catalog/${region}/${make.slug}`}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center transition hover:border-white/20 hover:bg-white/10"
          >
            <Image
              src={make.image}
              alt={make.title}
              width={80}
              height={80}
              className="h-16 w-16 object-contain"
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted group-hover:text-foreground">
              {make.title}
            </span>
          </Link>
        ))}
      </div>

      <form
        method="GET"
        className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 lg:grid-cols-[2fr_2fr_2fr_2fr_2fr_2fr_auto]"
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
          <label className="text-xs text-muted">Марка</label>
          <select
            name="make"
            defaultValue={resolvedParams.make ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="">Все марки</option>
            {makes.map((make) => (
              <option key={make.slug} value={make.slug}>
                {make.title}
              </option>
            ))}
          </select>
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
            href={`/catalog/${region}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Сбросить
          </Link>
        </div>
      </form>

      {filteredCars.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-card/80 p-10 text-sm text-muted">
          Пока нет авто по этим фильтрам. Оставьте заявку — подберём варианты.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      <LeadForm
        source={`catalog-${region}`}
        title="Получить консультацию"
        description="Расскажите, какой автомобиль ищете. Подготовим подборку в течение 24 часов."
        buttonLabel="Отправить запрос"
      />
    </section>
  );
}
