import type { APIRoute } from "astro";
import { ARTICLES } from "../data/articles";
import { CALCULATORS, SITE } from "../data/site";
import { HOUSING_CITIES } from "../data/housing-cities";

export const GET: APIRoute = () => {
  const text = [
    "# Mortgage Compass full content index",
    "",
    SITE.description,
    "",
    "## Calculator capabilities",
    "",
    ...CALCULATORS.flatMap((item) => [
      `### ${item.name}`,
      "",
      `${SITE.origin}/calculators/${item.slug}/`,
      "",
      item.description,
      ""
    ]),
    "## Editorial content",
    "",
    ...ARTICLES.flatMap((item) => [
      `### ${item.title}`,
      "",
      `${SITE.origin}/guides/${item.slug}/`,
      "",
      ...item.intro,
      "",
      ...item.sections.flatMap((section) => [
        `#### ${section.heading}`,
        "",
        ...section.paragraphs,
        ...(section.bullets ?? []).map((bullet) => `- ${bullet}`),
        ""
      ])
    ]),
    "## Live public housing data",
    "",
    ...HOUSING_CITIES.flatMap((city) => [
      `### ${city.name}`,
      "",
      `${SITE.origin}/housing/${city.slug}/`,
      "",
      city.description,
      ""
    ]),
    "## Capability limits",
    "",
    "Mortgage Compass provides deterministic browser calculations, educational content, and cached read-only public housing data. It does not provide a lender quote, approval, account, personalized recommendation, legal interpretation, appraisal, write API, remote MCP server, OAuth service, or A2A endpoint."
  ].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
