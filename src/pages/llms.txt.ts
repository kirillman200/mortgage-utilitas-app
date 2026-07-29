import type { APIRoute } from "astro";
import { ARTICLES } from "../data/articles";
import { CALCULATORS, SITE } from "../data/site";
import { HOUSING_CITIES } from "../data/housing-cities";

export const GET: APIRoute = () => {
  const calculators = CALCULATORS.map(
    (item) => `- [${item.name}](${SITE.origin}/calculators/${item.slug}/): ${item.description}`
  ).join("\n");
  const guides = ARTICLES.map(
    (item) => `- [${item.title}](${SITE.origin}/guides/${item.slug}/): ${item.description}`
  ).join("\n");
  const housing = HOUSING_CITIES.map(
    (city) => `- [${city.name} housing data](${SITE.origin}/housing/${city.slug}/): ${city.description}`
  ).join("\n");
  const text = `# Mortgage Compass

> ${SITE.description}

Mortgage Compass is a free browser-based planning application from Utilitas. Calculator inputs remain in the browser unless the user chooses to share a URL or exported file. It does not provide approvals, quotes, lender rankings, or personalized financial advice.

## Calculators

${calculators}

## Guides

${guides}

## Live public housing data

${housing}

City pages request a same-origin read-only endpoint backed by Statistics Canada and Bank of Canada public data. Responses are cached and do not require user credentials.

## Trust and access

- [Methodology](${SITE.origin}/methodology/): formulas, conventions, limitations, and validation
- [Privacy](${SITE.origin}/privacy/): local processing, storage, sharing, and advertising
- [Terms](${SITE.origin}/terms/): permitted use and estimate limitations
- [Contact](${SITE.origin}/contact/): corrections and accessibility feedback
- [Service access](${SITE.origin}/auth.md): public-access and unsupported-capability statement
- [Agent Skills index](${SITE.origin}/.well-known/agent-skills/index.json): browser calculator skills

No public account API, write API, OAuth issuer, remote MCP server, or A2A service is offered.
`;
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
