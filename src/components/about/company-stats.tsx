import { companyContent } from "@/content/company";

export function CompanyStats() {
  return (
    <section className="container mx-auto px-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#141922] via-[#1a1f2b] to-[#2a2b1a]">
        <div className="absolute inset-0 hidden md:block">
          <span className="absolute left-1/2 top-0 h-full w-px bg-white/10" />
          <span className="absolute top-1/2 left-0 h-px w-full bg-white/10" />
        </div>
        <div className="grid gap-px md:grid-cols-2">
          {companyContent.stats.map((stat) => (
            <div key={stat.label} className="card-glass p-6 md:p-8">
              <div className="text-4xl font-semibold text-white md:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-white/80">{stat.label}</div>
              {stat.sub && (
                <div className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
                  {stat.sub}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
