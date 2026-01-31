import type { ServiceContent } from "./types";
import selection from "./selection";
import logistics from "./logistics";
import customs from "./customs";
import auction from "./auction";
import usa from "./usa";
import eu from "./eu";
import china from "./china";

export const services: ServiceContent[] = [
  selection,
  logistics,
  customs,
  auction,
  usa,
  eu,
  china,
];

export const servicesBySlug = services.reduce<Record<string, ServiceContent>>(
  (acc, service) => {
    acc[service.slug] = service;
    return acc;
  },
  {}
);
