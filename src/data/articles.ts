export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  category: "Planning" | "Mortgage basics" | "Borrowing" | "Market";
  readingMinutes: number;
  published: string;
  updated: string;
  intro: string[];
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: Array<{ question: string; answer: string }>;
  sources: Array<{ label: string; href: string }>;
  calculator?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "paying-off-your-mortgage-game-changer",
    title: "Paying Off Your Mortgage: The Game Changer Is What You Do Next",
    description:
      "A practical plan for the cash flow, paperwork, protection, and new priorities that follow your final mortgage payment.",
    keyword: "paying off your mortgage game changer",
    category: "Planning",
    readingMinutes: 9,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "Paying off a mortgage can change the shape of a household budget, but the final payment is not the finish line for home expenses. Property tax, insurance, maintenance, utilities, and condominium fees continue. The useful question is not only how much payment disappears, but how much dependable monthly cash flow is truly released.",
      "A good post-mortgage plan protects the home, confirms that the lender's charge has been discharged where required, and gives the old payment a new job. That job could be retirement saving, other debt, a renovation reserve, education, travel, or a mix chosen around your goals."
    ],
    keyTakeaways: [
      "Separate the mortgage payment from taxes, insurance, and other costs that may have been bundled with it.",
      "Confirm discharge paperwork, title records, automatic payments, and insurance details.",
      "Redirect the former payment deliberately before lifestyle spending absorbs it.",
      "Keep an accessible repair reserve even after the loan reaches zero."
    ],
    sections: [
      {
        heading: "Calculate the cash flow that is actually free",
        paragraphs: [
          "Start with recent statements. If the lender collected property tax or insurance, those bills still exist after principal and interest end. Add a realistic maintenance allowance and any fees that continue. The difference between the old payment and these ongoing obligations is the amount available for a new plan.",
          "Run the payoff calculator before a final lump sum. A contract may limit annual prepayments or charge a penalty during a closed term. Keeping emergency cash can be more valuable than reaching zero a few months earlier if the alternative leaves the household dependent on expensive credit."
        ]
      },
      {
        heading: "Give the old mortgage payment a new assignment",
        paragraphs: [
          "Automation helps preserve the habit. A standing transfer on the old payment date can direct money to retirement accounts, a high-interest debt, a home reserve, or several goals. The best mix depends on taxes, employer matching, time horizon, risk tolerance, and the interest rates on any remaining debt.",
          "Paying off a mortgage creates a guaranteed saving equal to the avoided mortgage interest, but investing has uncertain returns and better liquidity. There is no universal winner. Compare after-tax outcomes, risk, access to cash, and the value you place on a lower fixed monthly obligation."
        ],
        bullets: [
          "Protect: rebuild or enlarge the emergency and home-maintenance reserves.",
          "Reduce: address higher-interest consumer debt first.",
          "Invest: capture any employer match and review registered or tax-advantaged accounts.",
          "Enjoy: create a defined amount for lifestyle goals without allowing every dollar to drift."
        ]
      },
      {
        heading: "Close the administrative loop",
        paragraphs: [
          "Ask the lender what documents confirm repayment and whether a mortgage discharge must be registered. Procedures and fees vary by location. Review the property title after the process is complete and keep final statements with permanent home records.",
          "Cancel mortgage payment instructions only after the lender confirms the balance and any final interest. If insurance premiums were paid through the lender, arrange direct billing. Review the beneficiary, estate, and home-insurance information that may have referenced the mortgagee."
        ]
      },
      {
        heading: "Build a mortgage-free home budget",
        paragraphs: [
          "A paid-off home is still a long-lived asset with uneven costs. Roofs, heating systems, foundations, windows, and appliances do not fail on a smooth monthly schedule. A reserve based on the home's age, condition, and planned work can prevent a future repair from becoming new debt.",
          "Revisit the plan each year. A mortgage-free budget should support the life you want while preserving the asset that made the change possible. The game changer is not only the absence of a payment. It is the capacity to choose what the same cash flow does next."
        ]
      }
    ],
    faqs: [
      {
        question: "Does paying off a mortgage remove every housing payment?",
        answer: "No. Property tax, insurance, maintenance, utilities, and applicable association or condominium fees continue."
      },
      {
        question: "Should I invest or pay the mortgage early?",
        answer: "Compare the guaranteed interest avoided with uncertain after-tax investment returns, liquidity needs, penalties, employer matching, and your comfort with debt."
      },
      {
        question: "What paperwork should I expect?",
        answer: "Ask the lender for a final payout statement and discharge process. Registration, title, and fee requirements depend on the jurisdiction."
      }
    ],
    sources: [
      {
        label: "Financial Consumer Agency of Canada: breaking a mortgage contract",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/break-mortgage-contract.html"
      }
    ],
    calculator: "extra-payments"
  },
  {
    slug: "darlene-early-reverse-mortgage",
    title: "The Darlene Early Reverse Mortgage Case: Fraud Claims and Homeowner Safeguards",
    description:
      "What the reported Darlene Early dispute shows about mortgage fraud, title checks, independent advice, and responding to an unfamiliar loan.",
    keyword: "darlene early reverse mortgage",
    category: "Borrowing",
    readingMinutes: 8,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "Darlene Early is an Ontario homeowner whose reverse-mortgage dispute was reported by the Toronto Star. Early said she learned in 2022 that a $405,000 CHIP reverse mortgage had been issued in her name even though she says she did not knowingly take it out. HomeEquity Bank said the alleged fraud involved a third-party broker. The lender and homeowner have advanced competing claims in court, so allegations should not be treated as final findings.",
      "The case is not a general verdict on reverse mortgages. It is a warning about identity, consent, title records, sales pressure, and the controls around a loan secured by an older homeowner's home. Those risks deserve careful attention before a transaction and a fast, documented response when an unfamiliar mortgage or lien appears."
    ],
    keyTakeaways: [
      "Early's account and the lender's response are disputed allegations, not a completed court finding.",
      "Check the property title and credit reports for unfamiliar mortgages, liens, or applications.",
      "Verify every broker, brokerage, lender, and lawyer through an independent official channel.",
      "If a loan is unfamiliar, preserve records and contact a lawyer, the lender, police, land registry, and credit bureaus promptly."
    ],
    sections: [
      {
        heading: "What was reported",
        paragraphs: [
          "The Toronto Star reported that Early, a retired nurse in Brampton, received a welcome letter for a $405,000 reverse mortgage after believing her home was mortgage-free. She alleges that she did not knowingly authorize the loan and that she had previously been drawn into door-to-door home-equipment transactions that affected her home equity.",
          "The report says HomeEquity Bank attributed the alleged fraud to a third-party mortgage broker and is seeking repayment. Early disputes liability. Court allegations, electronic-signing records, the movement and use of funds, and the responsibilities of the people and organizations involved require evidence and legal findings. A consumer guide cannot decide that dispute."
        ]
      },
      {
        heading: "Why title and consent checks matter",
        paragraphs: [
          "A reverse mortgage is secured against the home, and interest generally increases the balance over time. That makes valid identity, informed consent, independent legal advice, and accurate registration central to the transaction. A homeowner should receive and retain the lender commitment, cost-of-borrowing disclosure, legal documents, appraisal information, and records showing where funds were sent.",
          "The Financial Consumer Agency of Canada warns that title fraud can involve stolen personal information and an unauthorized mortgage. It recommends checking the provincial or territorial land registry, monitoring credit reports, using licensed professionals, and consulting a lawyer before giving anyone authority over a home or other assets."
        ],
        bullets: [
          "Confirm the legal names and licence status of the broker, brokerage, and lender.",
          "Contact each organization using a number obtained independently, not one supplied in an unexpected message.",
          "Use your own lawyer and confirm instructions with that lawyer through a known contact path.",
          "Read the complete mortgage and any waiver before signing, and keep copies of every signed document.",
          "Review the registered title after closing and investigate any entry you do not recognize."
        ]
      },
      {
        heading: "Recognize warning signs before closing",
        paragraphs: [
          "Ontario mortgage brokers and agents generally must be licensed by the Financial Services Regulatory Authority of Ontario. FSRA says consumers should receive clear written information about costs, risks, conflicts, and the role of the brokerage. It also warns about pressure to waive the normal two-business-day review period.",
          "Be cautious when a salesperson combines home equipment, debt consolidation, renovations, legal referrals, and new financing into one urgent solution. Stop if someone controls who you speak with, discourages independent advice, asks you to sign blank or incomplete documents, requests a one-time security code, or will not explain where every dollar will go."
        ]
      },
      {
        heading: "What to do about an unfamiliar mortgage",
        paragraphs: [
          "Do not ignore a lender letter, title notice, collection demand, or unfamiliar account. Preserve envelopes, emails, texts, call logs, contracts, electronic-signature records, bank statements, and the names of everyone involved. Avoid altering original files. Contact a lawyer experienced in real-estate or mortgage disputes before signing a settlement, discharge, sale, or new loan.",
          "The Financial Consumer Agency of Canada advises potential victims to contact affected financial institutions, local police, the land registry, and both major credit bureaus, and to report fraud through the National Fraud Reporting System. Ask a title insurer whether a policy applies, but remember that coverage depends on the policy and facts. A calculator can model how a disputed balance might grow, but it cannot determine consent, liability, insurance coverage, or the outcome of a court case."
        ]
      }
    ],
    faqs: [
      {
        question: "Who is Darlene Early in the reverse-mortgage story?",
        answer: "She is an Ontario homeowner who says a $405,000 reverse mortgage was issued in her name without her informed authorization. The lender disputes her position and says alleged fraud involved a third-party broker. The competing claims should not be presented as settled facts."
      },
      {
        question: "How can I check whether a mortgage or lien is on my home?",
        answer: "Search the applicable provincial or territorial land registry or ask an independent real-estate lawyer to obtain and explain the parcel register or title record."
      },
      {
        question: "What should I do if I do not recognize a mortgage?",
        answer: "Preserve all records and promptly contact an independent lawyer, the named lender through a verified channel, local police, the land registry, both credit bureaus, and the National Fraud Reporting System."
      }
    ],
    sources: [
      {
        label: "Toronto Star: Darlene Early reverse-mortgage investigation",
        href: "https://www.thestar.com/news/investigations/her-home-was-completely-paid-off-then-a-letter-from-homeequity-bank-claimed-she-owed/article_8bf1557b-a943-417d-81e6-467969dd32d0.html"
      },
      {
        label: "Financial Consumer Agency of Canada: real estate fraud",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/real-estate-fraud.html"
      },
      {
        label: "FSRA: watch out for mortgage fraud",
        href: "https://www.fsrao.ca/consumers/mortgage-brokering/watch-out-mortgage-fraud"
      },
      {
        label: "FSRA: understanding title insurance",
        href: "https://www.fsrao.ca/consumers/property-and-other-insurance/understanding-title-insurance"
      }
    ],
    calculator: "reverse-mortgage"
  },
  {
    slug: "how-to-get-preapproved-for-mortgage",
    title: "How to Get Preapproved for a Mortgage Without Overstretching",
    description:
      "Prepare documents, compare lenders, protect your budget, and understand what a mortgage preapproval does not guarantee.",
    keyword: "how to get preapproved for mortgage",
    category: "Borrowing",
    readingMinutes: 10,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "A mortgage preapproval is a lender's conditional estimate of what it may lend based on information reviewed at that point. It can clarify a price range and may include a temporary rate hold, but it is not a promise that every property or final application will be approved.",
      "The strongest approach is to organize documents first, set a personal budget below the lender maximum, and compare more than one lender on total cost and terms."
    ],
    keyTakeaways: [
      "Check credit reports and correct errors before the application window.",
      "Prepare income, employment, asset, down-payment, and debt documents.",
      "Compare at least three lenders or channels where practical.",
      "Keep a cash buffer for closing, moving, repairs, and payment changes.",
      "Avoid new debt or unexplained account changes before closing."
    ],
    sections: [
      {
        heading: "Prepare the financial file",
        paragraphs: [
          "Lenders commonly ask for identification, employment and income evidence, tax records for self-employed applicants, bank or investment statements, the source of the down payment, and details of debts or support obligations. Requirements vary by lender, loan program, and country.",
          "Review the numbers for consistency before submitting. Large deposits, recent loans, job changes, and transfers may require explanation. Keep an organized copy of everything provided and never send sensitive documents through an unverified link."
        ]
      },
      {
        heading: "Set your own limit before hearing the lender's",
        paragraphs: [
          "A lender's maximum is based on its underwriting model, not on every household goal. It may not capture childcare, commuting, family support, renovations, variable income, or the emergency reserve that helps you sleep well. Use an affordability model with taxes, insurance, fees, debt, and a retained cash buffer.",
          "Stress the payment at a higher rate and include realistic closing costs. A lower personal ceiling can create room for repairs, rate changes, and normal life without turning every month into a test."
        ]
      },
      {
        heading: "Compare complete offers",
        paragraphs: [
          "Rate matters, but so do points or lender fees, mortgage insurance, prepayment rules, portability, conversion options, rate-lock terms, service, and penalties. Ask how long a quoted or held rate lasts and what happens if market rates fall.",
          "In the United States, the CFPB recommends comparing multiple preapprovals and later official Loan Estimates. In Canada, the FCAC notes that preapproval terminology and criteria can vary and that the property still must satisfy the lender."
        ]
      },
      {
        heading: "Protect the approval through closing",
        paragraphs: [
          "Continue paying every bill on time. Ask the lender before opening credit, financing furniture, co-signing, changing jobs, or moving down-payment funds. Final approval commonly includes updated verification and a review of the property.",
          "Treat any preapproval letter as private financial information. Share it only with people who need it and consider whether the maximum amount should be visible during negotiation."
        ]
      }
    ],
    faqs: [
      {
        question: "Does preapproval guarantee a mortgage?",
        answer: "No. Final approval can depend on updated finances, credit, underwriting, the property, appraisal, title, insurance, and other conditions."
      },
      {
        question: "How long does a preapproved rate last?",
        answer: "It varies by lender and market. In Canada, the FCAC notes that rate holds may range from 60 to 130 days depending on the lender."
      },
      {
        question: "Should I borrow the maximum?",
        answer: "Not automatically. Build a household budget that includes non-housing goals, irregular costs, closing expenses, and a cash reserve."
      }
    ],
    sources: [
      {
        label: "FCAC: getting preapproved for a mortgage",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/preapproval-qualify-mortgage.html"
      },
      {
        label: "CFPB: shopping for a mortgage",
        href: "https://www.consumerfinance.gov/consumer-tools/mortgages/shopping-for-a-mortgage/"
      }
    ],
    calculator: "affordability"
  },
  {
    slug: "mortgage-quote",
    title: "Mortgage Quote Checklist: Compare the Price, Terms, and Tradeoffs",
    description:
      "Learn what belongs in a useful mortgage quote and how to compare rate, APR, fees, penalties, and cash required.",
    keyword: "mortgage quote",
    category: "Borrowing",
    readingMinutes: 8,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "A mortgage quote is useful only when the assumptions and costs are visible. A rate without loan amount, term, lock period, points or fees, insurance, and qualification conditions is marketing information, not a complete comparison.",
      "Put competing quotes on the same property value, down payment, loan type, amortization, and closing date. Then compare payment, cash to close, flexibility, and total cost over the time you expect to keep the loan."
    ],
    keyTakeaways: [
      "Match the loan amount, term, amortization, and rate type before comparing.",
      "Separate lender fees, third-party costs, prepaid amounts, and optional products.",
      "Ask whether the rate is locked, floating, held, or conditional.",
      "Model the cost over your expected holding period, not only the full amortization."
    ],
    sections: [
      {
        heading: "What to collect with every quote",
        paragraphs: [
          "Record the lender and product, principal, fixed or variable structure, interest rate, payment frequency, amortization, mortgage term, rate-lock details, discount points or lender fees, mortgage insurance, and estimated closing costs. Note which values are guaranteed and which can change.",
          "For adjustable or variable products, request the index, margin or discount, adjustment frequency, caps, trigger provisions, and a payment example at a higher rate. For fixed products, review prepayment limits and the formula used for an early-break penalty."
        ]
      },
      {
        heading: "Compare cash and time",
        paragraphs: [
          "A lower rate with large upfront costs may be unattractive if you sell or refinance before reaching break-even. Divide the added upfront cost by reliable monthly savings for a rough break-even, then use an amortization comparison for a more complete view.",
          "Cash to close deserves its own line. Down payment, taxes, legal or settlement fees, appraisal, inspection, title costs, insurance, moving, and reserves can arrive at different times. Do not spend the emergency buffer merely because the lender permits it."
        ]
      },
      {
        heading: "Ask how the quote can change",
        paragraphs: [
          "Quotes can depend on credit, property type, occupancy, location, debt ratios, income verification, appraisal, loan size, and closing date. Ask for the expiration date and a written list of assumptions. A verbal estimate should be followed by the formal disclosure required in your jurisdiction.",
          "Avoid sending identity or banking documents until you have independently verified the lender or broker and its secure application channel."
        ]
      },
      {
        heading: "Use calculators as a cross-check",
        paragraphs: [
          "Enter the quoted principal, rate, and amortization into the payment tool. Small differences may reflect compounding conventions, insurance, rounding, or fees added to the loan. Ask the lender to explain discrepancies rather than assuming either number is exact.",
          "A calculator is most valuable as a question generator. The lender's contract and official disclosure control the transaction."
        ]
      }
    ],
    faqs: [
      {
        question: "Is the lowest mortgage rate always the best quote?",
        answer: "No. Fees, points, penalties, insurance, flexibility, service, and how long you keep the mortgage can outweigh a small rate difference."
      },
      {
        question: "What is the difference between rate and APR?",
        answer: "Interest rate prices borrowing principal. APR in the United States is a broader standardized cost measure that incorporates certain fees, but it still needs context and is not identical to the payment rate."
      },
      {
        question: "Can a quote change?",
        answer: "Yes, unless specific terms are locked or guaranteed. Credit, property, verification, market rates, closing date, and loan details can change the final offer."
      }
    ],
    sources: [
      {
        label: "CFPB: shopping for a mortgage",
        href: "https://www.consumerfinance.gov/consumer-tools/mortgages/shopping-for-a-mortgage/"
      },
      {
        label: "FCAC: mortgage preapproval",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/preapproval-qualify-mortgage.html"
      }
    ],
    calculator: "payment"
  },
  {
    slug: "fixed-rate-mortgage",
    title: "Fixed-Rate Mortgage Guide: Stable Payment, Real Tradeoffs",
    description:
      "Understand what stays fixed, what can still change, and how term, amortization, penalties, and renewal affect a fixed-rate mortgage.",
    keyword: "fixed-rate mortgage",
    category: "Mortgage basics",
    readingMinutes: 9,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "A fixed-rate mortgage keeps its contractual interest rate unchanged for a defined period. That can make principal-and-interest payments predictable, but it does not freeze property tax, insurance, fees, or every future borrowing cost.",
      "The meaning of “fixed for the life of the loan” is common in the United States, while Canadian mortgages often have a shorter mortgage term inside a longer amortization and must be renewed at then-current terms."
    ],
    keyTakeaways: [
      "Separate mortgage term from amortization.",
      "A fixed rate protects against increases during the fixed period but may cost more to break.",
      "Taxes, insurance, and association fees can still raise the total housing payment.",
      "Compare renewal, portability, and prepayment terms as carefully as the headline rate."
    ],
    sections: [
      {
        heading: "What is fixed",
        paragraphs: [
          "The interest rate used to calculate scheduled principal and interest is fixed for the contract period. With a fully amortizing loan and no changes, payments reduce the balance to zero by the end of the amortization.",
          "The payment can still change when tax or insurance escrow changes, mortgage insurance is added or removed, a loan is recast, or the contract provides another adjustment. Review the official documents for the product in front of you."
        ]
      },
      {
        heading: "Term and amortization are different",
        paragraphs: [
          "Amortization is the planned time to repay the full balance. Term is the period the current contract applies. In Canada, a five-year fixed term may sit inside a 25-year amortization, leaving a balance to renew after five years. In the United States, a 30-year fixed mortgage commonly fixes the rate for the full scheduled loan.",
          "A longer amortization lowers the payment but usually increases total interest. A shorter amortization raises the payment and builds equity faster."
        ]
      },
      {
        heading: "The cost of leaving early",
        paragraphs: [
          "Fixed contracts can carry material prepayment penalties. Canadian closed fixed mortgages may use a calculation based on three months of interest or an interest-rate differential, subject to the contract and applicable rules. U.S. prepayment terms vary by product and law.",
          "If moving or refinancing is plausible, compare portability, assumability where applicable, prepayment privileges, and the exact penalty method before choosing between rates."
        ]
      },
      {
        heading: "Stress test the renewal or refinance",
        paragraphs: [
          "Predictability lasts only as long as the fixed period. Model the balance and payment at renewal under several rates. This is especially important when the current rate is unusually low or the household plans to extend amortization to manage cash flow.",
          "Use a schedule to see the expected balance at each anniversary. That turns rate news into a household-specific range rather than a headline."
        ]
      }
    ],
    faqs: [
      {
        question: "Can a fixed-rate mortgage payment change?",
        answer: "Principal and interest normally stay fixed for the defined period, but taxes, insurance, fees, mortgage insurance, and renewal terms can change the total housing payment."
      },
      {
        question: "Is a longer amortization cheaper?",
        answer: "It usually lowers each payment but increases total interest when the rate and other assumptions are unchanged."
      },
      {
        question: "What happens when a Canadian fixed term ends?",
        answer: "If a balance remains, the borrower normally renews, refinances, transfers, or pays it out under then-available terms."
      }
    ],
    sources: [
      {
        label: "FCAC: mortgage terms and amortization",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html"
      },
      {
        label: "CFPB: shopping for a mortgage",
        href: "https://www.consumerfinance.gov/consumer-tools/mortgages/shopping-for-a-mortgage/"
      }
    ],
    calculator: "stress-test"
  },
  {
    slug: "how-to-calculate-mortgage-payments",
    title: "How to Calculate Mortgage Payments and Check the Result",
    description:
      "Learn the fixed-payment formula, compounding conventions, total housing costs, and the assumptions behind a mortgage calculator.",
    keyword: "how to calculate mortgage payments",
    category: "Mortgage basics",
    readingMinutes: 9,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "A standard mortgage payment is built from principal, periodic interest rate, and number of payments. The formula is compact, but real results also depend on compounding convention, payment frequency, insurance, taxes, fees, and rounding.",
      "Mortgage Compass calculates the loan schedule in your browser and lets you switch between Canadian and U.S. conventions. The result is a planning estimate, not a lender quote."
    ],
    keyTakeaways: [
      "Principal equals the financed amount after down payment and financed costs.",
      "Convert the quoted annual rate using the contract's compounding convention.",
      "Use the number of payments, not only the number of years.",
      "Add taxes, insurance, mortgage insurance, and fees for a housing-budget estimate."
    ],
    sections: [
      {
        heading: "The fixed-payment formula",
        paragraphs: [
          "For principal P, periodic rate r, and n scheduled payments, the payment is P times r times (1 + r) to the power n, divided by (1 + r) to the power n minus 1. When the rate is zero, payment is simply principal divided by the number of payments.",
          "Each payment first covers accrued interest under the schedule, with the remainder reducing principal. Early payments generally contain more interest because the balance is larger."
        ]
      },
      {
        heading: "Convert the annual rate correctly",
        paragraphs: [
          "Many U.S. fixed mortgages use a nominal annual rate divided by 12 for monthly calculations. Canadian fixed mortgage rates are generally quoted with semi-annual compounding, which requires an equivalent periodic conversion. The same displayed rate can therefore produce a slightly different payment.",
          "Payment frequency adds another layer. Ordinary biweekly payment divides the annual schedule into 26 calculated periods. Accelerated biweekly is often defined as half the monthly payment every two weeks, creating the equivalent of an extra monthly payment each year."
        ]
      },
      {
        heading: "Add the rest of the housing budget",
        paragraphs: [
          "Principal and interest are not the whole cost of ownership. Add property tax, home insurance, mortgage insurance, condominium or association fees, and a maintenance reserve. Some costs may be collected with the lender payment, but they remain separate economic obligations.",
          "For affordability, compare the combined housing cost and all required debt payments with stable gross and net household income. Leave room for closing, moving, and irregular expenses."
        ]
      },
      {
        heading: "Check a calculator result",
        paragraphs: [
          "Confirm principal, rate, amortization, frequency, country convention, and whether fees or insurance were financed. Compare the first schedule row: interest should equal the opening balance times the periodic rate, subject to the lender's day-count and rounding rules.",
          "Small differences can be legitimate. Large differences often mean one tool included taxes or insurance, used another compounding convention, or interpreted term and amortization differently."
        ]
      }
    ],
    faqs: [
      {
        question: "Why does my lender payment differ from a calculator?",
        answer: "Possible causes include compounding, payment timing, financed insurance or fees, rounding, escrowed costs, day-count rules, or an incorrect term or amortization input."
      },
      {
        question: "Does paying biweekly always save interest?",
        answer: "Not necessarily. Ordinary biweekly and accelerated biweekly are different. Savings depend on the payment amount, posting method, rate, and contract."
      },
      {
        question: "Are taxes included in the mortgage formula?",
        answer: "No. The core formula covers principal and interest. Taxes, insurance, fees, and maintenance must be added separately."
      }
    ],
    sources: [
      {
        label: "CFPB: how lenders calculate monthly payments",
        href: "https://www.consumerfinance.gov/ask-cfpb/how-do-mortgage-lenders-calculate-monthly-payments-en-1965/"
      },
      {
        label: "FCAC: mortgage terms and amortization",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html"
      }
    ],
    calculator: "payment"
  },
  {
    slug: "what-is-a-reverse-mortgage",
    title: "What Is a Reverse Mortgage? Costs, Triggers, and Equity",
    description:
      "Understand how a reverse mortgage converts home equity into cash, how the balance grows, and what homeowners and families should review.",
    keyword: "what is a reverse mortgage",
    category: "Mortgage basics",
    readingMinutes: 10,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "A reverse mortgage is a loan secured by a home that allows an eligible homeowner to receive funds while generally postponing principal repayment. Interest and fees are added to the balance, so the amount owed tends to grow and home equity tends to shrink relative to a no-loan case.",
      "Rules differ across countries and products. In Canada, reverse mortgages are commonly available to homeowners age 55 or older and may permit borrowing up to a portion of appraised value. In the United States, the common federally insured HECM program is generally for homeowners age 62 or older and includes product-specific counselling and insurance requirements."
    ],
    keyTakeaways: [
      "The homeowner keeps title, but the home secures a growing debt.",
      "No scheduled mortgage payment does not mean no ongoing obligations.",
      "Property tax, insurance, occupancy, and maintenance terms matter.",
      "Compare a reverse mortgage with downsizing, a HELOC, home-equity loan, and other income options."
    ],
    sections: [
      {
        heading: "How money and interest move",
        paragraphs: [
          "Funds may be provided as a lump sum, scheduled advances, a line of credit, or a combination depending on the product. Interest accrues on amounts advanced and fees may also be added. Without voluntary payments, the balance compounds upward.",
          "A projection should show the loan balance and home value separately. Future home growth is uncertain and should never be used as a guarantee that equity will remain."
        ]
      },
      {
        heading: "When the loan becomes due",
        paragraphs: [
          "Common repayment events include sale of the home, the last borrower moving out or dying, or a default under contract obligations. Exact definitions, timelines, spouse protections, estate procedures, and non-recourse terms vary.",
          "Homeowners may still have to pay property tax, insurance, condominium fees, and maintenance. Failure to meet required obligations can create default risk even when no scheduled principal payment is due."
        ]
      },
      {
        heading: "Costs and alternatives",
        paragraphs: [
          "Reverse-mortgage rates can be higher than traditional mortgage or HELOC rates, and setup costs may include appraisal, legal, title, insurance, or lender charges. The cost can be substantial when the loan is held for many years.",
          "Compare the net cash, total projected balance, flexibility, and family goals with a HELOC, home-equity loan, refinancing, selling and downsizing, renting part of the home, or public-benefit and tax-deferral programs where available."
        ]
      },
      {
        heading: "Questions for independent review",
        paragraphs: [
          "Ask an independent lawyer or qualified housing counsellor to explain repayment triggers, spouse and co-owner status, non-recourse protection, fees, rate changes, required property obligations, default, and what heirs can do. Include family only with the homeowner's informed permission.",
          "Never sign because a salesperson says the offer expires today. A home-secured contract should allow time for verified documents and independent advice."
        ]
      }
    ],
    faqs: [
      {
        question: "Do you still own the home with a reverse mortgage?",
        answer: "The homeowner generally keeps title, while the lender holds a security interest. Contract obligations and local law still apply."
      },
      {
        question: "Do reverse mortgages require monthly payments?",
        answer: "Many do not require scheduled principal and interest payments while qualifying conditions continue, but taxes, insurance, maintenance, fees, and other obligations remain."
      },
      {
        question: "Can a reverse mortgage use all home equity?",
        answer: "Product limits apply and depend on factors such as value, age, rates, existing secured debt, and jurisdiction. Borrowing also reduces remaining equity over time."
      }
    ],
    sources: [
      {
        label: "FCAC: borrowing against home equity",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/borrow-home-equity.html"
      },
      {
        label: "CFPB: what is a reverse mortgage",
        href: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-reverse-mortgage-en-224/"
      }
    ],
    calculator: "reverse-mortgage"
  },
  {
    slug: "private-mortgage",
    title: "Private Mortgage Guide: When Bank Financing Is Not the Fit",
    description:
      "Understand private mortgages, short terms, fees, exit plans, due diligence, and the risks of borrowing outside mainstream bank channels.",
    keyword: "private mortgage",
    category: "Borrowing",
    readingMinutes: 9,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "A private mortgage is funded by an individual, mortgage investment entity, or other non-bank lender rather than a mainstream deposit-taking institution. It can serve borrowers or properties that do not fit conventional underwriting, but it often carries higher rates, lender fees, broker fees, shorter terms, and a stronger focus on property equity.",
      "The central question is not only whether the loan can close. It is whether the borrower has a credible, affordable exit before the term ends."
    ],
    keyTakeaways: [
      "Compare the annual rate, every fee, payment structure, and effective cost.",
      "Write the exit plan before accepting the loan.",
      "Use independent legal advice and verify each professional and funder.",
      "Model a delayed sale, failed refinance, lower appraisal, and higher renewal rate."
    ],
    sections: [
      {
        heading: "Why borrowers consider private financing",
        paragraphs: [
          "Possible reasons include temporary credit problems, unverifiable or irregular income, a property needing major work, a fast closing, bridge financing, tax arrears, or a loan size outside a bank's policy. A private loan may solve a timing problem, but it does not repair the underlying issue by itself.",
          "Ask which facts prevented conventional approval and what must change before the private term expires. If the answer is vague, the exit is not yet a plan."
        ]
      },
      {
        heading: "Calculate the complete cost",
        paragraphs: [
          "Add interest, lender fee, broker fee, appraisal, legal costs, title costs, administration, renewal fees, and any interest reserve. Determine whether fees are paid in cash or added to principal, because financed fees also accrue interest.",
          "Short terms can make annualized cost comparisons difficult. Build a month-by-month cash flow and calculate the balance due at maturity. Confirm whether payments are interest-only or amortizing and whether open prepayment is allowed."
        ]
      },
      {
        heading: "Build and stress the exit",
        paragraphs: [
          "Common exits include selling, completing renovations and refinancing, improving documented income or credit, receiving expected funds, or moving to a mainstream lender. Each exit depends on events that can be late or weaker than expected.",
          "Model a lower appraisal, six-month construction delay, higher refinance rate, sale costs, and renewal fee. Keep enough liquidity to avoid accepting the first rescue offer under pressure."
        ]
      },
      {
        heading: "Use professional and regulatory checks",
        paragraphs: [
          "Verify the broker, administrator, lender, and lawyer through applicable public records. Insist on written disclosure of conflicts, fees, interest, default provisions, enforcement rights, and renewal terms.",
          "Independent legal advice should be genuinely independent. Do not sign blank forms, transfer funds to an unverified account, or rely on promises not written into the agreement."
        ]
      }
    ],
    faqs: [
      {
        question: "Are private mortgages always bad?",
        answer: "No, but they can be expensive and high risk. They are best evaluated as short-term financing with a documented and stress-tested exit."
      },
      {
        question: "Can fees be added to the mortgage?",
        answer: "Sometimes. If they are financed, the opening balance and interest cost rise. The contract and disclosure should show this clearly."
      },
      {
        question: "What happens at the end of a short term?",
        answer: "The balance may need to be repaid, refinanced, renewed, or paid from a sale. Renewal is not guaranteed and may involve a new rate and fee."
      }
    ],
    sources: [
      {
        label: "FCAC: borrowing against home equity",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/borrow-home-equity.html"
      }
    ],
    calculator: "refinance"
  },
  {
    slug: "rocket-mortgage",
    title: "Rocket Mortgage: What It Is and How to Compare an Online Lender",
    description:
      "An independent overview of Rocket Mortgage and a neutral checklist for comparing an online mortgage option with other lenders.",
    keyword: "rocket mortgage",
    category: "Borrowing",
    readingMinutes: 7,
    published: "2026-07-28",
    updated: "2026-08-06",
    intro: [
      "Rocket Mortgage is a U.S. online mortgage lender and digital mortgage experience. Its official materials describe purchase and refinance options and an online process for application, document exchange, approval tasks, closing, and servicing for many loans.",
      "Mortgage Compass is not affiliated with, endorsed by, or sponsored by Rocket Mortgage. This guide does not rank lenders. It explains how to compare one online lender with banks, credit unions, brokers, and other direct lenders using the same assumptions."
    ],
    keyTakeaways: [
      "Rocket Mortgage operates in the United States, not Canada.",
      "Product availability and borrower requirements change, so use current official disclosures.",
      "Compare formal offers from multiple lenders, not only websites or advertised rates.",
      "Evaluate cost, product fit, service, rate lock, appraisal, closing, and servicing."
    ],
    sections: [
      {
        heading: "What the service does",
        paragraphs: [
          "Rocket's official FAQ describes an online path from application through approval and closing, plus account tools for many serviced loans. It lists conventional and certain government-backed options, while noting that some products are unavailable.",
          "An online interface can make document collection and status tracking convenient, but underwriting, appraisal, title, insurance, and closing requirements still apply."
        ]
      },
      {
        heading: "How to compare it fairly",
        paragraphs: [
          "Use the same property price, down payment, loan type, term, rate-lock period, credit assumptions, occupancy, and closing date. Compare interest rate, APR where provided, points, lender credits, fees, mortgage insurance, cash to close, and payment.",
          "Request formal disclosures from multiple lenders within a focused shopping period. Ask how changing points or credits changes the rate and break-even."
        ]
      },
      {
        heading: "Service and product-fit questions",
        paragraphs: [
          "Rocket's official FAQ says an online account can be used during origination to communicate, send documents, and view loan and closing details. If Rocket services the loan after closing, the account can support payments, transaction history, mortgage documents, paperless statements, tax and insurance information, and escrow changes. The FAQ also directs signed-in customers to online chat for questions.",
          "Ask what happens when a file needs manual review, whether servicing may be transferred, and how closing works in your location. A fast interface is not a substitute for understanding the contract, and online tools do not guarantee approval or a customized loan that fits every future goal."
        ]
      },
      {
        heading: "Avoid brand-search scams",
        paragraphs: [
          "Type the official address or use a verified listing. Sponsored search results, cloned login pages, and unsolicited calls can imitate well-known companies. Check the domain before entering identity or banking information.",
          "If a caller pressures you to move funds, install software, or share a one-time security code, stop and contact the lender through its official public channel."
        ]
      }
    ],
    faqs: [
      {
        question: "Is Rocket Mortgage a calculator?",
        answer: "No. Its official FAQ describes Rocket Mortgage as an online mortgage experience and lender. Calculator results are estimates, while a lender application can produce personalized terms."
      },
      {
        question: "Is Rocket Mortgage available in Canada?",
        answer: "Its official FAQ states that it is available in U.S. states and the District of Columbia and is not offered outside the United States."
      },
      {
        question: "Is an online lender always cheaper?",
        answer: "No. Compare formal offers, points, credits, fees, insurance, lock terms, product fit, and service. Delivery channel alone does not determine cost."
      },
      {
        question: "Does Rocket Mortgage offer an online application and servicing tools?",
        answer: "Its official FAQ describes an online process for application, documents, communication, approval tasks, and closing details. For loans it services, the signed-in account can also support payments, statements, documents, tax and insurance information, and escrow changes."
      },
      {
        question: "Can Rocket Mortgage adjust my payment schedule or recast a loan?",
        answer: "Options depend on the loan and servicer. Rocket's current recast guide says eligible conventional loans may be recast after qualifying principal reduction and payment-history requirements. Borrowers facing payment difficulty should contact the servicer about available repayment, forbearance, modification, or deferral options."
      },
      {
        question: "Can a self-employed borrower apply online?",
        answer: "Rocket publishes an online application path and self-employed documentation guidance. Approval still depends on verified income, assets, credit, debt, property, and the selected loan program."
      }
    ],
    sources: [
      {
        label: "Rocket Mortgage official FAQ",
        href: "https://www.rocketmortgage.com/faqs"
      },
      {
        label: "Rocket Mortgage: mortgage recasting",
        href: "https://www.rocketmortgage.com/learn/recast-mortgage"
      },
      {
        label: "Rocket Mortgage: self-employed borrowers",
        href: "https://www.rocketmortgage.com/learn/self-employed-mortgage"
      },
      {
        label: "CFPB: shopping for a mortgage",
        href: "https://www.consumerfinance.gov/consumer-tools/mortgages/shopping-for-a-mortgage/"
      }
    ],
    calculator: "payment"
  },
  {
    slug: "mortgage-rates-news",
    title: "Mortgage Rates News: Read the Signal Without Chasing the Headline",
    description:
      "A dated July 2026 mortgage-rate update for Canada and the United States, plus a framework for turning market news into a payment range.",
    keyword: "mortgage rates news",
    category: "Market",
    readingMinutes: 8,
    published: "2026-07-28",
    updated: "2026-07-28",
    intro: [
      "As of the latest official releases available for this July 28, 2026 update, the Bank of Canada held its policy rate at 2.25% on July 15, while Freddie Mac reported a U.S. average 30-year fixed mortgage rate of 6.58% and 15-year fixed rate of 5.96% for July 23.",
      "Those are market reference points, not personal mortgage quotes. A borrower rate depends on country, product, term, credit, down payment, property, lender pricing, points or fees, insurance, and timing."
    ],
    keyTakeaways: [
      "Canada's policy rate is not a direct five-year fixed mortgage quote.",
      "Freddie Mac's survey is an average, not an offer to every borrower.",
      "Bond yields, funding costs, competition, risk, and product terms all matter.",
      "Translate news into payment scenarios at your actual balance and renewal date."
    ],
    sections: [
      {
        heading: "Canada: policy held at 2.25%",
        paragraphs: [
          "The Bank of Canada held the overnight-rate target at 2.25% on July 15, 2026. Its statement described an improving but uncertain outlook and said the current rate remained appropriate at that meeting. The next scheduled announcement was listed for September 2, 2026.",
          "Variable mortgage pricing is often linked more directly to lender prime rates, while fixed mortgage pricing is influenced by bond yields and funding markets. A policy-rate hold can coexist with movement in fixed offers."
        ]
      },
      {
        heading: "United States: mid-six-percent survey averages",
        paragraphs: [
          "Freddie Mac's July 23, 2026 consumer page reported 6.58% for the average 30-year fixed rate and 5.96% for the 15-year fixed rate. The survey reflects loan applications submitted to lenders and is released weekly.",
          "A shorter term usually has a higher payment even when its rate is lower, because principal is repaid faster. Points, fees, borrower characteristics, and loan program can move an individual offer away from the survey."
        ]
      },
      {
        heading: "Turn a headline into a household range",
        paragraphs: [
          "Use your current or planned principal and model at least three rates: the available quote, one percentage point higher, and a more severe scenario. Include tax, insurance, fees, other debt, and a cash buffer.",
          "For a renewal, use the expected balance at the renewal date rather than the original loan. Compare keeping the amortization, extending it, making a lump sum, and changing payment frequency, while checking contract limits."
        ]
      },
      {
        heading: "What to watch next",
        paragraphs: [
          "Follow official central-bank announcements, inflation and labour data, government bond yields, and weekly mortgage surveys. Lender specials can move before or after widely reported benchmarks.",
          "Date-stamp every rate note. Old rate content can be actively misleading, so this page separates the observation date from evergreen education and links directly to updateable official sources."
        ]
      }
    ],
    faqs: [
      {
        question: "Does a central-bank cut reduce my fixed mortgage immediately?",
        answer: "Not necessarily. Fixed pricing is also influenced by bond yields, funding costs, risk, competition, term, and lender strategy."
      },
      {
        question: "Is a national average my likely mortgage rate?",
        answer: "No. It is a market reference. Your quote depends on the full application, loan program, property, timing, fees, and lender."
      },
      {
        question: "How often should I update a rate scenario?",
        answer: "Update it when a material quote, balance, income, renewal date, or market assumption changes. Use a fresh lender disclosure for decisions."
      }
    ],
    sources: [
      {
        label: "Bank of Canada: July 15, 2026 rate decision",
        href: "https://www.bankofcanada.ca/2026/07/fad-press-release-2026-07-15/"
      },
      {
        label: "Freddie Mac: mortgage rates and affordability",
        href: "https://myhome.freddiemac.com/buying/mortgage-rates"
      }
    ],
    calculator: "stress-test"
  },
  {
    slug: "mortgage-renewal-calculator-canada",
    title: "Mortgage Renewal Calculator Canada Guide",
    description:
      "Estimate a Canadian mortgage renewal payment, compare stay-versus-switch costs, and prepare for rate, term, and amortization decisions.",
    keyword: "mortgage renewal calculator Canada",
    category: "Planning",
    readingMinutes: 10,
    published: "2026-08-05",
    updated: "2026-08-05",
    intro: [
      "A mortgage renewal calculator for Canada starts with the balance expected on the renewal date, not the amount originally borrowed. Add the proposed rate, remaining amortization, payment frequency, and any costs to switch lenders. The result is a planning estimate that helps you compare offers on consistent assumptions.",
      "Renewal deserves an early calculation because the offered rate is only one part of the decision. Term length, fixed or variable pricing, prepayment privileges, portability, fees, and a changed amortization can alter both the next payment and the longer-run interest cost."
    ],
    keyTakeaways: [
      "Use the projected balance on the renewal date and the remaining amortization.",
      "Compare the same balance, payment frequency, amortization, and term assumptions across offers.",
      "Start shopping a few months before renewal instead of relying on an automatic offer.",
      "Treat a lower payment from a longer amortization as a tradeoff, not a free saving.",
      "A straight switch may avoid a set federal stress-test rate, but the new lender still decides whether to approve the application."
    ],
    sections: [
      {
        heading: "Gather the inputs for a renewal payment estimate",
        paragraphs: [
          "Find the remaining principal expected at the end of the current term. Your lender's renewal statement should show the balance at renewal, offered interest rate, payment frequency, term, and applicable charges. A federally regulated lender must provide that statement at least 21 days before the end of the term, but waiting for it can leave too little time to compare alternatives.",
          "For an earlier estimate, use the current amortization schedule or account balance and project it forward to the renewal date. Enter that future balance in the refinance break-even calculator, set fees and the prepayment penalty to zero for an at-term renewal, and run each proposed rate with the same remaining amortization."
        ],
        bullets: [
          "Projected principal on the renewal date",
          "Offered annual rate and fixed or variable structure",
          "Remaining amortization and proposed term",
          "Monthly, biweekly, accelerated biweekly, or other payment frequency",
          "Transfer, appraisal, legal, registration, discharge, or administration costs"
        ]
      },
      {
        heading: "Measure payment shock with more than one rate",
        paragraphs: [
          "Model the renewal offer, at least one competing offer, and a higher-rate scenario. Compare the dollar payment, total interest during the proposed term, and expected balance at the next renewal. A single monthly number can hide the cost of stretching the amortization or selecting a longer term.",
          "Bank of Canada staff estimated that about 60% of outstanding Canadian mortgages would renew in 2025 or 2026. Under the study's assumptions, the average monthly payment for 2026 renewals could be 6% above December 2024, while five-year fixed borrowers renewing in 2026 could average a 20% increase. Those are portfolio estimates, not forecasts for a specific household, so your balance and offer matter more than the national average."
        ]
      },
      {
        heading: "Compare staying with switching lenders",
        paragraphs: [
          "The existing lender's renewal letter is a starting point, not a complete market comparison. Ask for a better rate and compare the term, prepayment privileges, penalty method, portability, collateral-charge implications, service, and optional insurance. A slightly lower rate may not win after transfer costs or less flexible terms are included.",
          "Since November 21, 2024, OSFI has not required a set minimum qualifying rate for an uninsured straight switch between federally regulated lenders when neither the loan amount nor amortization increases. This does not guarantee approval or remove underwriting. The new lender can apply its own criteria, and refinancing, increasing the balance, or extending amortization changes the situation."
        ]
      },
      {
        heading: "Use a renewal checklist before accepting",
        paragraphs: [
          "Start several months before the term ends. Confirm the maturity date, registration type, insurance certificate if applicable, transfer costs, and the documents a new lender will require. Keep written copies of each offer so the rate, assumptions, and conditions can be compared on the same day.",
          "Before signing, rerun the payment with the final balance and disclosed rate. Check whether the household budget still leaves room for taxes, insurance, condominium fees, repairs, other debt, and emergency savings. If the payment is difficult, contact the lender early and compare options with a qualified professional before extending amortization or adding debt."
        ]
      }
    ],
    faqs: [
      {
        question: "What balance should I use in a Canadian mortgage renewal calculator?",
        answer: "Use the principal expected on the renewal date. Obtain it from the renewal statement or project the current balance to the end of the term with an amortization schedule."
      },
      {
        question: "Do I have to renew with my current lender?",
        answer: "No. You may apply to switch lenders, but the new lender must approve the application and transfer, appraisal, legal, registration, discharge, or administration costs may apply."
      },
      {
        question: "Do I need to pass the mortgage stress test when switching at renewal?",
        answer: "OSFI does not require a set minimum qualifying rate for an uninsured straight switch between federally regulated lenders when the loan amount and amortization do not increase. Lenders still underwrite the application, and other transactions may be treated differently."
      },
      {
        question: "Does extending amortization make a renewal cheaper?",
        answer: "It can lower the scheduled payment, but it usually increases the time in debt and total interest. Compare payment relief with the longer-run cost."
      }
    ],
    sources: [
      {
        label: "FCAC: renewing your mortgage",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html"
      },
      {
        label: "OSFI: minimum qualifying rate for uninsured straight switches",
        href: "https://www.osfi-bsif.gc.ca/en/news/backgrounder-minimum-qualifying-rate-mqr"
      },
      {
        label: "Bank of Canada: how mortgage payments may change at renewal",
        href: "https://www.bankofcanada.ca/2025/07/staff-analytical-note-2025-21/"
      }
    ],
    calculator: "refinance"
  },
  {
    slug: "mortgage-penalty-calculator-canada",
    title: "Mortgage Penalty Calculator Canada Guide",
    description:
      "Estimate a Canadian mortgage prepayment penalty, understand three-month-interest and IRD methods, and test the full refinance break-even cost.",
    keyword: "mortgage penalty calculator Canada",
    category: "Borrowing",
    readingMinutes: 10,
    published: "2026-08-05",
    updated: "2026-08-05",
    intro: [
      "A mortgage penalty calculator in Canada can provide a rough prepayment-charge estimate, but the lender's written quote is the number that belongs in a refinance decision. Contracts differ, and an interest rate differential can depend on posted rates, discounts, the comparison term, and the lender's stated method.",
      "The useful decision is broader than the penalty alone. Add discharge, administration, appraisal, legal, registration, and possible cash-back repayment costs, then compare that total with payment and interest savings over the period you realistically expect to keep the replacement mortgage."
    ],
    keyTakeaways: [
      "An open mortgage can generally be repaid without a prepayment penalty, while a closed mortgage commonly has limits.",
      "A closed-mortgage charge is often based on three months of interest or an interest rate differential.",
      "IRD methods vary, so an online estimate may differ materially from the lender's payout quote.",
      "Use the full switching cost, not only the penalty, in a refinance break-even comparison.",
      "Check prepayment, portability, blend-and-extend, and wait-until-renewal options before breaking the term."
    ],
    sections: [
      {
        heading: "Check whether a prepayment penalty applies",
        paragraphs: [
          "Read the mortgage contract for open or closed status, prepayment privileges, annual limits, portability, and the penalty formula. A lender may charge when you exceed an allowed lump sum, break the contract, transfer before term-end, sell and repay the mortgage, or otherwise pay the balance earlier than permitted.",
          "The Financial Consumer Agency of Canada says open mortgages allow lump-sum or full repayment without a prepayment penalty. Closed contracts normally restrict extra repayment, and the charge can reach thousands of dollars. Other fees and cash-back repayment may still apply, so request a complete payout or discharge statement."
        ]
      },
      {
        heading: "Estimate three months of interest and the IRD",
        paragraphs: [
          "A simple three-month-interest estimate is the outstanding balance multiplied by the annual contract rate and then multiplied by three-twelfths. This is a planning shortcut. The contract may define the balance, rate, dates, and calculation conventions differently, so compare the estimate with the lender's calculator and written quote.",
          "For a fixed mortgage, the lender may instead use an interest rate differential. FCAC explains that lenders can compare the remaining interest under the current contract with interest based on a similar remaining term, using posted or discounted rates according to the contract. Because those inputs and discount treatments vary, there is no universal IRD result from only the balance and contract rate."
        ],
        bullets: [
          "Outstanding balance and amount being prepaid",
          "Contract rate and original rate discount",
          "Months remaining in the term",
          "Current comparison rate selected under the contract",
          "The lender's posted-rate or discounted-rate method"
        ]
      },
      {
        heading: "Calculate the complete refinance break-even",
        paragraphs: [
          "Add the quoted penalty to discharge, administration, appraisal, legal, registration, reinvestment, and new-lender setup costs. Include any cash-back repayment. If costs are added to the new principal, they also generate interest, so model the financed amount rather than treating every fee as cash paid today.",
          "Enter the actual lender penalty and other fees in the refinance break-even calculator. Compare the current and replacement mortgages over the same remaining horizon. A lower payment is not enough if it comes from extending amortization, and a short break-even period is not useful if you expect to sell or refinance again before reaching it."
        ]
      },
      {
        heading: "Compare ways to reduce or avoid the charge",
        paragraphs: [
          "Ask whether you can use an available lump-sum privilege before requesting the payout, since a lower balance may reduce the charge. Confirm timing first because some contracts restrict prepayments close to a discharge. Waiting until the term ends can remove the mid-term penalty, although rates and other circumstances can change while you wait.",
          "If you are moving, ask whether the mortgage can be ported. If you want a different rate with the same lender, ask about blend-and-extend and compare its full cost and new penalty terms. Do not assume an apparently penalty-free option is cheaper without calculating the new rate, fees, remaining balance, and flexibility."
        ]
      }
    ],
    faqs: [
      {
        question: "How do I estimate three months of mortgage interest?",
        answer: "For a rough estimate, multiply the balance by the annual contract rate and by 3/12. The lender's contract and written payout quote determine the actual charge."
      },
      {
        question: "What is an interest rate differential mortgage penalty?",
        answer: "An IRD estimates the interest the lender may lose over the remaining term by comparing contract interest with interest based on a current comparison rate. The exact method and rate inputs vary by lender and contract."
      },
      {
        question: "Can I avoid a mortgage penalty by waiting for renewal?",
        answer: "You can generally repay or switch at the end of the term without a mid-term prepayment penalty, but discharge, transfer, legal, registration, or other fees may still apply. Confirm the exact maturity and payout process with the lender."
      },
      {
        question: "Should I refinance if the new rate is lower?",
        answer: "Only after the interest and payment savings exceed the penalty and all other switching costs within a realistic holding period, while accounting for any change in amortization and loan amount."
      }
    ],
    sources: [
      {
        label: "FCAC: mortgage fees and prepayment penalties",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reduce-prepayment-penalties.html"
      },
      {
        label: "FCAC: breaking your mortgage contract",
        href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/break-mortgage-contract.html"
      }
    ],
    calculator: "refinance"
  },
  {
    slug: "mortgage-amortization-schedule-calculator-canada",
    title: "Mortgage Amortization Schedule Calculator Canada Guide",
    description:
      "Build a Canadian mortgage amortization schedule, read principal and interest by payment or year, and understand what changes at renewal.",
    keyword: "mortgage amortization schedule calculator Canada",
    category: "Mortgage basics",
    readingMinutes: 8,
    published: "2026-08-06",
    updated: "2026-08-06",
    intro: [
      "A mortgage amortization schedule is a payment-by-payment table showing how much goes to interest, how much reduces principal, and what balance remains. Enter the amount borrowed, annual rate, amortization, and payment frequency to generate the schedule.",
      "For a Canadian mortgage, the schedule is a projection rather than a promise that one rate lasts until the loan reaches zero. The mortgage term is usually shorter than the amortization, so a new rate and payment can create a new schedule at renewal."
    ],
    keyTakeaways: [
      "Amortization is the estimated repayment period, while the mortgage term is the current contract period.",
      "Early payments usually contain more interest because the balance is larger.",
      "Payment frequency and Canadian compounding conventions can change the result.",
      "Use the projected renewal balance as the principal for the next term's scenario."
    ],
    sections: [
      {
        heading: "Inputs that determine the amortization table",
        paragraphs: [
          "Start with mortgage principal, which is normally the purchase price minus the down payment plus any amount financed into the loan. Add the contract rate, amortization period, payment frequency, and the correct country convention. Do not use the original purchase price as principal after years of repayment.",
          "The payment formula converts the annual rate into a periodic rate and spreads repayment across the number of scheduled payments. Canadian fixed-rate mortgage examples commonly use a nominal annual rate compounded semi-annually. Exact lender dates, rounding, fees, insurance, and contract terms may produce small differences."
        ]
      },
      {
        heading: "How to read principal, interest, and balance",
        paragraphs: [
          "Interest for a period is based on the outstanding balance and periodic rate. The rest of the scheduled payment reduces principal. Because the balance is highest near the beginning, interest usually takes a larger share of early payments even though the fixed payment amount stays the same.",
          "The yearly view is useful for comparing progress and estimating a renewal balance. The detailed table is better for checking a particular payment date or exporting a complete schedule. Treat the final decimals as estimates until compared with the lender's statement."
        ]
      },
      {
        heading: "What changes the schedule",
        paragraphs: [
          "A new rate at renewal, a changed amortization, a different payment frequency, or an extra principal payment changes the path. A longer amortization normally reduces the required payment but increases the time in debt and total interest. A valid prepayment reduces the balance and can shorten payoff.",
          "Create a fresh schedule whenever a material input changes. For renewal planning, use the balance expected on the maturity date, then compare the offered rate with higher-rate and alternative-amortization cases."
        ]
      },
      {
        heading: "Check the calculator against the contract",
        paragraphs: [
          "A financial calculator or spreadsheet can reproduce the fixed-payment formula when the periodic rate and number of payments are entered correctly. The most common mistake is dividing a Canadian quoted rate by 12 without first accounting for its stated compounding convention.",
          "Compare the first payment, a year-end balance, and the renewal-date balance with lender documents. Differences can come from funding dates, payment dates, rounding, rate changes, skipped payments, fees, insurance, or prepayments that the simple schedule does not know about."
        ]
      }
    ],
    faqs: [
      { question: "What does a mortgage amortization schedule show?", answer: "It shows each payment, the principal and interest portions, and the remaining balance. This calculator also provides yearly rollups." },
      { question: "Is amortization the same as the mortgage term?", answer: "No. Amortization is the estimated full repayment period. The term is the shorter contract period that ends at renewal or repayment." },
      { question: "Can I download an amortization table?", answer: "Yes. The amortization calculator can show every payment and export the detailed rows as CSV." }
    ],
    sources: [
      { label: "FCAC: mortgage terms and amortization", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/mortgage-terms-amortization.html" },
      { label: "FCAC: interest on mortgages", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/interest-on-mortgages.html" }
    ],
    calculator: "amortization"
  },
  {
    slug: "mortgage-extra-payment-calculator-canada",
    title: "Mortgage Extra Payment Calculator Canada Guide",
    description:
      "Compare one-time, annual, and recurring mortgage prepayments in Canada, including interest saved, payoff time, and contract limits.",
    keyword: "mortgage extra payment calculator Canada",
    category: "Planning",
    readingMinutes: 8,
    published: "2026-08-06",
    updated: "2026-08-06",
    intro: [
      "A mortgage extra payment calculator compares the regular amortization with a schedule that applies more money to principal. It can model an increase on every payment, an annual lump sum, a separate one-time lump sum, or a combination of the three.",
      "The calculation shows a potential interest saving and earlier payoff, but the mortgage contract decides whether the payment is allowed without a charge. Check the amount, timing, notice, and annual reset rules before acting."
    ],
    keyTakeaways: [
      "Extra principal reduces the balance used for future interest calculations.",
      "A one-time payment needs both an amount and the payment number when it will occur.",
      "Earlier prepayments usually have more time to reduce interest.",
      "Prepayment privileges and penalties vary by contract and lender."
    ],
    sections: [
      {
        heading: "Choose the prepayment pattern you can sustain",
        paragraphs: [
          "Use extra-per-payment for a recurring increase tied to every regular payment. Use annual lump sum for a repeatable once-a-year amount. Use one-time lump sum when modeling a tax refund, bonus, inheritance, sale proceeds, or other single principal reduction at a chosen future payment.",
          "Keep the base mortgage assumptions identical when comparing strategies. If the rate, amortization, or frequency also changes, you will not know how much of the difference came from the prepayment itself."
        ]
      },
      {
        heading: "Interpret interest saved and time saved",
        paragraphs: [
          "Interest saved is the difference between the base schedule's total interest and the accelerated schedule's total interest under the same rate assumption. Time saved compares the modeled payoff dates. The result will change at renewal if the interest rate or payment changes.",
          "A prepayment is not automatically the best use of cash. Compare the guaranteed mortgage interest avoided with emergency reserves, higher-interest debt, tax considerations, and the uncertain return from other uses of the money."
        ]
      },
      {
        heading: "Check the contract before paying extra",
        paragraphs: [
          "The Financial Consumer Agency of Canada advises borrowers to check the mortgage contract for the permitted lump-sum amount and dates. Paying more than the privilege allows can trigger a prepayment penalty. Some lenders also limit payment increases or define when an annual privilege resets.",
          "Ask the lender to confirm in writing how the payment will be applied and whether notice is required. After it posts, compare the new balance with the calculator and keep the lender statement with your plan."
        ]
      },
      {
        heading: "Compare the prepayment with other uses of cash",
        paragraphs: [
          "Run a conservative case with no future lump sums, a sustainable recurring increase, and the largest one-time amount you are seriously considering. This shows the range of interest and payoff outcomes without assuming that every future bonus or refund will be available.",
          "Keep enough liquidity for repairs, income disruption, and other priorities. A calculator can measure avoided mortgage interest, but it cannot value flexibility or decide whether higher-interest debt, employer matching, or another goal should come first."
        ]
      }
    ],
    faqs: [
      { question: "Can I calculate one extra mortgage payment?", answer: "Yes. Enter the amount as a one-time lump sum and select the payment number at which it will reduce principal." },
      { question: "Do extra payments always save interest?", answer: "A valid principal prepayment normally reduces later interest, but penalties or lost liquidity can change the broader financial outcome." },
      { question: "Is accelerated biweekly the same as regular biweekly?", answer: "No. Accelerated biweekly commonly pays half the monthly amount every two weeks, which creates the equivalent of one additional monthly payment each year." }
    ],
    sources: [
      { label: "FCAC: paying off your mortgage faster", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/pay-mortgage-faster.html" },
      { label: "FCAC: mortgage prepayment rights", href: "https://www.canada.ca/en/financial-consumer-agency/services/rights-responsibilities/rights-mortgages/rights-prepayments.html" }
    ],
    calculator: "extra-payments"
  },
  {
    slug: "closing-cost-calculator-canada",
    title: "Closing Cost Calculator Canada Guide",
    description:
      "Estimate cash to close in Canada, including Ontario, Toronto, and British Columbia transfer taxes, fees, adjustments, and a reserve.",
    keyword: "closing cost calculator Canada",
    category: "Planning",
    readingMinutes: 8,
    published: "2026-08-06",
    updated: "2026-08-06",
    intro: [
      "A Canadian closing-cost estimate starts with the down payment and adds the cash required to complete the purchase. Common items include land or property transfer tax, legal fees, inspection, appraisal, title insurance, moving costs, adjustments, and a reserve for immediate work.",
      "Location matters. Ontario has provincial land transfer tax, Toronto adds a municipal land transfer tax, and British Columbia uses property transfer tax. First-time buyer relief has eligibility conditions and should be treated as an estimate until confirmed by the legal professional handling the transfer."
    ],
    keyTakeaways: [
      "Keep the down payment separate from other closing costs when building the budget.",
      "Toronto buyers can face both provincial and municipal land transfer tax.",
      "B.C. property transfer tax uses progressive brackets and may have first-time buyer relief.",
      "A lawyer's final statement of adjustments determines the actual cash required."
    ],
    sections: [
      {
        heading: "Build the complete cash-to-close list",
        paragraphs: [
          "Enter the purchase price, down payment, location, available cash, and a reserve that will remain after closing. Replace default legal, inspection, appraisal, title, moving, and repair amounts with written quotes as they become available.",
          "Also ask about property-tax and utility adjustments, condo-related documents or fees, lender charges, mortgage insurance, sales tax on a new home, and unusual legal work. These items vary and are not all calculated by a general planner."
        ]
      },
      {
        heading: "Ontario and Toronto land transfer tax",
        paragraphs: [
          "Ontario applies progressive land transfer tax rates to the value of consideration. A Toronto property can also have municipal land transfer tax, with higher municipal brackets for high-value residential properties effective April 1, 2026. The calculator applies both systems when Toronto is selected.",
          "Eligible first-time purchasers may receive up to $4,000 of Ontario relief and up to $4,475 of Toronto municipal relief. Eligibility depends on ownership history, age, occupancy, status in Canada, spouse history, and the purchaser's share, so the checkbox is not an eligibility determination."
        ]
      },
      {
        heading: "British Columbia property transfer tax",
        paragraphs: [
          "B.C. general property transfer tax is based on fair market value using progressive rates. The calculator includes the additional general rate on residential value over $3 million but does not calculate the additional property transfer tax that can apply to some foreign entities or taxable trustees.",
          "For an eligible first-time buyer, the current program can exempt the tax on the first $500,000 for homes in the qualifying range, with a maximum $8,000 exemption and a phase-out between $835,000 and $860,000. Confirm the property, purchaser, residence, citizenship or permanent-residence, and prior-ownership requirements with the official program."
        ]
      },
      {
        heading: "Replace estimates before the closing date",
        paragraphs: [
          "As the transaction progresses, replace every initial estimate with the lender commitment, lawyer's estimate, inspection invoice, insurance quote, moving quote, and documented adjustments. Keep the emergency buffer as a separate amount instead of silently spending it on closing.",
          "Ask the lawyer when certified funds or a wire must arrive and what name and account controls apply. Verify payment instructions through a trusted channel because a correct cost estimate does not protect against payment-direction fraud."
        ]
      }
    ],
    faqs: [
      { question: "How much should I budget for closing costs in Canada?", answer: "The amount varies by price, location, property, lender, and transaction. FCAC notes that upfront closing costs commonly include inspection, legal fees, adjustments, and title insurance, so calculate item by item rather than relying only on a percentage." },
      { question: "Does a Toronto condo have two land transfer taxes?", answer: "A Toronto condo purchase can have Ontario land transfer tax and Toronto municipal land transfer tax, subject to the transaction and any available relief." },
      { question: "Does the calculator confirm first-time buyer eligibility?", answer: "No. It estimates the tax relief amount after you select it. A legal or tax professional must confirm eligibility and the final transfer filing." }
    ],
    sources: [
      { label: "FCAC: buying a home", href: "https://www.canada.ca/en/financial-consumer-agency/services/buying-home.html" },
      { label: "Ontario: calculating land transfer tax", href: "https://www.ontario.ca/document/land-transfer-tax/calculating-land-transfer-tax" },
      { label: "Ontario: first-time homebuyer land transfer tax refund", href: "https://www.ontario.ca/document/land-transfer-tax/land-transfer-tax-refunds-first-time-homebuyers" },
      { label: "Toronto: municipal land transfer tax rates", href: "https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/" },
      { label: "Toronto: first-time homebuyer rebate", href: "https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rebate-opportunities/" },
      { label: "British Columbia: property transfer tax", href: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax" },
      { label: "British Columbia: first-time buyer exemption amounts", href: "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/exemptions/first-time-home-buyers/current-amount" }
    ],
    calculator: "closing-costs"
  },
  {
    slug: "mortgage-refinance-break-even-calculator-canada",
    title: "Mortgage Refinance Break-Even Calculator Canada Guide",
    description:
      "Calculate mortgage refinance break-even in Canada using payment savings, penalties, fees, amortization, and a realistic holding period.",
    keyword: "mortgage refinance break even calculator Canada",
    category: "Borrowing",
    readingMinutes: 8,
    published: "2026-08-06",
    updated: "2026-08-06",
    intro: [
      "A mortgage refinance break-even calculation estimates how long a lower payment takes to recover the cost of switching. The basic result divides the prepayment penalty and other entered fees by monthly payment savings.",
      "That result is only one test. A longer replacement amortization can create a lower payment without lowering total cost, and a break-even month has little value if you expect to sell, refinance, or make a large prepayment before reaching it."
    ],
    keyTakeaways: [
      "Use the current balance and remaining amortization, not the original mortgage amount.",
      "Add the written penalty and every switching fee to the break-even cost.",
      "Compare current and new payments on consistent amortization assumptions.",
      "Check both the break-even month and the modeled interest difference."
    ],
    sections: [
      {
        heading: "Gather current and proposed mortgage inputs",
        paragraphs: [
          "For the current mortgage, enter the outstanding balance, contract rate, and remaining amortization. For the proposed mortgage, enter the quoted rate and amortization. If fees and penalties will be added to the new loan, include them because financed costs increase principal and accrue interest.",
          "Request a written payout quote from the current lender. A rough penalty estimate can be materially wrong when an interest rate differential depends on the lender's posted rates, discounts, comparison term, and contract method."
        ]
      },
      {
        heading: "Calculate break-even without hiding amortization",
        paragraphs: [
          "If the new payment is lower, divide total switching costs by monthly savings and round up to the next month. That produces a payment-based break-even point. If the new payment is equal or higher, there is no payment-savings break-even even if another strategic reason for refinancing exists.",
          "Keep the new amortization equal to the remaining amortization for a clean rate comparison. Then run a second case if extending amortization is under consideration. The gap between those cases reveals how much payment relief comes from slower principal repayment."
        ]
      },
      {
        heading: "Decide whether the break-even period is useful",
        paragraphs: [
          "Compare the break-even month with the time you expect to keep the replacement mortgage. Add the risk of another move, sale, renewal, or refinance. Also compare prepayment privileges, portability, penalty method, fixed or variable structure, and lender service rather than treating rate as the only term.",
          "FCAC recommends comparing the benefits of breaking a mortgage with the penalty, administration, appraisal, reinvestment, discharge, and new-mortgage setup costs. Ask whether waiting for renewal, porting, or a blend-and-extend option changes the outcome."
        ]
      },
      {
        heading: "Stress-test the refinance result",
        paragraphs: [
          "Run the proposed quote, a slightly higher final rate, and a case with larger fees. Rate holds can expire and a property appraisal or legal review can change the transaction, so a decision that only works at one exact input has little margin.",
          "Compare paying costs in cash with adding them to the mortgage. Then pin the clean same-amortization case before testing payment relief from an extension, so the cost of slower principal repayment remains visible."
        ]
      }
    ],
    faqs: [
      { question: "How do I calculate refinance break-even?", answer: "Divide the penalty and other switching costs by estimated monthly payment savings. Then compare that month with your realistic holding period." },
      { question: "What costs belong in a refinance calculator?", answer: "Include the prepayment penalty, discharge, legal, registration, appraisal, administration, setup, and any cash-back repayment that applies." },
      { question: "Can a lower refinance payment cost more overall?", answer: "Yes. Extending amortization or financing fees can lower the payment while increasing total interest and time in debt." }
    ],
    sources: [
      { label: "FCAC: breaking your mortgage contract", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/break-mortgage-contract.html" },
      { label: "FCAC: mortgage prepayment penalties", href: "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/reduce-prepayment-penalties.html" }
    ],
    calculator: "refinance"
  },
  {
    slug: "rent-vs-buy-calculator-canada",
    title: "Rent vs Buy Calculator Canada Guide",
    description:
      "Compare renting and buying in Canada using equity, unrecoverable costs, investment opportunity cost, selling costs, and time horizon.",
    keyword: "rent vs buy calculator Canada",
    category: "Planning",
    readingMinutes: 8,
    published: "2026-08-06",
    updated: "2026-08-06",
    intro: [
      "A useful rent-versus-buy comparison does not place rent beside the full mortgage payment and stop. Mortgage principal builds equity, while mortgage interest, property tax, insurance, maintenance, condo fees, and transaction costs are ownership costs that may not be recovered.",
      "Renting also has more than one cost, and it can leave cash available to invest. A fair model tracks both paths over the same time horizon and makes the uncertain assumptions visible."
    ],
    keyTakeaways: [
      "Compare net positions over the same number of years, not only the first monthly payment.",
      "Include maintenance, property tax, insurance, fees, and eventual selling costs for buying.",
      "Include rent growth and the opportunity to invest unused cash for renting.",
      "Stress-test home growth and investment returns instead of relying on one forecast."
    ],
    sections: [
      {
        heading: "Build the buying side",
        paragraphs: [
          "Enter the purchase price, down payment, rate, amortization, property tax, insurance, condo or association fees, maintenance, and expected selling cost. The model reduces the mortgage balance as principal is paid and applies the entered home-value growth rate.",
          "At each year, buy net position equals modeled home value minus remaining mortgage and selling costs. This is not spendable cash unless the home is sold or equity is borrowed, and the result excludes tax or transaction details not entered."
        ]
      },
      {
        heading: "Build the renting and investing side",
        paragraphs: [
          "Enter current rent and rent growth. Cash available today that is not used as a down payment begins on the renting side, and positive monthly differences between modeled ownership cost and rent are added to the investment balance.",
          "The investment return is uncertain and may have fees and taxes. Test lower returns, and do not assume every renter will consistently invest the difference. The purpose is to expose opportunity cost, not to promise a portfolio outcome."
        ]
      },
      {
        heading: "Interpret the break-even horizon",
        paragraphs: [
          "Review the difference at every year, not only the final result. Transaction costs often make a short ownership period less attractive, while a longer stay gives principal repayment and any home growth more time to accumulate. A small modeled lead can reverse after a minor assumption change.",
          "The financial result is not the entire decision. Stability, control of the space, repair responsibility, mobility, job uncertainty, family plans, and access to cash can matter more than a narrow projected difference."
        ]
      },
      {
        heading: "Use local data without confusing it with a forecast",
        paragraphs: [
          "For Toronto, Montréal, Edmonton, or another city, begin with the rent and purchase options actually available to you. National posted mortgage rates are useful benchmarks, but negotiated offers depend on the borrower, property, term, insurance, and lender rather than the city name alone.",
          "Update the scenario when a written mortgage quote, target property, rent renewal, condo fee, tax bill, or inspection changes. A current local input is more useful than a confident long-range growth assumption."
        ]
      }
    ],
    faqs: [
      { question: "Is renting always worse because it builds no equity?", answer: "No. Owners also pay interest, tax, insurance, maintenance, and transaction costs, while renters may keep and invest more liquid cash." },
      { question: "What time horizon should I use?", answer: "Use the period you realistically expect to remain in the property, then compare shorter and longer cases because transaction costs make timing important." },
      { question: "Does a rent-versus-buy calculator predict home prices?", answer: "No. Home growth, rent growth, maintenance, selling costs, and investment returns are editable assumptions, not forecasts." }
    ],
    sources: [
      { label: "FCAC: buying a home", href: "https://www.canada.ca/en/financial-consumer-agency/services/buying-home.html" },
      { label: "FCAC: renting an apartment or house", href: "https://www.canada.ca/en/financial-consumer-agency/services/renting-first-apartment.html" }
    ],
    calculator: "rent-vs-buy"
  }
];

export const ARTICLE_ROUTES = ARTICLES.map((article) => `/guides/${article.slug}/`);
