import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { ModelsCarousel } from "@/components/models/models-carousel";
import { RegionMap } from "@/components/services/region-map";
import { WhyImport } from "@/components/services/why-import";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { regionsByKey, type RegionKey } from "@/content/regions";
import { services, servicesBySlug } from "@/content/services";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const regionKeys = ["usa", "eu", "china"] as const;
const teamImages = [
  "/manager1-v2.jpg",
  "/manager2-v2.jpg",
  "/manager3-v2.jpg",
  "/manager4-v2.jpg",
  "/manager5-v2.jpg",
];

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesBySlug[slug];

  if (!service) {
    return {};
  }

  const canonical = `${siteConfig.url}/services/${service.slug}`;

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      type: "website",
      url: canonical,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesBySlug[slug];

  if (!service) {
    notFound();
  }

  const regionKey = regionKeys.includes(slug as RegionKey)
    ? (slug as RegionKey)
    : "eu";
  const region = regionsByKey[regionKey];
  const modelsTitle = regionKeys.includes(slug as RegionKey)
    ? `Популярные модели из ${region.titleGenitive}`
    : "Популярные модели";

  return (
    <>
      <section className="border-b border-border/60 bg-card-muted">
        <div className="container mx-auto space-y-8 px-6 py-12">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Услуги", href: "/services" },
              { label: service.title },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              <div className="text-xs uppercase tracking-[0.4em] text-muted">
                Услуга
              </div>
              <h1 className="text-4xl font-semibold md:text-5xl">
                {service.hero.title}
              </h1>
              <p className="text-lg text-muted">{service.hero.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#lead"
                  className={cn(buttonVariants({ variant: "accent" }))}
                >
                  {service.hero.ctaButtonLabel ?? "Получить консультацию"}
                </Link>
                <Link
                  href="/services"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Все услуги
                </Link>
              </div>
            </div>
            <LeadForm
              source={`service-${service.slug}-hero`}
              title={service.hero.ctaTitle}
              description={service.hero.ctaDescription}
              buttonLabel={service.hero.ctaButtonLabel ?? "Получить консультацию"}
              className="bg-card/80"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto space-y-10 px-6">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">Почему мы</div>
          <h2 className="text-3xl font-semibold">Наши преимущества</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.advantages.map((advantage) => (
            <Card key={advantage.title} className="bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">{advantage.title}</CardTitle>
                <p className="text-sm text-muted">{advantage.text}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto space-y-10 px-6">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">Как работаем</div>
          <h2 className="text-3xl font-semibold">Этапы работы</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {service.steps.map((step, index) => (
            <Card key={step.title} className="bg-card/80">
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm text-muted">
                  {index + 1}
                </div>
                <div>
                  <div className="text-lg font-semibold">{step.title}</div>
                  <p className="text-sm text-muted">{step.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <RegionMap initialRegion={regionKey} />
      <WhyImport />
      <ModelsCarousel title={modelsTitle} models={region.models} />

      <section className="container mx-auto space-y-10 px-6">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">FAQ</div>
          <h2 className="text-3xl font-semibold">Частые вопросы</h2>
        </div>
        <div className="space-y-4">
          {service.faq.map((item) => (
            <details
              key={item.question}
              className="rounded-2xl border border-border/60 bg-card/80 px-6 py-4"
            >
              <summary className="cursor-pointer text-sm font-semibold">
                {item.question}
              </summary>
              <p className="mt-3 text-sm text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container mx-auto space-y-10 px-6">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">Команда</div>
          <h2 className="text-3xl font-semibold">Команда и контакты</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.team.map((member, index) => (
            <Card key={member.name} className="bg-card/80">
              <CardContent className="space-y-4 p-6">
                <div className="relative mx-auto h-40 w-40 md:h-48 md:w-48">
                  <div className="absolute inset-0 rounded-full bg-accent/90 shadow-[0_18px_36px_rgba(255,230,0,0.28)]" />
                  <Image
                    src={teamImages[index % teamImages.length]}
                    alt={member.name}
                    fill
                    quality={100}
                    sizes="(max-width: 768px) 160px, 192px"
                    className="relative z-10 rounded-full object-cover ring-4 ring-background/90"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-center">
                    {member.name}
                  </div>
                  <div className="text-sm text-muted text-center">
                    {member.role}
                  </div>
                </div>
                <div className="text-sm text-muted text-center">
                  {member.phone}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6" id="lead">
        <div className="grid gap-8 rounded-3xl border border-border/60 bg-card-muted p-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.4em] text-muted">Заявка</div>
            <h2 className="text-3xl font-semibold">{service.cta.title}</h2>
            <p className="text-muted">{service.cta.description}</p>
          </div>
          <LeadForm
            source={`service-${service.slug}-cta`}
            title=""
            description=""
            buttonLabel={service.cta.buttonLabel ?? "Получить консультацию"}
            className="bg-transparent border-none p-0"
          />
        </div>
      </section>
    </>
  );
}
