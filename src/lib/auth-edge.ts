const COOKIE_NAME = "admin_session";

function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret";
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toHex(signature);
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifySessionValue(value: string | undefined | null) {
  if (!value) return false;
  const [token, expiresAtRaw, signature] = value.split(".");
  if (!token || !expiresAtRaw || !signature) return false;
  const payload = `${token}.${expiresAtRaw}`;
  const expected = await sign(payload);
  if (!constantTimeEqual(expected, signature)) return false;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt)) return false;
  return expiresAt > Date.now();
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}
