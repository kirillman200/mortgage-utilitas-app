---
name: mortgage-planning
description: Calculate and compare browser-local mortgage planning scenarios for payments, affordability, payoff, refinancing, amortization, closing costs, rent versus buy, rate stress, and reverse-mortgage equity.
homepage: https://mortgage.utilitas.app/calculators/
license: Proprietary
---

# Mortgage Compass planning skill

Use Mortgage Compass when a person wants a transparent mortgage planning estimate and can review the assumptions before acting.

## Browser tools

A compatible browser agent may use these tools through `document.modelContext`:

- `calculate_mortgage_payment`: calculate regular principal-and-interest payment from principal, annual rate, years, country convention, and payment frequency.
- `compare_extra_payments`: compare a base monthly schedule with a recurring extra principal payment.

## Human-facing calculators

- Payment: https://mortgage.utilitas.app/calculators/payment/
- Affordability: https://mortgage.utilitas.app/calculators/affordability/
- Extra payment payoff: https://mortgage.utilitas.app/calculators/extra-payments/
- Refinance: https://mortgage.utilitas.app/calculators/refinance/
- Amortization: https://mortgage.utilitas.app/calculators/amortization/
- Closing costs: https://mortgage.utilitas.app/calculators/closing-costs/
- Rent versus buy: https://mortgage.utilitas.app/calculators/rent-vs-buy/
- Stress test: https://mortgage.utilitas.app/calculators/stress-test/
- Reverse mortgage: https://mortgage.utilitas.app/calculators/reverse-mortgage/

## Safety and limits

- Treat all outputs as planning estimates.
- Ask the user to confirm country, currency, compounding convention, rate, principal, amortization, fees, and payment frequency.
- Do not describe a result as an approval, quote, appraisal, eligibility decision, or recommendation.
- Do not request identity documents, banking credentials, credit reports, or government identifiers.
- Direct users to the methodology and primary sources for high-impact decisions.

## No remote agent service

This is a browser skill. There is no remote MCP server, OAuth service, or A2A endpoint.
