import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const hasError = error === "1";

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md bg-card/90">
        <CardHeader>
          <CardTitle>Вход в админку</CardTitle>
          {hasError && (
            <p className="text-sm text-amber-200">
              Неверный пароль. Попробуйте ещё раз.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form action="/api/admin/login" method="post" className="space-y-4">
            <Input
              type="password"
              name="password"
              placeholder="Пароль администратора"
              required
            />
            <Button variant="accent" type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
