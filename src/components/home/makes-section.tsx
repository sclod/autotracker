"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { FLAT_MAKES } from "@/data/makes";

function getInitials(name: string) {
  const parts = name.replace(/[-]/g, " ").split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

export function MakesSection() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const makes = useMemo(() => FLAT_MAKES, []);

  return (
    <section className="bg-transparent py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h3 className="text-2xl font-semibold md:text-3xl">
            Автомобили, которые привозим из<br />США, Европы, Китая и Кореи
          </h3>
          <div className="text-sm text-muted">
            Доставляем под ключ, контролируем проверку и логистику.
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-8">
          {makes.map((make) => (
            <div
              key={make.slug}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center"
            >
              {failedImages[make.slug] ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card text-sm font-semibold text-muted shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:h-20 md:w-20 md:text-base">
                  {getInitials(make.title)}
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:h-20 md:w-20">
                  <Image
                    src={make.image}
                    alt={make.title}
                    width={56}
                    height={56}
                    className="h-10 w-10 object-contain md:h-12 md:w-12"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [make.slug]: true }))
                    }
                  />
                </div>
              )}
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                {make.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}