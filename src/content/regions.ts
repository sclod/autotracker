export type RegionKey = "usa" | "eu" | "china";

export type RegionModel = {
  name: string;
  priceFrom?: string;
  note?: string;
  badge?: string;
  image?: string;
};

export type RegionMapPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type RegionMapArc = {
  from: [number, number];
  to: [number, number];
};

export type RegionContent = {
  key: RegionKey;
  title: string;
  titleGenitive: string;
  bullets: string[];
  map: {
    highlight: { x: number; y: number; w: number; h: number };
    points: RegionMapPoint[];
    arcs: RegionMapArc[];
  };
  models: RegionModel[];
};

export const regions: RegionContent[] = [
  {
    key: "usa",
    title: "США",
    titleGenitive: "США",
    bullets: [
      "Широкий выбор комплектаций и редких моделей.",
      "Прозрачная история через отчеты и аукционы.",
      "Выгодные цены на популярные SUV и седаны.",
    ],
    map: {
      highlight: { x: 140, y: 150, w: 220, h: 150 },
      points: [
        { id: "la", label: "Лос-Анджелес", x: 190, y: 230 },
        { id: "ny", label: "Нью-Йорк", x: 310, y: 210 },
        { id: "msk", label: "Москва", x: 700, y: 210 },
      ],
      arcs: [
        { from: [190, 230], to: [700, 210] },
        { from: [310, 210], to: [700, 210] },
      ],
    },
    models: [
      { name: "Ford F-150", priceFrom: "от 4,8 млн ₽", badge: "SUV", image: "/models/model-02.webp" },
      { name: "Jeep Grand Cherokee", priceFrom: "от 5,4 млн ₽", image: "/models/default-car.webp" },
      { name: "Tesla Model Y", priceFrom: "от 6,9 млн ₽", badge: "EV", image: "/models/model-03.webp" },
      { name: "Chevrolet Tahoe", priceFrom: "от 7,6 млн ₽", image: "/models/model-02.webp" },
    ],
  },
  {
    key: "eu",
    title: "Европа",
    titleGenitive: "Европы",
    bullets: [
      "Богатые комплектации и история обслуживания.",
      "Низкие пробеги и аккуратная эксплуатация.",
      "Широкий выбор премиальных брендов.",
    ],
    map: {
      highlight: { x: 520, y: 170, w: 160, h: 120 },
      points: [
        { id: "de", label: "Германия", x: 560, y: 220 },
        { id: "pl", label: "Польша", x: 600, y: 230 },
        { id: "msk", label: "Москва", x: 700, y: 210 },
      ],
      arcs: [{ from: [560, 220], to: [700, 210] }],
    },
    models: [
      { name: "BMW X5", priceFrom: "от 6,2 млн ₽", image: "/models/model-03.webp" },
      { name: "Mercedes-Benz E-Class", priceFrom: "от 5,7 млн ₽", image: "/models/default-car.webp" },
      { name: "Audi Q7", priceFrom: "от 6,4 млн ₽", image: "/models/model-02.webp" },
      { name: "Porsche Cayenne", priceFrom: "от 9,9 млн ₽", badge: "Premium", image: "/models/model-03.webp" },
    ],
  },
  {
    key: "china",
    title: "Китай",
    titleGenitive: "Китая",
    bullets: [
      "Новые модели с современными опциями.",
      "Быстрое обновление ассортимента.",
      "Выгодные цены на электромобили.",
    ],
    map: {
      highlight: { x: 760, y: 230, w: 160, h: 110 },
      points: [
        { id: "sh", label: "Шанхай", x: 800, y: 270 },
        { id: "bj", label: "Пекин", x: 820, y: 240 },
        { id: "msk", label: "Москва", x: 700, y: 210 },
      ],
      arcs: [{ from: [800, 270], to: [700, 210] }],
    },
    models: [
      { name: "Geely Monjaro", priceFrom: "от 3,4 млн ₽", image: "/models/default-car.webp" },
      { name: "Zeekr 001", priceFrom: "от 5,8 млн ₽", badge: "EV", image: "/models/model-03.webp" },
      { name: "Li Auto L7", priceFrom: "от 6,2 млн ₽", image: "/models/model-02.webp" },
      { name: "Chery Tiggo 8 Pro", priceFrom: "от 2,9 млн ₽", image: "/models/default-car.webp" },
    ],
  },
];

export const regionsByKey = regions.reduce<Record<RegionKey, RegionContent>>(
  (acc, region) => {
    acc[region.key] = region;
    return acc;
  },
  {} as Record<RegionKey, RegionContent>
);
