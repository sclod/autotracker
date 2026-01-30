"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLeadAction } from "@/app/actions/leads";
import { leadInitialState } from "@/lib/lead-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { siteConfig, sitePlaceholders, withFallback } from "@/config/site";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="accent" type="submit" className="w-full" disabled={pending}>
      {pending ? "Отправляем..." : label}
    </Button>
  );
}

export function LeadForm({
  title,
  description,
  source,
  buttonLabel = "Отправить заявку",
  className,
  defaultValues,
}: {
  title?: string;
  description?: string;
  source: string;
  buttonLabel?: string;
  className?: string;
  defaultValues?: {
    name?: string;
    phone?: string;
    message?: string;
  };
}) {
  const [state, formAction] = useActionState(
    createLeadAction,
    leadInitialState
  );
  const phone = withFallback(siteConfig.contacts.phone, sitePlaceholders.phone);

  return (
    <div className={cn("rounded-3xl border border-border/60 bg-card/80 p-6", className)}>
      {title && <div className="text-lg font-semibold">{title}</div>}
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      {state.ok && (
        <div className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          <div className="font-semibold">
            {state.message || "Заявка отправлена"}
          </div>
          <p className="mt-2 text-emerald-100/80">
            Ответим в течение 15–30 минут и пришлём варианты.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/catalog/usa"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Каталог
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
            >
              Контакты
            </Link>
          </div>
          <div className="mt-2 text-xs text-emerald-100/80">
            Если нужно срочно: {phone}
          </div>
        </div>
      )}
      <form key={state.resetKey} action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="source" value={source} />
        <Input
          name="name"
          placeholder="Имя"
          required
          maxLength={80}
          defaultValue={defaultValues?.name ?? ""}
        />
        <Input
          name="phone"
          placeholder="Телефон"
          required
          maxLength={32}
          defaultValue={defaultValues?.phone ?? ""}
        />
        <Textarea
          name="message"
          placeholder="Сообщение"
          maxLength={1000}
          defaultValue={defaultValues?.message ?? ""}
        />
        <SubmitButton label={buttonLabel} />
        {state.message && !state.ok && (
          <p className="text-sm text-amber-200">{state.message}</p>
        )}
      </form>
    </div>
  );
}
