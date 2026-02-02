import { test, expect } from "@playwright/test";

const trackingNumber = process.env.E2E_TRACKING_NUMBER ?? "123456";
const accessCode = process.env.E2E_ACCESS_CODE ?? "111111";
const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me";

test.describe.configure({ mode: "serial" });

test("home lead flow", async ({ page }) => {
  await page.goto("/");
  const nameInput = page.locator('input[name="name"]').first();
  const phoneInput = page.locator('input[name="phone"]').first();
  await nameInput.fill("Тест Клиент");
  await phoneInput.fill("+7 (999) 222-33-44");
  await page.locator('form button[type="submit"]').first().click();
  await expect(page.locator('[class*="border-emerald-400"]').first()).toBeVisible();
});

test("home top cars lead prefill", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Хочу такой автомобиль" }).first().click();
  const message = await page.locator('textarea[name="message"]').inputValue();
  expect(message.length).toBeGreaterThan(6);
  await expect(page.locator("img").first()).toBeVisible();
});

test("track portal redirects to result", async ({ page }) => {
  await page.goto("/track");
  await page.locator('input[name="trackingNumber"]').fill(trackingNumber);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(`/track/${trackingNumber}$`));
  await expect(page.locator(".tracker-card").first()).toBeVisible();
  await expect(
    page.locator(".leaflet-container, .tracker-skeleton").first()
  ).toBeVisible();
});

test("admin redirects without auth", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("admin orders tabs", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator('input[type="password"]').fill(adminPassword);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin(\/|\?|$)/);

  await page.goto("/admin/orders");
  const openButtons = page.getByRole("link", { name: "Открыть" });
  await expect(openButtons.first()).toBeVisible();
  await openButtons.first().click();

  await expect(page.getByRole("link", { name: "Трекер" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Маршрут" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Чат" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Файлы" })).toBeVisible();
});

test("chat burst does not lock DB", async ({ request }) => {
  const responses = await Promise.all(
    Array.from({ length: 10 }).map((_, idx) =>
      request.post("/api/chat/send", {
        data: {
          trackingNumber,
          text: `Burst message ${idx + 1}`,
          accessCode,
        },
      })
    )
  );
  responses.forEach((response) => {
    expect([200, 400, 403, 429]).toContain(response.status());
  });
});

test("lead convert flow", async ({ page }) => {
  await page.goto("/");
  await page.locator('input[name="name"]').first().fill("Лид для конвертации");
  await page.locator('input[name="phone"]').first().fill("+7 (999) 333-44-55");
  await page.locator('form button[type="submit"]').first().click();
  await expect(page.locator('[class*="border-emerald-400"]').first()).toBeVisible();

  await page.goto("/admin/login");
  await page.locator('input[type="password"]').fill(adminPassword);
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/\/admin(\/|\?|$)/);

  await page.goto("/admin/leads");
  const convertBtn = page.getByRole("button", { name: "Конвертировать" }).first();
  await expect(convertBtn).toBeVisible();
  await convertBtn.click();

  const modal = page.locator("div").filter({
    hasText: "Конвертация лида в заказ",
  });
  await expect(modal.first()).toBeVisible();

  await page.locator('textarea[name="summary"]').fill("BMW X5 2022, дизель");
  await page.getByRole("button", { name: "Создать заказ" }).click();
  await expect(page.getByText("Заказ создан")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Скопировать ссылку/i })
  ).toBeVisible();
});
