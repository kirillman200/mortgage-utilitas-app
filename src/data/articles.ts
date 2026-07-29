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
    updated: "2026-07-28",
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
          "Ask who will handle questions, how documents are secured, what happens when a file needs manual review, whether the loan may be transferred, and how closing works in your location. Confirm the lender supports the property and loan program you need.",
          "A fast interface is not a substitute for understanding the contract. Read rate-lock, appraisal, refund, servicing, and complaint information before paying a fee."
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
      }
    ],
    sources: [
      {
        label: "Rocket Mortgage official FAQ",
        href: "https://www.rocketmortgage.com/faqs"
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
  }
];

export const ARTICLE_ROUTES = ARTICLES.map((article) => `/guides/${article.slug}/`);
