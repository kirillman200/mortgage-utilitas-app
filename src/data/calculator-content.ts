import type { CalculatorSlug } from "./site";

export interface CalculatorContent {
  heading: string;
  intro: string[];
  steps: string[];
  resultHeading: string;
  resultParagraphs: string[];
  faqs: Array<{ question: string; answer: string }>;
  sources: Array<{ label: string; href: string }>;
}

export const CALCULATOR_CONTENT: Record<CalculatorSlug, CalculatorContent> = {
  payment: {
    heading: "How to calculate a mortgage payment",
    intro: [
      "A mortgage payment is determined by the amount borrowed, periodic interest rate, number of payments, and payment frequency. The calculator also keeps property tax, insurance, and condo or association fees separate so you can see both principal-and-interest and the broader monthly housing cost.",
      "Canadian mortgages commonly quote a nominal annual rate compounded twice per year, while U.S. examples commonly divide a nominal rate across monthly payments. Select the country convention that matches the loan, then compare the result with the lender's disclosure."
    ],
    steps: [
      "Enter the home price and down payment so the tool can determine principal.",
      "Enter the quoted annual rate, amortization, and payment frequency.",
      "Add taxes, insurance, and recurring fees for a fuller household budget.",
      "Pin a scenario before changing a rate or amortization to compare the results."
    ],
    resultHeading: "Read the payment in context",
    resultParagraphs: [
      "The regular payment covers principal and interest. Total monthly housing adds the entered tax, insurance, and recurring fees. It does not include every possible ownership cost, qualification rule, mortgage-insurance premium, or lender fee.",
      "A longer amortization usually lowers the scheduled payment but increases total interest. Test a higher rate as well as the quoted rate before treating the payment as affordable."
    ],
    faqs: [
      { question: "What is the mortgage payment formula?", answer: "For a fixed payment loan, payment equals principal times r(1+r)^n divided by ((1+r)^n minus 1), where r is the periodic interest rate and n is the number of payments." },
      { question: "Does this payment include property tax?", answer: "The regular payment is principal and interest. Enter property tax, insurance, and fees separately to see the broader monthly housing estimate." },
      { question: "Why can a lender's payment differ?", answer: "Compounding convention, exact dates, insurance, fees, rounding, rate type, and contract terms can all change the lender's result." }
    ],
    sources: [
      { label: "FCAC: interest on mortgages", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/interest-on-mortgages.html" },
      { label: "FCAC: mortgage terms and amortization", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html" }
    ]
  },
  affordability: {
    heading: "Use affordability as a guardrail",
    intro: [
      "An affordability estimate starts with gross income and debt ratios, then subtracts property tax, heating or insurance assumptions, condo fees, and other debt before converting the remaining payment capacity into a mortgage amount.",
      "Approval and affordability are different. Keep a cash buffer and test a higher rate, because a lender's maximum is not a recommendation for a resilient household budget."
    ],
    steps: ["Enter gross household income and monthly debt.", "Set housing and total-debt ratio caps.", "Add ongoing housing costs and the rate to test.", "Keep part of available cash outside the down payment."],
    resultHeading: "What the price ceiling means",
    resultParagraphs: ["The result combines the mortgage supported by the entered payment cap with cash available for the down payment. It is a planning ceiling, not a loan approval.", "Compare a smaller purchase price and keep room for closing costs, repairs, income changes, and rate changes."],
    faqs: [
      { question: "Does this calculator preapprove a mortgage?", answer: "No. A lender verifies income, debt, credit, property, down payment, insurance, and its own underwriting rules." },
      { question: "Should all available cash become the down payment?", answer: "Usually not. Closing costs, repairs, moving expenses, and emergencies need liquid cash." },
      { question: "Why stress a higher rate?", answer: "It shows whether the budget remains workable if the contract rate or future renewal payment rises." }
    ],
    sources: [{ label: "FCAC: buying a home", href: "https://www.canada.ca/en/financial-consumer-agency/services/buying-home.html" }]
  },
  "extra-payments": {
    heading: "Model recurring, annual, and one-time extra payments",
    intro: [
      "Extra principal reduces the balance on which later interest is calculated. This calculator compares the regular schedule with extra money on every payment, a recurring annual lump sum, and one separate lump sum at a chosen payment number.",
      "The mathematical saving does not override the mortgage contract. Confirm the permitted amount, eligible dates, and penalty rules before sending a prepayment."
    ],
    steps: ["Enter the normal mortgage assumptions and payment frequency.", "Add an amount to every payment if you plan a recurring increase.", "Add an annual lump sum for a payment that repeats each year.", "Use the one-time field and payment number for a single future principal reduction."],
    resultHeading: "Compare interest and payoff time",
    resultParagraphs: ["Interest saved compares the accelerated schedule with the same mortgage and no extra principal. The new payoff time reflects all three prepayment types.", "Earlier prepayments generally have more time to reduce interest, but using cash can reduce liquidity. Compare the saving with emergency needs and higher-interest debt."],
    faqs: [
      { question: "Can I calculate one extra mortgage payment?", answer: "Yes. Enter it as a one-time lump sum and choose the payment number when it will be applied." },
      { question: "Are extra mortgage payments penalty-free?", answer: "Only within the prepayment privileges and timing rules in your contract. Amounts above the allowed limit may trigger a penalty." },
      { question: "Does accelerated biweekly mean the same as biweekly?", answer: "No. Accelerated biweekly commonly uses half the monthly payment every two weeks, producing the equivalent of one extra monthly payment each year." }
    ],
    sources: [
      { label: "FCAC: paying off your mortgage faster", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/pay-mortgage-faster.html" },
      { label: "FCAC: mortgage prepayment rights", href: "https://www.canada.ca/en/financial-consumer-agency/services/rights-responsibilities/rights-mortgages/rights-prepayments.html" }
    ]
  },
  refinance: {
    heading: "Calculate the refinance break-even point",
    intro: [
      "A refinance break-even estimate asks how many months of payment savings are required to recover the prepayment penalty and other switching costs. Enter the current balance and remaining amortization, then the replacement rate, amortization, penalty, and fees.",
      "A lower payment is not automatically a saving. Extending amortization can lower the payment while increasing total interest and time in debt."
    ],
    steps: ["Use the current principal balance, rate, and remaining amortization.", "Enter the proposed rate and new amortization.", "Add the lender's written penalty plus legal, discharge, appraisal, and setup fees.", "Compare break-even time with how long you expect to keep the new mortgage."],
    resultHeading: "Use break-even and lifetime cost together",
    resultParagraphs: ["Break-even divides entered switching costs by estimated monthly payment savings. If the proposed payment is not lower, the calculator reports no payment-based break-even.", "Lifetime difference compares the modeled interest paths, but it should be read cautiously when the two amortizations differ or when you expect another sale, renewal, or refinance."],
    faqs: [
      { question: "What is a mortgage refinance break-even point?", answer: "It is the time required for modeled savings to recover the penalty and other costs entered for the switch." },
      { question: "Should I finance refinance costs?", answer: "Financing costs preserves cash but adds them to principal, so they also accrue interest. Compare both approaches." },
      { question: "Can a lower rate still cost more?", answer: "Yes. Penalties, fees, a longer amortization, and a short holding period can outweigh the lower rate." }
    ],
    sources: [{ label: "FCAC: breaking your mortgage contract", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/break-mortgage-contract.html" }]
  },
  amortization: {
    heading: "Build and read an amortization schedule",
    intro: [
      "An amortization schedule separates each fixed payment into interest and principal and shows the balance after the payment. Early in a long mortgage, interest usually consumes a larger share because the outstanding balance is higher.",
      "Use the yearly table for the long view or open every payment for dates and detailed principal, interest, and remaining-balance figures."
    ],
    steps: ["Enter price, down payment, rate, and amortization.", "Choose monthly, semi-monthly, biweekly, or accelerated biweekly payments.", "Review the yearly principal, interest, and balance totals.", "Open every payment or download CSV for a complete amortization table."],
    resultHeading: "Term and amortization are not the same",
    resultParagraphs: ["Amortization is the modeled time to repay the loan. A Canadian mortgage term is the period covered by one contract, so the rate often changes at renewal before the full amortization ends.", "The schedule assumes the entered rate continues. Use the projected balance at renewal as the starting point for a new scenario."],
    faqs: [
      { question: "What does an amortization table show?", answer: "It shows each payment date, principal, interest, and remaining balance, plus yearly rollups in this calculator." },
      { question: "Can I download the amortization schedule?", answer: "Yes. Use Download CSV for the detailed rows or Download PDF for a summary." },
      { question: "Why does the schedule change at renewal?", answer: "A new rate, payment, amortization, or lump sum changes the remaining repayment path." }
    ],
    sources: [{ label: "FCAC: mortgage terms and amortization", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html" }]
  },
  "closing-costs": {
    heading: "Estimate cash needed at closing",
    intro: [
      "Cash to close is more than the down payment. This planner adds estimated land transfer tax, legal or settlement fees, inspection, appraisal, title insurance, moving costs, initial repairs, and a retained emergency buffer.",
      "The location presets calculate Ontario land transfer tax, Toronto provincial and municipal land transfer taxes, or British Columbia property transfer tax. The first-time buyer option applies a simplified estimate of the official relief and does not determine eligibility."
    ],
    steps: ["Enter the purchase price, down payment, available cash, and buffer.", "Choose Toronto, Ontario outside Toronto, British Columbia, or a manual rate.", "Select first-time buyer relief only if you expect to meet every official condition.", "Replace the default legal, inspection, appraisal, title, moving, and repair figures with written estimates."],
    resultHeading: "What is included and excluded",
    resultParagraphs: ["Transfer tax is shown after estimated first-time buyer relief. Toronto also shows its municipal tax before relief because it is charged in addition to Ontario tax.", "The planner does not calculate every adjustment, sales tax on a new home, non-resident tax, lender insurance, utility setup, condo status documents, or unusual legal work. Your lawyer's statement of adjustments controls the final amount."],
    faqs: [
      { question: "Does Toronto have two land transfer taxes?", answer: "Yes. A Toronto purchase can have Ontario land transfer tax and Toronto municipal land transfer tax." },
      { question: "Does the B.C. preset calculate property transfer tax?", answer: "Yes. It applies the general B.C. brackets and the current first-time buyer exemption range when selected." },
      { question: "Are condo closing costs different?", answer: "The same transfer-tax location rules can apply, but condo fees, status documents, adjustments, insurance, and new-construction charges may add costs." }
    ],
    sources: [
      { label: "Ontario: calculating land transfer tax", href: "https://www.ontario.ca/document/land-transfer-tax/calculating-land-transfer-tax" },
      { label: "Ontario: first-time homebuyer land transfer tax refund", href: "https://www.ontario.ca/document/land-transfer-tax/land-transfer-tax-refunds-first-time-homebuyers" },
      { label: "Toronto: municipal land transfer tax rates", href: "https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/" },
      { label: "Toronto: first-time homebuyer rebate", href: "https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rebate-opportunities/" },
      { label: "British Columbia: property transfer tax", href: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax" },
      { label: "British Columbia: first-time buyer exemption amounts", href: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount" }
    ]
  },
  "rent-vs-buy": {
    heading: "Compare renting with buying over time",
    intro: [
      "A rent-versus-buy calculator should compare more than rent with a mortgage payment. This model tracks mortgage balance, home value, property tax, insurance, fees, maintenance, selling costs, rent growth, and the opportunity to invest cash not used for ownership.",
      "The result is a scenario, not a forecast. Home growth, investment returns, repairs, rent increases, selling costs, and the time you stay can change the answer."
    ],
    steps: ["Use the same home and mortgage assumptions you would actually consider.", "Enter current rent and what it includes.", "Add ownership costs, selling costs, and a realistic time horizon.", "Stress lower home growth, lower investment returns, and higher maintenance before interpreting a winner."],
    resultHeading: "Focus on the break-even horizon",
    resultParagraphs: ["Buy net position is modeled home value less mortgage balance and selling costs. Rent net position is the modeled investment account funded by cash and positive monthly differences available to the renter.", "A small difference is not a decisive result when it depends on uncertain growth assumptions. Flexibility, stability, repair risk, and the likelihood of moving also matter."],
    faqs: [
      { question: "Is renting always throwing money away?", answer: "No. Rent buys housing and flexibility, while owners also pay unrecoverable interest, tax, insurance, maintenance, and transaction costs." },
      { question: "Why include investment returns?", answer: "A renter may keep or invest cash that a buyer uses for the down payment, closing, and higher monthly ownership costs." },
      { question: "What makes buying break even sooner?", answer: "A longer stay, lower transaction costs, lower interest and maintenance, or stronger home growth can help, but none is guaranteed." }
    ],
    sources: [
      { label: "FCAC: buying a home", href: "https://www.canada.ca/en/financial-consumer-agency/services/buying-home.html" },
      { label: "FCAC: renting an apartment or house", href: "https://www.canada.ca/en/financial-consumer-agency/services/renting-first-apartment.html" }
    ]
  },
  "stress-test": {
    heading: "Stress-test a mortgage payment",
    intro: ["A rate stress test shows how payment and debt ratios change when the modeled rate rises. Use the current balance for a renewal scenario or price and down payment for a purchase scenario.", "This tool is a household risk lens. It does not reproduce every lender qualification rule or guarantee approval."],
    steps: ["Enter the loan, income, debt, tax, insurance, and fee assumptions.", "Choose the number of percentage points to add.", "Compare the payment and total debt ratio across the table.", "Test the rate at which the budget would require a change."],
    resultHeading: "Turn rate risk into a budget decision",
    resultParagraphs: ["The table isolates rate changes while holding the other assumptions constant. Real renewals may also include a different balance, amortization, payment frequency, income, and expenses.", "If a moderate increase makes the budget unworkable, consider a smaller loan, larger buffer, prepayment plan, or earlier renewal preparation."],
    faqs: [
      { question: "Is this the official mortgage stress test?", answer: "No. It models payment and debt-ratio sensitivity, while a lender applies the current qualifying rules and its underwriting." },
      { question: "Can I use it for renewal?", answer: "Yes. Use the balance and amortization expected at renewal, then compare likely and higher rates." },
      { question: "What does a two-point increase mean?", answer: "It adds two percentage points to the entered mortgage rate, such as 4.5% becoming 6.5%." }
    ],
    sources: [{ label: "FCAC: preparing to get a mortgage", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/preparing-mortgage.html" }]
  },
  "reverse-mortgage": {
    heading: "Project reverse mortgage balance and equity",
    intro: ["A reverse mortgage balance usually grows because interest is added instead of paid each month. This calculator projects that compounding balance alongside an assumed home value and shows the equity remaining each year.", "It is an equity projection, not a lender eligibility or proceeds calculator. Age, property, location, existing secured debt, product limits, fees, and lender underwriting determine an actual offer."],
    steps: ["Enter current home value and the initial amount advanced.", "Add any planned monthly advances.", "Use the disclosed rate and a cautious home-growth assumption.", "Compare multiple horizons and include lender fees in the starting advance if they will be financed."],
    resultHeading: "Read remaining equity cautiously",
    resultParagraphs: ["Remaining equity is projected home value less projected loan balance. A negative result is floored at zero in the table and does not interpret a lender's no-negative-equity terms.", "Ask for written illustrations showing rates, fees, repayment triggers, prepayment rules, and how taking money as a lump sum or over time affects cost."],
    faqs: [
      { question: "How much reverse mortgage can I get?", answer: "This tool does not estimate eligibility. The lender determines proceeds using borrower, property, location, debt, and product criteria." },
      { question: "Why does the reverse mortgage balance increase?", answer: "Interest and any new advances are added to the balance when there are no regular principal-and-interest payments." },
      { question: "Can I model monthly advances?", answer: "Yes. Enter an initial advance, a monthly advance, or both to compare how the borrowing pattern affects equity." }
    ],
    sources: [{ label: "FCAC: reverse mortgages", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reverse-mortgages.html" }]
  }
};
