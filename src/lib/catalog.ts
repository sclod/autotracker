import type { Car, CarStatus } from "@/data/cars";

export type CatalogSort = "price-asc" | "price-desc" | "year-asc" | "year-desc";

export type CatalogFilters = {
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  status?: CarStatus;
  make?: string;
  sort?: CatalogSort;
};

export function parseNumber(value: string | undefined | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export function formatMileage(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} км`;
}

export function applyCatalogFilters(items: Car[], filters: CatalogFilters) {
  let result = items;
  if (filters.make) {
    result = result.filter((item) => item.makeSlug === filters.make);
  }
  if (filters.status) {
    result = result.filter((item) => item.status === filters.status);
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((item) => item.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((item) => item.price <= filters.maxPrice!);
  }
  if (filters.minYear !== undefined) {
    result = result.filter((item) => item.year >= filters.minYear!);
  }
  if (filters.maxYear !== undefined) {
    result = result.filter((item) => item.year <= filters.maxYear!);
  }

  return sortCatalogItems(result, filters.sort);
}

export function sortCatalogItems(items: Car[], sort?: CatalogSort) {
  const sorted = [...items];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "year-asc":
      return sorted.sort((a, b) => a.year - b.year);
    case "year-desc":
      return sorted.sort((a, b) => b.year - a.year);
    default:
      return sorted;
  }
}

export const statusOptions: { value: CarStatus; label: string }[] = [
  { value: "available", label: "В наличии" },
  { value: "in_transit", label: "В пути" },
];

export const sortOptions: { value: CatalogSort; label: string }[] = [
  { value: "price-desc", label: "Цена: по убыванию" },
  { value: "price-asc", label: "Цена: по возрастанию" },
  { value: "year-desc", label: "Год: новее" },
  { value: "year-asc", label: "Год: старше" },
];
