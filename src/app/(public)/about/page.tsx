import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CompanyStats } from "@/components/about/company-stats";
import { CompanyTimeline } from "@/components/about/company-timeline";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Команда, которая ведет клиента от подбора до передачи ключей. Прозрачные этапы и контроль качества.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16">
      <PageHero
        title="О компании"
        subtitle="Рассказываем, как работаем, какие ценности разделяем и почему нам доверяют поставку автомобилей под ключ."
      />
      <CompanyStats />
      <CompanyTimeline />
    </div>
  );
}
