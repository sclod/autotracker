import { test } from "@playwright/test";
import fs from "fs";
import path from "path";

const viewports = [
  { name: "375x812", width: 375, height: 812 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
];

const pages = [
  { name: "home", path: "/" },
  { name: "track", path: "/track" },
  { name: "track-123456", path: "/track/123456" },
  { name: "catalog", path: "/catalog" },
  { name: "catalog-eu-bmw", path: "/catalog/eu/bmw" },
  { name: "service-selection", path: "/services/selection" },
  { name: "admin-login", path: "/admin/login" },
];

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
  }> = [];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const entry of pages) {
      const urlPath = entry.path;
      await page.goto(urlPath, { waitUntil: "networkidle" });

      await page.addStyleTag({
        content: `
          * {
            animation: none !important;
            transition: none !important;
          }
        `,
      });

      const issues = await page.evaluate(() => {
        const problems: string[] = [];
        const doc = document.documentElement;
        if (doc.scrollWidth > doc.clientWidth + 1) {
          problems.push("overflow-x");
        }
        return problems;
      });

      report.push({
        viewport: viewport.name,
        page: entry.name,
        url: urlPath,
        issues,
      });

      const filename = `${entry.name}__${viewport.name}.png`;
      const filePath = path.join(baseDir, filename);
      await page.screenshot({ path: filePath, fullPage: true });
    }
  }

  fs.writeFileSync(
    path.join(baseDir, "report.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );
});
