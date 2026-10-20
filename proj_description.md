# Mortgage Compass operational context

Initialized 2026-10-20 from repository revision e28d78d34eeb62a8dcc8addb5d786667e667914c and targeted production reads. No article topic has been selected.

## Product and audience

Mortgage planning calculators and educational guides for homebuyers and homeowners. The browser workspace supports Canada and U.S. modes; the default locale is en-CA and Canadian examples use CAD. Use practical English, Canadian spelling where appropriate, explicit units and transparent assumptions. Calculators are planning estimates, not lender approval, personalised advice, quotes or forecasts. Confirm consequential rules against current official jurisdiction-specific sources.

Nine tools cover payment, affordability, extra payments, refinance, amortization, closing costs, rent versus buy, stress tests and reverse mortgages. Local scenario storage, optional share links, comparisons and CSV/PDF exports support planning. Calculations stay in the browser; this does not mean all page requests or optional analytics are absent. No lead form, lender ranking or account is offered. City dashboards cover Toronto, Vancouver, Montreal, Calgary, Edmonton and Winnipeg using public-source data and validated fallback snapshots.

## Public routes and content

- Canonical host: https://mortgage.utilitas.app. Homepage, /guides/ and /sitemap.xml returned HTTP 200 during initialization.
- Guides: /guides/<slug>/ with trailing slash. Internal destinations: /calculators/, /calculators/<slug>/, /housing/, /methodology/, /about/ and relevant existing guides. Exact calculator routes are in src/data/site.ts.
- Repository-backed content, no Hygraph integration found. src/data/articles.ts defines Article, ARTICLES and ARTICLE_ROUTES. Current registry contains 18 guides; use the current registry plus production sitemap for duplicate-topic checks, not this count alone.
- Article fields: slug, title, description, keyword, category, readingMinutes, published, updated, intro, keyTakeaways, sections (heading/paragraphs/optional bullets), faqs, sources and optional calculator. Sources are href/label pairs. Retain useful primary citations and accurate publication/modification dates.
- src/pages/guides/[slug].astro renders Article and FAQPage JSON-LD, visible update date, sources, related articles and calculator CTA. src/layouts/BaseLayout.astro supplies title, description, canonical, Open Graph, Twitter, WebPage and breadcrumb metadata.
- src/pages/guides/index.astro, src/pages/sitemap.xml.ts, src/pages/llms.txt.ts and src/pages/llms-full.txt.ts consume registries. Verify propagation after adding content. Sitemap currently uses SITE.updated globally; do not redate unrelated pages to announce a new guide. src/data/articles.test.ts and tests/site-contract.test.mjs contain content/route contracts.

## Media

The Article interface currently has no per-article image field. Article JSON-LD and BaseLayout social metadata use /assets/mortgage-compass-card.svg; guide bodies contain no cover slot. This shared brand card is existing implementation evidence, not approval to reuse editorial artwork. If a new article brief requires an image, implement only the required per-article metadata/rendering support and supply a new approved image after inventory and uniqueness review. Inventory pointers: src/data/articles.ts, src/pages/guides/[slug].astro, src/layouts/BaseLayout.astro and public/assets/. Margot owns the cross-project image ledger. Never generate artwork before an approved article-specific brief.

## Stack, validation and release

Astro 7, Vue 3 and Chart.js; static output in dist, with src/worker.ts serving assets and housing APIs through Cloudflare Workers. wrangler.jsonc names mortgage-utilitas-app, the custom domain, ASSETS and HOUSING_CACHE bindings, and a six-hour refresh cron. No secret values belong in browser code or committed configuration. README.md is the root operating guide; no root AGENTS.md or REPLICATION_GUIDE.md is present at the initialization revision.

- Install with npm ci. npm run dev builds Astro and runs Wrangler with local KV; astro dev alone omits Worker routes/bindings. npm run preview runs the production-style local session without watching.
- README release checks: npm run validate (Astro check, Vitest, build and rendered site contracts), npm run test:e2e, npm run deploy:dry. Run focused checks for the actual change and retain exact results.
- README also requires npm run refresh:housing before release. This changes versioned fallback data; keep it separately reviewable rather than silently including unrelated data in an article commit.
- Repository default branch is master. Use the assigned isolated issue branch, focused commits and independent QA then CTO acceptance before the established release. Wrangler deploy publishes the Worker/assets after an accepted build; confirm the current Cloudflare release contract and required bindings before release. Initialization did not verify deployment credentials or run a build/deployment.
- IndexNow: node scripts/submit-indexnow.mjs <canonical-URL> previews; add --send only after production verification. With no URL it reads dist/sitemap.xml. There is no literal preview subcommand. The preview prints the ownership key, so keep raw output out of issues/logs. The script checks the live key but does not implement every weekly prerequisite; separately verify homepage, robots, sitemap, exact HTTPS host and key before sending. Never add a second submission path.

## Handoff and limitations

This context was created on the isolated October 20 prerequisite branch for reuse by the later Mortgage Compass article delivery. It is not publication acceptance. No new article, image, CMS change, deployment or IndexNow submission is included. Production availability was checked only on the homepage, guide index and sitemap, not every article. Build, end-to-end and deployment access remain unverified by this documentation-only initialization. A later delivery must record its exact commit, reviewed release, targeted live article/index/sitemap/media checks and rollback (revert the scoped change and redeploy the last accepted revision through the established path).
