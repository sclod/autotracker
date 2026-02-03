import type { ServiceContent } from "./types";

export const services: ServiceContent[] = [];

export const servicesBySlug = services.reduce<Record<string, ServiceContent>>(
  (acc, service) => {
    acc[service.slug] = service;
    return acc;
  },
  {}
);
