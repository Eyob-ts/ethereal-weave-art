/**
 * generate-index.mjs
 * Runs after `vite build` to produce dist/client/index.html.
 *
 * TanStack Start's SSR build doesn't emit an index.html (the server renders
 * it at runtime). Since we deploy as a static SPA on Netlify (nitro: false),
 * we need to generate one ourselves from Vite's manifest.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const clientDir = join(root, "dist", "client");
const manifestPath = join(clientDir, ".vite", "manifest.json");

// Read Vite's manifest to find hashed filenames.
let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
} catch {
  console.error("[generate-index] Could not read manifest at", manifestPath);
  process.exit(1);
}

// Collect all entry chunks (isEntry: true).
const entries = Object.values(manifest).filter((chunk) => chunk.isEntry);

if (entries.length === 0) {
  console.error("[generate-index] No entry chunks found in manifest.");
  process.exit(1);
}

// Gather all CSS files referenced by entry chunks (from both `css` and `assets` arrays).
const cssFiles = [
  ...new Set(
    entries.flatMap((e) => [
      ...(e.css ?? []),
      ...(e.assets ?? []).filter((a) => a.endsWith(".css")),
    ]),
  ),
];

// Gather all entry JS files.
const jsFiles = entries.map((e) => e.file);

console.log("[generate-index] Entry JS:", jsFiles);
console.log("[generate-index] Entry CSS:", cssFiles);

const cssLinks = cssFiles.map((f) => `    <link rel="stylesheet" href="/${f}" />`).join("\n");

const jsScripts = jsFiles.map((f) => `    <script type="module" src="/${f}"></script>`).join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Zhaddi Wedding</title>
    <meta name="description" content="Zhaddi Wedding - Ethereal Bridal Couture" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
    />
${cssLinks}
  </head>
  <body>
${jsScripts}
  </body>
</html>
`;

const outPath = join(clientDir, "index.html");
writeFileSync(outPath, html, "utf-8");
console.log("[generate-index] Written:", outPath);
