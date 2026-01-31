import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Каталог автомобилей — AutoTracker",
  description:
    "Популярные модели из США, Европы и Китая. Подбор, проверка и доставка под ключ.",
  alternates: { canonical: `${siteConfig.url}/catalog` },
  openGraph: {
    title: "Каталог автомобилей — AutoTracker",
    description:
      "Популярные модели из США, Европы и Китая. Подбор, проверка и доставка под ключ.",
    url: `${siteConfig.url}/catalog`,
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTracker — каталог автомобилей",
      },
    ],
  },
};

export default function CatalogRedirectPage() {
  redirect("/catalog/usa");
}
