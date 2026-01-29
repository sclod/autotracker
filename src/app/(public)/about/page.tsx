import { PageHero } from "@/components/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="О компании"
        subtitle="Мы сопровождаем премиальные авто от выбора лота до передачи ключей, сохраняя прозрачность на каждом этапе."
      />
      <section className="container mx-auto grid gap-6 px-6 md:grid-cols-3">
        {[
          {
            title: "12 лет на рынке",
            text: "Команда с экспертизой в подборе, логистике и оформлении импортных авто.",
          },
          {
            title: "24/7 сопровождение",
            text: "Единое окно коммуникации и контроль сроков для каждого клиента.",
          },
          {
            title: "Прозрачные этапы",
            text: "Собственный трекер заказа с доступом по номеру и ключевым статусам.",
          },
        ].map((item) => (
          <Card key={item.title} className="bg-card/80">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted">{item.text}</CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
