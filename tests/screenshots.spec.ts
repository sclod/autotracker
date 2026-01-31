import { test, type Page, type Request, type Response } from "@playwright/test";
import fs from "fs";
import path from "path";
import { createSessionValue, getSessionCookieName } from "../src/lib/auth";

type PageEntry = {
  name: string;
  path?: string;
  requiresH1?: boolean;
  checkHeroCta?: boolean;
  requiresAuth?: boolean;
  resolvePath?: (page: Page) => Promise<string | null>;
};

test.setTimeout(10 * 60 * 1000);

const baseURL = process.env.BASE_URL?.trim()
  ? process.env.BASE_URL
  : "http://127.0.0.1:3000";
const authSecret = process.env.AUTH_SECRET ?? "change-me-please";
process.env.AUTH_SECRET = authSecret;

const viewports = [
  { name: "375x812", width: 375, height: 812 },
  { name: "390x844", width: 390, height: 844 },
  { name: "414x896", width: 414, height: 896 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const pages: PageEntry[] = [
  { name: "home", path: "/", requiresH1: true, checkHeroCta: true },
  { name: "about", path: "/about", requiresH1: true },
  { name: "services", path: "/services", requiresH1: true },
  { name: "service-selection", path: "/services/selection", requiresH1: true },
  { name: "catalog", path: "/catalog", requiresH1: true },
  { name: "catalog-usa", path: "/catalog/usa", requiresH1: true },
  { name: "catalog-eu", path: "/catalog/eu", requiresH1: true },
  { name: "catalog-china", path: "/catalog/china", requiresH1: true },
  { name: "catalog-usa-ford", path: "/catalog/usa/ford/ford-f150-2022", requiresH1: true },
  { name: "track", path: "/track", requiresH1: true },
  { name: "track-123456", path: "/track/123456", requiresH1: true },
  { name: "admin", path: "/admin" },
  { name: "admin-login", path: "/admin/login" },
  { name: "admin-orders", path: "/admin/orders", requiresAuth: true },
  { name: "admin-leads", path: "/admin/leads", requiresAuth: true },
  {
    name: "admin-order",
    requiresAuth: true,
    resolvePath: async (page) => {
      await page.goto("/admin/orders", { waitUntil: "domcontentloaded" });
      const orderHref = await page.evaluate(() => {
        const links = Array.from(
          document.querySelectorAll<HTMLAnchorElement>('a[href^="/admin/orders/"]')
        );
        const target = links.find((link) => {
          const href = link.getAttribute("href") ?? "";
          return href && !href.endsWith("/new");
        });
        return target?.getAttribute("href") ?? null;
      });
      return orderHref;
    },
  },
];

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function ensureAdminSession(page: Page) {
  const cookieValue = createSessionValue();
  await page.context().addCookies([
    {
      name: getSessionCookieName(),
      value: cookieValue,
      url: baseURL,
    },
  ]);
}

test("screenshots", async ({ page }) => {
  const runStamp = new Date().toISOString().replace(/[:.]/g, "-");
  const baseDir = path.join("artifacts", "screenshots", runStamp);
  ensureDir(baseDir);

  const report: Array<{
    viewport: string;
    page: string;
    url: string;
    issues: string[];
    checks: Record<string, boolean>;
  }> = [];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.context().clearCookies();
    let authed = false;

    for (const entry of pages) {
      const imageFailures = new Set<string>();
      const requestFailures = new Set<string>();

      const onResponse = (response: Response) => {
        const request = response.request();
        if (request.resourceType() === "image" && response.status() >= 400) {
          const url = response.url();
          if (!url.includes("tile.openstreetmap.org")) {
            imageFailures.add(url);
          }
        }
      };
      const onRequestFailed = (request: Request) => {
        if (request.resourceType() === "image") {
          const url = request.url();
          if (!url.includes("tile.openstreetmap.org")) {
            requestFailures.add(url);
          }
        }
      };

      page.on("response", onResponse);
      page.on("requestfailed", onRequestFailed);

      if (entry.requiresAuth && !authed) {
        await ensureAdminSession(page);
        authed = true;
      }

      let targetPath = entry.path ?? null;
      if (entry.resolvePath) {
        targetPath = await entry.resolvePath(page);
      }
      if (!targetPath) {
        page.off("response", onResponse);
        page.off("requestfailed", onRequestFailed);
        continue;
      }

      await page.goto(targetPath, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(200);

      await page.addStyleTag({
        content: `
          * {
            animation: none !important;
            transition: none !important;
          }
        `,
      });

      const checks = await page.evaluate(
        ({ requiresH1, checkHeroCta }) => {
          const result: Record<string, boolean> = {
            overflowX: true,
            h1Present: true,
            heroCtaVisible: true,
            missingImageSrc: true,
          };

          const doc = document.documentElement;
          if (doc.scrollWidth > doc.clientWidth + 1) {
            result.overflowX = false;
          }

          if (requiresH1) {
            const h1 = document.querySelector("h1");
            result.h1Present = Boolean(h1 && h1.textContent?.trim());
          }

          if (checkHeroCta) {
            const cta =
              document.querySelector('main a[href="/contact"]') ||
              document.querySelector('main a[href="/catalog/usa"]') ||
              document.querySelector('main a[href="/catalog"]');
            if (!cta) {
              result.heroCtaVisible = false;
            } else {
              const ctaRect = cta.getBoundingClientRect();
              const header = document.querySelector("header");
              const headerRect = header?.getBoundingClientRect();
              const isVisible =
                ctaRect.width > 0 &&
                ctaRect.height > 0 &&
                ctaRect.bottom > 0 &&
                ctaRect.top < window.innerHeight;
              const overlapped =
                headerRect && ctaRect.top < headerRect.bottom - 2;
              result.heroCtaVisible = isVisible && !overlapped;
            }
          }

          const missingSrc = Array.from(document.images).some(
            (img) => !img.getAttribute("src")
          );
          result.missingImageSrc = !missingSrc;

          return result;
        },
        { requiresH1: entry.requiresH1, checkHeroCta: entry.checkHeroCta }
      );

      const brokenImages =
        imageFailures.size > 0 || requestFailures.size > 0 ? false : true;
      const issues: string[] = [];
      if (!checks.overflowX) issues.push("overflow-x");
      if (!checks.h1Present && entry.requiresH1) issues.push("missing-h1");
      if (!checks.heroCtaVisible && entry.checkHeroCta) issues.push("hero-cta-hidden");
      if (!checks.missingImageSrc) issues.push("missing-image-src");
      if (!brokenImages) issues.push("broken-images");

      const filename = `${entry.name}__${viewport.name}.png`;
      const filePath = path.join(baseDir, filename);
      await page.screenshot({ path: filePath, fullPage: true });

      report.push({
        viewport: viewport.name,
        page: entry.name,
        url: page.url(),
        issues,
        checks: {
          ...checks,
          brokenImages,
        },
      });

      page.off("response", onResponse);
      page.off("requestfailed", onRequestFailed);
    }
  }

  fs.writeFileSync(
    path.join(baseDir, "report.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );
});
