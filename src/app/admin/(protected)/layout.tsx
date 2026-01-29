import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-card-muted">
        <div className="container mx-auto flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold tracking-[0.2em]">
            ADMIN<span className="text-accent">TRACKER</span>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/admin/orders" className="text-muted hover:text-foreground">
              Заказы
            </Link>
            <Link href="/admin/leads" className="text-muted hover:text-foreground">
              Лиды
            </Link>
            <Link
              href="/admin/orders/new"
              className={cn(buttonVariants({ variant: "subtle", size: "sm" }))}
            >
              Новый заказ
            </Link>
            <Link
              href="/api/admin/logout"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Выйти
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex flex-col gap-8 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
