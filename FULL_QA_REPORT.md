# Full QA Report (2026-01-31)

## Automated checks
- npm ci: OK (required clean install). Note: initial EPERM unlink on lightningcss, resolved by removing node_modules and re-running npm ci.
- prisma:generate: OK
- npm run lint: OK
- npm run test:smoke: OK
- npm run shots: OK
- screenshots: artifacts/screenshots/2026-01-31T12-35-39-611Z

## Fixes applied
- Company timeline: dot + year are flex-aligned (no overlap).
- Catalog AJM UI: white section, 7-image carousel with numbered dots, specs line, price-from, CTA prefill.
- Catalog data: 3 regions (USA/EU/China), 6 cars each, 7 images per car.
- Managers block: round portraits with glow circle, larger size on home/services.
- Images: allowed quality 100 for local portraits in next.config.

## Remaining warnings
- Next.js warning: middleware-to-proxy deprecation (dev).
- Next.js warning: allowedDevOrigins for dev HMR (dev).

## Visual regression matrix (OK/Issue)
| Page | 375x812 | 390x844 | 414x896 | 768x1024 | 1024x768 | 1440x900 | 1920x1080 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| home | OK | OK | OK | OK | OK | OK | OK |
| about | OK | OK | OK | OK | OK | OK | OK |
| services | OK | OK | OK | OK | OK | OK | OK |
| service-selection | OK | OK | OK | OK | OK | OK | OK |
| catalog | OK | OK | OK | OK | OK | OK | OK |
| catalog-usa | OK | OK | OK | OK | OK | OK | OK |
| catalog-eu | OK | OK | OK | OK | OK | OK | OK |
| catalog-china | OK | OK | OK | OK | OK | OK | OK |
| catalog-usa-ford | OK | OK | OK | OK | OK | OK | OK |
| track | OK | OK | OK | OK | OK | OK | OK |
| track-123456 | OK | OK | OK | OK | OK | OK | OK |
| admin | OK | OK | OK | OK | OK | OK | OK |
| admin-login | OK | OK | OK | OK | OK | OK | OK |
| admin-orders | OK | OK | OK | OK | OK | OK | OK |
| admin-leads | OK | OK | OK | OK | OK | OK | OK |
| admin-order | OK | OK | OK | OK | OK | OK | OK |

## Notes
- No broken images detected (OSM tiles ignored by report).
- No horizontal scroll detected after fixes.
