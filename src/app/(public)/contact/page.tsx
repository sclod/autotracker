import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig, sitePlaceholders, withFallback } from "@/config/site";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Контакты"
        subtitle="Оставьте заявку — подберём авто и подготовим расчёт стоимости доставки."
      />
      <section className="container mx-auto grid gap-10 px-6 md:grid-cols-[1.3fr_1fr]">
        <form className="space-y-6 rounded-3xl border border-border/60 bg-card/80 p-8">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" placeholder="Иван" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" placeholder="+7 (999) 000-00-00" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="request">Запрос</Label>
            <Textarea id="request" placeholder="Марка, бюджет, страна доставки" />
          </div>
          <Button variant="accent" type="button">
            Отправить заявку
          </Button>
        </form>
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-muted">Офис</div>
            <div className="mt-3 text-lg font-semibold">
              {withFallback(siteConfig.contacts.address, sitePlaceholders.address)}
            </div>
            <div className="text-sm text-muted">
              {withFallback(siteConfig.contacts.hours, sitePlaceholders.hours)}
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-muted">Связаться</div>
            <div className="mt-3 text-sm text-muted">
              {withFallback(siteConfig.contacts.phone, sitePlaceholders.phone)}
            </div>
            <div className="text-sm text-muted">
              {withFallback(siteConfig.contacts.email, sitePlaceholders.email)}
            </div>
            <div className="text-sm text-muted">
              {Object.values(siteConfig.socials).some(Boolean)
                ? Object.entries(siteConfig.socials)
                    .filter(([, value]) => value)
                    .map(([key]) => key[0].toUpperCase() + key.slice(1))
                    .join(" · ")
                : "Соцсети уточняются"}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
