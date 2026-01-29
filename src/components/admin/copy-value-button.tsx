"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyValueButton({
  value,
  label,
  copiedLabel,
}: {
  value: string;
  label: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" type="button" onClick={handleCopy}>
      {copied ? copiedLabel ?? "Скопировано" : label}
    </Button>
  );
}
