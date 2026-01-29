import { test, expect } from "@playwright/test";

const trackingNumber = process.env.SMOKE_TRACKING_NUMBER ?? "123456";
const accessCode = process.env.SMOKE_ACCESS_CODE ?? "111111";
const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me";

const sampleCarId = "bmw-x5-2022";

test("home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("video")).toBeVisible();
  await expect(page.locator('a[href="/catalog"]').first()).toBeVisible();
});

test("catalog pages render", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.locator('input[name="minPrice"]')).toBeVisible();
  await expect(page.locator('input[name="maxPrice"]')).toBeVisible();

  await page.goto("/catalog/eu/bmw");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('a[href^="/catalog/eu/bmw/"]').first()).toBeVisible();
});

test("catalog detail page renders", async ({ page }) => {
  await page.goto(`/catalog/eu/bmw/${sampleCarId}`);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('textarea[name="message"]').first()).toBeVisible();
});

test("lead submission works", async ({ page }) => {
  await page.goto("/");
  const nameInput = page.locator('input[name="name"]').first();
  const phoneInput = page.locator('input[name="phone"]').first();
  await nameInput.fill("????");
  await phoneInput.fill("+7 (999) 111-22-33");
  await page.getByRole("button").first().click();
  await expect(nameInput).toHaveValue("");
  await expect(page.locator('[class*="border-emerald-400"]').first()).toBeVisible();
});

test("admin login page loads", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test("admin login works", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator('input[type="password"]').fill(adminPassword);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin(\/|\?|$)/);
});

test("track page renders demo order", async ({ page }) => {
  await page.goto(`/track/${trackingNumber}`);
  await expect(page.locator('.tracker-card').first()).toBeVisible();
});

test("track page renders second demo order", async ({ page }) => {
  await page.goto("/track/654321");
  await expect(page.locator('.tracker-card').first()).toBeVisible();
});

test("chat api send/list", async ({ request }) => {
  const sendResponse = await request.post("/api/chat/send", {
    data: {
      trackingNumber,
      text: "Smoke test message",
      accessCode,
    },
  });
  expect(sendResponse.ok()).toBeTruthy();

  const listResponse = await request.get(
    `/api/chat/list?trackingNumber=${trackingNumber}&accessCode=${accessCode}`
  );
  expect(listResponse.ok()).toBeTruthy();
  const data = await listResponse.json();
  expect(Array.isArray(data.messages)).toBeTruthy();
});
