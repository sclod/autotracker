import Image from "next/image";
import { companyContent } from "@/content/company";
import { cn } from "@/lib/utils";

export function CompanyCulture() {
  const { mission, values, team } = companyContent.culture;

  const cards = [
    { ...mission, accent: "Миссия" },
    { ...values, accent: "Ценности" },
  ];

  return (
    <section className="container mx-auto px-6">
      <div className="mb-8 space-y-3">
        <div className="text-xs uppercase tracking-[0.4em] text-muted">
          О компании
        </div>
        <h2 className="text-3xl font-semibold">Миссия, ценности и команда</h2>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="grid gap-6">
          {cards.map((card) => (
            <article
              key={card.title}
              className={cn(
                "relative overflow-hidden rounded-3xl border border-border/60 bg-card/80"
              )}
            >
              <div className="absolute inset-0">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover opacity-80"
                  sizes="(min-width: 1024px) 560px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
              </div>
              <div className="relative z-10 p-6">
                <div className="text-xs uppercase tracking-[0.4em] text-accent">
                  {card.accent}
                </div>
                <h3 className="mt-3 text-2xl font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-white/80">{card.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80">
          <Image
            src={team.image}
            alt="Команда"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 520px, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-sm text-white/80">{team.caption}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
