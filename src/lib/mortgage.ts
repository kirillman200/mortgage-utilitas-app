export type PaymentFrequency = "monthly" | "semi-monthly" | "biweekly" | "accelerated-biweekly";

export interface LoanInputs {
  principal: number;
  annualRate: number;
  years: number;
  frequency?: PaymentFrequency;
  extraPerPayment?: number;
  annualExtra?: number;
  oneTimeExtra?: number;
  oneTimeExtraAtPayment?: number;
  rateConvention?: "canada" | "us";
}

export interface ScheduleRow {
  paymentNumber: number;
  date: Date;
  payment: number;
  principal: number;
  interest: number;
  extra: number;
  balance: number;
}

const periodsByFrequency: Record<PaymentFrequency, number> = {
  monthly: 12,
  "semi-monthly": 24,
  biweekly: 26,
  "accelerated-biweekly": 26
};

export function clampNumber(value: unknown, min: number, max: number, fallback = min): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

export function periodicRate(
  annualRate: number,
  periods = 12,
  rateConvention: "canada" | "us" = "us"
): number {
  const nominal = clampNumber(annualRate, 0, 100, 0) / 100;
  return rateConvention === "canada"
    ? (1 + nominal / 2) ** (2 / periods) - 1
    : nominal / periods;
}

export function periodicPayment(
  principal: number,
  annualRate: number,
  years: number,
  periods = 12,
  rateConvention: "canada" | "us" = "us"
): number {
  const safePrincipal = clampNumber(principal, 0, 100_000_000, 0);
  const safeYears = clampNumber(years, 0.25, 50, 25);
  const count = Math.max(1, Math.round(safeYears * periods));
  const rate = periodicRate(annualRate, periods, rateConvention);
  if (rate === 0) return safePrincipal / count;
  return (safePrincipal * rate * (1 + rate) ** count) / ((1 + rate) ** count - 1);
}

export function paymentForFrequency(inputs: LoanInputs): number {
  const frequency = inputs.frequency ?? "monthly";
  if (frequency === "accelerated-biweekly") {
    return periodicPayment(
      inputs.principal,
      inputs.annualRate,
      inputs.years,
      12,
      inputs.rateConvention
    ) / 2;
  }
  return periodicPayment(
    inputs.principal,
    inputs.annualRate,
    inputs.years,
    periodsByFrequency[frequency],
    inputs.rateConvention
  );
}

export function buildSchedule(inputs: LoanInputs, startDate = new Date()): ScheduleRow[] {
  const frequency = inputs.frequency ?? "monthly";
  const periods = periodsByFrequency[frequency];
  const basePayment = paymentForFrequency(inputs);
  const ratePerPeriod = periodicRate(inputs.annualRate, periods, inputs.rateConvention);
  const recurringExtra = clampNumber(inputs.extraPerPayment ?? 0, 0, 10_000_000, 0);
  const annualExtra = clampNumber(inputs.annualExtra ?? 0, 0, 100_000_000, 0);
  const oneTimeExtra = clampNumber(inputs.oneTimeExtra ?? 0, 0, 100_000_000, 0);
  const oneTimeExtraAtPayment = Math.max(1, Math.round(clampNumber(
    inputs.oneTimeExtraAtPayment ?? 1,
    1,
    50 * periods,
    1
  )));
  const maximumPeriods = Math.ceil(50 * periods);
  const rows: ScheduleRow[] = [];
  let balance = clampNumber(inputs.principal, 0, 100_000_000, 0);

  for (let index = 1; index <= maximumPeriods && balance > 0.005; index += 1) {
    const interest = balance * ratePerPeriod;
    const annualTopUp = index % periods === 0 ? annualExtra : 0;
    const oneTimeTopUp = index === oneTimeExtraAtPayment ? oneTimeExtra : 0;
    const plannedExtra = recurringExtra + annualTopUp + oneTimeTopUp;
    const plannedPrincipal = Math.max(0, basePayment - interest) + plannedExtra;
    const principal = Math.min(balance, plannedPrincipal);
    const extra = Math.min(plannedExtra, Math.max(0, principal - Math.max(0, basePayment - interest)));
    const payment = interest + principal;
    balance = Math.max(0, balance - principal);
    const date = new Date(startDate);
    if (frequency === "monthly") {
      // Move from day one so short months cannot roll into the next month.
      // Anchor to the original day again after February or a 30-day month.
      date.setDate(1);
      date.setMonth(date.getMonth() + index);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      date.setDate(Math.min(startDate.getDate(), lastDay));
    }
    if (frequency === "semi-monthly") date.setDate(date.getDate() + Math.round(index * 365.25 / 24));
    if (frequency === "biweekly" || frequency === "accelerated-biweekly") {
      date.setDate(date.getDate() + index * 14);
    }
    rows.push({ paymentNumber: index, date, payment, principal, interest, extra, balance });
  }
  return rows;
}

export type PropertyTransferTaxJurisdiction = "ontario" | "toronto" | "british-columbia";

function progressiveTax(value: number, bands: Array<{ upTo: number; rate: number }>): number {
  let remaining = clampNumber(value, 0, 100_000_000, 0);
  let lowerBound = 0;
  let tax = 0;

  for (const band of bands) {
    const width = Math.max(0, band.upTo - lowerBound);
    const taxable = Math.min(remaining, width);
    tax += taxable * band.rate;
    remaining -= taxable;
    lowerBound = band.upTo;
    if (remaining <= 0) break;
  }

  return tax;
}

function ontarioLandTransferTax(value: number): number {
  return progressiveTax(value, [
    { upTo: 55_000, rate: 0.005 },
    { upTo: 250_000, rate: 0.01 },
    { upTo: 400_000, rate: 0.015 },
    { upTo: 2_000_000, rate: 0.02 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.025 }
  ]);
}

function torontoMunicipalLandTransferTax(value: number): number {
  return progressiveTax(value, [
    { upTo: 55_000, rate: 0.005 },
    { upTo: 250_000, rate: 0.01 },
    { upTo: 400_000, rate: 0.015 },
    { upTo: 2_000_000, rate: 0.02 },
    { upTo: 3_000_000, rate: 0.025 },
    { upTo: 4_000_000, rate: 0.044 },
    { upTo: 5_000_000, rate: 0.0545 },
    { upTo: 10_000_000, rate: 0.065 },
    { upTo: 20_000_000, rate: 0.0755 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.086 }
  ]);
}

function britishColumbiaPropertyTransferTax(value: number): number {
  return progressiveTax(value, [
    { upTo: 200_000, rate: 0.01 },
    { upTo: 2_000_000, rate: 0.02 },
    { upTo: 3_000_000, rate: 0.03 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.05 }
  ]);
}

function britishColumbiaFirstTimeExemption(value: number): number {
  if (value <= 500_000) return britishColumbiaPropertyTransferTax(value);
  if (value <= 835_000) return 8_000;
  if (value < 860_000) return 8_000 * ((860_000 - value) / 25_000);
  return 0;
}

export function propertyTransferTax(input: {
  value: number;
  jurisdiction: PropertyTransferTaxJurisdiction;
  firstTimeBuyer?: boolean;
}) {
  const value = clampNumber(input.value, 0, 100_000_000, 0);
  const firstTimeBuyer = input.firstTimeBuyer ?? false;
  let provincial = 0;
  let municipal = 0;
  let rebate = 0;

  if (input.jurisdiction === "ontario" || input.jurisdiction === "toronto") {
    provincial = ontarioLandTransferTax(value);
    if (firstTimeBuyer) rebate += Math.min(provincial, 4_000);
  }

  if (input.jurisdiction === "toronto") {
    municipal = torontoMunicipalLandTransferTax(value);
    if (firstTimeBuyer) rebate += Math.min(municipal, 4_475);
  }

  if (input.jurisdiction === "british-columbia") {
    provincial = britishColumbiaPropertyTransferTax(value);
    if (firstTimeBuyer) rebate += Math.min(provincial, britishColumbiaFirstTimeExemption(value));
  }

  const gross = provincial + municipal;
  return { provincial, municipal, gross, rebate, net: Math.max(0, gross - rebate) };
}

export function totalInterest(schedule: ScheduleRow[]): number {
  return schedule.reduce((sum, row) => sum + row.interest, 0);
}

export function remainingBalance(
  principal: number,
  annualRate: number,
  years: number,
  paymentsMade: number
): number {
  const payment = periodicPayment(principal, annualRate, years, 12);
  const rate = annualRate / 100 / 12;
  if (rate === 0) return Math.max(0, principal - payment * paymentsMade);
  return Math.max(
    0,
    principal * (1 + rate) ** paymentsMade -
      payment * (((1 + rate) ** paymentsMade - 1) / rate)
  );
}

export function maxPrincipalForPayment(
  payment: number,
  annualRate: number,
  years: number,
  rateConvention: "canada" | "us" = "us"
): number {
  const count = Math.max(1, Math.round(years * 12));
  const rate = periodicRate(annualRate, 12, rateConvention);
  if (rate === 0) return Math.max(0, payment * count);
  return Math.max(0, payment * ((1 + rate) ** count - 1) / (rate * (1 + rate) ** count));
}

export function refinanceComparison(input: {
  balance: number;
  currentRate: number;
  remainingYears: number;
  newRate: number;
  newYears: number;
  fees: number;
  penalty: number;
  rateConvention?: "canada" | "us";
}) {
  const currentPayment = periodicPayment(
    input.balance,
    input.currentRate,
    input.remainingYears,
    12,
    input.rateConvention
  );
  const newPrincipal = input.balance + input.fees + input.penalty;
  const newPayment = periodicPayment(
    newPrincipal,
    input.newRate,
    input.newYears,
    12,
    input.rateConvention
  );
  const monthlySavings = currentPayment - newPayment;
  const upfront = input.fees + input.penalty;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(upfront / monthlySavings) : null;
  const currentInterest = currentPayment * input.remainingYears * 12 - input.balance;
  const newInterest = newPayment * input.newYears * 12 - newPrincipal + upfront;
  return {
    currentPayment,
    newPayment,
    monthlySavings,
    breakEvenMonths,
    currentInterest,
    newInterest,
    lifetimeSavings: currentInterest - newInterest
  };
}

export function futureValue(contribution: number, annualReturn: number, years: number): number {
  const months = Math.max(0, Math.round(years * 12));
  const rate = annualReturn / 100 / 12;
  if (rate === 0) return contribution * months;
  return contribution * (((1 + rate) ** months - 1) / rate);
}

export function reverseMortgageProjection(input: {
  homeValue: number;
  initialAdvance: number;
  monthlyAdvance: number;
  annualRate: number;
  homeGrowth: number;
  years: number;
}) {
  const rows: Array<{ year: number; homeValue: number; balance: number; equity: number; equityShare: number }> = [];
  let homeValue = input.homeValue;
  let balance = input.initialAdvance;
  const monthlyRate = input.annualRate / 100 / 12;
  for (let month = 1; month <= input.years * 12; month += 1) {
    balance = balance * (1 + monthlyRate) + input.monthlyAdvance;
    homeValue *= (1 + input.homeGrowth / 100) ** (1 / 12);
    if (month % 12 === 0) {
      const equity = Math.max(0, homeValue - balance);
      rows.push({
        year: month / 12,
        homeValue,
        balance,
        equity,
        equityShare: homeValue > 0 ? equity / homeValue : 0
      });
    }
  }
  return rows;
}
