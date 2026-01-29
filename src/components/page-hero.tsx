import type { ReactNode } from "react";

export function PageHero({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border/60 bg-card-muted">
      <div className="container mx-auto flex flex-col gap-6 px-6 py-16">
        <div className="text-xs uppercase tracking-[0.4em] text-muted">AutoTracker</div>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-lg text-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
