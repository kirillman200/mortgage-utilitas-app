import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const dist = join(root, "dist");
const origin = "https://mortgage.utilitas.app";

const calculatorSlugs = [
  "payment",
  "affordability",
  "extra-payments",
  "refinance",
  "amortization",
  "closing-costs",
  "rent-vs-buy",
  "stress-test",
  "reverse-mortgage"
];

const articleSlugs = [
  "paying-off-your-mortgage-game-changer",
  "darlene-early-reverse-mortgage",
  "how-to-get-preapproved-for-mortgage",
  "mortgage-quote",
  "fixed-rate-mortgage",
  "how-to-calculate-mortgage-payments",
  "what-is-a-reverse-mortgage",
  "private-mortgage",
  "rocket-mortgage",
  "mortgage-rates-news",
  "mortgage-renewal-calculator-canada",
  "mortgage-penalty-calculator-canada",
  "mortgage-amortization-schedule-calculator-canada",
  "mortgage-extra-payment-calculator-canada",
  "closing-cost-calculator-canada",
  "mortgage-refinance-break-even-calculator-canada",
  "rent-vs-buy-calculator-canada"
];
const citySlugs = ["toronto", "vancouver", "montreal", "calgary", "edmonton", "winnipeg"];

const read = (path) => readFile(join(root, path), "utf8");
const readDist = (path) => readFile(join(dist, path), "utf8");

test("all public calculator and guide routes were built", async () => {
  for (const slug of calculatorSlugs) {
    const html = await readDist(join("calculators", slug, "index.html"));
    assert.match(html, new RegExp(`${origin}/calculators/${slug}/`));
    assert.match(html, /Mortgage Compass/);
  }
  for (const slug of articleSlugs) {
    const html = await readDist(join("guides", slug, "index.html"));
    assert.match(html, new RegExp(`${origin}/guides/${slug}/`));
    assert.match(html, /application\/ld\+json/);
  }
  for (const slug of citySlugs) {
    const html = await readDist(join("housing", slug, "index.html"));
    assert.match(html, new RegExp(`${origin}/housing/${slug}/`));
    assert.match(html, /Dataset/);
    assert.match(html, new RegExp(`citySlug[^>]+${slug}`));
  }
});

test("every public HTML page has visible breadcrumbs and page SEO", async () => {
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...await walk(path));
      else if (entry.name === "index.html") files.push(path);
    }
    return files;
  }

  const pages = await walk(dist);
  for (const file of pages) {
    const html = await readFile(file, "utf8");
    assert.match(html, /<title>[^<]+<\/title>/, file);
    assert.match(html, /<meta name="description" content="[^"]+"/, file);
    assert.match(html, /<link rel="canonical" href="https:\/\/mortgage\.utilitas\.app/, file);
    assert.match(html, /"@type":"WebPage"/, file);
    if (file !== join(dist, "index.html")) {
      assert.match(html, /<nav class="breadcrumbs" aria-label="Breadcrumb">/, file);
      assert.match(html, /"@type":"BreadcrumbList"/, file);
    }
  }
});

test("every article reserves at least five labelled ad placements", async () => {
  for (const slug of articleSlugs) {
    const html = await readDist(join("guides", slug, "index.html"));
    const placements = html.match(/data-ad-placement=/g) ?? [];
    assert.ok(placements.length >= 5, `${slug} had only ${placements.length} ad placements`);
    assert.match(html, /aria-label="Advertisement"/);
  }
});

test("new SEO guides show their actual publication date", async () => {
  for (const slug of [
    "mortgage-amortization-schedule-calculator-canada",
    "mortgage-extra-payment-calculator-canada",
    "closing-cost-calculator-canada",
    "mortgage-refinance-break-even-calculator-canada",
    "rent-vs-buy-calculator-canada"
  ]) {
    const html = await readDist(join("guides", slug, "index.html"));
    assert.match(html, /datetime="2026-08-06">August 6, 2026<\/time>/);
    assert.match(html, /"datePublished":"2026-08-06"/);
    assert.match(html, /"dateModified":"2026-08-06"/);
  }
});

test("calculator pages publish specific guidance and FAQ schema", async () => {
  for (const slug of calculatorSlugs) {
    const html = await readDist(join("calculators", slug, "index.html"));
    assert.match(html, /Calculator guide/);
    assert.match(html, /"@type":"FAQPage"/);
    assert.match(html, /Frequently asked questions/);
    assert.match(html, /Official references/);
  }
});

test("exports and machine indexes identify the production URL", async () => {
  const component = await read("src/components/MortgageWorkbench.vue");
  const pdf = await read("src/lib/pdf.ts");
  assert.match(component, /https:\/\/mortgage\.utilitas\.app/);
  assert.match(component, /Mortgage Compass export/);
  assert.match(pdf, /Source application:/);
  assert.match(pdf, /application\/pdf/);
  assert.match(await readDist("llms.txt"), /https:\/\/mortgage\.utilitas\.app/);
  assert.match(await readDist("llms-full.txt"), /No public account API|does not provide/);
});

test("local serving uses the Worker runtime required by live data", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  const developmentRunner = await read("scripts/run-worker-dev.mjs");
  const e2eRunner = await read("scripts/run-e2e.mjs");
  assert.match(packageJson.scripts.dev, /run-worker-dev\.mjs/);
  assert.match(packageJson.scripts.preview, /run-worker-dev\.mjs --no-watch/);
  assert.match(developmentRunner, /wrangler\.js/);
  assert.match(developmentRunner, /"dev", "--local"[\s\S]*"--host", "127.0.0.1"[\s\S]*"--port", "4321"/);
  assert.match(e2eRunner, /wranglerCli/);
});

test("Agent Skills digest matches the published skill", async () => {
  const index = JSON.parse(await read("public/.well-known/agent-skills/index.json"));
  const skill = await read("public/.well-known/agent-skills/mortgage-planning/SKILL.md");
  const digest = createHash("sha256").update(skill).digest("hex");
  assert.equal(index.skills[0].sha256, digest);
  assert.equal(index.$schema, "https://schemas.agentskills.io/discovery/0.2.0/schema.json");
});

test("robots, security, access, and ad contracts are truthful", async () => {
  assert.match(await readDist("robots.txt"), /Content-Signal: ai-train=no, search=yes, ai-input=yes/);
  assert.match(await readDist("auth.md"), /does not offer user accounts, an OAuth issuer, a remote MCP server, an A2A endpoint/i);
  assert.match(await readDist(join(".well-known", "security.txt")), /Canonical: https:\/\/mortgage\.utilitas\.app\/\.well-known\/security\.txt/);
  assert.match(await readDist("ads.txt"), /not currently authorized/);
});

test("favicon family is published and wired into the shared head", async () => {
  const layout = await read("src/layouts/BaseLayout.astro");
  const manifest = JSON.parse(await read("public/manifest.webmanifest"));
  const requiredFiles = [
    "public/favicon.svg",
    "public/favicon.ico",
    "public/favicon-32.png",
    "public/apple-touch-icon.png",
    "public/favicon-192.png",
    "public/favicon-512.png",
  ];

  for (const file of requiredFiles) {
    assert.ok((await stat(join(root, file))).size > 0, `${file} must not be empty`);
  }

  assert.match(layout, /href="\/favicon\.ico" sizes="any"/);
  assert.match(layout, /href="\/favicon\.svg" type="image\/svg\+xml"/);
  assert.match(layout, /href="\/favicon-32\.png" type="image\/png" sizes="32x32"/);
  assert.match(layout, /href="\/apple-touch-icon\.png" sizes="180x180"/);
  assert.deepEqual(
    manifest.icons.map(({ src, sizes, type }) => ({ src, sizes, type })),
    [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
  );

  const ico = await readFile(join(root, "public/favicon.ico"));
  assert.deepEqual([...ico.subarray(0, 4)], [0, 0, 1, 0]);
  assert.equal(ico.readUInt16LE(4), 3);
});
test("source and public content contain no em dash characters", async () => {
  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) files.push(...await walk(path));
      else files.push(path);
    }
    return files;
  }
  const files = [...await walk(join(root, "src")), ...await walk(join(root, "public"))];
  for (const file of files) {
    const content = await readFile(file, "utf8");
    assert.equal(content.includes("\u2014"), false, `em dash found in ${file}`);
  }
});

test("published articles contain no leaked AI or editorial reasoning", async () => {
  const articles = await read("src/data/articles.ts");
  const forbiddenEditorialProcessLanguage = [
    /\bas an ai\b/i,
    /\blanguage model\b/i,
    /\bchain of thought\b/i,
    /\blet(?:'|’)s think\b/i,
    /\bsources reviewed\b/i,
    /\bthis article intentionally\b/i,
    /\bsearch phrase does not identify\b/i,
    /\bchatgpt\b/i,
    /\bmy reasoning\b/i,
    /\bdraft note\b/i,
    /\beditorial note\b/i,
    /\bplaceholder\b/i
  ];

  for (const pattern of forbiddenEditorialProcessLanguage) {
    assert.doesNotMatch(articles, pattern);
  }

  assert.match(articles, /Darlene Early is an Ontario homeowner/);
  assert.match(articles, /competing claims in court/);
});
