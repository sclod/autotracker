import crypto from "crypto";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionValue() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const token = crypto.randomBytes(16).toString("hex");
  const payload = `${token}.${expiresAt}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionValue(value: string | undefined | null) {
  if (!value) return false;
  const [token, expiresAtRaw, signature] = value.split(".");
  if (!token || !expiresAtRaw || !signature) return false;
  const payload = `${token}.${expiresAtRaw}`;
  const expected = sign(payload);
  try {
    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");
    if (expectedBuffer.length !== signatureBuffer.length) return false;
    if (!crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) return false;
  } catch {
    return false;
  }
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) return false;
  return expiresAt > Date.now();
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}
