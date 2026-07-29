export interface HousingCity {
  slug: string;
  name: string;
  province: string;
  statCanGeographyId: number;
  description: string;
}

export const HOUSING_CITIES: HousingCity[] = [
  {
    slug: "toronto",
    name: "Toronto",
    province: "Ontario",
    statCanGeographyId: 27,
    description:
      "Track Toronto asking rents and benchmark Canadian mortgage rates with current public data.",
  },
  {
    slug: "vancouver",
    name: "Vancouver",
    province: "British Columbia",
    statCanGeographyId: 41,
    description:
      "Compare Vancouver asking rents with current Canadian mortgage and policy rates.",
  },
  {
    slug: "montreal",
    name: "Montréal",
    province: "Quebec",
    statCanGeographyId: 7,
    description:
      "Review Montréal asking-rent trends alongside current Canadian borrowing-rate benchmarks.",
  },
  {
    slug: "calgary",
    name: "Calgary",
    province: "Alberta",
    statCanGeographyId: 32,
    description:
      "Follow Calgary asking rents and the national rates that shape mortgage affordability.",
  },
  {
    slug: "edmonton",
    name: "Edmonton",
    province: "Alberta",
    statCanGeographyId: 33,
    description:
      "Explore Edmonton asking-rent data with current Canadian mortgage-rate context.",
  },
  {
    slug: "winnipeg",
    name: "Winnipeg",
    province: "Manitoba",
    statCanGeographyId: 29,
    description:
      "See Winnipeg asking-rent trends and current mortgage and policy-rate benchmarks.",
  },
];

export const HOUSING_CITY_ROUTES = HOUSING_CITIES.map(
  (city) => `/housing/${city.slug}/`,
);

export function findHousingCity(slug: string): HousingCity | undefined {
  return HOUSING_CITIES.find((city) => city.slug === slug);
}
