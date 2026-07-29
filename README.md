# Mortgage Compass

Mortgage Compass is an Astro, Vue, and Cloudflare Workers application. Its calculator pages are static, while the city housing dashboards use a Worker route and Workers KV.

## Local development

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:4321/`.

The development command builds the Astro site, starts `wrangler dev` with local KV, and rebuilds the static assets when files under `src/` or `public/` change. Run the project through this command because `astro dev` alone cannot provide Worker routes or bindings.

For a production-style local session without source watching:

```powershell
npm.cmd run preview
```

## Live housing data

City pages request `/api/housing/{city}` from the same origin. The Worker keeps one national Bank of Canada rate record and one Statistics Canada rent record per city in the `HOUSING_CACHE` KV binding. Fresh records are used for six hours, stale records can be served for seven days while a background refresh runs, and validated static snapshots are the final cold-cache fallback.

A scheduled Worker refresh runs every six hours. Calculator values never enter these requests and remain in the browser.

The public sources do not require credentials. Do not add API keys, account tokens, or namespace credentials to browser code or committed configuration.

Refresh the versioned fallback snapshots before a release:

```powershell
npm.cmd run refresh:housing
```

The refresh script validates dates, units, value bounds, and minimum observation counts before replacing the previous snapshots.

## Validation

```powershell
npm.cmd run validate
npm.cmd run test:e2e
npm.cmd run deploy:dry
```
