export const siteConfig = {
  brand: {
    name: "AUTO",
    accent: "TRACKER",
  },
  tagline: "Импорт автомобилей под ключ по России",
  locationShort: "Москва · работаем по РФ",
  contacts: {
    phone: "+7 (900) 555-12-34",
    email: "hello@autotracker.ru",
    address: "Москва, Пресненская наб., 12",
    hours: "Ежедневно 10:00-20:00",
  },
  socials: {
    telegram: "https://t.me/importauto_ru",
    whatsapp: "https://wa.me/79005551234",
    vk: "https://vk.com/autotracker",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mskmkad-auto.ru",
};

export const sitePlaceholders = {
  phone: "Телефон уточняется",
  email: "hello@example.com",
  address: "Адрес уточняется",
  hours: "График уточняется",
  locationShort: "Локация уточняется",
};

export function withFallback(value: string | undefined, fallback: string) {
  return value && value.trim() ? value : fallback;
}
