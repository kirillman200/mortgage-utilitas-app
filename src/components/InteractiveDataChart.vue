<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ActiveElement,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "vue-chartjs";
import type { HousingDataPoint, HousingSeries } from "../lib/housing-data";
import { CHART_SERIES_COLOURS } from "../lib/chart-theme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

interface ChartRange {
  label: string;
  months: number | null;
}

interface PlotPoint {
  x: number;
  y: number;
}

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    series: HousingSeries[];
    valuePrefix?: string;
    valueSuffix?: string;
    rangeOptions?: ChartRange[];
  }>(),
  {
    valuePrefix: "",
    valueSuffix: "",
    rangeOptions: () => [
      { label: "All", months: null },
      { label: "1Y", months: 12 },
    ],
  },
);

const activeRangeIndex = ref(0);
const selected = ref<{ seriesIndex: number; date: string } | null>(null);

watch(
  () => props.series,
  () => {
    selected.value = null;
  },
);

watch(activeRangeIndex, () => {
  selected.value = null;
});

const sourceDates = computed(() =>
  props.series.flatMap((series) => series.points.map((point) => point.date)).sort(),
);

const latestSourceDate = computed(() => sourceDates.value.at(-1) ?? "");

const displayedSeries = computed(() => {
  const activeRange = props.rangeOptions[activeRangeIndex.value] ?? props.rangeOptions[0];
  const cutoff = activeRange?.months
    ? subtractMonths(latestSourceDate.value, activeRange.months)
    : "";

  return props.series.map((series, seriesIndex) => ({
    series,
    seriesIndex,
    points: cutoff
      ? series.points.filter((point) => point.date >= cutoff)
      : series.points,
  }));
});

const displayedDates = computed(() =>
  displayedSeries.value.flatMap((item) => item.points.map((point) => point.date)).sort(),
);

const isRateChart = computed(() => props.valueSuffix === "%");

const chartData = computed<ChartData<"line", PlotPoint[]>>(() => ({
  datasets: displayedSeries.value.map((item) => {
    const colour = CHART_SERIES_COLOURS[item.seriesIndex] ?? "#304652";
    return {
      label: shortSeriesLabel(item.series.label),
      data: item.points.map((point) => ({
        x: dateTimestamp(point.date),
        y: point.value,
      })),
      borderColor: colour,
      backgroundColor: colour,
      pointBackgroundColor: colour,
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      pointRadius: isRateChart.value ? 0 : 4,
      pointHoverRadius: 6,
      pointHitRadius: 12,
      borderWidth: 3,
      tension: isRateChart.value ? 0 : 0.22,
      stepped: isRateChart.value ? "before" : false,
      fill: false,
    };
  }),
}));

const chartOptions = computed<ChartOptions<"line">>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  normalized: true,
  parsing: false,
  animation: {
    duration:
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : 260,
  },
  interaction: {
    mode: "nearest",
    axis: "xy",
    intersect: false,
  },
  onHover: (_event, elements) => selectChartElement(elements),
  onClick: (_event, elements) => selectChartElement(elements),
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      align: "start",
      labels: {
        color: "#203946",
        usePointStyle: true,
        pointStyle: "line",
        boxWidth: 32,
        boxHeight: 8,
        padding: 20,
        font: {
          family: '"Aptos", "Segoe UI", system-ui, sans-serif',
          size: 13,
          weight: 700,
        },
      },
    },
    tooltip: {
      enabled: true,
      mode: "nearest",
      intersect: false,
      displayColors: true,
      backgroundColor: "#122633",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        title(items) {
          return formatTimestamp(items[0]?.parsed.x ?? 0, true);
        },
        label(context) {
          return `${context.dataset.label}: ${formatValue(context.parsed.y)}`;
        },
      },
    },
  },
  scales: {
    x: {
      type: "linear",
      min: displayedDates.value[0]
        ? dateTimestamp(displayedDates.value[0])
        : undefined,
      max: displayedDates.value.at(-1)
        ? dateTimestamp(displayedDates.value.at(-1)!)
        : undefined,
      grid: {
        display: false,
      },
      ticks: {
        color: "#526974",
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 7,
        callback(value) {
          return formatTimestamp(Number(value), false);
        },
      },
      border: {
        color: "#cbbfa9",
      },
    },
    y: {
      grace: "8%",
      beginAtZero: false,
      grid: {
        color: "#e4dac8",
      },
      border: {
        display: false,
      },
      ticks: {
        color: "#526974",
        callback(value) {
          return formatAxisValue(Number(value));
        },
      },
    },
  },
}));

const activePoint = computed(() => {
  if (selected.value) {
    const item = displayedSeries.value.find(
      (candidate) => candidate.seriesIndex === selected.value?.seriesIndex,
    );
    const point = item?.points.find((candidate) => candidate.date === selected.value?.date);
    if (item && point) return { item, point };
  }

  const item = displayedSeries.value[0];
  const point = item?.points.at(-1);
  return item && point ? { item, point } : undefined;
});

const observationCount = computed(() =>
  displayedSeries.value.reduce((total, item) => total + item.points.length, 0),
);

const displayedPeriod = computed(() => {
  const first = displayedDates.value[0];
  const last = displayedDates.value.at(-1);
  return first && last ? `${formatDate(first)} to ${formatDate(last)}` : "";
});

const interpretation = computed(() => {
  const item = displayedSeries.value[0];
  const first = item?.points[0];
  const last = item?.points.at(-1);
  if (!item || !first || !last) return "";
  const difference = last.value - first.value;
  const direction =
    Math.abs(difference) < 0.005
      ? "was unchanged"
      : difference > 0
        ? "increased"
        : "decreased";
  if (direction === "was unchanged") {
    return `Across the selected period, ${shortSeriesLabel(item.series.label)} was unchanged at ${formatValue(last.value)}.`;
  }
  const amount =
    item.series.unit === "percent"
      ? `${Math.abs(difference).toFixed(2)} percentage points`
      : formatValue(Math.abs(difference));
  const percentage =
    item.series.unit === "CAD" && first.value
      ? `, or ${Math.abs(difference / first.value * 100).toFixed(1)}%`
      : "";
  return `Across the selected period, ${shortSeriesLabel(item.series.label)} ${direction} by ${amount}${percentage}.`;
});

function selectChartElement(elements: ActiveElement[]): void {
  const element = elements[0];
  if (!element) return;
  const item = displayedSeries.value[element.datasetIndex];
  const point = item?.points[element.index];
  if (item && point) {
    selected.value = { seriesIndex: item.seriesIndex, date: point.date };
  }
}

function subtractMonths(date: string, months: number): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setUTCMonth(parsed.getUTCMonth() - months);
  return parsed.toISOString().slice(0, 10);
}

function dateTimestamp(value: string): number {
  const normalized = value.length === 7 ? `${value}-01` : value;
  return Date.parse(`${normalized}T00:00:00Z`);
}

function formatDate(value: string): string {
  return formatTimestamp(dateTimestamp(value), true);
}

function formatTimestamp(value: number, includeDay: boolean): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: includeDay ? "numeric" : undefined,
    timeZone: "UTC",
  }).format(parsed);
}

function shortSeriesLabel(label: string): string {
  return label
    .replace("One-year conventional mortgage rate", "1-year posted")
    .replace("Three-year conventional mortgage rate", "3-year posted")
    .replace("Five-year conventional mortgage rate", "5-year posted")
    .replace("One-bedroom asking rent", "1-bedroom")
    .replace("Two-bedroom asking rent", "2-bedroom")
    .replace("Prime rate", "Prime");
}

function formatValue(value: number): string {
  const formatted =
    props.valueSuffix === "%"
      ? new Intl.NumberFormat("en-CA", { maximumFractionDigits: 2 }).format(value)
      : new Intl.NumberFormat("en-CA", { maximumFractionDigits: 0 }).format(value);
  return `${props.valuePrefix}${formatted}${props.valueSuffix}`;
}

function formatAxisValue(value: number): string {
  const formatted = props.valueSuffix === "%" ? value.toFixed(1) : String(Math.round(value));
  return `${props.valuePrefix}${formatted}${props.valueSuffix}`;
}
</script>

<template>
  <figure class="interactive-chart">
    <div class="chart-heading">
      <figcaption>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </figcaption>

      <div class="range-controls" role="group" :aria-label="`${title} date range`">
        <button
          v-for="(range, index) in rangeOptions"
          :key="range.label"
          type="button"
          :aria-pressed="activeRangeIndex === index"
          @click="activeRangeIndex = index"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div class="chart-canvas">
      <Line
        :data="chartData"
        :options="chartOptions"
        role="img"
        :aria-label="`${title}. Interactive chart covering ${displayedPeriod}. Hover or click a line for an exact value. Use the legend to show or hide a series.`"
      />
    </div>

    <p v-if="interpretation" class="chart-interpretation">
      {{ interpretation }}
    </p>

    <div class="chart-footer">
      <p class="chart-meta">
        {{ observationCount.toLocaleString("en-CA") }} public observations
        <span aria-hidden="true">·</span>
        {{ displayedPeriod }}
      </p>
      <div v-if="activePoint" class="chart-readout" aria-live="polite">
        <span>{{ shortSeriesLabel(activePoint.item.series.label) }}</span>
        <strong>{{ formatValue(activePoint.point.value) }}</strong>
        <time :datetime="activePoint.point.date">{{ formatDate(activePoint.point.date) }}</time>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.interactive-chart {
  margin: 0;
  padding: clamp(1rem, 3vw, 1.6rem);
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.chart-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.25rem;
}

figcaption {
  min-width: 0;
}

figcaption h3 {
  margin: 0;
}

figcaption p {
  max-width: 720px;
  margin: 0.35rem 0 0;
  color: var(--ink-soft);
}

.range-controls {
  padding: 0.25rem;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 0.2rem;
  background: var(--paper-deep);
  border: 1px solid var(--line);
  border-radius: 10px;
}

.range-controls button {
  min-width: 48px;
  min-height: 36px;
  padding: 0.35rem 0.7rem;
  color: var(--ink-soft);
  background: transparent;
  border: 0;
  border-radius: 7px;
  font-size: 0.8rem;
  font-weight: 800;
}

.range-controls button[aria-pressed="true"] {
  color: var(--white);
  background: var(--ink);
}

.chart-canvas {
  height: clamp(300px, 42vw, 390px);
  margin-top: 1rem;
  position: relative;
}

.chart-canvas :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}

.chart-interpretation {
  margin: 0.7rem 0 0;
  padding: 0.8rem 0.9rem;
  color: var(--ink);
  background: var(--sage-pale);
  border-left: 4px solid var(--sage);
  border-radius: 0 8px 8px 0;
  font-size: 0.84rem;
}

.chart-footer {
  min-height: 46px;
  margin-top: 0.4rem;
  padding-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid var(--line);
}

.chart-meta {
  margin: 0;
  color: var(--ink-soft);
  font-size: 0.78rem;
}

.chart-meta span {
  margin: 0 0.35rem;
}

.chart-readout {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.25rem 0.65rem;
  text-align: right;
}

.chart-readout span,
.chart-readout time {
  color: var(--ink-soft);
  font-size: 0.8rem;
}

.chart-readout strong {
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.15rem;
}

@media (max-width: 680px) {
  .interactive-chart {
    padding: 0.9rem;
  }

  .chart-heading,
  .chart-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .range-controls {
    align-self: flex-start;
  }

  .chart-canvas {
    height: 320px;
  }

  .chart-readout {
    justify-content: flex-start;
    text-align: left;
  }
}
</style>
