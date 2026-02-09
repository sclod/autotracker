export type CompanyStat = {
  value: string;
  label: string;
  sub?: string;
};

export type CompanyTimelineItem = {
  year: string;
  title: string;
  desc: string;
};

export type CompanyCulture = {
  mission: {
    title: string;
    desc: string;
    image: string;
  };
  values: {
    title: string;
    desc: string;
    image: string;
  };
  team: {
    image: string;
    caption: string;
  };
};

export const companyContent: {
  stats: CompanyStat[];
  timeline: CompanyTimelineItem[];
  culture: CompanyCulture;
} = {
  stats: [
    { value: "12+", label: "лет на рынке", sub: "с 2013 года" },
    { value: "1000+", label: "авто доставлено", sub: "по РФ и СНГ" },
    { value: "3", label: "ключевых региона", sub: "США · Европа · Китай" },
    { value: "24/7", label: "связь с менеджером", sub: "персональный куратор" },
  ],
  timeline: [
    {
      year: "2019",
      title: "Первые поставки из Европы",
      desc: "Запустили подбор и доставку авто под ключ с прозрачными этапами.",
    },
    {
      year: "2020",
      title: "Собственная логистика",
      desc: "Расширили маршруты и сократили сроки доставки.",
    },
    {
      year: "2021",
      title: "Трекинг заказов",
      desc: "Внедрили трекер с этапами, картой и статусами.",
    },
    {
      year: "2022",
      title: "Рост команды",
      desc: "Сформировали отделы подбора, логистики и сервиса.",
    },
    {
      year: "2023",
      title: "Расширение географии",
      desc: "Добавили поставки из США и Китая.",
    },
    {
      year: "2024",
      title: "Premium-сервис",
      desc: "Обновили клиентский опыт и усилили контроль качества.",
    },
  ],
  culture: {
    mission: {
      title: "Миссия",
      desc: "Делать импорт автомобилей максимально прозрачным и предсказуемым для клиента.",
      image: "/about/mission.jpg",
    },
    values: {
      title: "Ценности",
      desc: "Честность, скорость и контроль качества на каждом этапе сделки.",
      image: "/about/values.jpg",
    },
    team: {
      image: "/about/team.jpg",
      caption: "Команда, которая ведет клиента от подбора до передачи ключей.",
    },
  },
};
