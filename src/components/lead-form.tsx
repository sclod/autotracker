"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLeadAction } from "@/app/actions/leads";
import { leadInitialState } from "@/lib/lead-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { siteConfig, sitePlaceholders, withFallback } from "@/config/site";

function SubmitButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="accent"
      type="submit"
      className={cn("w-full", className)}
      disabled={pending}
    >
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
  variant = "default",
  sideImageSrc,
  sideImageAlt,
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
  variant?: "default" | "compact";
  sideImageSrc?: string;
  sideImageAlt?: string;
}) {
  const [state, formAction] = useActionState(
    createLeadAction,
    leadInitialState
  );
  const phone = withFallback(siteConfig.contacts.phone, sitePlaceholders.phone);
  const isCompact = variant === "compact";
  const inputClassName = isCompact ? "h-10" : undefined;
  const textareaClassName = isCompact ? "min-h-[80px]" : undefined;
  const buttonClassName = isCompact ? "h-10 text-xs" : undefined;

  return (
    <div
      className={cn("rounded-3xl border border-border/60 bg-card/80 p-6", className)}
    >
      <div
        className={cn(
          "flex flex-col gap-6",
          sideImageSrc && "md:grid md:grid-cols-2 md:items-stretch md:gap-8"
        )}
      >
        <div>
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
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
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
              className={inputClassName}
            />
            <Input
              name="phone"
              placeholder="Телефон"
              required
              maxLength={32}
              defaultValue={defaultValues?.phone ?? ""}
              className={inputClassName}
            />
            <Textarea
              name="message"
              placeholder="Сообщение"
              maxLength={1000}
              defaultValue={defaultValues?.message ?? ""}
              className={textareaClassName}
            />
            <SubmitButton label={buttonLabel} className={buttonClassName} />
            {state.message && !state.ok && (
              <p className="text-sm text-amber-200">{state.message}</p>
            )}
            {!state.ok && (
              <div className="text-xs text-muted">
                Если нужно срочно: {phone}
              </div>
            )}
          </form>
        </div>

        {sideImageSrc && (
          <div className="order-last md:order-none">
            <div className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl border border-border/60 bg-card/60 shadow-[0_18px_40px_rgba(0,0,0,0.25)] md:min-h-[360px]">
              <Image
                src={sideImageSrc}
                alt={sideImageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                quality={95}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
