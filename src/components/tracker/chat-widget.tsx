"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  author: "client" | "admin";
  text: string;
  createdAt: string;
};

type ChatWidgetProps = {
  trackingNumber?: string;
  orderId?: string;
  requireCode?: boolean;
  isAdmin?: boolean;
  initialMessages?: ChatMessage[];
  accessCode?: string;
  onAccessCodeChange?: (value: string) => void;
  showAccessInput?: boolean;
};

export function ChatWidget({
  trackingNumber,
  orderId,
  requireCode = false,
  isAdmin = false,
  initialMessages = [],
  accessCode,
  onAccessCodeChange,
  showAccessInput = true,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const storageKey = trackingNumber ? `chat-code-${trackingNumber}` : "";
  const isControlled = typeof accessCode === "string";
  const [internalAccessCode, setInternalAccessCode] = useState(() => {
    if (!requireCode || isAdmin || !storageKey || typeof window === "undefined") {
      return "";
    }
    return window.localStorage.getItem(storageKey) || "";
  });
  const accessCodeValue = isControlled ? accessCode : internalAccessCode;

  useEffect(() => {
    if (!requireCode || isAdmin || !storageKey || isControlled) return;
    if (internalAccessCode) {
      window.localStorage.setItem(storageKey, internalAccessCode);
    }
  }, [internalAccessCode, requireCode, isAdmin, storageKey, isControlled]);

  useEffect(() => {
    if (!trackingNumber && !orderId) return;
    if (!isAdmin && requireCode && !accessCodeValue) return;

    let active = true;
    const fetchMessages = async () => {
      setStatus(null);
      const params = new URLSearchParams();
      if (orderId) {
        params.set("orderId", orderId);
      } else if (trackingNumber) {
        params.set("trackingNumber", trackingNumber);
        if (requireCode && accessCodeValue) {
          params.set("accessCode", accessCodeValue);
        }
      }
      const res = await fetch(`/api/chat/list?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "invalid_code") {
          setStatus("Неверный код доступа.");
        } else if (data.error === "locked") {
          setStatus("Слишком много попыток. Попробуйте позже.");
        } else if (data.error === "rate_limited") {
          setStatus("Слишком много запросов. Попробуйте позже.");
        }
        return;
      }
      const data = await res.json();
      if (active) {
        setMessages(data.messages || []);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [trackingNumber, orderId, accessCodeValue, isAdmin, requireCode]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setStatus(null);

    const payload: Record<string, string> = { text: text.trim() };
    if (orderId) {
      payload.orderId = orderId;
    } else if (trackingNumber) {
      payload.trackingNumber = trackingNumber;
      if (requireCode) {
        payload.accessCode = accessCodeValue || "";
      }
    }

    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.error === "invalid_code") {
        setStatus("Неверный код доступа.");
      } else if (data.error === "locked") {
        setStatus("Слишком много попыток. Попробуйте позже.");
      } else if (data.error === "rate_limited") {
        setStatus("Слишком много запросов. Попробуйте позже.");
      } else {
        setStatus("Не удалось отправить сообщение.");
      }
      return;
    }

    setText("");
  };

  const handleAccessCodeChange = (value: string) => {
    if (onAccessCodeChange) {
      onAccessCodeChange(value);
      return;
    }
    setInternalAccessCode(value);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-border/60 bg-card/70 p-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted">
            {requireCode && !isAdmin && !accessCodeValue
              ? "Чат доступен после ввода кода доступа."
              : "Сообщений пока нет."}
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
              message.author === "admin"
                ? "ml-auto bg-accent text-black"
                : "bg-card text-foreground"
            )}
          >
            {message.text}
          </div>
        ))}
      </div>

      {!isAdmin && requireCode && showAccessInput && (
        <Input
          value={accessCodeValue}
          onChange={(event) => handleAccessCodeChange(event.target.value)}
          placeholder="Введите код доступа"
          maxLength={6}
        />
      )}

      <div className="flex flex-col gap-3">
        <Input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Напишите сообщение"
          maxLength={1000}
        />
        <Button
          variant="accent"
          type="button"
          onClick={handleSend}
          disabled={requireCode && !isAdmin && !accessCodeValue}
        >
          Отправить
        </Button>
        {status && <div className="text-sm text-amber-200">{status}</div>}
      </div>
    </div>
  );
}
