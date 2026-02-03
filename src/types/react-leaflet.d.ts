declare module "react-leaflet" {
  import * as React from "react";
  type Props = Record<string, unknown>;
  export const MapContainer: React.ComponentType<Props>;
  export const TileLayer: React.ComponentType<Props>;
  export const Marker: React.ComponentType<Props>;
  export const Popup: React.ComponentType<Props>;
  export const Polyline: React.ComponentType<Props>;
  export function useMap(): unknown;
}
