"use client";

import dynamic from "next/dynamic";
import type { RoutePoint } from "@/components/tracker/route-map-client";

const RouteMapClient = dynamic(
  () =>
    import("@/components/tracker/route-map-client").then(
      (mod) => mod.RouteMapClient
    ),
  {
    ssr: false,
    loading: () => (
      <div className="tracker-skeleton flex h-80 w-full items-center justify-center border border-border/60 text-sm text-muted">
        Карта загружается...
      </div>
    ),
  }
);

export type { RoutePoint };

export function RouteMap({
  points,
  focusPointId,
}: {
  points: RoutePoint[];
  focusPointId?: string | null;
}) {
  return <RouteMapClient points={points} focusPointId={focusPointId} />;
}
