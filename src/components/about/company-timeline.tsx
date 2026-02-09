import { companyContent } from "@/content/company";
import { cn } from "@/lib/utils";

export function CompanyTimeline() {
  return (
    <section className="container mx-auto px-6">
      <div className="space-y-6">
        <div className="text-xs uppercase tracking-[0.4em] text-muted">История</div>
        <h2 className="text-3xl font-semibold">Ключевые этапы 2019–2024</h2>
      </div>

      <div className="mt-8 hidden md:block">
        <div className="relative">
          <span className="absolute left-0 right-0 top-[6px] h-px bg-border/80" />
          <div className="flex items-start gap-6">
            {companyContent.timeline.map((item) => (
              <div key={item.year} className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_20px_rgba(255,230,0,0.45)]" />
                  <div className="translate-y-[10px] text-2xl font-semibold text-foreground">
                    {item.year}
                  </div>
                </div>
                <div className="mt-3 text-sm font-semibold text-foreground">
                  {item.title}
                </div>
                <p className="mt-2 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6 md:hidden">
        {companyContent.timeline.map((item, index) => (
          <div key={item.year} className="relative pl-8">
            <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-accent shadow-[0_0_18px_rgba(255,230,0,0.45)]" />
            {index < companyContent.timeline.length - 1 && (
              <span className="absolute left-[5px] top-5 h-full w-px bg-border/70" />
            )}
            <div className={cn("translate-y-[10px] text-xl font-semibold text-foreground")}>
              {item.year}
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">{item.title}</div>
            <p className="mt-2 text-sm text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
