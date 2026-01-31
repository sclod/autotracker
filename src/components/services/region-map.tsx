"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { regionsByKey, type RegionKey } from "@/content/regions";
import { cn } from "@/lib/utils";

const regionTabs: Array<{ key: RegionKey; label: string }> = [
  { key: "usa", label: "США" },
  { key: "eu", label: "Европа" },
  { key: "china", label: "Китай" },
];

function arcPath(from: [number, number], to: [number, number]) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = Math.abs(x2 - x1);
  const controlX = x1 + (x2 - x1) / 2;
  const controlY = Math.min(y1, y2) - Math.max(40, dx * 0.12);
  return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
}

export function RegionMap({ initialRegion = "eu" }: { initialRegion?: RegionKey }) {
  const [active, setActive] = useState<RegionKey>(initialRegion);
  const region = regionsByKey[active];
  const highlight = region.map.highlight;

  const arcPaths = useMemo(
    () => region.map.arcs.map((arc) => arcPath(arc.from, arc.to)),
    [region]
  );

  return (
    <section className="container mx-auto px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.4em] text-muted">
            Карта направлений
          </div>
          <h2 className="text-3xl font-semibold">География импорта</h2>
          <p className="text-sm text-muted">
            Выберите регион и посмотрите ключевые маршруты и преимущества.
          </p>

          <div className="flex flex-wrap gap-2">
            {regionTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  active === tab.key
                    ? "border-accent/60 bg-accent/10 text-foreground accent-glow"
                    : "border-border/70 text-muted hover:border-accent/40"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 text-sm text-muted">
            {region.bullets.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-4">
            <Image
              src="/maps/world-silhouette.svg"
              alt="Карта мира"
              fill
              className="object-contain opacity-90"
              sizes="(min-width: 1024px) 640px, 100vw"
            />

            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 h-full w-full"
            >
              <rect
                x={highlight.x}
                y={highlight.y}
                width={highlight.w}
                height={highlight.h}
                rx="18"
                fill="rgba(255, 230, 0, 0.08)"
                stroke="rgba(255, 230, 0, 0.6)"
                strokeWidth="2"
              />
              {arcPaths.map((path, index) => (
                <path
                  key={path}
                  d={path}
                  stroke="rgba(255, 230, 0, 0.9)"
                  strokeWidth="2"
                  fill="none"
                  className={cn("region-arc accent-glow")}
                  style={{ animationDelay: `${index * 0.12}s` }}
                  opacity={0.9 - index * 0.1}
                />
              ))}
              {region.map.points.map((point) => (
                <g key={point.id}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="5"
                    fill="rgba(255, 230, 0, 0.9)"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="rgba(255, 230, 0, 0.18)"
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
