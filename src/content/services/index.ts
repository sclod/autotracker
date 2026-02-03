import type { ServiceContent } from "./types";
import logistics from "./logistics";
import customs from "./customs";
import auction from "./auction";

export const services: ServiceContent[] = [
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
