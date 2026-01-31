export const TRACKING_REGEX = /^[A-Z0-9]{10,12}$/;
export const TRACKING_DEMO_REGEX = /^[0-9]{6}$/;
export const ACCESS_CODE_REGEX = /^[0-9]{6}$/;

export function normalizeTrackingNumber(value?: string | null) {
  return value?.trim().toUpperCase() ?? "";
}

export function isValidTrackingNumber(value: string) {
  if (isDemoTrackingAllowed() && TRACKING_DEMO_REGEX.test(value)) {
    return true;
  }
  return TRACKING_REGEX.test(value);
}

export function isValidAccessCode(value: string) {
  return ACCESS_CODE_REGEX.test(value);
}

export function isDemoTrackingAllowed() {
  return process.env.SEED_DEMO === "true";
}

export function normalizeText(value: string | null | undefined, maxLength: number) {
  const trimmed = value?.toString().trim() ?? "";
  if (trimmed.length > maxLength) {
    return trimmed.slice(0, maxLength);
  }
  return trimmed;
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 18;
}

export function isValidLabel(value: string, min = 2, max = 80) {
  const trimmed = value.trim();
  return trimmed.length >= min && trimmed.length <= max;
}

export function isValidLatLng(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
