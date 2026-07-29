import { describe, expect, it, vi } from "vitest";
import {
  acceptsMarkdown,
  addDiscoveryHeaders,
  createCanonicalRedirect,
  createMarkdownResponse,
  createSecureHtmlResponse,
  handleHousingApi,
  htmlToMarkdown
} from "./worker";
import type { HousingRatesData, HousingRentData } from "./lib/housing-data";

describe("agent discovery response helpers", () => {
  it("honours explicit Markdown preference", () => {
    expect(acceptsMarkdown("text/markdown")).toBe(true);
    expect(acceptsMarkdown("text/html;q=0.7, text/markdown;q=1")).toBe(true);
    expect(acceptsMarkdown("text/html, text/markdown;q=0.4")).toBe(false);
    expect(acceptsMarkdown("text/markdown;q=0")).toBe(false);
  });

  it("converts useful content and removes scripts", () => {
    const markdown = htmlToMarkdown(
      "<html><body><h1>Payment plan</h1><p>Use the <a href=\"/calculators/\">tools</a>.</p><script>secret()</script></body></html>"
    );
    expect(markdown).toContain("# Payment plan");
    expect(markdown).toContain("[tools](/calculators/)");
    expect(markdown).toContain("https://mortgage.utilitas.app");
    expect(markdown).not.toContain("secret()");
  });

  it("publishes homepage discovery links and content signals", () => {
    const response = addDiscoveryHeaders(
      new Response("<h1>Mortgage Compass</h1>", {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }),
      "/"
    );
    expect(response.headers.get("Cache-Control")).toBe("no-cache");
    expect(response.headers.get("X-Utilitas-App")).toBe("mortgage-compass");
    expect(response.headers.get("Content-Signal")).toBe("ai-train=no, search=yes, ai-input=yes");
    expect(response.headers.get("Link")).toContain("/llms.txt");
    expect(response.headers.get("Link")).toContain("/.well-known/agent-skills/index.json");
  });

  it("creates a clean Markdown response contract", async () => {
    const response = createMarkdownResponse(
      "<h1>Payment plan</h1><p>Browser estimate.</p>",
      new Response("unused", {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Length": "123",
          ETag: "\"stale\""
        }
      })
    );
    expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("X-Utilitas-App")).toBe("mortgage-compass");
    expect(response.headers.get("Vary")).toBe("Accept");
    expect(response.headers.get("ETag")).toBeNull();
    expect(response.headers.get("Content-Length")).toBeNull();
    expect(response.headers.get("x-markdown-tokens")).toMatch(/^\d+$/);
    expect(await response.text()).toContain("# Payment plan");
  });

  it("adds matching nonces to generated HTML and its CSP", async () => {
    const response = createSecureHtmlResponse(
      "<html><head><style>body{color:#123}</style></head><body><script>window.ready=true</script></body></html>",
      new Response("unused", {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Security-Policy": "default-src 'self'",
          "Content-Length": "100",
        },
      }),
      "/",
    );
    const html = await response.text();
    const nonce = html.match(/<script nonce="([^"]+)"/)?.[1];
    expect(nonce).toBeTruthy();
    expect(html).toContain(`<style nonce="${nonce}"`);
    expect(response.headers.get("Content-Security-Policy")).toContain(
      `'nonce-${nonce}'`,
    );
    expect(response.headers.get("Content-Length")).toBeNull();
    expect(response.headers.get("Link")).toContain("/llms.txt");
  });

  it("permits Wrangler's exact injected reload script only on local hosts", () => {
    const asset = () =>
      new Response("unused", {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    const local = createSecureHtmlResponse("<html></html>", asset(), "/", "127.0.0.1");
    const production = createSecureHtmlResponse(
      "<html></html>",
      asset(),
      "/",
      "mortgage.utilitas.app",
    );

    expect(local.headers.get("Content-Security-Policy")).toContain(
      "'sha256-g5a3SrOYIecCloZ8S7M4xdT1pbYi6e7mjHrmwphRxfE='",
    );
    expect(production.headers.get("Content-Security-Policy")).not.toContain(
      "'sha256-g5a3SrOYIecCloZ8S7M4xdT1pbYi6e7mjHrmwphRxfE='",
    );
  });
});

describe("production routing", () => {
  it("redirects canonical HTTP URLs to HTTPS", () => {
    const response = createCanonicalRedirect(
      new URL("http://mortgage.utilitas.app/calculators/payment/?term=25"),
      true,
    );

    expect(response?.status).toBe(308);
    expect(response?.headers.get("Location")).toBe(
      "https://mortgage.utilitas.app/calculators/payment/?term=25",
    );
    expect(
      createCanonicalRedirect(
        new URL("http://mortgage.utilitas.app/"),
        false,
        "mortgage.utilitas.app",
      ),
    ).toBeNull();
  });
});

describe("housing API cache", () => {
  it("serves fresh shared rate and city rent records from KV", async () => {
    const points = Array.from({ length: 8 }, (_, index) => ({
      date: `2025-${String(index + 1).padStart(2, "0")}-01`,
      value: 2100 + index,
    }));
    const rentSeries = {
      label: "Test rent",
      unit: "CAD" as const,
      points,
    };
    const rateSeries = {
      label: "Test rate",
      unit: "percent" as const,
      points: points.map((point) => ({ ...point, value: 5 })),
    };
    const generatedAt = new Date().toISOString();
    const rent: HousingRentData = {
      citySlug: "toronto",
      generatedAt,
      rent: { oneBedroom: rentSeries, twoBedroom: rentSeries },
      source: { name: "Statistics Canada", url: "https://statcan.gc.ca", note: "Test" },
    };
    const rates: HousingRatesData = {
      generatedAt,
      rates: {
        prime: rateSeries,
        mortgageOneYear: rateSeries,
        mortgageThreeYear: rateSeries,
        mortgageFiveYear: rateSeries,
        policy: rateSeries,
      },
      source: { name: "Bank of Canada", url: "https://bankofcanada.ca", note: "Test" },
    };
    const get = vi.fn().mockImplementation((key: string) =>
      Promise.resolve(key.includes("rent") ? rent : rates),
    );
    const put = vi.fn();
    const waitUntil = vi.fn();

    const response = await handleHousingApi(
      new Request("https://mortgage.utilitas.app/api/housing/toronto"),
      {
        HOUSING_CACHE: { get, put },
      } as unknown as Env,
      { waitUntil } as unknown as ExecutionContext,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Data-Cache")).toBe("HIT");
    expect(response.headers.get("X-Data-Components")).toBe(
      "rent=HIT, rates=HIT",
    );
    expect(get).toHaveBeenCalledWith("housing-rent:v1:toronto", {
      type: "json",
      cacheTtl: 300,
    });
    expect(get).toHaveBeenCalledWith("housing-rates:v1", {
      type: "json",
      cacheTtl: 300,
    });
    expect(put).not.toHaveBeenCalled();
    expect(waitUntil).not.toHaveBeenCalled();
  });

  it("uses validated static snapshots when KV and upstreams are unavailable", async () => {
    const generatedAt = new Date().toISOString();
    const rentPoints = Array.from({ length: 8 }, (_, index) => ({
      date: `2025-${String(index + 1).padStart(2, "0")}-01`,
      value: 2100 + index,
    }));
    const ratePoints = rentPoints.map((point) => ({
      ...point,
      value: 5,
    }));
    const rent: HousingRentData = {
      citySlug: "toronto",
      generatedAt,
      rent: {
        oneBedroom: { label: "One bedroom", unit: "CAD", points: rentPoints },
        twoBedroom: { label: "Two bedroom", unit: "CAD", points: rentPoints },
      },
      source: { name: "Statistics Canada", url: "https://statcan.gc.ca", note: "Test" },
    };
    const rateSeries = { label: "Rate", unit: "percent" as const, points: ratePoints };
    const rates: HousingRatesData = {
      generatedAt,
      rates: {
        prime: rateSeries,
        mortgageOneYear: rateSeries,
        mortgageThreeYear: rateSeries,
        mortgageFiveYear: rateSeries,
        policy: rateSeries,
      },
      source: { name: "Bank of Canada", url: "https://bankofcanada.ca", note: "Test" },
    };
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const assetsFetch = vi.fn().mockImplementation((request: Request) =>
      Promise.resolve(
        Response.json(
          new URL(request.url).pathname.endsWith("/rates.json") ? rates : rent,
        ),
      ),
    );

    try {
      const response = await handleHousingApi(
        new Request("https://mortgage.utilitas.app/api/housing/toronto"),
        {
          HOUSING_CACHE: {
            get: vi.fn().mockResolvedValue(null),
            put: vi.fn(),
          },
          ASSETS: { fetch: assetsFetch },
        } as unknown as Env,
        { waitUntil: vi.fn() } as unknown as ExecutionContext,
      );

      expect(response.status).toBe(200);
      expect(response.headers.get("X-Data-Cache")).toBe("SNAPSHOT");
      expect(response.headers.get("X-Data-Source")).toBe("snapshot");
      expect(assetsFetch).toHaveBeenCalledTimes(2);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("rejects unknown cities before any upstream request", async () => {
    const response = await handleHousingApi(
      new Request("https://mortgage.utilitas.app/api/housing/not-a-city"),
      {} as Env,
      {} as ExecutionContext,
    );
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "City data is unavailable.",
    });
  });
});
