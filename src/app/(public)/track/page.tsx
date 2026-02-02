import Link from "next/link";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Отследить заказ — AutoTracker",
  description:
    "Портал отслеживания заказа: этапы, карта маршрута, чат и файлы.",
  alternates: { canonical: `${siteConfig.url}/track` },
  openGraph: {
    title: "Отследить заказ — AutoTracker",
    description:
      "Портал отслеживания заказа: этапы, карта маршрута, чат и файлы.",
    url: `${siteConfig.url}/track`,
    type: "website",
    images: [
      {
        url: "/og/og-cover-v2.jpg",
        width: 1200,
        height: 630,
        alt: "AutoTracker — трекинг заказа",
      },
    ],
  },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ trackingNumber?: string; error?: string }>;
}) {
  const { trackingNumber: rawTracking, error } = await searchParams;
  const trackingNumber = rawTracking?.trim().toUpperCase();
  const demoAllowed = process.env.SEED_DEMO === "true";
  const example = demoAllowed ? "123456" : "X7D4K9P2QZ";
  const inputPattern = demoAllowed
    ? "([0-9]{6}|[A-Za-z0-9]{10,12})"
    : "[A-Za-z0-9]{10,12}";
  const placeholder = `Например, ${example}`;
  const inputTitle = demoAllowed
    ? "Номер заказа: 6 цифр (демо) или 10-12 символов A-Z/0-9"
    : "Номер заказа: 10-12 символов A-Z/0-9";

  if (trackingNumber) {
    redirect(`/track/${encodeURIComponent(trackingNumber)}`);
  }

  const contactHref =
    siteConfig.socials.whatsapp || siteConfig.socials.telegram || "/contact";

  return (
    <>
      <section className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card-muted p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(90,100,120,0.25),_transparent_55%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-6">
              <div className="text-xs uppercase tracking-[0.4em] text-muted">
                Трекинг заказа
              </div>
              <h1 className="text-4xl font-semibold md:text-5xl">
                Отследите заказ по номеру
              </h1>
              <p className="text-muted">
                Смотрите статус, этапы, карту маршрута и историю общения с менеджером.
              </p>

              <form className="space-y-4" method="get">
                <Input
                  name="trackingNumber"
                  placeholder={placeholder}
                  required
                  pattern={inputPattern}
                  title={inputTitle}
                  className="h-12 text-base"
                />
                <div className="flex flex-wrap gap-3">
                  <Button variant="accent" type="submit">
                    Найти заказ
                  </Button>
                  <Link
                    href={contactHref}
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    Написать менеджеру
                  </Link>
                </div>
              </form>

              <div className="rounded-2xl border border-border/60 bg-card/70 p-4 text-sm text-muted">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">
                  Где найти номер заказа
                </div>
                <p className="mt-2">
                  Номер указан в договоре или в сообщении менеджера. Если не нашли — напишите нам.
                </p>
                <div className="mt-3 text-xs text-muted">
                  Пример номера: <span className="font-semibold text-foreground">{example}</span>
                </div>
              </div>

              {(error === "not_found" || error === "invalid") && (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-100">
                  <div className="font-semibold">
                    {error === "invalid"
                      ? "Неверный номер заказа"
                      : "Заказ не найден"}
                  </div>
                  <p className="mt-2 text-rose-100/80">
                    {error === "invalid"
                      ? "Проверьте формат номера и попробуйте ещё раз."
                      : "Проверьте номер или свяжитесь с менеджером."}
                  </p>
                  <Link
                    href={contactHref}
                    className={cn(
                      buttonVariants({ variant: "accent", size: "sm" }),
                      "mt-3"
                    )}
                  >
                    Связаться
                  </Link>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Статус и этапы",
                  text: "Показываем все шаги доставки и текущий статус.",
                },
                {
                  title: "Карта маршрута",
                  text: "Видите, где находится автомобиль.",
                },
                {
                  title: "Файлы и отчёты",
                  text: "Документы, фото и отчёты по заказу.",
                },
                {
                  title: "Чат с менеджером",
                  text: "Задавайте вопросы прямо в трекере.",
                },
              ].map((item) => (
                <Card key={item.title} className="bg-card/80">
                  <CardContent className="space-y-2 p-5">
                    <div className="text-sm font-semibold text-foreground">
                      {item.title}
                    </div>
                    <p className="text-xs text-muted">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
