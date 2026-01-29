import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Услуги — AutoTracker",
  description: "Подбор, проверка, логистика и таможенное оформление под ключ.",
  alternates: { canonical: `${siteConfig.url}/services` },
  openGraph: {
    title: "Услуги — AutoTracker",
    description: "Подбор, проверка, логистика и таможенное оформление под ключ.",
    url: `${siteConfig.url}/services`,
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTracker — услуги",
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Услуги"
        subtitle="Подбор, проверка и доставка авто под ключ — с прозрачными этапами."
      />
      <section className="container mx-auto grid gap-6 px-6 md:grid-cols-3">
        {services.map((service) => (
          <Card key={service.slug} className="bg-card/80">
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
              <p className="text-sm text-muted">{service.summary}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted">
              {service.advantages.slice(0, 3).map((advantage) => (
                <div key={advantage.title}>? {advantage.title}</div>
              ))}
              <Link
                href={`/services/${service.slug}`}
                className={cn(buttonVariants({ variant: "subtle" }))}
              >
                Подробнее
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
