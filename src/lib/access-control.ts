import { isChatCodeRequired } from "@/lib/chat";
import { isValidAccessCode } from "@/lib/validation";
import { peekRateLimit, rateLimit } from "@/lib/rate-limit";

const ACCESS_CODE_LOCKOUT = { limit: 10, windowMs: 30 * 60 * 1000 };

type AccessCheckParams = {
  trackingNumber: string;
  providedCode: string | null | undefined;
  orderAccessCode: string | null | undefined;
  ip: string;
};

export function requireAccessCode({
  trackingNumber,
  providedCode,
  orderAccessCode,
  ip,
}: AccessCheckParams) {
  if (!isChatCodeRequired()) {
    return { ok: true };
  }

  const lockKey = `access-code:${trackingNumber}:${ip}`;
  const lockStatus = peekRateLimit(lockKey, ACCESS_CODE_LOCKOUT);
  if (!lockStatus.ok) {
    return { ok: false, error: "locked" as const };
  }

  if (!providedCode || !isValidAccessCode(providedCode) || providedCode !== orderAccessCode) {
    const attempt = rateLimit(lockKey, ACCESS_CODE_LOCKOUT);
    if (!attempt.ok) {
      return { ok: false, error: "locked" as const };
    }
    return { ok: false, error: "invalid_code" as const };
  }

  return { ok: true };
}
