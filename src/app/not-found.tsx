import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader className="fixed left-0 right-0 top-0 z-50" />
      <main className="pt-header pb-20">
        <section className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-8 md:p-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,230,0,0.18),_transparent_55%)]" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,230,0,0.2),_transparent_70%)] blur-2xl" />
            <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.4em] text-muted">
                  Навигация
                </div>
                <div className="text-[72px] font-semibold leading-none md:text-[96px]">
                  404
                </div>
                <h1 className="text-3xl font-semibold md:text-4xl">
                  Страница не найдена
                </h1>
                <p className="text-muted">
                  Проверьте ссылку или вернитесь на главную либо в трекер.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/" className={cn(buttonVariants({ variant: "accent" }))}>
                    На главную
                  </Link>
                  <Link
                    href="/track"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Трекинг
                  </Link>
                </div>
                <form
                  action="/track"
                  method="get"
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                >
                  <Input
                    name="trackingNumber"
                    placeholder="Введите номер заказа"
                    className="h-11"
                  />
                  <button
                    type="submit"
                    className={cn(buttonVariants({ variant: "outline" }), "h-11")}
                  >
                    Проверить
                  </button>
                </form>
              </div>

              <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-[0.3em] text-muted">
                    Быстрые ссылки
                  </div>
                  <div className="space-y-3 text-sm">
                    <Link href="/services" className="block text-foreground hover:text-accent">
                      Услуги
                    </Link>
                    <Link href="/contact" className="block text-foreground hover:text-accent">
                      Контакты
                    </Link>
                    <Link href="/track" className="block text-foreground hover:text-accent">
                      Отследить заказ
                    </Link>
                  </div>
                </div>
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-muted">
                  Если не нашли страницу — напишите менеджеру, мы поможем.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}