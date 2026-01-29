import type { ServiceContent } from "./types";
import selection from "./selection";
import logistics from "./logistics";
import customs from "./customs";
import auction from "./auction";

export const services: ServiceContent[] = [
  selection,
  logistics,
  customs,
  auction,
];

export const servicesBySlug = services.reduce<Record<string, ServiceContent>>(
  (acc, service) => {
    acc[service.slug] = service;
    return acc;
  },
  {}
);
