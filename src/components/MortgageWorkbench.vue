<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import CalculatorChart from "./CalculatorChart.vue";
import {
  buildSchedule,
  maxPrincipalForPayment,
  paymentForFrequency,
  periodicPayment,
  periodicRate,
  propertyTransferTax,
  refinanceComparison,
  reverseMortgageProjection,
  totalInterest,
  type LoanInputs,
  type PaymentFrequency
} from "../lib/mortgage";
import type { CalculatorSlug } from "../data/site";
import type { CalculatorChartModel } from "../lib/calculator-chart";

const APP_URL = "https://mortgage.utilitas.app";
const STORAGE_KEY = "mortgage-compass-scenario-v1";

const props = defineProps<{ initialMode?: CalculatorSlug }>();

const mode = ref<CalculatorSlug>(props.initialMode ?? "payment");
const status = ref("");
const hydrated = ref(false);
const showFullSchedule = ref(false);
const comparison = ref<null | { label: string; payment: number; interest: number; payoffYears: number }>(null);

const state = reactive({
  country: "CA" as "CA" | "US",
  homePrice: 650000,
  downPayment: 130000,
  rate: 4.75,
  years: 25,
  frequency: "monthly" as PaymentFrequency,
  propertyTax: 4800,
  monthlyInsurance: 135,
  monthlyFees: 0,
  householdIncome: 125000,
  monthlyDebt: 750,
  housingRatio: 32,
  totalDebtRatio: 40,
  availableCash: 155000,
  cashBuffer: 15000,
  extraPerPayment: 200,
  annualExtra: 3000,
  oneTimeExtra: 10000,
  oneTimeExtraAtPayment: 12,
  currentBalance: 420000,
  currentRate: 5.8,
  remainingYears: 22,
  newRate: 4.65,
  newYears: 20,
  refinanceFees: 2800,
  prepaymentPenalty: 4500,
  legalFees: 1800,
  inspection: 550,
  appraisal: 500,
  moving: 1800,
  closingJurisdiction: "toronto" as "manual" | "ontario" | "toronto" | "british-columbia",
  firstTimeBuyer: false,
  transferTaxRate: 1.5,
  titleInsurance: 450,
  initialRepairs: 2500,
  monthlyRent: 2650,
  rentGrowth: 3,
  homeGrowth: 2.5,
  investmentReturn: 5,
  maintenanceRate: 1,
  sellingCostRate: 5,
  horizonYears: 10,
  stressIncrease: 2,
  reverseAdvance: 150000,
  reverseMonthlyAdvance: 500,
  reverseRate: 6.5,
  reverseYears: 15
});

const isCanada = computed(() => state.country === "CA");
const currency = computed(() => (isCanada.value ? "CAD" : "USD"));
const locale = computed(() => (isCanada.value ? "en-CA" : "en-US"));
const convention = computed<"canada" | "us">(() => (isCanada.value ? "canada" : "us"));

const money = (value: number, digits = 0) =>
  new Intl.NumberFormat(locale.value, {
    style: "currency",
    currency: currency.value,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(Number.isFinite(value) ? value : 0);

const number = (value: number, digits = 1) =>
  new Intl.NumberFormat(locale.value, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(Number.isFinite(value) ? value : 0);

const principal = computed(() => Math.max(0, state.homePrice - state.downPayment));
const loanInputs = computed<LoanInputs>(() => ({
  principal: principal.value,
  annualRate: state.rate,
  years: state.years,
  frequency: state.frequency,
  rateConvention: convention.value
}));
const baseSchedule = computed(() => buildSchedule(loanInputs.value));
const paymentSchedule = computed(() =>
  buildSchedule({
    ...loanInputs.value,
    extraPerPayment: mode.value === "extra-payments" ? state.extraPerPayment : 0,
    annualExtra: mode.value === "extra-payments" ? state.annualExtra : 0,
    oneTimeExtra: mode.value === "extra-payments" ? state.oneTimeExtra : 0,
    oneTimeExtraAtPayment: state.oneTimeExtraAtPayment
  })
);
const regularPayment = computed(() => paymentForFrequency(loanInputs.value));
const periodsPerYear = computed(() =>
  state.frequency === "monthly" ? 12 : state.frequency === "semi-monthly" ? 24 : 26
);
const monthlyPI = computed(() =>
  periodicPayment(principal.value, state.rate, state.years, 12, convention.value)
);
const monthlyHousing = computed(
  () =>
    monthlyPI.value +
    state.propertyTax / 12 +
    state.monthlyInsurance +
    state.monthlyFees
);

const payoffYears = computed(() => paymentSchedule.value.length / periodsPerYear.value);
const interestSaved = computed(
  () => totalInterest(baseSchedule.value) - totalInterest(paymentSchedule.value)
);

const affordability = computed(() => {
  const grossMonthly = state.householdIncome / 12;
  const housingCap = grossMonthly * state.housingRatio / 100;
  const debtCap = grossMonthly * state.totalDebtRatio / 100 - state.monthlyDebt;
  const maxHousing = Math.max(0, Math.min(housingCap, debtCap));
  const availablePI = Math.max(
    0,
    maxHousing - state.propertyTax / 12 - state.monthlyInsurance - state.monthlyFees
  );
  const maxLoan = maxPrincipalForPayment(
    availablePI,
    state.rate,
    state.years,
    convention.value
  );
  const cashDown = Math.max(0, state.availableCash - state.cashBuffer);
  const maxPrice = maxLoan + cashDown;
  return {
    maxHousing,
    availablePI,
    maxLoan,
    cashDown,
    maxPrice,
    housingRatio: grossMonthly > 0 ? monthlyHousing.value / grossMonthly * 100 : 0,
    totalRatio:
      grossMonthly > 0 ? (monthlyHousing.value + state.monthlyDebt) / grossMonthly * 100 : 0
  };
});

const refinance = computed(() =>
  refinanceComparison({
    balance: state.currentBalance,
    currentRate: state.currentRate,
    remainingYears: state.remainingYears,
    newRate: state.newRate,
    newYears: state.newYears,
    fees: state.refinanceFees,
    penalty: state.prepaymentPenalty,
    rateConvention: convention.value
  })
);

const closing = computed(() => {
  const tax = state.closingJurisdiction === "manual"
    ? {
        provincial: state.homePrice * state.transferTaxRate / 100,
        municipal: 0,
        gross: state.homePrice * state.transferTaxRate / 100,
        rebate: 0,
        net: state.homePrice * state.transferTaxRate / 100
      }
    : propertyTransferTax({
        value: state.homePrice,
        jurisdiction: state.closingJurisdiction,
        firstTimeBuyer: state.firstTimeBuyer
      });
  const other =
    state.legalFees +
    state.inspection +
    state.appraisal +
    state.moving +
    state.titleInsurance +
    state.initialRepairs;
  const total = state.downPayment + tax.net + other + state.cashBuffer;
  return {
    transferTax: tax.net,
    transferTaxGross: tax.gross,
    transferTaxRebate: tax.rebate,
    provincialTax: tax.provincial,
    municipalTax: tax.municipal,
    other,
    total,
    gap: state.availableCash - total
  };
});

const stressRows = computed(() => [0, 1, state.stressIncrease, 3, 5].map((increase) => {
  const rate = state.rate + increase;
  const payment = periodicPayment(principal.value, rate, state.years, 12, convention.value);
  const housing = payment + state.propertyTax / 12 + state.monthlyInsurance + state.monthlyFees;
  const gross = state.householdIncome / 12;
  return {
    increase,
    rate,
    payment,
    housing,
    totalDebtRatio: gross > 0 ? (housing + state.monthlyDebt) / gross * 100 : 0
  };
}));

const rentVsBuy = computed(() => {
  let homeValue = state.homePrice;
  let balance = principal.value;
  let rent = state.monthlyRent;
  let invested = Math.max(0, state.availableCash - state.downPayment);
  const monthlyRate = periodicRate(state.rate, 12, convention.value);
  const payment = periodicPayment(principal.value, state.rate, state.years, 12, convention.value);
  const investmentMonthly = (1 + state.investmentReturn / 100) ** (1 / 12) - 1;
  const rows: Array<{ year: number; buyNet: number; rentNet: number; difference: number }> = [];

  for (let month = 1; month <= state.horizonYears * 12; month += 1) {
    const interest = balance * monthlyRate;
    balance = Math.max(0, balance - Math.max(0, payment - interest));
    homeValue *= (1 + state.homeGrowth / 100) ** (1 / 12);
    const ownershipCost =
      payment +
      state.propertyTax / 12 +
      state.monthlyInsurance +
      state.monthlyFees +
      state.homePrice * state.maintenanceRate / 100 / 12;
    const monthlyDifference = ownershipCost - rent;
    invested = invested * (1 + investmentMonthly) + Math.max(0, monthlyDifference);
    rent *= (1 + state.rentGrowth / 100) ** (1 / 12);
    if (month % 12 === 0) {
      const saleCosts = homeValue * state.sellingCostRate / 100;
      const buyNet = homeValue - balance - saleCosts;
      const rentNet = invested;
      rows.push({ year: month / 12, buyNet, rentNet, difference: buyNet - rentNet });
    }
  }
  return rows;
});

const reverseRows = computed(() =>
  reverseMortgageProjection({
    homeValue: state.homePrice,
    initialAdvance: state.reverseAdvance,
    monthlyAdvance: state.reverseMonthlyAdvance,
    annualRate: state.reverseRate,
    homeGrowth: state.homeGrowth,
    years: state.reverseYears
  })
);

type ScheduleRows = ReturnType<typeof buildSchedule>;

interface YearlyPaymentRow {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extra: number;
  balance: number;
}

function groupSchedule(rows: ScheduleRows): YearlyPaymentRow[] {
  const grouped: YearlyPaymentRow[] = [];
  rows.forEach((row, index) => {
    const year = Math.ceil((index + 1) / periodsPerYear.value);
    const existing = grouped[year - 1];
    if (existing) {
      existing.payment += row.payment;
      existing.principal += row.principal;
      existing.interest += row.interest;
      existing.extra += row.extra;
      existing.balance = row.balance;
    } else {
      grouped.push({
        year,
        payment: row.payment,
        principal: row.principal,
        interest: row.interest,
        extra: row.extra,
        balance: row.balance
      });
    }
  });
  return grouped;
}

const yearlySchedule = computed(() => groupSchedule(paymentSchedule.value));
const baseYearlySchedule = computed(() => groupSchedule(baseSchedule.value));

function cumulativeInterestSeries(rows: YearlyPaymentRow[]) {
  let total = 0;
  return rows.map((row) => {
    total += row.interest;
    return { label: `Year ${row.year}`, value: total };
  });
}

const calculatorChart = computed<CalculatorChartModel | null>(() => {
  if (mode.value === "payment" || mode.value === "amortization") {
    return {
      title: "Balance and cumulative interest",
      description: "The chart updates immediately from the assumptions in this browser.",
      interpretation: `The balance reaches ${money(yearlySchedule.value.at(-1)?.balance ?? 0)} after ${yearlySchedule.value.length} years, with ${money(totalInterest(paymentSchedule.value))} of cumulative interest in this model.`,
      valuePrefix: isCanada.value ? "$" : "US$",
      series: [
        {
          label: "Remaining balance",
          points: yearlySchedule.value.map((row) => ({
            label: `Year ${row.year}`,
            value: row.balance,
          })),
        },
        {
          label: "Cumulative interest",
          points: cumulativeInterestSeries(yearlySchedule.value),
        },
      ],
    };
  }

  if (mode.value === "extra-payments") {
    const accelerated = new Map(
      yearlySchedule.value.map((row) => [row.year, row.balance]),
    );
    return {
      title: "Regular versus accelerated payoff",
      description: "Compare the projected balance with and without the selected extra payments.",
      interpretation: `The selected prepayments save about ${money(interestSaved.value)} and shorten payoff by ${number(state.years - payoffYears.value, 1)} years.`,
      valuePrefix: isCanada.value ? "$" : "US$",
      series: [
        {
          label: "Regular plan",
          points: baseYearlySchedule.value.map((row) => ({
            label: `Year ${row.year}`,
            value: row.balance,
          })),
        },
        {
          label: "With prepayments",
          points: baseYearlySchedule.value.map((row) => ({
            label: `Year ${row.year}`,
            value: accelerated.get(row.year) ?? 0,
          })),
        },
      ],
    };
  }

  if (mode.value === "stress-test") {
    const rows = [...new Map(
      stressRows.value.map((row) => [row.rate.toFixed(4), row]),
    ).values()].sort((left, right) => left.rate - right.rate);
    const selected =
      stressRows.value.find((row) => row.increase === state.stressIncrease) ??
      stressRows.value[0];
    return {
      title: "Renewal-rate payment sensitivity",
      description: "Monthly principal and interest across the tested renewal rates.",
      interpretation: selected
        ? `At ${number(selected.rate, 2)}%, the modeled monthly payment is ${money(selected.payment, 2)}.`
        : "Enter valid assumptions to compare renewal rates.",
      valuePrefix: isCanada.value ? "$" : "US$",
      series: [
        {
          label: "Monthly payment",
          points: rows.map((row) => ({
            label: `${number(row.rate, 2)}%`,
            value: row.payment,
          })),
        },
      ],
    };
  }

  if (mode.value === "refinance") {
    const switchingCosts = state.refinanceFees + state.prepaymentPenalty;
    const monthlySavings = refinance.value.currentPayment - refinance.value.newPayment;
    const months = Array.from({ length: 11 }, (_, index) => index * 6);
    return {
      title: "Refinance break-even path",
      description: "Cumulative payment savings compared with the entered switching costs.",
      interpretation: refinance.value.breakEvenMonths
        ? `The modeled payment savings recover the entered costs after about ${refinance.value.breakEvenMonths} months.`
        : "The entered costs are not recovered by the modeled monthly payment difference.",
      valuePrefix: isCanada.value ? "$" : "US$",
      series: [
        {
          label: "Cumulative payment savings",
          points: months.map((month) => ({
            label: `${month} mo`,
            value: monthlySavings * month,
          })),
        },
        {
          label: "Switching costs",
          points: months.map((month) => ({
            label: `${month} mo`,
            value: switchingCosts,
          })),
        },
      ],
    };
  }

  return null;
});

const modeTitle = computed(() => {
  const titles: Record<CalculatorSlug, string> = {
    payment: "Payment plan",
    affordability: "Affordability range",
    "extra-payments": "Payoff accelerator",
    refinance: "Refinance break-even",
    amortization: "Amortization explorer",
    "closing-costs": "Cash-to-close plan",
    "rent-vs-buy": "Rent versus buy",
    "stress-test": "Renewal stress test",
    "reverse-mortgage": "Reverse mortgage projection"
  };
  return titles[mode.value];
});

const exportRows = computed(() => {
  if (mode.value === "stress-test") return stressRows.value;
  if (mode.value === "rent-vs-buy") return rentVsBuy.value;
  if (mode.value === "reverse-mortgage") return reverseRows.value;
  if (mode.value === "refinance") return [{
    currentPayment: refinance.value.currentPayment,
    newPayment: refinance.value.newPayment,
    monthlySavings: refinance.value.monthlySavings,
    breakEvenMonths: refinance.value.breakEvenMonths,
    currentInterest: refinance.value.currentInterest,
    newInterest: refinance.value.newInterest,
    lifetimeSavings: refinance.value.lifetimeSavings
  }];
  if (mode.value === "closing-costs") return [{
    downPayment: state.downPayment,
    provincialTransferTaxBeforeRelief: closing.value.provincialTax,
    municipalTransferTaxBeforeRelief: closing.value.municipalTax,
    estimatedFirstTimeBuyerRelief: closing.value.transferTaxRebate,
    transferTaxAfterRelief: closing.value.transferTax,
    legalFees: state.legalFees,
    inspection: state.inspection,
    appraisal: state.appraisal,
    titleInsurance: state.titleInsurance,
    moving: state.moving,
    initialRepairs: state.initialRepairs,
    retainedCashBuffer: state.cashBuffer,
    estimatedCashToClose: closing.value.total,
    cashRemaining: closing.value.gap
  }];
  return paymentSchedule.value.map((row) => ({
    paymentNumber: row.paymentNumber,
    date: row.date.toISOString().slice(0, 10),
    payment: row.payment,
    principal: row.principal,
    interest: row.interest,
    extra: row.extra,
    balance: row.balance
  }));
});

const summaryLines = computed(() => {
  if (mode.value === "affordability") {
    return [
      ["Estimated price ceiling", money(affordability.value.maxPrice)],
      ["Mortgage supported", money(affordability.value.maxLoan)],
      ["Monthly housing cap", money(affordability.value.maxHousing)]
    ];
  }
  if (mode.value === "refinance") {
    return [
      ["Current payment", money(refinance.value.currentPayment, 2)],
      ["New payment", money(refinance.value.newPayment, 2)],
      ["Break-even", refinance.value.breakEvenMonths ? `${refinance.value.breakEvenMonths} months` : "No break-even"]
    ];
  }
  if (mode.value === "closing-costs") {
    return [
      ["Estimated cash to close", money(closing.value.total)],
      ["Transfer tax estimate", money(closing.value.transferTax)],
      ["Cash remaining", money(closing.value.gap)]
    ];
  }
  if (mode.value === "rent-vs-buy") {
    const last = rentVsBuy.value.at(-1);
    return [
      ["Buy net position", money(last?.buyNet ?? 0)],
      ["Rent net position", money(last?.rentNet ?? 0)],
      ["Difference", money(last?.difference ?? 0)]
    ];
  }
  if (mode.value === "stress-test") {
    const selected = stressRows.value.find((row) => row.increase === state.stressIncrease) ?? stressRows.value[0]!;
    return [
      ["Stressed rate", `${number(selected.rate, 2)}%`],
      ["Stressed payment", money(selected.payment, 2)],
      ["Total debt ratio", `${number(selected.totalDebtRatio, 1)}%`]
    ];
  }
  if (mode.value === "reverse-mortgage") {
    const last = reverseRows.value.at(-1);
    return [
      ["Projected loan balance", money(last?.balance ?? 0)],
      ["Projected home value", money(last?.homeValue ?? 0)],
      ["Remaining equity", money(last?.equity ?? 0)]
    ];
  }
  return [
    ["Payment", money(regularPayment.value, 2)],
    ["Payoff time", `${number(payoffYears.value, 1)} years`],
    ["Total interest", money(totalInterest(paymentSchedule.value))]
  ];
});

async function setMode(next: CalculatorSlug) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  mode.value = next;
  status.value = "";
  await nextTick();
  window.scrollTo(scrollX, scrollY);
  root.style.scrollBehavior = previousScrollBehavior;
}

function serializableState() {
  return { mode: mode.value, state: { ...state } };
}

function saveScenario() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState()));
  status.value = "Scenario saved on this device.";
}

function loadScenario() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    status.value = "No saved scenario was found on this device.";
    return;
  }
  try {
    const parsed = JSON.parse(stored) as { mode?: CalculatorSlug; state?: Partial<typeof state> };
    if (parsed.state) Object.assign(state, parsed.state);
    if (parsed.mode) mode.value = parsed.mode;
    status.value = "Saved scenario loaded.";
  } catch {
    status.value = "The saved scenario could not be read.";
  }
}

function rememberComparison() {
  comparison.value = {
    label: `${number(state.rate, 2)}% for ${state.years} years`,
    payment: regularPayment.value,
    interest: totalInterest(baseSchedule.value),
    payoffYears: baseSchedule.value.length / periodsPerYear.value
  };
  status.value = "Scenario pinned. Change the assumptions to compare.";
}

function reset() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.assign(window.location.pathname);
}

async function share() {
  const params = new URLSearchParams({
    calculator: mode.value,
    country: state.country,
    price: String(Math.round(state.homePrice)),
    down: String(Math.round(state.downPayment)),
    rate: String(state.rate),
    years: String(state.years),
    frequency: state.frequency,
    extra: String(state.extraPerPayment),
    annualExtra: String(state.annualExtra),
    oneTimeExtra: String(state.oneTimeExtra),
    oneTimeAt: String(state.oneTimeExtraAtPayment)
  });
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    status.value = "Share link copied.";
  } catch {
    status.value = "Could not copy the link. Copy the address from the browser bar.";
  }
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function downloadBlob(blob: Blob, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(anchor.href), 0);
}

function exportCsv() {
  const rows = exportRows.value;
  const headers = rows.length ? Object.keys(rows[0]!) : [];
  const lines = [
    ["Mortgage Compass export", APP_URL],
    ["Calculator", modeTitle.value],
    ["Currency", currency.value],
    ["Generated", new Date().toISOString()],
    [],
    headers,
    ...rows.map((row) => headers.map((header) => (row as Record<string, unknown>)[header]))
  ];
  const csv = lines.map((row) => row.map(csvCell).join(",")).join("\r\n");
  downloadBlob(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }), `mortgage-compass-${mode.value}.csv`);
  status.value = "CSV downloaded with the app URL included.";
}

async function exportPdf() {
  status.value = "Preparing PDF...";
  const { createMortgagePdf } = await import("../lib/pdf");
  const pdf = createMortgagePdf({
    title: modeTitle.value,
    subtitle: `${currency.value} planning estimate`,
    generated: `Generated ${new Date().toLocaleString(locale.value)}`,
    lines: summaryLines.value,
    disclaimer:
      "Planning estimate only. Verify rates, fees, taxes, insurance, qualification rules, and contract terms with qualified professionals.",
    sourceUrl: APP_URL
  });
  downloadBlob(pdf, `mortgage-compass-${mode.value}.pdf`);
  status.value = "PDF downloaded with the app URL included.";
}

function applyUrlState() {
  const params = new URLSearchParams(window.location.search);
  const calculator = params.get("calculator") as CalculatorSlug | null;
  if (calculator) mode.value = calculator;
  if (params.get("country") === "US" || params.get("country") === "CA") {
    state.country = params.get("country") as "US" | "CA";
  }
  const map: Array<[string, keyof typeof state]> = [
    ["price", "homePrice"],
    ["down", "downPayment"],
    ["rate", "rate"],
    ["years", "years"],
    ["extra", "extraPerPayment"],
    ["annualExtra", "annualExtra"],
    ["oneTimeExtra", "oneTimeExtra"],
    ["oneTimeAt", "oneTimeExtraAtPayment"]
  ];
  for (const [param, key] of map) {
    if (!params.has(param)) continue;
    const value = Number(params.get(param));
    if (Number.isFinite(value) && value >= 0) {
      (state[key] as number) = value;
    }
  }
  const frequency = params.get("frequency") as PaymentFrequency | null;
  if (frequency && ["monthly", "semi-monthly", "biweekly", "accelerated-biweekly"].includes(frequency)) {
    state.frequency = frequency;
  }
}

watch(
  () => state.country,
  () => {
    if (isCanada.value && state.years === 30) state.years = 25;
  }
);

onMounted(() => {
  applyUrlState();
  hydrated.value = true;
});
</script>

<template>
  <section class="workbench" aria-labelledby="workbench-title">
    <div class="tool-tabs" role="tablist" aria-label="Mortgage calculators">
      <button v-for="tool in [
        ['payment', 'Payment'],
        ['affordability', 'Afford'],
        ['extra-payments', 'Payoff'],
        ['refinance', 'Refinance'],
        ['amortization', 'Schedule'],
        ['closing-costs', 'Closing'],
        ['rent-vs-buy', 'Rent vs buy'],
        ['stress-test', 'Stress'],
        ['reverse-mortgage', 'Reverse']
      ]" :key="tool[0]" type="button" role="tab"
        :aria-selected="mode === tool[0]" :class="{ active: mode === tool[0] }" :disabled="!hydrated"
        @click="setMode(tool[0] as CalculatorSlug)">
        {{ tool[1] }}
      </button>
    </div>

    <div class="workbench-heading">
      <div>
        <p class="eyebrow">Private browser workspace</p>
        <h2 id="workbench-title">{{ modeTitle }}</h2>
        <p>No sign-up. Your assumptions stay in this browser unless you choose to share a link.</p>
      </div>
      <label class="country-switch">
        <span>Mortgage rules</span>
        <select v-model="state.country" :disabled="!hydrated" aria-label="Mortgage rules and currency">
          <option value="CA">Canada (CAD)</option>
          <option value="US">United States (USD)</option>
        </select>
      </label>
    </div>

    <div class="workbench-grid">
      <form class="assumptions" @submit.prevent>
        <fieldset v-if="['payment', 'extra-payments', 'amortization', 'affordability', 'closing-costs', 'rent-vs-buy', 'stress-test'].includes(mode)" :disabled="!hydrated">
          <legend>Property and loan</legend>
          <div class="field-grid">
            <label>
              <span>Home price</span>
              <input v-model.number="state.homePrice" type="number" min="0" max="100000000" step="1000">
            </label>
            <label>
              <span>Down payment</span>
              <input v-model.number="state.downPayment" type="number" min="0" :max="state.homePrice" step="1000">
              <small>{{ number(state.homePrice ? state.downPayment / state.homePrice * 100 : 0, 1) }}% of price</small>
            </label>
            <label>
              <span>Interest rate</span>
              <span class="input-suffix"><input v-model.number="state.rate" type="number" min="0" max="30" step="0.01"><b>%</b></span>
            </label>
            <label>
              <span>Amortization</span>
              <select v-model.number="state.years">
                <option v-for="year in [10, 15, 20, 25, 30, 35, 40]" :key="year" :value="year">{{ year }} years</option>
              </select>
            </label>
            <label v-if="['payment', 'extra-payments', 'amortization'].includes(mode)">
              <span>Payment frequency</span>
              <select v-model="state.frequency">
                <option value="monthly">Monthly</option>
                <option value="semi-monthly">Semi-monthly</option>
                <option value="biweekly">Biweekly</option>
                <option value="accelerated-biweekly">Accelerated biweekly</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset v-if="['payment', 'affordability', 'rent-vs-buy', 'stress-test'].includes(mode)" :disabled="!hydrated">
          <legend>Ongoing housing costs</legend>
          <div class="field-grid">
            <label><span>Annual property tax</span><input v-model.number="state.propertyTax" type="number" min="0" step="100"></label>
            <label><span>Monthly insurance</span><input v-model.number="state.monthlyInsurance" type="number" min="0" step="10"></label>
            <label><span>Monthly HOA or condo fees</span><input v-model.number="state.monthlyFees" type="number" min="0" step="10"></label>
          </div>
        </fieldset>

        <fieldset v-if="mode === 'affordability' || mode === 'stress-test'" :disabled="!hydrated">
          <legend>Income and guardrails</legend>
          <div class="field-grid">
            <label><span>Gross household income</span><input v-model.number="state.householdIncome" type="number" min="0" step="1000"></label>
            <label><span>Other monthly debt</span><input v-model.number="state.monthlyDebt" type="number" min="0" step="50"></label>
            <label v-if="mode === 'affordability'"><span>Housing ratio cap</span><span class="input-suffix"><input v-model.number="state.housingRatio" type="number" min="1" max="60" step="1"><b>%</b></span></label>
            <label><span>Total debt ratio cap</span><span class="input-suffix"><input v-model.number="state.totalDebtRatio" type="number" min="1" max="70" step="1"><b>%</b></span></label>
            <label v-if="mode === 'affordability'"><span>Available cash</span><input v-model.number="state.availableCash" type="number" min="0" step="1000"></label>
            <label v-if="mode === 'affordability'"><span>Cash buffer to keep</span><input v-model.number="state.cashBuffer" type="number" min="0" step="1000"></label>
          </div>
        </fieldset>

        <fieldset v-if="mode === 'extra-payments'" :disabled="!hydrated">
          <legend>Payoff strategy</legend>
          <div class="field-grid">
            <label><span>Extra each payment</span><input v-model.number="state.extraPerPayment" type="number" min="0" step="25"></label>
            <label><span>Annual lump sum</span><input v-model.number="state.annualExtra" type="number" min="0" step="250"></label>
            <label><span>One-time lump sum</span><input v-model.number="state.oneTimeExtra" type="number" min="0" step="250"></label>
            <label><span>Apply at payment number</span><input v-model.number="state.oneTimeExtraAtPayment" type="number" min="1" :max="state.years * periodsPerYear" step="1"></label>
          </div>
          <p class="field-note">The one-time amount is applied at payment {{ state.oneTimeExtraAtPayment }}. Check your contract for prepayment privileges, timing rules, and penalties before acting.</p>
        </fieldset>

        <fieldset v-if="mode === 'refinance'" :disabled="!hydrated">
          <legend>Current mortgage</legend>
          <div class="field-grid">
            <label><span>Balance</span><input v-model.number="state.currentBalance" type="number" min="0" step="1000"></label>
            <label><span>Current rate</span><span class="input-suffix"><input v-model.number="state.currentRate" type="number" min="0" max="30" step="0.01"><b>%</b></span></label>
            <label><span>Years remaining</span><input v-model.number="state.remainingYears" type="number" min="1" max="40" step="1"></label>
          </div>
          <legend>Proposed mortgage</legend>
          <div class="field-grid">
            <label><span>New rate</span><span class="input-suffix"><input v-model.number="state.newRate" type="number" min="0" max="30" step="0.01"><b>%</b></span></label>
            <label><span>New amortization</span><input v-model.number="state.newYears" type="number" min="1" max="40" step="1"></label>
            <label><span>Fees</span><input v-model.number="state.refinanceFees" type="number" min="0" step="100"></label>
            <label><span>Prepayment penalty</span><input v-model.number="state.prepaymentPenalty" type="number" min="0" step="100"></label>
          </div>
        </fieldset>

        <fieldset v-if="mode === 'closing-costs'" :disabled="!hydrated">
          <legend>Closing cost assumptions</legend>
          <div class="field-grid">
            <label>
              <span>Land transfer tax location</span>
              <select v-model="state.closingJurisdiction">
                <option value="toronto">Toronto, Ontario</option>
                <option value="ontario">Ontario outside Toronto</option>
                <option value="british-columbia">British Columbia</option>
                <option value="manual">Other or manual rate</option>
              </select>
            </label>
            <label v-if="state.closingJurisdiction === 'manual'"><span>Transfer tax rate</span><span class="input-suffix"><input v-model.number="state.transferTaxRate" type="number" min="0" max="10" step="0.1"><b>%</b></span></label>
            <label v-else class="checkbox-field"><input v-model="state.firstTimeBuyer" type="checkbox"><span>Apply estimated eligible first-time buyer relief</span></label>
            <label><span>Legal or settlement fees</span><input v-model.number="state.legalFees" type="number" min="0" step="100"></label>
            <label><span>Inspection</span><input v-model.number="state.inspection" type="number" min="0" step="50"></label>
            <label><span>Appraisal</span><input v-model.number="state.appraisal" type="number" min="0" step="50"></label>
            <label><span>Title insurance</span><input v-model.number="state.titleInsurance" type="number" min="0" step="50"></label>
            <label><span>Moving</span><input v-model.number="state.moving" type="number" min="0" step="100"></label>
            <label><span>Initial repairs</span><input v-model.number="state.initialRepairs" type="number" min="0" step="100"></label>
            <label><span>Emergency buffer</span><input v-model.number="state.cashBuffer" type="number" min="0" step="1000"></label>
            <label><span>Available cash</span><input v-model.number="state.availableCash" type="number" min="0" step="1000"></label>
          </div>
        </fieldset>

        <fieldset v-if="mode === 'rent-vs-buy'" :disabled="!hydrated">
          <legend>Long-term assumptions</legend>
          <div class="field-grid">
            <label><span>Current monthly rent</span><input v-model.number="state.monthlyRent" type="number" min="0" step="50"></label>
            <label><span>Annual rent growth</span><span class="input-suffix"><input v-model.number="state.rentGrowth" type="number" min="-10" max="20" step="0.1"><b>%</b></span></label>
            <label><span>Home value growth</span><span class="input-suffix"><input v-model.number="state.homeGrowth" type="number" min="-20" max="20" step="0.1"><b>%</b></span></label>
            <label><span>Investment return</span><span class="input-suffix"><input v-model.number="state.investmentReturn" type="number" min="-20" max="30" step="0.1"><b>%</b></span></label>
            <label><span>Maintenance per year</span><span class="input-suffix"><input v-model.number="state.maintenanceRate" type="number" min="0" max="10" step="0.1"><b>%</b></span></label>
            <label><span>Selling cost</span><span class="input-suffix"><input v-model.number="state.sellingCostRate" type="number" min="0" max="15" step="0.1"><b>%</b></span></label>
            <label><span>Time horizon</span><input v-model.number="state.horizonYears" type="number" min="1" max="30" step="1"></label>
            <label><span>Cash available today</span><input v-model.number="state.availableCash" type="number" min="0" step="1000"></label>
          </div>
        </fieldset>

        <fieldset v-if="mode === 'stress-test'" :disabled="!hydrated">
          <legend>Stress scenario</legend>
          <label><span>Selected rate increase</span><span class="input-suffix"><input v-model.number="state.stressIncrease" type="number" min="0" max="15" step="0.25"><b>points</b></span></label>
        </fieldset>

        <fieldset v-if="mode === 'reverse-mortgage'" :disabled="!hydrated">
          <legend>Home and borrowing</legend>
          <div class="field-grid">
            <label><span>Current home value</span><input v-model.number="state.homePrice" type="number" min="0" step="1000"></label>
            <label><span>Initial advance</span><input v-model.number="state.reverseAdvance" type="number" min="0" :max="state.homePrice" step="1000"></label>
            <label><span>Monthly advance</span><input v-model.number="state.reverseMonthlyAdvance" type="number" min="0" step="50"></label>
            <label><span>Interest rate</span><span class="input-suffix"><input v-model.number="state.reverseRate" type="number" min="0" max="30" step="0.01"><b>%</b></span></label>
            <label><span>Home value growth</span><span class="input-suffix"><input v-model.number="state.homeGrowth" type="number" min="-20" max="20" step="0.1"><b>%</b></span></label>
            <label><span>Projection length</span><input v-model.number="state.reverseYears" type="number" min="1" max="40" step="1"></label>
          </div>
          <p class="field-note">This is an equity projection, not an eligibility or proceeds quote. Product rules vary by country and lender.</p>
        </fieldset>
      </form>

      <section class="results" aria-live="polite">
        <div class="result-kicker">{{ currency }} planning estimate</div>

        <div v-if="mode === 'payment' || mode === 'amortization' || mode === 'extra-payments'" class="hero-result">
          <span>{{ mode === 'extra-payments' ? 'Regular payment before extra' : 'Regular payment' }}</span>
          <strong>{{ money(regularPayment, 2) }}</strong>
          <small>per {{ state.frequency.replaceAll('-', ' ') }} period</small>
        </div>

        <div v-if="mode === 'affordability'" class="hero-result">
          <span>Prudent price ceiling</span><strong>{{ money(affordability.maxPrice) }}</strong>
          <small>based on your ratios, costs, and retained cash buffer</small>
        </div>

        <div v-if="mode === 'refinance'" class="hero-result">
          <span>Estimated monthly change</span><strong :class="{ negative: refinance.monthlySavings < 0 }">{{ money(refinance.monthlySavings, 2) }}</strong>
          <small>{{ refinance.monthlySavings >= 0 ? 'lower per month' : 'higher per month' }}</small>
        </div>

        <div v-if="mode === 'closing-costs'" class="hero-result">
          <span>Estimated cash to close</span><strong>{{ money(closing.total) }}</strong>
          <small>including down payment and retained buffer</small>
        </div>

        <div v-if="mode === 'rent-vs-buy'" class="hero-result">
          <span>Net position difference after {{ state.horizonYears }} years</span>
          <strong :class="{ negative: (rentVsBuy.at(-1)?.difference ?? 0) < 0 }">{{ money(rentVsBuy.at(-1)?.difference ?? 0) }}</strong>
          <small>{{ (rentVsBuy.at(-1)?.difference ?? 0) >= 0 ? 'buying leads in this model' : 'renting leads in this model' }}</small>
        </div>

        <div v-if="mode === 'stress-test'" class="hero-result">
          <span>Payment at {{ number(state.rate + state.stressIncrease, 2) }}%</span>
          <strong>{{ money(stressRows.find(row => row.increase === state.stressIncrease)?.payment ?? stressRows[0]?.payment ?? 0, 2) }}</strong>
          <small>principal and interest per month</small>
        </div>

        <div v-if="mode === 'reverse-mortgage'" class="hero-result">
          <span>Projected remaining equity</span>
          <strong>{{ money(reverseRows.at(-1)?.equity ?? 0) }}</strong>
          <small>after {{ state.reverseYears }} years under these assumptions</small>
        </div>

        <div class="metric-grid" v-if="mode === 'payment'">
          <div><span>Loan amount</span><strong>{{ money(principal) }}</strong></div>
          <div><span>Total monthly housing</span><strong>{{ money(monthlyHousing, 2) }}</strong></div>
          <div><span>Total interest</span><strong>{{ money(totalInterest(baseSchedule)) }}</strong></div>
          <div><span>Paid off</span><strong>{{ state.years }} years</strong></div>
        </div>

        <div class="metric-grid" v-if="mode === 'extra-payments'">
          <div><span>Interest saved</span><strong>{{ money(interestSaved) }}</strong></div>
          <div><span>Time saved</span><strong>{{ number(state.years - payoffYears, 1) }} years</strong></div>
          <div><span>New payoff time</span><strong>{{ number(payoffYears, 1) }} years</strong></div>
          <div><span>Extra per year</span><strong>{{ money(state.extraPerPayment * periodsPerYear + state.annualExtra) }}</strong></div>
          <div><span>One-time at payment {{ state.oneTimeExtraAtPayment }}</span><strong>{{ money(state.oneTimeExtra) }}</strong></div>
        </div>

        <div class="metric-grid" v-if="mode === 'affordability'">
          <div><span>Mortgage supported</span><strong>{{ money(affordability.maxLoan) }}</strong></div>
          <div><span>Cash used</span><strong>{{ money(affordability.cashDown) }}</strong></div>
          <div><span>Current housing ratio</span><strong>{{ number(affordability.housingRatio, 1) }}%</strong></div>
          <div><span>Current total ratio</span><strong>{{ number(affordability.totalRatio, 1) }}%</strong></div>
        </div>

        <div class="metric-grid" v-if="mode === 'refinance'">
          <div><span>Current payment</span><strong>{{ money(refinance.currentPayment, 2) }}</strong></div>
          <div><span>New payment</span><strong>{{ money(refinance.newPayment, 2) }}</strong></div>
          <div><span>Break-even</span><strong>{{ refinance.breakEvenMonths ? `${refinance.breakEvenMonths} months` : 'Not reached' }}</strong></div>
          <div><span>Lifetime difference</span><strong>{{ money(refinance.lifetimeSavings) }}</strong></div>
        </div>

        <div class="metric-grid" v-if="mode === 'closing-costs'">
          <div><span>Down payment</span><strong>{{ money(state.downPayment) }}</strong></div>
          <div><span>Transfer tax after relief</span><strong>{{ money(closing.transferTax) }}</strong></div>
          <div v-if="closing.transferTaxRebate > 0"><span>Estimated first-time buyer relief</span><strong>{{ money(closing.transferTaxRebate) }}</strong></div>
          <div v-if="closing.municipalTax > 0"><span>Toronto municipal tax before relief</span><strong>{{ money(closing.municipalTax) }}</strong></div>
          <div><span>Other costs</span><strong>{{ money(closing.other) }}</strong></div>
          <div><span>Cash after close</span><strong :class="{ negative: closing.gap < 0 }">{{ money(closing.gap) }}</strong></div>
        </div>

        <div v-if="comparison && ['payment', 'extra-payments', 'amortization'].includes(mode)" class="comparison-card">
          <span>Pinned scenario: {{ comparison.label }}</span>
          <div><b>{{ money(comparison.payment, 2) }}</b><small> payment</small></div>
          <div><b>{{ money(comparison.interest) }}</b><small> interest</small></div>
          <button type="button" @click="comparison = null">Remove</button>
        </div>

        <CalculatorChart v-if="calculatorChart" :model="calculatorChart" />

        <div v-if="mode === 'stress-test'" class="data-table-wrap">
          <table>
            <thead><tr><th>Rate</th><th>Payment</th><th>Total debt ratio</th></tr></thead>
            <tbody><tr v-for="row in stressRows" :key="row.increase">
              <td>{{ number(row.rate, 2) }}%</td><td>{{ money(row.payment, 2) }}</td><td>{{ number(row.totalDebtRatio, 1) }}%</td>
            </tr></tbody>
          </table>
        </div>

        <div v-if="mode === 'rent-vs-buy' || mode === 'reverse-mortgage'" class="data-table-wrap">
          <table v-if="mode === 'rent-vs-buy'">
            <thead><tr><th>Year</th><th>Buy net</th><th>Rent net</th><th>Difference</th></tr></thead>
            <tbody><tr v-for="row in rentVsBuy" :key="row.year">
              <td>{{ row.year }}</td><td>{{ money(row.buyNet) }}</td><td>{{ money(row.rentNet) }}</td><td>{{ money(row.difference) }}</td>
            </tr></tbody>
          </table>
          <table v-else>
            <thead><tr><th>Year</th><th>Home value</th><th>Loan balance</th><th>Equity</th></tr></thead>
            <tbody><tr v-for="row in reverseRows" :key="row.year">
              <td>{{ row.year }}</td><td>{{ money(row.homeValue) }}</td><td>{{ money(row.balance) }}</td><td>{{ money(row.equity) }}</td>
            </tr></tbody>
          </table>
        </div>

        <div v-if="mode === 'amortization'" class="data-table-wrap schedule">
          <div class="table-toolbar">
            <b>Amortization detail</b>
            <button type="button" @click="showFullSchedule = !showFullSchedule">{{ showFullSchedule ? 'Show yearly' : 'Show every payment' }}</button>
          </div>
          <table v-if="!showFullSchedule">
            <thead><tr><th>Year</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody><tr v-for="row in yearlySchedule" :key="row.year">
              <td>{{ row.year }}</td><td>{{ money(row.principal) }}</td><td>{{ money(row.interest) }}</td><td>{{ money(row.balance) }}</td>
            </tr></tbody>
          </table>
          <table v-else>
            <thead><tr><th>#</th><th>Date</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody><tr v-for="row in paymentSchedule" :key="row.paymentNumber">
              <td>{{ row.paymentNumber }}</td><td>{{ row.date.toLocaleDateString(locale) }}</td><td>{{ money(row.principal, 2) }}</td><td>{{ money(row.interest, 2) }}</td><td>{{ money(row.balance, 2) }}</td>
            </tr></tbody>
          </table>
        </div>

        <p class="estimate-note">Planning estimate only. Lenders use their own qualification, compounding, rounding, insurance, fee, tax, and contract rules.</p>
      </section>
    </div>

    <div class="workbench-actions">
      <button type="button" :disabled="!hydrated" @click="saveScenario">Save</button>
      <button type="button" :disabled="!hydrated" @click="loadScenario">Load</button>
      <button v-if="['payment', 'extra-payments', 'amortization'].includes(mode)" type="button" :disabled="!hydrated" @click="rememberComparison">Pin comparison</button>
      <button type="button" :disabled="!hydrated" @click="share">Share link</button>
      <button type="button" :disabled="!hydrated" @click="exportCsv">Download CSV</button>
      <button type="button" class="primary" :disabled="!hydrated" @click="exportPdf">Download PDF</button>
      <button type="button" class="quiet" :disabled="!hydrated" @click="reset">Reset</button>
      <p role="status">{{ status }}</p>
    </div>
  </section>
</template>
