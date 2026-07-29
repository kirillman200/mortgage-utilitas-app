import { describe, expect, it } from "vitest";
import {
  buildSchedule,
  maxPrincipalForPayment,
  paymentForFrequency,
  periodicPayment,
  refinanceComparison,
  reverseMortgageProjection,
  totalInterest
} from "./mortgage";

describe("mortgage math", () => {
  it("matches a standard fixed-rate payment", () => {
    expect(periodicPayment(100_000, 4, 30)).toBeCloseTo(477.42, 1);
  });

  it("handles a zero interest loan", () => {
    expect(periodicPayment(120_000, 0, 10)).toBe(1000);
  });

  it("pays off a schedule without a negative balance", () => {
    const schedule = buildSchedule({ principal: 400_000, annualRate: 5, years: 25 });
    expect(schedule).toHaveLength(300);
    expect(schedule.at(-1)?.balance).toBe(0);
    expect(totalInterest(schedule)).toBeGreaterThan(0);
  });

  it("accelerated biweekly and extra payments shorten payoff", () => {
    const base = buildSchedule({ principal: 500_000, annualRate: 5, years: 25 });
    const accelerated = buildSchedule({
      principal: 500_000,
      annualRate: 5,
      years: 25,
      frequency: "accelerated-biweekly",
      extraPerPayment: 100
    });
    expect(accelerated.length / 26).toBeLessThan(base.length / 12);
    expect(paymentForFrequency({
      principal: 500_000,
      annualRate: 5,
      years: 25,
      frequency: "accelerated-biweekly"
    })).toBeGreaterThan(0);
  });

  it("inverts a payment into principal", () => {
    const principal = maxPrincipalForPayment(2000, 5, 25);
    expect(periodicPayment(principal, 5, 25)).toBeCloseTo(2000, 6);
  });

  it("calculates refinance break-even", () => {
    const result = refinanceComparison({
      balance: 350_000,
      currentRate: 6.5,
      remainingYears: 25,
      newRate: 5,
      newYears: 25,
      fees: 3000,
      penalty: 2000
    });
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.breakEvenMonths).toBeGreaterThan(0);
  });

  it("projects reverse mortgage balance and equity", () => {
    const rows = reverseMortgageProjection({
      homeValue: 800_000,
      initialAdvance: 150_000,
      monthlyAdvance: 500,
      annualRate: 6.5,
      homeGrowth: 2,
      years: 10
    });
    expect(rows).toHaveLength(10);
    expect(rows.at(-1)?.balance).toBeGreaterThan(150_000);
    expect(rows.at(-1)?.equity).toBeGreaterThanOrEqual(0);
  });
});
