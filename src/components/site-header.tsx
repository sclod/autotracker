"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const navItems = [
  { href: "/contact", label: "Контакты" },
  { href: "/track", label: "Трекер" },
  { href: "/about", label: "О компании" },
];

export function SiteHeader({ className }: { className?: string }) {
  const telegramLink = siteConfig.socials.telegram;
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < 20) {
        setHidden(false);
      } else if (delta > 6 && y > 80) {
        setHidden(true);
        setOpen(false);
      } else if (delta < -6) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "border-b border-border/60 bg-background/80 backdrop-blur transition-transform duration-200",
        hidden ? "-translate-y-full md:translate-y-0" : "translate-y-0",
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
          <div className="flex items-center gap-2">
            {telegramLink ? (
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card/60 transition hover:border-accent hover:bg-card"
              >
                <Image src="/telegram.png" alt="Telegram" width={18} height={18} />
              </a>
            ) : null}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground transition hover:bg-card md:hidden"
              aria-label="Открыть меню"
              onClick={() => setOpen((prev) => !prev)}
            >
              <span className="relative block h-3 w-4">
                <span className="absolute left-0 top-0 h-0.5 w-full bg-current" />
                <span className="absolute left-0 top-1.5 h-0.5 w-full bg-current" />
                <span className="absolute left-0 top-3 h-0.5 w-full bg-current" />
              </span>
            </button>
          </div>
        </div>

        <nav className="hidden w-full flex-wrap items-center gap-3 text-sm text-muted md:flex md:w-auto md:justify-center">
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
      </div>

      {open && (
        <div className="md:hidden">
          <div className="container mx-auto px-6 pb-4">
            <div className="rounded-2xl border border-border/60 bg-card/90 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm text-foreground hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
                {telegramLink ? (
                  <a
                    href={telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-white/10"
                  >
                    <Image src="/telegram.png" alt="Telegram" width={16} height={16} />
                    Telegram канал
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
