import fs from "fs";
import path from "path";

const root = path.resolve(process.cwd(), "src");
const exts = new Set([".ts", ".tsx", ".md", ".css"]);
const pattern = /\?{3,}/g;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (exts.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const matches = [];

for (const file of walk(root)) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      matches.push(`${file}:${index + 1}`);
    }
    pattern.lastIndex = 0;
  });
}

if (matches.length) {
  console.error("Found '???' sequences:");
  matches.forEach((entry) => console.error(`  ${entry}`));
  process.exit(1);
}

console.log("check:qmarks passed");
