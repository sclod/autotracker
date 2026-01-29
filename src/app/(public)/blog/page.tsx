import { PageHero } from "@/components/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogPosts } from "@/lib/placeholder-data";

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Блог и полезное"
        subtitle="Плейсхолдеры для статей, аналитики и гайдов по импортным авто."
      />
      <section className="container mx-auto grid gap-6 px-6 md:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="bg-card/80">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-xs text-muted">
                {post.date} · {post.readTime}
              </p>
            </CardHeader>
            <CardContent className="text-sm text-muted">{post.excerpt}</CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
