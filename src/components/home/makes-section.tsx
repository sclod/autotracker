"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MAKES, type Make, type RegionKey } from "@/data/makes";
import { cn } from "@/lib/utils";

const tabs: { key: RegionKey; label: string }[] = [
  { key: "usa", label: "США" },
  { key: "eu", label: "Европы" },
  { key: "china", label: "Китая" },
];

function getInitials(name: string) {
  const parts = name.replace(/[-]/g, " ").split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts[1]?.[0] ?? "";
  return `${first}${second}`.toUpperCase();
}

function MakeLogo({ make }: { make: Make }) {
  const [failed, setFailed] = useState(false);
  if (!make.image || failed) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card text-sm font-semibold text-muted shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:h-20 md:w-20 md:text-base">
        {getInitials(make.title)}
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card shadow-[0_8px_30px_rgba(0,0,0,0.35)] md:h-20 md:w-20">
      <Image
        src={make.image}
        alt={make.title}
        width={56}
        height={56}
        className="h-10 w-10 object-contain md:h-12 md:w-12"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function MakesSection() {
  const [region, setRegion] = useState<RegionKey>("usa");

  const makes = useMemo(() => MAKES[region] ?? [], [region]);

  return (
    <section className="bg-transparent py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h3 className="text-2xl font-semibold md:text-3xl">
            Автомобили, которые<br />привозим из
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-1 md:overflow-visible">
            {tabs.map((tab) => {
              const active = region === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setRegion(tab.key)}
                  className={cn(
                    "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition",
                    active
                      ? "border-accent/60 bg-accent text-black"
                      : "border-border bg-card/60 text-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4 lg:grid-cols-8">
          {makes.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-border/60 bg-card/60 p-6 text-sm text-muted">
              Скоро добавим марки для выбранного региона.
            </div>
          ) : (
            makes.map((make) => (
              <Link
                key={`${region}-${make.slug}`}
                href={`/catalog/${region}/${make.slug}`}
                className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 text-center transition hover:border-white/20 hover:bg-white/10"
              >
                <MakeLogo make={make} />
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted group-hover:text-foreground">
                  {make.title}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
