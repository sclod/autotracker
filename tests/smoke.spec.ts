import { test, expect, type Page } from "@playwright/test";

const trackingNumber = process.env.SMOKE_TRACKING_NUMBER ?? "123456";
const accessCode = process.env.SMOKE_ACCESS_CODE ?? "111111";
const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me";

async function loginAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.locator('input[type="password"]').fill(adminPassword);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin\/orders(\/|\?|$)/);
}

test("home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("video")).toBeVisible();
  await expect(page.locator('a[href="/track"]').first()).toBeVisible();
});

test("top cars CTA prefill", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Хочу такой автомобиль" }).first().click();
  const message = page.locator('textarea[name="message"]').first();
  await expect(message).toHaveValue(/Хочу/);
});

test("lead submission works", async ({ page }) => {
  await page.goto("/");
  const nameInput = page.locator('input[name="name"]').first();
  const phoneInput = page.locator('input[name="phone"]').first();
  await nameInput.fill("Тест");
  await phoneInput.fill("+7 (999) 111-22-33");
  await page.locator('form button[type="submit"]').first().click();
  await expect(nameInput).toHaveValue("");
  await expect(page.locator('[class*="border-emerald-400"]').first()).toBeVisible();
});

test("track portal redirects and shows sections", async ({ page }) => {
  await page.goto("/track");
  await page.locator('input[name="trackingNumber"]').fill(trackingNumber);
  await page.locator('form button[type="submit"]').first().click();
  await expect(page).toHaveURL(/\/track\//);
  await expect(page.getByText("Этапы доставки")).toBeVisible();
  await expect(page.getByText("Маршрут на карте")).toBeVisible();
  await expect(page.getByText("Файлы и документы")).toBeVisible();
  await expect(page.getByText("Чат с менеджером")).toBeVisible();
});

test("admin redirects to login when unauth", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("admin orders tabs available", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/orders");
  const openLink = page.getByRole("link", { name: "Открыть" }).first();
  if ((await openLink.count()) === 0) {
    await page.goto("/admin/orders/new");
    await page.locator('input[name="vehicleSummary"]').fill("Demo order");
    await page.getByRole("button", { name: "Создать заказ" }).click();
    await expect(page).toHaveURL(/\/admin\/orders\//);
  } else {
    await openLink.click();
  }
  await expect(page.getByRole("link", { name: "Трекер", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Маршрут" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Чат" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Файлы" })).toBeVisible();
});

test("admin leads update + convert", async ({ page }) => {
  await loginAdmin(page);
  await page.goto("/admin/leads");

  const statusSelect = page.locator('select[name="status"]');
  if ((await statusSelect.count()) === 0) {
    await page.goto("/");
    await page.locator('input[name="name"]').first().fill("Тест");
    await page.locator('input[name="phone"]').first().fill("+7 (999) 222-33-44");
    await page.locator('form button[type="submit"]').first().click();
    await expect(page.locator('[class*="border-emerald-400"]').first()).toBeVisible();
    await loginAdmin(page);
    await page.goto("/admin/leads");
  }

  const statusForm = page.locator("form", {
    has: page.locator('select[name="status"]'),
  }).first();
  await expect(statusForm.locator('select[name="status"]')).toBeVisible();
  await statusForm.locator('select[name="status"]').selectOption("qualified");
  await statusForm.locator('button[type="submit"]').click();

  const noteForm = page.locator("form", {
    has: page.locator('textarea[name="adminNote"]'),
  }).first();
  await noteForm.locator('textarea[name="adminNote"]').fill("Демо заметка");
  await noteForm.locator('button[type="submit"]').click();

  const convertButton = page.getByRole("button", { name: "Конвертировать" }).first();
  if (await convertButton.isVisible()) {
    await convertButton.click();
    await page.getByRole("button", { name: "Создать заказ" }).click();
    const successText = page.getByText("Заказ создан");
    try {
      await expect(successText).toBeVisible({ timeout: 10000 });
    } catch {
      await expect(page.getByRole("link", { name: "Открыть заказ" }).first()).toBeVisible();
    }
  } else {
    await expect(page.getByRole("link", { name: "Открыть заказ" }).first()).toBeVisible();
  }
});

test("track page renders demo order", async ({ page }) => {
  await page.goto(`/track/${trackingNumber}`);
  await expect(page.locator(".tracker-card").first()).toBeVisible();
});

test("track page renders second demo order", async ({ page }) => {
  await page.goto("/track/654321");
  await expect(page.locator(".tracker-card").first()).toBeVisible();
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

test("track api returns order", async ({ request }) => {
  const response = await request.post("/api/track", {
    data: { trackingNumber },
  });
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.order?.trackingNumber).toBe(trackingNumber);
});