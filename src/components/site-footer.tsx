import Image from "next/image";
import Link from "next/link";
import { siteConfig, sitePlaceholders, withFallback } from "@/config/site";

const footerLinks = [
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
  const telegramLink = siteConfig.socials.telegram;

  return (
    <footer className="border-t border-border/60 bg-card-muted">
      <div className="container mx-auto grid gap-8 px-6 py-12 lg:grid-cols-[2fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="text-lg font-semibold tracking-[0.2em]">
            {siteConfig.brand.name}
            <span className="text-accent">{siteConfig.brand.accent}</span>
          </div>
          <p className="text-sm text-muted">
            Доставка автомобилей под ключ. Прозрачный трекер, фиксируем условия и сроки.
          </p>
          <div className="text-sm text-muted">
            {withFallback(siteConfig.contacts.address, sitePlaceholders.address)} ·{" "}
            {withFallback(siteConfig.contacts.hours, sitePlaceholders.hours)}
          </div>
        </div>
        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">{section.title}</div>
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
          {telegramLink ? (
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-2 text-sm text-foreground transition hover:border-accent hover:bg-card"
            >
              <Image src="/telegram.png" alt="Telegram" width={16} height={16} />
              <span>Наш Telegram</span>
            </a>
          ) : null}
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
