"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";

export type RoutePoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: "checkpoint" | "current" | "start" | "end";
  timestamp?: string;
};

function FitBounds({ points }: { points: RoutePoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 7 });
  }, [map, points]);

  return null;
}

function FocusPoint({
  points,
  focusPointId,
}: {
  points: RoutePoint[];
  focusPointId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusPointId) return;
    const point = points.find((item) => item.id === focusPointId);
    if (!point) return;
    map.flyTo([point.lat, point.lng], 7, { duration: 0.6 });
  }, [focusPointId, map, points]);

  return null;
}

export function RouteMapClient({
  points,
  focusPointId,
}: {
  points: RoutePoint[];
  focusPointId?: string | null;
}) {
  const center = useMemo(() => {
    const current = points.find((point) => point.type === "current");
    if (current) return [current.lat, current.lng] as [number, number];
    const first = points[0];
    return first
      ? ([first.lat, first.lng] as [number, number])
      : ([55.751244, 37.618423] as [number, number]);
  }, [points]);

  const markerIcon = useMemo(() => {
    const icon = (color: string, size = 10) =>
      L.divIcon({
        className: "",
        html: `<div style='width:${size}px;height:${size}px;border-radius:999px;background:${color};'></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    const current = L.divIcon({
      className: "",
      html:
        "<div style='width:16px;height:16px;border-radius:999px;background:#d8b56a;box-shadow:0 0 0 6px rgba(216,181,106,0.2);'></div>",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    return {
      checkpoint: icon("#9aa4b2"),
      start: icon("#56c2a1", 12),
      end: icon("#5ea7ff", 12),
      current,
    };
  }, []);

  if (points.length < 2) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-2xl border border-border/60 bg-card/60 text-sm text-muted">
        Маршрут ещё не задан.
      </div>
    );
  }

  const polyline = points.map((point) => [point.lat, point.lng]) as [number, number][];

  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom={false}
      className="h-80 w-full overflow-hidden rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      <FocusPoint points={points} focusPointId={focusPointId} />
      <Polyline positions={polyline} pathOptions={{ color: "#4cc3ff", weight: 3 }} />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={markerIcon[point.type]}
        >
          <Popup>
            <div className="text-xs">
              <div className="font-semibold">{point.label}</div>
              {point.timestamp && <div>Дата: {point.timestamp}</div>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}