<script setup lang="ts">
import { computed } from "vue";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "vue-chartjs";
import { CHART_SERIES_COLOURS } from "../lib/chart-theme";
import type { CalculatorChartModel } from "../lib/calculator-chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const props = defineProps<{ model: CalculatorChartModel }>();

const labels = computed(() =>
  props.model.series[0]?.points.map((point) => point.label) ?? [],
);

const chartData = computed<ChartData<"line">>(() => ({
  labels: labels.value,
  datasets: props.model.series.map((series, index) => ({
    label: series.label,
    data: series.points.map((point) => point.value),
    borderColor: CHART_SERIES_COLOURS[index] ?? "#304652",
    backgroundColor: CHART_SERIES_COLOURS[index] ?? "#304652",
    pointBackgroundColor: CHART_SERIES_COLOURS[index] ?? "#304652",
    pointBorderColor: "#ffffff",
    pointBorderWidth: 2,
    pointRadius: series.points.length <= 12 ? 3 : 0,
    pointHoverRadius: 6,
    pointHitRadius: 12,
    borderWidth: 3,
    cubicInterpolationMode: "monotone",
    tension: 0.34,
    fill: false,
  })),
}));

const options = computed<ChartOptions<"line">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  normalized: true,
  animation: {
    duration:
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 320,
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      position: "bottom",
      align: "start",
      labels: {
        color: "#203946",
        usePointStyle: true,
        pointStyle: "line",
        boxWidth: 30,
        padding: 18,
        font: {
          family: '"Aptos", "Segoe UI", system-ui, sans-serif',
          size: 12,
          weight: 700,
        },
      },
    },
    tooltip: {
      backgroundColor: "#122633",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      padding: 11,
      cornerRadius: 8,
      callbacks: {
        label(context) {
          return `${context.dataset.label}: ${formatValue(context.parsed.y)}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#526974",
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 6,
      },
      border: { color: "#cbbfa9" },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#e4dac8" },
      border: { display: false },
      ticks: {
        color: "#526974",
        callback(value) {
          return compactValue(Number(value));
        },
      },
    },
  },
}));

function formatValue(value: number): string {
  const digits = props.model.valueSuffix === "%" ? 2 : 0;
  const formatted = new Intl.NumberFormat("en-CA", {
    maximumFractionDigits: digits,
  }).format(value);
  return `${props.model.valuePrefix ?? ""}${formatted}${props.model.valueSuffix ?? ""}`;
}

function compactValue(value: number): string {
  if (props.model.valueSuffix === "%") return `${value.toFixed(1)}%`;
  const compact = new Intl.NumberFormat("en-CA", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return `${props.model.valuePrefix ?? ""}${compact}${props.model.valueSuffix ?? ""}`;
}
</script>

<template>
  <figure class="calculator-chart">
    <figcaption>
      <h3>{{ model.title }}</h3>
      <p>{{ model.description }}</p>
    </figcaption>
    <div class="calculator-chart-canvas">
      <Line
        :data="chartData"
        :options="options"
        role="img"
        :aria-label="`${model.title}. ${model.description}`"
      />
    </div>
    <p class="calculator-chart-interpretation">{{ model.interpretation }}</p>
    <details class="calculator-chart-table">
      <summary>View chart values as a table</summary>
      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th
                v-for="series in model.series"
                :key="series.label"
                scope="col"
              >
                {{ series.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(label, index) in labels" :key="`${label}-${index}`">
              <th scope="row">{{ label }}</th>
              <td v-for="series in model.series" :key="series.label">
                {{ formatValue(series.points[index]?.value ?? 0) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </figure>
</template>

<style scoped>
.calculator-chart {
  margin: 1rem 0 0;
  padding: 1rem;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 10px;
}

figcaption h3 {
  margin: 0;
  font-size: 1rem;
}

figcaption p {
  margin: 0.25rem 0 0;
  color: var(--ink-soft);
  font-size: 0.78rem;
}

.calculator-chart-canvas {
  height: 250px;
  margin-top: 0.8rem;
  position: relative;
}

.calculator-chart-canvas :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}

.calculator-chart-interpretation {
  margin: 0.5rem 0 0;
  padding: 0.75rem;
  color: var(--ink);
  background: var(--sage-pale);
  border-left: 4px solid var(--sage);
  font-size: 0.8rem;
}

.calculator-chart-table {
  margin-top: 0.75rem;
  font-size: 0.78rem;
}

.calculator-chart-table summary {
  font-weight: 800;
}

.calculator-chart-table > div {
  max-height: 280px;
  overflow: auto;
}

table {
  width: 100%;
  margin-top: 0.6rem;
  border-collapse: collapse;
  white-space: nowrap;
}

th,
td {
  padding: 0.55rem;
  text-align: right;
  border-bottom: 1px solid var(--line);
}

th:first-child,
td:first-child {
  text-align: left;
}

@media (max-width: 640px) {
  .calculator-chart {
    padding: 0.8rem;
  }

  .calculator-chart-canvas {
    height: 230px;
  }
}
</style>
