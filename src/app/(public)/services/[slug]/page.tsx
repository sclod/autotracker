import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { services, servicesBySlug } from "@/content/services";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

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
      images: [
        {
          url: "/og.jpg",
          width: 1200,
          height: 630,
          alt: `AutoTracker ? ${service.title}`,
        },
      ],
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

  return (
    <>
      <section className="border-b border-border/60 bg-card-muted">
        <div className="container mx-auto space-y-8 px-6 py-12">
          <Breadcrumbs
            items={[
              { label: "???????", href: "/" },
              { label: "??????", href: "/services" },
              { label: service.title },
            ]}
          />
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-5">
              <div className="text-xs uppercase tracking-[0.4em] text-muted">
                ??????
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
                  {service.hero.ctaButtonLabel ?? "???????? ??????"}
                </Link>
                <Link
                  href="/services"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  ??? ??????
                </Link>
              </div>
            </div>
            <LeadForm
              source={`service-${service.slug}-hero`}
              title={service.hero.ctaTitle}
              description={service.hero.ctaDescription}
              buttonLabel={service.hero.ctaButtonLabel ?? "????????? ??????"}
              className="bg-card/80"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto space-y-10 px-6">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">?????? ??</div>
          <h2 className="text-3xl font-semibold">???????? ????????????</h2>
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
          <div className="text-xs uppercase tracking-[0.4em] text-muted">??? ????????</div>
          <h2 className="text-3xl font-semibold">?????????? ????? ??????</h2>
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

      <section className="container mx-auto space-y-10 px-6">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">FAQ</div>
          <h2 className="text-3xl font-semibold">?????? ???????</h2>
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
          <div className="text-xs uppercase tracking-[0.4em] text-muted">???????</div>
          <h2 className="text-3xl font-semibold">????????????? ?????????</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {service.team.map((member) => (
            <Card key={member.name} className="bg-card/80">
              <CardContent className="space-y-4 p-6">
                <Image
                  src="/placeholders/person.svg"
                  alt={member.name}
                  width={320}
                  height={320}
                  className="h-40 w-full rounded-2xl object-cover"
                />
                <div>
                  <div className="text-base font-semibold">{member.name}</div>
                  <div className="text-sm text-muted">{member.role}</div>
                </div>
                <div className="text-sm text-muted">{member.phone}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6" id="lead">
        <div className="grid gap-8 rounded-3xl border border-border/60 bg-card-muted p-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.4em] text-muted">??????</div>
            <h2 className="text-3xl font-semibold">{service.cta.title}</h2>
            <p className="text-muted">{service.cta.description}</p>
          </div>
          <LeadForm
            source={`service-${service.slug}-cta`}
            title=""
            description=""
            buttonLabel={service.cta.buttonLabel ?? "????????? ??????"}
            className="bg-transparent border-none p-0"
          />
        </div>
      </section>
    </>
  );
}
