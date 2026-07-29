import type { APIRoute } from "astro";
import { ARTICLE_ROUTES } from "../data/articles";
import { PUBLIC_ROUTES, SITE } from "../data/site";

export const GET: APIRoute = () => {
  const routes = [...new Set([...PUBLIC_ROUTES, ...ARTICLE_ROUTES])];
  const urls = routes
    .map((route) => `<url><loc>${SITE.origin}${route}</loc><lastmod>${SITE.updated}</lastmod></url>`)
    .join("");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
};
