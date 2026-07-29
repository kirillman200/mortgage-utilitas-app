(() => {
  const modelContext = document.modelContext;
  if (!modelContext || typeof modelContext.registerTool !== "function") return;

  const safeNumber = (value, min, max, fallback) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  };

  const rateForPeriod = (annualRate, periods, country) => {
    const nominal = safeNumber(annualRate, 0, 100, 0) / 100;
    return country === "CA"
      ? (1 + nominal / 2) ** (2 / periods) - 1
      : nominal / periods;
  };

  const payment = (principal, annualRate, years, periods, country) => {
    const count = Math.max(1, Math.round(years * periods));
    const rate = rateForPeriod(annualRate, periods, country);
    if (rate === 0) return principal / count;
    return principal * rate * (1 + rate) ** count / ((1 + rate) ** count - 1);
  };

  const frequencyPeriods = {
    monthly: 12,
    "semi-monthly": 24,
    biweekly: 26,
    "accelerated-biweekly": 26
  };

  modelContext.registerTool({
    name: "calculate_mortgage_payment",
    description: "Calculate a planning estimate for regular principal-and-interest mortgage payment. This is not a lender quote or approval.",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "number", minimum: 0, maximum: 100000000 },
        annualRate: { type: "number", minimum: 0, maximum: 100 },
        years: { type: "number", minimum: 0.25, maximum: 50 },
        country: { type: "string", enum: ["CA", "US"] },
        frequency: { type: "string", enum: ["monthly", "semi-monthly", "biweekly", "accelerated-biweekly"] }
      },
      required: ["principal", "annualRate", "years", "country", "frequency"],
      additionalProperties: false
    },
    execute: async (input) => {
      const principal = safeNumber(input.principal, 0, 100000000, 0);
      const annualRate = safeNumber(input.annualRate, 0, 100, 0);
      const years = safeNumber(input.years, 0.25, 50, 25);
      const frequency = frequencyPeriods[input.frequency] ? input.frequency : "monthly";
      const country = input.country === "US" ? "US" : "CA";
      const periods = frequencyPeriods[frequency];
      const amount = frequency === "accelerated-biweekly"
        ? payment(principal, annualRate, years, 12, country) / 2
        : payment(principal, annualRate, years, periods, country);
      return {
        payment: Math.round(amount * 100) / 100,
        frequency,
        currency: country === "CA" ? "CAD" : "USD",
        source: "https://mortgage.utilitas.app",
        disclaimer: "Planning estimate only. Verify all terms with the lender and contract."
      };
    }
  });

  modelContext.registerTool({
    name: "compare_extra_payments",
    description: "Compare a base monthly mortgage with a recurring extra principal payment.",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "number", minimum: 0, maximum: 100000000 },
        annualRate: { type: "number", minimum: 0, maximum: 100 },
        years: { type: "number", minimum: 0.25, maximum: 50 },
        extraMonthly: { type: "number", minimum: 0, maximum: 10000000 },
        country: { type: "string", enum: ["CA", "US"] }
      },
      required: ["principal", "annualRate", "years", "extraMonthly", "country"],
      additionalProperties: false
    },
    execute: async (input) => {
      const principal = safeNumber(input.principal, 0, 100000000, 0);
      const annualRate = safeNumber(input.annualRate, 0, 100, 0);
      const years = safeNumber(input.years, 0.25, 50, 25);
      const extra = safeNumber(input.extraMonthly, 0, 10000000, 0);
      const country = input.country === "US" ? "US" : "CA";
      const regular = payment(principal, annualRate, years, 12, country);
      const rate = rateForPeriod(annualRate, 12, country);

      const simulate = (extraPayment) => {
        let balance = principal;
        let interest = 0;
        let months = 0;
        while (balance > 0.005 && months < 600) {
          const accrued = balance * rate;
          const principalPaid = Math.min(balance, Math.max(0, regular - accrued) + extraPayment);
          interest += accrued;
          balance -= principalPaid;
          months += 1;
        }
        return { months, interest };
      };

      const base = simulate(0);
      const accelerated = simulate(extra);
      return {
        regularPayment: Math.round(regular * 100) / 100,
        monthsSaved: Math.max(0, base.months - accelerated.months),
        interestSaved: Math.round(Math.max(0, base.interest - accelerated.interest) * 100) / 100,
        currency: country === "CA" ? "CAD" : "USD",
        source: "https://mortgage.utilitas.app",
        disclaimer: "Planning estimate only. Confirm prepayment privileges and penalties."
      };
    }
  });
})();
