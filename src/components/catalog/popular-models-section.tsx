"use client";

import { useRef, useState } from "react";
import { LeadForm } from "@/components/lead-form";
import { CatalogCard } from "@/components/catalog/region-showcase";
import type { Car } from "@/data/cars";

export function PopularModelsSection({
  cars,
  title,
  subtitle,
  source,
  showLead = true,
  headingAs = "h2",
}: {
  cars: Car[];
  title: string;
  subtitle?: string;
  source: string;
  showLead?: boolean;
  headingAs?: "h1" | "h2";
}) {
  const Heading = headingAs;
  const [message, setMessage] = useState("");
  const leadRef = useRef<HTMLDivElement>(null);

  const handlePick = (car: Car) => {
    setMessage(`Хочу ${car.name}, свяжитесь со мной`);
    requestAnimationFrame(() => {
      leadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-6 py-14">
        <div className="mb-8 space-y-3">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">
            Популярные модели
          </div>
          <Heading className="text-3xl font-semibold md:text-4xl">
            {title}
          </Heading>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CatalogCard key={car.id} car={car} onPick={handlePick} showFlag={false} />
          ))}
        </div>

        {showLead && (
          <div ref={leadRef} id="lead" className="mt-10">
            <LeadForm
              key={message}
              source={source}
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
        )}
      </div>
    </section>
  );
}
