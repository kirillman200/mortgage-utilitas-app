<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import InteractiveDataChart from "./InteractiveDataChart.vue";
import type {
  HousingData,
  HousingDataPoint,
  HousingSeries,
} from "../lib/housing-data";

const props = defineProps<{ citySlug: string; cityName: string }>();
const data = ref<HousingData | null>(null);
const error = ref("");
const loading = ref(true);
const dataStatus = ref({
  cache: "",
  source: "",
  ageSeconds: 0,
});
let controller: AbortController | undefined;

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});
const percent = new Intl.NumberFormat("en-CA", {
  maximumFractionDigits: 2,
});
const rentRanges = [
  { label: "2Y", months: null },
  { label: "1Y", months: 12 },
];
const rateRanges = [
  { label: "2Y", months: 24 },
  { label: "1Y", months: 12 },
  { label: "6M", months: 6 },
];
const month = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "short",
});

function latest(series?: HousingSeries): HousingDataPoint | undefined {
  return series?.points.at(-1);
}

function formatDate(value: string): string {
  const parsed = new Date(`${value.length === 7 ? `${value}-01` : value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : month.format(parsed);
}

async function loadData() {
  controller?.abort();
  controller = new AbortController();
  loading.value = true;
  error.value = "";

  const timeout = window.setTimeout(() => controller?.abort(), 12_000);
  try {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      response = await fetch(`/api/housing/${props.citySlug}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (response.ok || response.status < 500) break;
      await new Promise((resolve) => window.setTimeout(resolve, 500));
    }
    if (response?.status === 404) {
      error.value =
        "The live data service is not running on this server. Start the Worker-backed site with npm run dev.";
      return;
    }
    if (!response?.ok) throw new Error("Live data request failed");
    data.value = (await response.json()) as HousingData;
    dataStatus.value = {
      cache: response.headers.get("X-Data-Cache") ?? "LIVE",
      source: response.headers.get("X-Data-Source") ?? "live",
      ageSeconds: Number(response.headers.get("X-Data-Age") ?? 0),
    };
  } catch {
    error.value =
      "Live data is temporarily unavailable. The calculators still work without it.";
  } finally {
    window.clearTimeout(timeout);
    loading.value = false;
  }
}

onMounted(loadData);
onBeforeUnmount(() => controller?.abort());

const rentSeries = computed(() =>
  data.value ? [data.value.rent.oneBedroom, data.value.rent.twoBedroom] : [],
);
const rateSeries = computed(() =>
  data.value
    ? [
        data.value.rates.prime,
        data.value.rates.mortgageOneYear,
        data.value.rates.mortgageThreeYear,
        data.value.rates.mortgageFiveYear,
      ]
    : [],
);

const allSeries = computed(() => [...rentSeries.value, ...rateSeries.value]);

const dataWarnings = computed(() => {
  const warnings: string[] = [];
  if (dataStatus.value.source === "snapshot") {
    warnings.push(
      "The live upstream service could not be reached, so this page is using the last validated static snapshot.",
    );
  } else if (dataStatus.value.cache === "STALE") {
    warnings.push(
      "The cached response is older than six hours. A background refresh has been requested.",
    );
  }
  const estimated = rentSeries.value.reduce(
    (total, series) =>
      total + series.points.filter((point) => point.estimated).length,
    0,
  );
  if (estimated > 0) {
    warnings.push(
      `Statistics Canada marks ${estimated} displayed rent observation${estimated === 1 ? "" : "s"} as estimates.`,
    );
  }
  return warnings;
});

const tableRows = computed(() =>
  allSeries.value.flatMap((series) =>
    series.points.map((point) => ({
      measure: series.label,
      unit: series.unit,
      date: point.date,
      value: point.value,
      estimated: point.estimated,
    })),
  ),
);

function csvCell(value: unknown): string {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadCityCsv(): void {
  if (!data.value) return;
  const rows = [
    ["Mortgage Compass city data", "https://mortgage.utilitas.app"],
    ["City", data.value.city.name],
    ["Generated", data.value.generatedAt],
    ["Data source mode", dataStatus.value.source || "live"],
    [],
    ["Measure", "Date", "Value", "Unit", "Estimated"],
    ...tableRows.value.map((row) => [
      row.measure,
      row.date,
      row.value,
      row.unit,
      row.estimated ? "Yes" : "No",
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = `mortgage-compass-${props.citySlug}-housing-data.csv`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
}
</script>

<template>
  <section class="live-dashboard" aria-labelledby="live-data-heading">
    <div class="dashboard-heading">
      <div>
        <p class="eyebrow">Public data dashboard</p>
        <h2 id="live-data-heading">Current {{ cityName }} housing signals</h2>
      </div>
      <div v-if="data" class="freshness">
        <span class="data-state" :data-source="dataStatus.source">
          {{ dataStatus.source === "snapshot" ? "Validated snapshot" : dataStatus.cache === "STALE" ? "Stale cache" : "Current public data" }}
        </span>
        <p>
          Refreshed
          <time :datetime="data.generatedAt">{{ new Date(data.generatedAt).toLocaleString("en-CA") }}</time>
        </p>
      </div>
    </div>

    <div v-if="loading" class="dashboard-state" role="status">
      Loading current public data…
    </div>
    <div v-else-if="error" class="dashboard-state dashboard-error" role="alert">
      <p>{{ error }}</p>
      <button type="button" @click="loadData">Try again</button>
    </div>

    <template v-else-if="data">
      <div v-if="dataWarnings.length" class="data-warnings" role="status">
        <strong>Data quality notice</strong>
        <ul>
          <li v-for="warning in dataWarnings" :key="warning">{{ warning }}</li>
        </ul>
      </div>

      <div class="metric-grid">
        <article>
          <span>One-bedroom asking rent</span>
          <strong>{{ money.format(latest(data.rent.oneBedroom)?.value ?? 0) }}</strong>
          <small>{{ formatDate(latest(data.rent.oneBedroom)?.date ?? "") }}</small>
        </article>
        <article>
          <span>Two-bedroom asking rent</span>
          <strong>{{ money.format(latest(data.rent.twoBedroom)?.value ?? 0) }}</strong>
          <small>{{ formatDate(latest(data.rent.twoBedroom)?.date ?? "") }}</small>
        </article>
        <article>
          <span>Prime rate</span>
          <strong>{{ percent.format(latest(data.rates.prime)?.value ?? 0) }}%</strong>
          <small>{{ formatDate(latest(data.rates.prime)?.date ?? "") }}</small>
        </article>
        <article>
          <span>Five-year posted rate</span>
          <strong>{{ percent.format(latest(data.rates.mortgageFiveYear)?.value ?? 0) }}%</strong>
          <small>{{ formatDate(latest(data.rates.mortgageFiveYear)?.date ?? "") }}</small>
        </article>
        <article>
          <span>Policy interest rate</span>
          <strong>{{ percent.format(latest(data.rates.policy)?.value ?? 0) }}%</strong>
          <small>{{ formatDate(latest(data.rates.policy)?.date ?? "") }}</small>
        </article>
      </div>

      <InteractiveDataChart
        title="Advertised asking-rent trend"
        description="Quarterly Statistics Canada asking rents in Canadian dollars."
        :series="rentSeries"
        value-suffix=""
        value-prefix="$"
        :range-options="rentRanges"
      />
      <InteractiveDataChart
        title="Posted mortgage rate history"
        description="Two years of Bank of Canada prime and conventional one-year, three-year, and five-year posted rates."
        :series="rateSeries"
        value-suffix="%"
        value-prefix=""
        :range-options="rateRanges"
      />

      <div class="data-actions">
        <button type="button" @click="downloadCityCsv">Download chart data as CSV</button>
      </div>

      <details class="data-table">
        <summary>View all chart values as a table</summary>
        <div class="table-scroll">
          <table>
            <caption>Complete public observations used by the charts</caption>
            <thead><tr><th scope="col">Measure</th><th scope="col">Date</th><th scope="col">Value</th><th scope="col">Status</th></tr></thead>
            <tbody>
              <tr v-for="row in tableRows" :key="`${row.measure}-${row.date}`">
                <th scope="row">{{ row.measure }}</th>
                <td>{{ formatDate(row.date) }}</td>
                <td>
                  {{ row.unit === "CAD"
                    ? money.format(row.value)
                    : `${percent.format(row.value)}%` }}
                </td>
                <td>{{ row.estimated ? "Estimate" : "Published" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </template>
  </section>
</template>

<style scoped>
.live-dashboard {
  display: grid;
  gap: 1.5rem;
}

.dashboard-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-heading h2 {
  margin: 0;
}

.freshness {
  display: grid;
  justify-items: end;
  gap: 0.35rem;
  color: var(--ink-soft);
  font-size: 0.82rem;
}

.freshness p {
  margin: 0;
}

.data-state {
  padding: 0.25rem 0.55rem;
  color: #244f3b;
  background: var(--sage-pale);
  border: 1px solid #aac6b5;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-state[data-source="snapshot"] {
  color: #74361f;
  background: #fff0df;
  border-color: #e2b88c;
}

.data-warnings {
  padding: 1rem 1.2rem;
  color: #68321f;
  background: #fff5e8;
  border: 1px solid #e2b88c;
  border-left: 5px solid var(--orange);
  border-radius: 10px;
}

.data-warnings ul {
  margin: 0.4rem 0 0;
  padding-left: 1.2rem;
}

.data-actions {
  display: flex;
  justify-content: flex-end;
}

.data-actions button {
  padding: 0.7rem 1rem;
  color: var(--white);
  background: var(--ink);
  border: 0;
  border-radius: 8px;
  font-weight: 800;
}

.dashboard-state {
  padding: 2rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}

.dashboard-error button {
  padding: 0.6rem 1rem;
  color: var(--white);
  background: var(--ink);
  border: 0;
  border-radius: 999px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.8rem;
}

.metric-grid article {
  padding: 1rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-top: 4px solid var(--gold);
  border-radius: 12px;
}

.metric-grid span,
.metric-grid small {
  display: block;
  color: var(--ink-soft);
  font-size: 0.78rem;
}

.metric-grid strong {
  display: block;
  margin: 0.4rem 0 0.25rem;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.3rem, 2vw, 1.8rem);
}

.data-table {
  padding: 1rem 1.2rem;
  background: var(--paper-deep);
  border: 1px solid var(--line);
  border-radius: 12px;
}

.data-table summary {
  font-weight: 800;
}

.table-scroll {
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}

.data-table caption {
  text-align: left;
}

.data-table th,
.data-table td {
  padding: 0.7rem;
  text-align: left;
  border-bottom: 1px solid var(--line);
}

@media (max-width: 900px) {
  .metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .dashboard-heading {
    display: block;
  }

  .freshness {
    margin-top: 0.6rem;
    justify-items: start;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }

}
</style>
