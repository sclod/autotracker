import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig, sitePlaceholders, withFallback } from "@/config/site";

const navItems = [
  { href: "/about", label: "О компании" },
  { href: "/services", label: "Услуги" },
  { href: "/catalog", label: "Каталог" },
  { href: "/reviews", label: "Отзывы" },
  { href: "/blog", label: "Полезное" },
  { href: "/contact", label: "Контакты" },
  { href: "/track", label: "Трекер" },
];

export function SiteHeader({ className }: { className?: string }) {
  const phone = withFallback(siteConfig.contacts.phone, sitePlaceholders.phone);

  return (
    <header
      className={cn(
        "border-b border-border/60 bg-background/80 backdrop-blur",
        className
      )}
    >
      <div className="border-b border-border/60 bg-card-muted/60" />
      <div className="container mx-auto flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-[0.2em]">
            {siteConfig.brand.name}
            <span className="text-accent">{siteConfig.brand.accent}</span>
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "subtle", size: "sm" }))}
          >
            {phone}
          </Link>
        </div>
        <nav className="flex w-full flex-wrap items-center gap-3 text-sm text-muted lg:w-auto lg:justify-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-transparent px-3 py-1 transition hover:border-border hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/catalog"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Каталог
          </Link>
          <Link
            href="/contact"
            className={cn(buttonVariants({ variant: "accent" }))}
          >
            Получить подбор
          </Link>
        </div>
      </div>
    </header>
  );
}
