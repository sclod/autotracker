import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MakesSection } from "@/components/home/makes-section";
import { HeroVideo } from "@/components/home/hero-video";
import { PopularModelsSection } from "@/components/catalog/popular-models-section";
import { LeadForm } from "@/components/lead-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stats } from "@/lib/placeholder-data";
import { deliverySteps, managers, reasons } from "@/data/home";
import { popularCars } from "@/data/cars";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Импорт автомобилей под ключ — AutoTracker",
  description:
    "Подбор, проверка и доставка автомобилей под ключ. Прозрачные этапы, трекинг заказа, сопровождение на каждом шаге.",
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: "Импорт автомобилей под ключ — AutoTracker",
    description:
      "Подбор, проверка и доставка автомобилей под ключ. Прозрачные этапы, трекинг заказа, сопровождение на каждом шаге.",
    url: siteConfig.url,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <section className="relative isolate h-auto -mt-[var(--header-h)] min-h-[560px] md:min-h-[720px] lg:min-h-[780px]">
        <div className="relative pb-10 md:pb-12">
          <div className="pointer-events-none absolute inset-0 z-0">
            <HeroVideo />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090d] via-[#07090d]/80 to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 container mx-auto px-6 pt-[var(--header-h)] pb-0 md:pt-24 md:pb-24">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div className="max-w-3xl space-y-6">
                <div className="text-xs uppercase tracking-[0.4em] text-muted">Импорт авто под ключ</div>
                <h1 className="text-4xl font-semibold leading-tight md:text-6xl">Привезём автомобиль под ваш бюджет и сроки</h1>
                <p className="text-lg text-muted md:text-xl">Подбор на аукционах и у дилеров, проверка и прозрачная логистика. От договора до выдачи — в одном трекере.</p>
                <div className="flex flex-wrap gap-4 pb-[25px]">
                  <Link
                    href="/contact"
                    className={cn(buttonVariants({ variant: "accent", size: "lg" }))}
                  >Получить консультацию</Link>
                </div>
              </div>
              <div className="max-md:hidden">
                <div className="rounded-3xl border border-border/60 bg-card/80 p-6 backdrop-blur">
                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="text-lg font-semibold">Оставьте заявку</div>
                      <p className="mt-2 text-sm text-muted">
                        Подберём авто и рассчитаем стоимость под ваш бюджет.
                      </p>
                    </div>
                    <Link
                      href="#lead-form"
                      className={cn(
                        buttonVariants({ variant: "accent", size: "lg" }),
                        "w-full"
                      )}
                    >
                      Оставить заявку
                    </Link>
                    <div className="text-xs text-muted">Ответим в течение 10–15 минут</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 container mx-auto px-6">
            <div className="mt-10 md:mt-16 grid gap-4 md:grid-cols-3 max-md:hidden">
              {stats.map((stat) => (
                <Card key={stat.label} className="bg-card/70">
                  <CardHeader>
                    <CardTitle className="text-3xl text-foreground">
                      {stat.value}
                    </CardTitle>
                    <p className="text-sm text-muted">{stat.label}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        <div className="relative z-10 container mx-auto px-6 md:hidden">
          <div className="space-y-6 pb-6">
            <div className="rounded-3xl border border-border/60 bg-card/80 p-6">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="text-lg font-semibold">Оставьте заявку</div>
                  <p className="mt-2 text-sm text-muted">
                    Подберём авто и рассчитаем стоимость под ваш бюджет.
                  </p>
                </div>
                <Link
                  href="#lead-form"
                  className={cn(
                    buttonVariants({ variant: "accent", size: "lg" }),
                    "w-full"
                  )}
                >
                  Оставить заявку
                </Link>
                <div className="text-xs text-muted">Ответим в течение 10–15 минут</div>
              </div>
            </div>
            <div className="grid gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="bg-card/70">
                  <CardHeader>
                      <CardTitle className="text-3xl text-foreground">
                        {stat.value}
                      </CardTitle>
                      <p className="text-sm text-muted">{stat.label}</p>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

</section>

      <section className="container mx-auto px-6" id="lead-form">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.4em] text-muted">Команда</div>
            <h2 className="text-3xl font-semibold">Менеджер всегда на связи</h2><p className="text-muted">Персональный менеджер сопровождает заказ и отвечает на вопросы.</p>
          </div>
          <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>Связаться</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {managers.map((manager) => (
            <Card key={manager.name} className="bg-card/80">
              <CardContent className="space-y-4 p-6">
                <div className="relative mx-auto h-40 w-40 md:h-48 md:w-48">
                  <div className="absolute inset-0 rounded-full bg-accent/90 shadow-[0_18px_36px_rgba(255,230,0,0.28)]" />
                  <Image
                    src={manager.image}
                    alt={manager.name}
                    fill
                    quality={100}
                    sizes="(max-width: 768px) 160px, 192px"
                    className="relative z-10 rounded-full object-cover object-top ring-4 ring-background/90"
                  />
                </div>
                <div>
                  <div className="text-base font-semibold text-center">
                    {manager.name}
                  </div>
                  <div className="text-sm text-muted text-center">
                    {manager.role}
                  </div>
                </div>
                <div className="text-sm text-muted text-center">
                  {manager.phone}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      <div className="mt-0">
        <PopularModelsSection
          cars={popularCars}
          title="Популярные модели, которые можно привезти"
          subtitle="Подбор • проверка • доставка • прозрачные этапы в трекере"
          source="home-popular"
          showLead
        />
      </div>

      <MakesSection />

      <section className="container mx-auto px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.4em] text-muted">Этапы</div>
            <h2 className="text-3xl font-semibold">Как мы доставляем автомобили</h2><p className="text-muted">Показываем весь путь: договор, логистика, таможня, выдача.</p>
          </div>
          <Link href="/track" className={cn(buttonVariants({ variant: "outline" }))}>Отследить заказ</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliverySteps.map((step, index) => (
            <Card key={step.title} className="bg-card/80">
              <CardContent className="space-y-3 p-5">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">Шаг {index + 1}
                </div>
                <div className="text-lg font-semibold">{step.title}</div>
                <p className="text-sm text-muted">{step.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6">
        <div className="grid gap-8 rounded-3xl border border-border/60 bg-card-muted p-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-[0.4em] text-muted">Гарантии</div>
            <h2 className="text-3xl font-semibold">Почему выбирают AutoTracker</h2><p className="text-muted">Фиксируем условия в договоре, работаем прозрачно и держим в курсе статуса.</p>
          </div>
          <div className="space-y-3">
            {reasons.map((reason) => (
              <div
                key={reason}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 px-4 py-3"
              >
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="text-sm text-foreground">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      <section className="container mx-auto px-6">
        <div className="grid gap-6 rounded-3xl border border-border/60 bg-card-muted p-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4">
            <div className="text-xs uppercase tracking-[0.4em] text-muted">Заявка</div>
            <h2 className="text-3xl font-semibold">Получите подбор за 24 часа</h2><p className="text-muted">Расскажите, какой автомобиль нужен — предложим варианты и рассчитаем стоимость.</p>
          </div>
          <LeadForm
            source="request-section"
            title="Популярные модели, которые можно привезти"
            description=""
            buttonLabel="Отправить заявку"
            className="bg-transparent border-none p-0"
          />
        </div>
      </section>
    </>
  );
}











