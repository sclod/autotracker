"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  convertLeadAction,
  type ConvertLeadState,
} from "@/app/admin/(protected)/leads/actions";
import { CopyTrackingLink } from "@/components/admin/copy-tracking-link";
import { CopyValueButton } from "@/components/admin/copy-value-button";

const regionOptions = [
  { value: "??????", label: "??????" },
  { value: "?????", label: "?????" },
  { value: "?????", label: "?????" },
  { value: "??????", label: "??????" },
];

const initialState: ConvertLeadState = { ok: false };

export function LeadConvertModal({
  leadId,
  defaultSummary,
}: {
  leadId: string;
  defaultSummary?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(convertLeadAction, initialState);

  return (
    <>
      <Button variant="accent" size="sm" type="button" onClick={() => setOpen(true)}>
        ??????????????
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-card/95 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-foreground">
                ??????????? ???? ? ?????
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-foreground"
              >
                ?
              </button>
            </div>

            {state.ok ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                  <div className="font-semibold">????? ??????</div>
                  <p className="mt-1 text-emerald-100/80">
                    ????????? ??????? ?????? ? ??? ??????? ??? ???? ? ??????.
                  </p>
                </div>
                <div className="space-y-3">
                  {state.orderId && (
                    <Link
                      href={`/admin/orders/${state.orderId}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm text-foreground hover:border-accent/60"
                    >
                      ??????? ?????
                    </Link>
                  )}
                  {state.trackingNumber && (
                    <CopyTrackingLink trackingNumber={state.trackingNumber} />
                  )}
                  {state.accessCode && (
                    <CopyValueButton
                      value={state.accessCode}
                      label="??????????? ???"
                      copiedLabel="??? ??????????"
                    />
                  )}
                </div>
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                  ???????
                </Button>
              </div>
            ) : (
              <form action={formAction} className="mt-5 space-y-4">
                <input type="hidden" name="leadId" value={leadId} />
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted">
                      ??????
                    </label>
                    <select
                      name="region"
                      className="h-11 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground"
                    >
                      <option value="">?? ???????</option>
                      {regionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.2em] text-muted">
                      ?????
                    </label>
                    <Input name="make" placeholder="BMW, Mercedes-Benz, Geely..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted">
                    ??????? ????????
                  </label>
                  <Textarea
                    name="summary"
                    defaultValue={defaultSummary ?? ""}
                    placeholder="????????: BMW X5 2022, ??????"
                    className="min-h-[100px]"
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-muted">
                    ETA
                  </label>
                  <Input name="etaText" placeholder="10?14.02.2026" />
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                  <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                    ??????
                  </Button>
                  <Button variant="accent" type="submit">
                    ??????? ?????
                  </Button>
                </div>
                {state.message && (
                  <p className="text-xs text-amber-200">{state.message}</p>
                )}
                <p className="text-xs text-muted">
                  ????? ??????????? ???????? ?????? ??????????? ?????? ? ???? ???????.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
