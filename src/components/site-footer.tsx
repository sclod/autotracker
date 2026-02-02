import Link from "next/link";
import { siteConfig, sitePlaceholders, withFallback } from "@/config/site";
import { services } from "@/content/services";

const serviceLinks = services.map((service) => ({
  href: `/services/${service.slug}`,
  label: service.title,
}));

const footerLinks = [
  {
    title: "Услуги",
    items: serviceLinks,
  },
  {
    title: "Навигация",
    items: [
      { href: "/", label: "Главная" },
      { href: "/track", label: "Трекинг" },
      { href: "/contact", label: "Контакты" },
    ],
  },
];

export function SiteFooter() {
  const socialsLabel = (() => {
    const entries = Object.entries(siteConfig.socials).filter(([, value]) => value);
    if (entries.length === 0) return "Соцсети уточняются";
    return entries
      .map(([key]) => key[0].toUpperCase() + key.slice(1))
      .join(" · ");
  })();

  return (
    <footer className="border-t border-border/60 bg-card-muted">
      <div className="container mx-auto grid gap-8 px-6 py-12 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="text-lg font-semibold tracking-[0.2em]">
            {siteConfig.brand.name}
            <span className="text-accent">{siteConfig.brand.accent}</span>
          </div>
          <p className="text-sm text-muted">
            Доставка автомобилей из США, Европы, Китая и Кореи. Прозрачный трекер,
            фиксируем условия и сроки.
          </p>
          <div className="text-sm text-muted">
            {withFallback(siteConfig.contacts.address, sitePlaceholders.address)} ·{" "}
            {withFallback(siteConfig.contacts.hours, sitePlaceholders.hours)}
          </div>
        </div>
        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">
              {section.title}
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {section.items.map((item) => (
                <Link key={item.label} href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-[0.2em] text-muted">Связаться</div>
          <div className="text-sm text-muted">
            {withFallback(siteConfig.contacts.phone, sitePlaceholders.phone)}
          </div>
          <div className="text-sm text-muted">
            {withFallback(siteConfig.contacts.email, sitePlaceholders.email)}
          </div>
          <div className="text-sm text-muted">{socialsLabel}</div>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container mx-auto flex flex-col gap-2 px-6 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <span>© 2026 AutoTracker. Все права защищены.</span>
          <span>Информация на сайте не является публичной офертой.</span>
        </div>
      </div>
    </footer>
  );
}