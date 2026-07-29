import { findHousingCity, HOUSING_CITIES } from "./data/housing-cities";
import {
  combineHousingData,
  fetchFreshHousingRates,
  fetchFreshHousingRent,
  HOUSING_CACHE_SECONDS,
  HOUSING_STALE_SECONDS,
  isHousingRatesData,
  isHousingRentData,
  type HousingData,
  type HousingRatesData,
  type HousingRentData,
} from "./lib/housing-data";

const SITE_ORIGIN = "https://mortgage.utilitas.app";
const HOUSING_API_PREFIX = "/api/housing/";
const HOUSING_CACHE_VERSION = "v1";
const HOUSING_SNAPSHOT_PREFIX = "/data/housing/v1";
const WRANGLER_LIVE_RELOAD_HASH =
  "'sha256-g5a3SrOYIecCloZ8S7M4xdT1pbYi6e7mjHrmwphRxfE='";

function acceptsMarkdown(header: string | null): boolean {
  if (!header) return false;
  const entries = header.toLowerCase().split(",").map((entry) => {
    const [mediaType = "", ...parameters] = entry.trim().split(";");
    const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
    const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
    return { mediaType: mediaType.trim(), quality: Number.isFinite(quality) ? quality : 0 };
  });
  const markdown = Math.max(
    ...entries.filter((entry) => entry.mediaType === "text/markdown").map((entry) => entry.quality),
    0
  );
  const html = Math.max(
    ...entries.filter((entry) => entry.mediaType === "text/html" || entry.mediaType === "*/*").map((entry) => entry.quality),
    0
  );
  return markdown > 0 && markdown >= html;
}

function htmlToMarkdown(html: string): string {
  const withoutNonContent = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, "")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, "");
  const markdown = withoutNonContent
    .replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)")
    .replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `${markdown}\n\nSource: ${SITE_ORIGIN}\n`;
}

function addDiscoveryHeaders(response: Response, pathname: string): Response {
  const headers = new Headers(response.headers);
  const contentType = headers.get("Content-Type") ?? "";
  headers.set("X-Utilitas-App", "mortgage-compass");
  if (contentType.includes("text/html")) {
    headers.set("Cache-Control", "no-cache");
    headers.set("Content-Signal", "ai-train=no, search=yes, ai-input=yes");
    if (pathname === "/") {
      headers.append("Link", `</llms.txt>; rel="alternate"; type="text/plain"`);
      headers.append("Link", `</auth.md>; rel="service-desc"; type="text/markdown"`);
      headers.append("Link", `</.well-known/agent-skills/index.json>; rel="service-meta"; type="application/json"`);
    }
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function createMarkdownResponse(html: string, assetResponse: Response): Response {
  const markdown = htmlToMarkdown(html);
  const headers = new Headers(assetResponse.headers);
  for (const name of ["Content-Length", "ETag", "Last-Modified", "Content-Encoding"]) {
    headers.delete(name);
  }
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("X-Utilitas-App", "mortgage-compass");
  headers.set("Content-Signal", "ai-train=no, search=yes, ai-input=yes");
  headers.set("Vary", "Accept");
  headers.set("x-markdown-tokens", String(Math.ceil(markdown.length / 4)));
  headers.set("x-original-tokens", String(Math.ceil(html.length / 4)));
  return new Response(markdown, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers
  });
}

function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return btoa(String.fromCharCode(...bytes));
}

function createSecureHtmlResponse(
  html: string,
  assetResponse: Response,
  pathname: string,
  hostname = "",
): Response {
  const nonce = createNonce();
  const isLocalDevelopment =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  const localScriptHash = isLocalDevelopment ? ` ${WRANGLER_LIVE_RELOAD_HASH}` : "";
  const securedHtml = html
    .replace(/<script\b(?![^>]*\bnonce=)/gi, `<script nonce="${nonce}"`)
    .replace(/<style\b(?![^>]*\bnonce=)/gi, `<style nonce="${nonce}"`);
  const headers = new Headers(assetResponse.headers);
  for (const name of ["Content-Length", "ETag", "Last-Modified", "Content-Encoding"]) {
    headers.delete(name);
  }
  headers.set("Cache-Control", "no-cache");
  headers.set("Content-Signal", "ai-train=no, search=yes, ai-input=yes");
  headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'${localScriptHash}; style-src 'self' 'nonce-${nonce}'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`,
  );
  headers.set("X-Utilitas-App", "mortgage-compass");
  if (pathname === "/") {
    headers.append("Link", `</llms.txt>; rel="alternate"; type="text/plain"`);
    headers.append("Link", `</auth.md>; rel="service-desc"; type="text/markdown"`);
    headers.append(
      "Link",
      `</.well-known/agent-skills/index.json>; rel="service-meta"; type="application/json"`,
    );
  }
  return new Response(securedHtml, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers,
  });
}

function housingJsonResponse(
  body: HousingData | { error: string },
  status: number,
  cacheStatus: "HIT" | "MISS" | "STALE" | "SNAPSHOT" | "ERROR",
  componentStatus = "",
): Response {
  const generatedAt = "generatedAt" in body ? Date.parse(body.generatedAt) : Date.now();
  const ageSeconds = Math.max(0, Math.floor((Date.now() - generatedAt) / 1000));
  const source =
    cacheStatus === "SNAPSHOT"
      ? "snapshot"
      : cacheStatus === "MISS"
        ? "live"
        : cacheStatus === "ERROR"
          ? "unavailable"
          : "kv";
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": status === 200 ? "public, max-age=300" : "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      "X-Content-Type-Options": "nosniff",
      "X-Data-Age": String(ageSeconds),
      "X-Data-Cache": cacheStatus,
      "X-Data-Components": componentStatus,
      "X-Data-Source": source,
      "X-Utilitas-App": "mortgage-compass",
    },
  });
}

function rateCacheKey(): string {
  return `housing-rates:${HOUSING_CACHE_VERSION}`;
}

function rentCacheKey(citySlug: string): string {
  return `housing-rent:${HOUSING_CACHE_VERSION}:${citySlug}`;
}

async function refreshHousingRates(env: Env): Promise<HousingRatesData> {
  const data = await fetchFreshHousingRates();
  await env.HOUSING_CACHE.put(rateCacheKey(), JSON.stringify(data), {
    expirationTtl: HOUSING_STALE_SECONDS,
  });
  return data;
}

async function refreshHousingRent(
  city: NonNullable<ReturnType<typeof findHousingCity>>,
  env: Env,
): Promise<HousingRentData> {
  const data = await fetchFreshHousingRent(city);
  await env.HOUSING_CACHE.put(rentCacheKey(city.slug), JSON.stringify(data), {
    expirationTtl: HOUSING_STALE_SECONDS,
  });
  return data;
}

type DataMode = "HIT" | "MISS" | "STALE" | "SNAPSHOT";

interface ResolvedData<T> {
  data: T;
  mode: DataMode;
}

async function readSnapshot<T>(
  env: Env,
  pathname: string,
  validate: (value: unknown) => value is T,
): Promise<T> {
  const response = await env.ASSETS.fetch(
    new Request(new URL(pathname, SITE_ORIGIN)),
  );
  if (!response.ok) {
    throw new Error(`Snapshot ${pathname} returned ${response.status}`);
  }
  const contentLength = Number(response.headers.get("Content-Length") ?? 0);
  if (contentLength > 1_000_000) {
    throw new Error(`Snapshot ${pathname} exceeded the allowed size`);
  }
  const value: unknown = await response.json();
  if (!validate(value)) {
    throw new Error(`Snapshot ${pathname} failed validation`);
  }
  return value;
}

function dataAgeSeconds(generatedAt: string): number {
  return Math.max(0, (Date.now() - Date.parse(generatedAt)) / 1000);
}

async function resolveHousingRates(
  env: Env,
  ctx: ExecutionContext,
): Promise<ResolvedData<HousingRatesData>> {
  const cached = await env.HOUSING_CACHE.get(rateCacheKey(), {
    type: "json",
    cacheTtl: 300,
  });
  if (isHousingRatesData(cached)) {
    if (dataAgeSeconds(cached.generatedAt) <= HOUSING_CACHE_SECONDS) {
      return { data: cached, mode: "HIT" };
    }
    ctx.waitUntil(
      refreshHousingRates(env).catch((error: unknown) => {
        console.error(JSON.stringify({
          event: "housing_rate_refresh_failed",
          message: error instanceof Error ? error.message : "Unknown error",
        }));
      }),
    );
    return { data: cached, mode: "STALE" };
  }

  try {
    return { data: await refreshHousingRates(env), mode: "MISS" };
  } catch (error) {
    console.error(JSON.stringify({
      event: "housing_rate_fetch_failed",
      message: error instanceof Error ? error.message : "Unknown error",
    }));
    return {
      data: await readSnapshot(
        env,
        `${HOUSING_SNAPSHOT_PREFIX}/rates.json`,
        isHousingRatesData,
      ),
      mode: "SNAPSHOT",
    };
  }
}

async function resolveHousingRent(
  city: NonNullable<ReturnType<typeof findHousingCity>>,
  env: Env,
  ctx: ExecutionContext,
): Promise<ResolvedData<HousingRentData>> {
  const cached = await env.HOUSING_CACHE.get(rentCacheKey(city.slug), {
    type: "json",
    cacheTtl: 300,
  });
  if (isHousingRentData(cached)) {
    if (dataAgeSeconds(cached.generatedAt) <= HOUSING_CACHE_SECONDS) {
      return { data: cached, mode: "HIT" };
    }
    ctx.waitUntil(
      refreshHousingRent(city, env).catch((error: unknown) => {
        console.error(JSON.stringify({
          event: "housing_rent_refresh_failed",
          city: city.slug,
          message: error instanceof Error ? error.message : "Unknown error",
        }));
      }),
    );
    return { data: cached, mode: "STALE" };
  }

  try {
    return { data: await refreshHousingRent(city, env), mode: "MISS" };
  } catch (error) {
    console.error(JSON.stringify({
      event: "housing_rent_fetch_failed",
      city: city.slug,
      message: error instanceof Error ? error.message : "Unknown error",
    }));
    return {
      data: await readSnapshot(
        env,
        `${HOUSING_SNAPSHOT_PREFIX}/${city.slug}.json`,
        isHousingRentData,
      ),
      mode: "SNAPSHOT",
    };
  }
}

function combinedDataMode(modes: DataMode[]): DataMode {
  if (modes.includes("SNAPSHOT")) return "SNAPSHOT";
  if (modes.includes("STALE")) return "STALE";
  if (modes.includes("MISS")) return "MISS";
  return "HIT";
}

async function handleHousingApi(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const pathname = new URL(request.url).pathname;
  const city = findHousingCity(pathname.slice(HOUSING_API_PREFIX.length).replace(/\/$/, ""));
  if (!city) {
    return housingJsonResponse({ error: "City data is unavailable." }, 404, "ERROR");
  }

  try {
    const [rent, rates] = await Promise.all([
      resolveHousingRent(city, env, ctx),
      resolveHousingRates(env, ctx),
    ]);
    const mode = combinedDataMode([rent.mode, rates.mode]);
    return housingJsonResponse(
      combineHousingData(city, rent.data, rates.data),
      200,
      mode,
      `rent=${rent.mode}, rates=${rates.mode}`,
    );
  } catch (error) {
    console.error(JSON.stringify({
      event: "housing_fetch_failed",
      city: city.slug,
      message: error instanceof Error ? error.message : "Unknown error",
    }));
    return housingJsonResponse(
      { error: "Live housing data is temporarily unavailable." },
      502,
      "ERROR",
    );
  }
}

async function refreshScheduledHousingData(env: Env): Promise<void> {
  const tasks = [
    {
      name: "rates",
      promise: refreshHousingRates(env),
    },
    ...HOUSING_CITIES.map((city) => ({
      name: `rent:${city.slug}`,
      promise: refreshHousingRent(city, env),
    })),
  ];
  const results = await Promise.allSettled(tasks.map((task) => task.promise));
  const failures = results.flatMap((result, index) =>
    result.status === "rejected"
      ? [{
          name: tasks[index]?.name ?? "unknown",
          message:
            result.reason instanceof Error
              ? result.reason.message
              : "Unknown error",
        }]
      : [],
  );
  console.log(JSON.stringify({
    event: "housing_scheduled_refresh",
    refreshed: tasks.length - failures.length,
    failed: failures,
  }));
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith(HOUSING_API_PREFIX)) {
      return handleHousingApi(request, env, ctx);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const contentType = assetResponse.headers.get("Content-Type") ?? "";

    if (request.method === "GET" && assetResponse.ok && contentType.includes("text/html")) {
      const contentLength = Number(assetResponse.headers.get("Content-Length") ?? 0);
      if (contentLength > 2_000_000) {
        return new Response("Page is too large to serve safely.", {
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
      const html = await assetResponse.text();
      if (acceptsMarkdown(request.headers.get("Accept"))) {
        return createMarkdownResponse(html, assetResponse);
      }
      return createSecureHtmlResponse(html, assetResponse, url.pathname, url.hostname);
    }

    return addDiscoveryHeaders(assetResponse, url.pathname);
  },
  async scheduled(_controller, env, _ctx): Promise<void> {
    await refreshScheduledHousingData(env);
  },
} satisfies ExportedHandler<Env>;

export {
  acceptsMarkdown,
  addDiscoveryHeaders,
  createMarkdownResponse,
  createSecureHtmlResponse,
  handleHousingApi,
  htmlToMarkdown,
  refreshScheduledHousingData,
};
