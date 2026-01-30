import { test, type Request, type Response } from "@playwright/test";
import fs from "fs";
import path from "path";

type PageEntry = {
  name: string;
  path: string;
  requiresH1?: boolean;
  checkHeroCta?: boolean;
};

const viewports = [
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
];

const pages: PageEntry[] = [
  { name: "home", path: "/", requiresH1: true, checkHeroCta: true },
  { name: "track", path: "/track", requiresH1: true },
  { name: "track-123456", path: "/track/123456", requiresH1: true },
  { name: "catalog-usa", path: "/catalog/usa", requiresH1: true },
  { name: "catalog-china", path: "/catalog/china", requiresH1: true },
  { name: "catalog-eu-bmw", path: "/catalog/eu/bmw", requiresH1: true },
  { name: "services", path: "/services", requiresH1: true },
  { name: "service-selection", path: "/services/selection", requiresH1: true },
  { name: "admin", path: "/admin" },
  { name: "admin-login", path: "/admin/login" },
  { name: "admin-leads", path: "/admin/leads" },
  { name: "admin-orders", path: "/admin/orders" },
];

const orderId = process.env.SHOTS_ORDER_ID;
if (orderId) {
  pages.push({ name: "admin-order", path: `/admin/orders/${orderId}` });
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
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

      await page.goto(entry.path, { waitUntil: "networkidle" });

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
