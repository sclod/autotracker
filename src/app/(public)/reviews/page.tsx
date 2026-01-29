import { PageHero } from "@/components/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviews } from "@/lib/placeholder-data";

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        title="Отзывы"
        subtitle="Плейсхолдеры отзывов. Реальные кейсы можно заменить в любое время."
      />
      <section className="container mx-auto grid gap-6 px-6 md:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.name} className="bg-card/80">
            <CardHeader>
              <CardTitle>{review.name}</CardTitle>
              <p className="text-xs text-muted">{review.location}</p>
            </CardHeader>
            <CardContent className="text-sm text-muted">{review.text}</CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
