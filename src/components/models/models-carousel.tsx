"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RegionModel } from "@/content/regions";

export function ModelsCarousel({
  title = "Популярные модели",
  models,
}: {
  title?: string;
  models: RegionModel[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (offset: number) => {
    scrollerRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  const renderCard = (model: RegionModel) => (
    <article
      key={model.name}
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)]",
        "flex min-w-[260px] flex-col gap-4 md:min-w-0"
      )}
    >
      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-white">
        <Image
          src={model.image ?? "/models/default-car.webp"}
          alt={model.name}
          fill
          className="object-contain"
          sizes="300px"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="text-base font-semibold text-slate-900">{model.name}</div>
          {model.badge && (
            <span className="rounded-full border border-accent/50 bg-accent/10 px-2 py-0.5 text-xs text-slate-900">
              {model.badge}
            </span>
          )}
        </div>
        {model.note && <div className="text-xs text-slate-500">{model.note}</div>}
        <div className="text-sm font-semibold text-slate-900">
          {model.priceFrom ?? "цена по запросу"}
        </div>
      </div>
      <Button variant="accent" size="sm" type="button">
        Хочу такой автомобиль
      </Button>
    </article>
  );

  return (
    <section className="bg-[#f7f5ef] text-slate-900">
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-slate-500">Модели</div>
            <h2 className="text-3xl font-semibold">{title}</h2>
          </div>
          <div className="flex gap-2 md:hidden">
            <Button variant="outline" size="sm" type="button" onClick={() => scrollBy(-320)}>
              Назад
            </Button>
            <Button variant="accent" size="sm" type="button" onClick={() => scrollBy(320)}>
              Вперёд
            </Button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:hidden"
        >
          {models.map(renderCard)}
        </div>

        <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
          {models.map(renderCard)}
        </div>
      </div>
    </section>
  );
}
