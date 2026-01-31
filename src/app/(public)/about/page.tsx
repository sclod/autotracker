import { PageHero } from "@/components/page-hero";
import { CompanyStats } from "@/components/about/company-stats";
import { CompanyTimeline } from "@/components/about/company-timeline";
import { CompanyCulture } from "@/components/about/company-culture";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="О компании"
        subtitle="Мы сопровождаем премиальные авто от выбора лота до передачи ключей, сохраняя прозрачность на каждом этапе."
      />
      <div className="space-y-16 pb-10">
        <CompanyStats />
        <CompanyTimeline />
        <CompanyCulture />
      </div>
    </>
  );
}
