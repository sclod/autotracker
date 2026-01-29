export type RegionKey = "eu" | "cn" | "kr";

export type Make = {
  title: string;
  slug: string;
  image: string;
};

export const REGION_LABELS: Record<RegionKey, string> = {
  eu: "Европа",
  cn: "Китай",
  kr: "Корея",
};

export const MAKES: Record<RegionKey, Make[]> = {
  eu: [
    { title: "BMW", slug: "bmw", image: "/makes/bmw.svg" },
    { title: "Mercedes-Benz", slug: "mercedes_benz", image: "/makes/mercedes_benz.png" },
    { title: "Volkswagen", slug: "volkswagen", image: "/makes/volkswagen.png" },
    { title: "Porsche", slug: "porsche", image: "/makes/porsche.png" },
    { title: "Audi", slug: "audi", image: "/makes/audi.png" },
    { title: "Honda", slug: "honda", image: "/makes/honda.png" },
    { title: "Ford", slug: "ford", image: "/makes/ford.png" },
    { title: "Ferrari", slug: "ferrari", image: "/makes/ferrari.png" },
    { title: "Lamborghini", slug: "lamborghini", image: "/makes/lamborghini.png" },
    { title: "Volvo", slug: "volvo", image: "/makes/volvo.png" },
    { title: "Nissan", slug: "nissan", image: "/makes/nissan.png" },
    { title: "Jeep", slug: "jeep", image: "/makes/jeep.png" },
    { title: "Citroen", slug: "citroen", image: "/makes/citroen.png" },
    { title: "Lexus", slug: "lexus", image: "/makes/lexus.svg" },
    { title: "Zeekr", slug: "zeekr", image: "/makes/zeekr.png" },
    { title: "Maserati", slug: "maserati", image: "/makes/maserati.png" },
    { title: "Mazda", slug: "mazda", image: "/makes/mazda.png" },
    { title: "Land Rover", slug: "land_rover", image: "/makes/land_rover.png" },
    { title: "MINI", slug: "mini", image: "/makes/mini.png" },
    { title: "Bentley", slug: "bentley", image: "/makes/bentley.png" },
    { title: "Tesla", slug: "tesla", image: "/makes/tesla.png" },
    { title: "Rolls-Royce", slug: "rolls_royce", image: "/makes/rolls_royce.png" },
    { title: "Seres", slug: "seres", image: "/makes/seres.png" },
    { title: "Skoda", slug: "skoda", image: "/makes/skoda.png" },
    { title: "Brabus", slug: "brabus", image: "/makes/brabus.svg" },
  ],
  cn: [
    { title: "Zeekr", slug: "zeekr", image: "/makes/zeekr.png" },
    { title: "Geely", slug: "geely", image: "/makes/geely.svg" },
    { title: "Li Auto", slug: "li_auto", image: "/makes/lixiang.svg" },
    { title: "Xpeng", slug: "xpeng", image: "/makes/xpeng.png" },
    { title: "Seres", slug: "seres", image: "/makes/seres.png" },
    { title: "BMW", slug: "bmw", image: "/makes/bmw.svg" },
    { title: "Tesla", slug: "tesla", image: "/makes/tesla.png" },
    { title: "Volkswagen", slug: "volkswagen", image: "/makes/volkswagen.png" },
  ],
  kr: [
    { title: "Hyundai", slug: "hyundai", image: "/makes/hyundai.svg" },
    { title: "Kia", slug: "kia", image: "/makes/kia.svg" },
    { title: "Genesis", slug: "genesis", image: "/makes/genesis.svg" },
    { title: "SsangYong", slug: "ssangyong", image: "/makes/ssangyong.svg" },
  ],
};
