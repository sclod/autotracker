"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LeadForm } from "@/components/lead-form";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Car } from "@/data/cars";

export function CatalogRegionShowcase({
  regionKey,
  regionLabel,
  regionFromLabel,
  regionFlag,
  cars,
  crumbs,
  title,
  subtitle,
}: {
  regionKey: string;
  regionLabel: string;
  regionFromLabel: string;
  regionFlag?: string;
  cars: Car[];
  crumbs?: Crumb[];
  title?: string;
  subtitle?: string;
}) {
  const [message, setMessage] = useState("");
  const leadRef = useRef<HTMLDivElement>(null);

  const handlePick = (car: Car) => {
    setMessage(`Хочу ${car.name} из ${regionLabel}, свяжитесь со мной`);
    requestAnimationFrame(() => {
      leadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-6 py-14">
        {crumbs && (
          <Breadcrumbs
            items={crumbs}
            className="text-muted [&_a:hover]:text-foreground"
          />
        )}
        <div className="mb-8 space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">Каталог</div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold">
              {title ?? `Популярные модели из ${regionFromLabel}`}
            </h1>
            {regionFlag && (
              <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xl">
                {regionFlag}
              </span>
            )}
          </div>
          <p className="text-sm text-muted">
            {subtitle ??
              "Витрина популярных моделей с быстрым расчетом стоимости и подбором под ваши задачи."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CatalogCard key={car.id} car={car} onPick={handlePick} />
          ))}
        </div>

        <div ref={leadRef} className="mt-10">
          <LeadForm
            key={message}
            source={`catalog-${regionKey}`}
            title="Получить консультацию"
            description="Оставьте заявку — подберем авто и рассчитаем стоимость доставки."
            buttonLabel="Отправить запрос"
            className="border-border/60 bg-card/80"
            variant="compact"
            sideImageSrc="/about_picta.png"
            sideImageAlt="Консультация"
            defaultValues={{ message }}
          />
        </div>
      </div>
    </section>
  );
}

function CatalogCard({
  car,
  onPick,
}: {
  car: Car;
  onPick: (car: Car) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const images = car.images.slice(0, 7);

  const scrollToIndex = (index: number) => {
    if (index === activeIndex || index === nextIndex) return;
    setNextIndex(index);
  };

  const handleNextLoaded = () => {
    if (nextIndex === null) return;
    setActiveIndex(nextIndex);
    setNextIndex(null);
  };

  return (
    <article
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:p-6",
        "shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition",
        "hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(0,0,0,0.55)]"
      )}
    >
      <div className="space-y-4">
        <div className="relative h-[220px] w-full overflow-hidden rounded-[20px] bg-transparent md:h-[260px]">
          <Image
            src={images[activeIndex] ?? "/placeholders/media.svg"}
            alt={car.name}
            fill
            priority={activeIndex === 0}
            quality={95}
            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 380px"
            className="object-cover bg-transparent"
          />
          {nextIndex !== null && (
            <Image
              src={images[nextIndex]}
              alt={car.name}
              fill
              quality={95}
              sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 380px"
              onLoad={handleNextLoaded}
              className="object-cover bg-transparent"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={`${car.id}-dot-${index}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full transition"
              )}
              aria-label={`Показать фото ${index + 1}`}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  activeIndex === index ? "bg-white" : "bg-white/30"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-semibold text-white md:text-xl">
            {car.name}
          </div>
          <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-base">
            {car.flag}
          </span>
        </div>
        <div className="text-sm text-white/60">{car.specLine}</div>
        <div className="text-2xl font-semibold text-white">
          <span className="mr-2 text-white/60">от</span>
          <span className="border-b border-accent/60">{car.priceFrom} руб.</span>
        </div>
        <Button
          variant="accent"
          type="button"
          className="w-full rounded-full py-3 uppercase tracking-[0.08em] hover:brightness-110"
          onClick={() => onPick(car)}
        >
          Хочу такой автомобиль
        </Button>
      </div>
    </article>
  );
}
