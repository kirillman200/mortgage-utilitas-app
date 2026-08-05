import { HOUSING_CITY_ROUTES } from "./housing-cities";

export const SITE = {
  name: "Mortgage Compass",
  network: "Utilitas",
  origin: "https://mortgage.utilitas.app",
  description:
    "Private, browser-based mortgage calculators for payments, affordability, payoff planning, refinancing, closing costs, reverse mortgages, and rent-versus-buy decisions.",
  contact: "contact@utilitas.app",
  locale: "en-CA",
  published: "2026-07-28",
  updated: "2026-08-05"
} as const;

export type CalculatorSlug =
  | "payment"
  | "affordability"
  | "extra-payments"
  | "refinance"
  | "amortization"
  | "closing-costs"
  | "rent-vs-buy"
  | "stress-test"
  | "reverse-mortgage";

export const CALCULATORS: Array<{
  slug: CalculatorSlug;
  name: string;
  short: string;
  description: string;
  eyebrow: string;
}> = [
  {
    slug: "payment",
    name: "Mortgage payment",
    short: "Payment",
    description: "Model principal, interest, taxes, insurance, fees, and payment frequency.",
    eyebrow: "Start here"
  },
  {
    slug: "affordability",
    name: "Home affordability",
    short: "Affordability",
    description: "Estimate a prudent price range using income, debt, housing costs, and a cash buffer.",
    eyebrow: "Budget guardrails"
  },
  {
    slug: "extra-payments",
    name: "Extra payment payoff",
    short: "Payoff",
    description: "Compare recurring and annual prepayments, interest saved, and a target payoff date.",
    eyebrow: "Accelerate"
  },
  {
    slug: "refinance",
    name: "Refinance break-even",
    short: "Refinance",
    description: "Compare remaining cost, fees, penalties, break-even month, and total interest.",
    eyebrow: "Switch check"
  },
  {
    slug: "amortization",
    name: "Amortization schedule",
    short: "Schedule",
    description: "Inspect every payment or yearly rollups, principal progress, and renewal balance.",
    eyebrow: "Full timeline"
  },
  {
    slug: "closing-costs",
    name: "Closing cost planner",
    short: "Closing costs",
    description: "Plan land transfer tax, legal fees, inspection, appraisal, moving, and reserves.",
    eyebrow: "Cash to close"
  },
  {
    slug: "rent-vs-buy",
    name: "Rent versus buy",
    short: "Rent vs buy",
    description: "Compare unrecoverable costs, equity, investment opportunity cost, and break-even.",
    eyebrow: "Long view"
  },
  {
    slug: "stress-test",
    name: "Rate stress test",
    short: "Stress test",
    description: "See payments and debt ratios across higher-rate scenarios before renewal.",
    eyebrow: "Risk lens"
  },
  {
    slug: "reverse-mortgage",
    name: "Reverse mortgage projection",
    short: "Reverse",
    description: "Project a growing loan balance and remaining home equity under transparent assumptions.",
    eyebrow: "Equity path"
  }
];

export const TRUST_ROUTES = [
  { href: "/about/", label: "About" },
  { href: "/methodology/", label: "Methodology" },
  { href: "/privacy/", label: "Privacy" },
  { href: "/terms/", label: "Terms" },
  { href: "/contact/", label: "Contact" }
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/calculators/",
  ...CALCULATORS.map((calculator) => `/calculators/${calculator.slug}/`),
  "/guides/",
  "/housing/",
  ...HOUSING_CITY_ROUTES,
  ...TRUST_ROUTES.map((route) => route.href)
];
