import {
  BadgeCheck,
  BadgeDollarSign,
  Car,
  Fuel,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const reasons = [
  {
    title: "Богатые комплектации",
    text: "Много опций и улучшений по сравнению с локальным рынком.",
    icon: Sparkles,
  },
  {
    title: "Прозрачная история",
    text: "Отчёты, сервисная история и проверка состояния.",
    icon: ShieldCheck,
  },
  {
    title: "Низкий пробег",
    text: "Более бережная эксплуатация и хорошие дороги.",
    icon: Car,
  },
  {
    title: "Выгодная цена",
    text: "Оптимальная стоимость с учётом доставки и пошлин.",
    icon: BadgeDollarSign,
  },
  {
    title: "Широкий выбор",
    text: "Доступ к редким моделям и нужным опциям.",
    icon: BadgeCheck,
  },
  {
    title: "Экономичность",
    text: "Часто ниже расход и лучше показатели.",
    icon: Fuel,
  },
];

export function WhyImport() {
  return (
    <section className="bg-[#f7f5ef] text-slate-900">
      <div className="container mx-auto px-6 py-16">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Почему авто из-за рубежа
          </div>
          <h2 className="text-3xl font-semibold">Преимущества импорта</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
              >
                <Icon className="h-6 w-6 text-accent" />
                <span className="mt-4 block h-px w-10 bg-slate-200" />
                <div className="mt-4 text-lg font-semibold text-slate-900">
                  {item.title}
                </div>
                <p className="mt-3 text-sm text-slate-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
