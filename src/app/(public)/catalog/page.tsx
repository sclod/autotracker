import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { CarCard } from "@/components/catalog/car-card";
import { buttonVariants } from "@/components/ui/button";
import { cars } from "@/data/cars";
import { MAKES } from "@/data/makes";
import {
  applyCatalogFilters,
  parseNumber,
  sortOptions,
  statusOptions,
  type CatalogSort,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "??????? ??????????? ? AutoTracker",
  description: "????? ???????? ??????????? ? ????????? ?? ????, ???? ? ???????.",
  alternates: { canonical: `${siteConfig.url}/catalog` },
  openGraph: {
    title: "??????? ??????????? ? AutoTracker",
    description: "????? ???????? ??????????? ? ????????? ?? ????, ???? ? ???????.",
    url: `${siteConfig.url}/catalog`,
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTracker ? ??????? ???????????",
      },
    ],
  },
};

export default async function CatalogHubPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const makeOptions = Array.from(
    new Map(
      Object.values(MAKES)
        .flat()
        .map((make) => [make.slug, make.title])
    )
  ).map(([value, label]) => ({ value, label }));

  const filters = {
    minPrice: parseNumber(params.minPrice),
    maxPrice: parseNumber(params.maxPrice),
    minYear: parseNumber(params.minYear),
    maxYear: parseNumber(params.maxYear),
    status: statusOptions.find((option) => option.value === params.status)?.value,
    make: makeOptions.find((option) => option.value === params.make)?.value,
    sort: sortOptions.find((option) => option.value === params.sort)?.value as
      | CatalogSort
      | undefined,
  };

  const filteredCars = applyCatalogFilters(cars, filters);

  return (
    <section className="container mx-auto flex flex-col gap-10 px-6">
      <Breadcrumbs items={[{ label: "???????", href: "/" }, { label: "???????" }]} />

      <div className="space-y-3">
        <div className="text-xs uppercase tracking-[0.4em] text-muted">???????</div>
        <h1 className="text-4xl font-semibold">??????? ???????????</h1>
        <p className="text-muted">
          ????? ???????? ?? ???-??????. ?????????? ?? ????, ???? ? ???????.
        </p>
      </div>

      <form
        method="GET"
        className="grid gap-4 rounded-3xl border border-border/60 bg-card/80 p-6 lg:grid-cols-[2fr_2fr_2fr_2fr_1.5fr_auto]"
      >
        <div className="space-y-2">
          <label className="text-xs text-muted">???? ??</label>
          <input
            type="number"
            name="minPrice"
            defaultValue={params.minPrice ?? ""}
            placeholder="3 000 000"
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">???? ??</label>
          <input
            type="number"
            name="maxPrice"
            defaultValue={params.maxPrice ?? ""}
            placeholder="12 000 000"
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">??? ??</label>
          <input
            type="number"
            name="minYear"
            defaultValue={params.minYear ?? ""}
            placeholder="2019"
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">??? ??</label>
          <input
            type="number"
            name="maxYear"
            defaultValue={params.maxYear ?? ""}
            placeholder="2024"
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">?????</label>
          <select
            name="make"
            defaultValue={params.make ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="">??? ?????</option>
            {makeOptions.map((make) => (
              <option key={make.value} value={make.value}>
                {make.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">??????</label>
          <select
            name="status"
            defaultValue={params.status ?? ""}
            className="h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground"
          >
            <option value="">??? ???????</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-muted">??????????</label>
          <select
            name="sort"
            defaultValue={params.sort ?? "price-desc"}
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
            ?????????
          </button>
          <Link
            href="/catalog"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            ????????
          </Link>
        </div>
      </form>

      <div className="flex items-center justify-between text-sm text-muted">
        <span>???????: {filteredCars.length}</span>
        <Link href="/catalog/eu" className="hover:text-foreground">
          ???????? ?? ???????? ?
        </Link>
      </div>

      {filteredCars.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-card/80 p-10 text-sm text-muted">
          ?????? ?? ????? ?? ????????? ??????????. ?????????? ???????? ???????.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      <LeadForm
        source="catalog-hub"
        title="????? ???????????? ?? ????????"
        description="???????? ?????? ? ???????? ???????? ? ?????????? ?????? ?????."
        buttonLabel="???????? ????????????"
      />
    </section>
  );
}
