import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader className="fixed left-0 right-0 top-0 z-50" />
      <main className="flex flex-col gap-10 pb-20 pt-header md:gap-20">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
