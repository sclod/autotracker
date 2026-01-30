import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CatalogRegionShowcase } from "@/components/catalog/region-showcase";
import { cars } from "@/data/cars";
import {
  REGION_FROM_LABELS,
  REGION_LABELS,
  type RegionKey,
} from "@/data/makes";
import { siteConfig } from "@/config/site";

const REGION_REDIRECTS: Record<string, string> = {
  cn: "/catalog/china",
  kr: "/catalog/usa",
  korea: "/catalog/usa",
};

const REGION_TITLES: Record<RegionKey, string> = {
  usa: "Популярные модели, которые можно привезти из США прямо сейчас",
  eu: "Популярные модели, которые можно привезти из Европы прямо сейчас",
  china: "Популярные модели, которые можно привезти из Китая прямо сейчас",
};

const REGION_SUBTITLE =
  "Подбор • проверка • доставка • прозрачные этапы в трекере";

function resolveRegion(value: string): RegionKey | null {
  if (value === "usa" || value === "eu" || value === "china") {
    return value;
  }
  if (REGION_REDIRECTS[value]) {
    redirect(REGION_REDIRECTS[value]);
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const resolved = resolveRegion(region);
  if (!resolved) {
    return {};
  }

  const regionFromLabel = REGION_FROM_LABELS[resolved];
  const title = `Популярные модели из ${regionFromLabel} — AutoTracker`;
  const description =
    "Подбор, проверка и доставка авто под ключ. Прозрачные этапы и поддержка менеджера.";
  const canonical = `${siteConfig.url}/catalog/${resolved}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: title }],
    },
  };
}

export default async function CatalogRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const resolved = resolveRegion(region);
  if (!resolved) {
    notFound();
  }

  const regionLabel = REGION_LABELS[resolved];
  const regionFromLabel = REGION_FROM_LABELS[resolved];
  const regionCars = cars.filter((car) => car.region === resolved).slice(0, 10);

  return (
    <CatalogRegionShowcase
      regionKey={resolved}
      regionLabel={regionLabel}
      regionFromLabel={regionFromLabel}
      cars={regionCars}
      title={REGION_TITLES[resolved]}
      subtitle={REGION_SUBTITLE}
      crumbs={[
        { label: "Главная", href: "/" },
        { label: "Каталог" },
        { label: regionLabel },
      ]}
    />
  );
}
