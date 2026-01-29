"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyTrackingLink({ trackingNumber }: { trackingNumber: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/track/${trackingNumber}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" type="button" onClick={handleCopy}>
      {copied ? "Ссылка скопирована" : "Скопировать ссылку трекинга"}
    </Button>
  );
}
