import { defineConfig } from "@playwright/test";

const port = Number(process.env.PORT ?? 3000);
const baseURL = process.env.BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --port ${port}`,
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "file:./dev.db",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "change-me",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "change-me-please",
      SEED_DEMO: process.env.SEED_DEMO ?? "true",
      CHAT_REQUIRE_CODE: process.env.CHAT_REQUIRE_CODE ?? "true",
    },
  },
});
