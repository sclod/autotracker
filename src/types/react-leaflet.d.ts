declare module "react-leaflet" {
  import * as React from "react";
  type LeafletProps = Record<string, unknown>;
  export const MapContainer: React.ComponentType<LeafletProps>;
  export const TileLayer: React.ComponentType<LeafletProps>;
  export const Marker: React.ComponentType<LeafletProps>;
  export const Popup: React.ComponentType<LeafletProps>;
  export const Polyline: React.ComponentType<LeafletProps>;
  export function useMap(): any;
}
