export type RegionKey = "usa" | "eu" | "china";

export type Make = {
  title: string;
  slug: string;
  image: string;
};

export const REGION_LABELS: Record<RegionKey, string> = {
  usa: "США",
  eu: "Европа",
  china: "Китай",
};

export const REGION_FROM_LABELS: Record<RegionKey, string> = {
  usa: "США",
  eu: "Европы",
  china: "Китая",
};

export const MAKES: Record<RegionKey, Make[]> = {
  usa: [
    { title: "BMW", slug: "bmw", image: "/makes/bmw.svg" },
    { title: "Volkswagen", slug: "volkswagen", image: "/makes/volkswagen.png" },
    { title: "Hyundai", slug: "hyundai", image: "/makes/hyundai.svg" },
    { title: "Tesla", slug: "tesla", image: "/makes/tesla.png" },
    { title: "Jeep", slug: "jeep", image: "/makes/jeep.png" },
    { title: "Ford", slug: "ford", image: "/makes/ford.png" },
    { title: "Honda", slug: "honda", image: "/makes/honda.png" },
    { title: "Nissan", slug: "nissan", image: "/makes/nissan.png" },
  ],
  eu: [
    { title: "BMW", slug: "bmw", image: "/makes/bmw.svg" },
    { title: "Mercedes-Benz", slug: "mercedes_benz", image: "/makes/mercedes_benz.png" },
    { title: "Volkswagen", slug: "volkswagen", image: "/makes/volkswagen.png" },
    { title: "Porsche", slug: "porsche", image: "/makes/porsche.png" },
    { title: "Audi", slug: "audi", image: "/makes/audi.png" },
    { title: "Ferrari", slug: "ferrari", image: "/makes/ferrari.png" },
    { title: "Lamborghini", slug: "lamborghini", image: "/makes/lamborghini.png" },
    { title: "Volvo", slug: "volvo", image: "/makes/volvo.png" },
    { title: "Land Rover", slug: "land_rover", image: "/makes/land_rover.png" },
    { title: "Bentley", slug: "bentley", image: "/makes/bentley.png" },
    { title: "Tesla", slug: "tesla", image: "/makes/tesla.png" },
    { title: "MINI", slug: "mini", image: "/makes/mini.png" },
  ],
  china: [
    { title: "Zeekr", slug: "zeekr", image: "/makes/zeekr.png" },
    { title: "Geely", slug: "geely", image: "/makes/geely.svg" },
    { title: "Li Auto", slug: "li_auto", image: "/makes/lixiang.svg" },
    { title: "Xpeng", slug: "xpeng", image: "/makes/xpeng.png" },
    { title: "Seres", slug: "seres", image: "/makes/seres.png" },
    { title: "Tesla", slug: "tesla", image: "/makes/tesla.png" },
    { title: "Volkswagen", slug: "volkswagen", image: "/makes/volkswagen.png" },
    { title: "BMW", slug: "bmw", image: "/makes/bmw.svg" },
  ],
};

export const FLAT_MAKES: Make[] = [
  { title: "BMW", slug: "bmw", image: "/makes/bmw.svg" },
  { title: "Mercedes-Benz", slug: "mercedes_benz", image: "/makes/mercedes_benz.png" },
  { title: "Audi", slug: "audi", image: "/makes/audi.png" },
  { title: "Volkswagen", slug: "volkswagen", image: "/makes/volkswagen.png" },
  { title: "Porsche", slug: "porsche", image: "/makes/porsche.png" },
  { title: "Tesla", slug: "tesla", image: "/makes/tesla.png" },
  { title: "Lamborghini", slug: "lamborghini", image: "/makes/lamborghini.png" },
  { title: "Ferrari", slug: "ferrari", image: "/makes/ferrari.png" },
  { title: "Land Rover", slug: "land_rover", image: "/makes/land_rover.png" },
  { title: "Volvo", slug: "volvo", image: "/makes/volvo.png" },
  { title: "Hyundai", slug: "hyundai", image: "/makes/hyundai.svg" },
  { title: "Kia", slug: "kia", image: "/makes/kia.png" },
  { title: "Genesis", slug: "genesis", image: "/makes/genesis.png" },
  { title: "SsangYong", slug: "ssangyong", image: "/makes/ssangyong.svg" },
  { title: "Geely", slug: "geely", image: "/makes/geely.svg" },
  { title: "Zeekr", slug: "zeekr", image: "/makes/zeekr.png" },
  { title: "Li Auto", slug: "li_auto", image: "/makes/lixiang.svg" },
  { title: "Xpeng", slug: "xpeng", image: "/makes/xpeng.png" },
  { title: "Seres", slug: "seres", image: "/makes/seres.png" },
];
