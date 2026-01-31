import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "src", "config", "site.ts");
const content = fs.readFileSync(filePath, "utf8");

const errors = [];

const urlMatches = content.match(/https?:\/\/[^\s"']+/g) || [];
urlMatches.forEach((url) => {
  try {
    new URL(url);
  } catch {
    errors.push(`invalid url: ${url}`);
  }
});

const socialsBlock = content.match(/socials:\s*\{([\s\S]*?)\}/);
if (socialsBlock) {
  const lines = socialsBlock[1].split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/(\w+)\s*:\s*"(.*)"/);
    if (!match) continue;
    const [, key, value] = match;
    if (!value.trim()) {
      errors.push(`empty social link: ${key}`);
    }
  }
}

if (!urlMatches.length) {
  errors.push("no URLs found in siteConfig");
}

if (errors.length) {
  console.error("check:links failed");
  errors.forEach((entry) => console.error(`  ${entry}`));
  process.exit(1);
}

console.log("check:links passed");
