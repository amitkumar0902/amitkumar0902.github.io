# Research: India payments & recurring billing rails (T03)

Researched 2026-07-31. Prices/fees and licence statuses are volatile; each is dated inline.
Context: solo developer, not a registered business, selling NORCET prep access to Indian
aspirants at a few hundred rupees per plan. Site is a static GitHub Pages site.

## TL;DR

- **Launch with validity plans (one-time payment for N-month access), not auto-recurring billing.** This is the Indian test-prep norm, needs no mandate infrastructure, works with hosted payment links/pages (zero backend), and sidesteps RBI e-mandate friction entirely. Add UPI Autopay auto-renewal later only if a low-ticket monthly tier proves out.
- **Apply to Razorpay and Cashfree in parallel** (activation, not fees, is the real bottleneck for individual merchants; both accept individuals/unregistered businesses). Keep **Easebuzz** as backup. Skip PayU, PhonePe PG, Instamojo, Paytm, Stripe for this use case (reasons below).
- At a ₹300 ticket, the fee delta between 1.5% and 2% is ~₹1.50/sale — irrelevant. Optimize for onboarding success and payment success rate instead.
- RBI's consolidated **e-mandate framework (issued 21 Apr 2026)** keeps the default AFA-free recurring debit at **₹15,000/transaction** — no constraint at this price point. The real recurring-billing frictions are mandate creation UX, mandatory 24-hour pre-debit alerts (an every-cycle cancel prompt), and mandate debit failures.

## Regulatory backdrop (as of July 2026)

- **RBI "Digital Payments – E-mandate Framework, 2026"** — issued 21 Apr 2026, effective immediately; consolidates and repeals 8 prior circulars (2019–2024). Applies to recurring transactions on cards / PPIs / UPI, domestic and cross-border. Key points:
  - One-time mandate registration requires AFA (for UPI Autopay, the UPI PIN entered in the customer's UPI app counts).
  - Subsequent auto-debits **up to ₹15,000 per transaction need no AFA**. Higher limit of ₹1,00,000 only for insurance premiums, mutual funds, and credit-card bill payments — prep subscriptions get the default ₹15,000, which is ample headroom for a few-hundred-rupee product.
  - **Pre-debit notification at least 24 hours before every charge** (amount, date, merchant, mandate ref) is mandatory; the customer can opt out of that specific debit or cancel the mandate at any time, free of charge. This is a structural churn lever built into Indian recurring billing.
  - Mandate registration must be free to the customer; modification requires AFA re-validation.
- **Card-on-file tokenization** (RBI rule since Oct 2022): gateways tokenize subscription cards automatically (e.g., Razorpay states card details are "securely tokenised as per RBI guidelines"). No merchant-side work, but card mandates add OTP-registration friction vs UPI Autopay's PIN flow.
- **Payment-aggregator licensing** shook out through 2023–2025: Razorpay and Cashfree hold final PA authorisations (onboarding pauses of Dec 2022 were resolved in late 2023); PayU got final online PA authorisation 13 May 2025 (integrated online+offline+cross-border Nov 2025); Paytm's PPSL got online PA authorisation 26 Nov 2025; Instamojo's application was returned 27 Sep 2023 and it now routes payments through partner PAs.

## Provider comparison (facts as of 2026-07-31 unless dated otherwise)

| | Razorpay | Cashfree | PayU | Instamojo | PhonePe PG | Easebuzz |
|---|---|---|---|---|---|---|
| **Individual / unregistered onboarding** | Yes — explicit "Individual/Unregistered" business type (personal PAN + Aadhaar + bank proof) | Yes — account is classed "Unregistered" when registration docs are absent; reputation for being freelancer-friendly | Effectively no — doc list wants business registration proof (GST or Udyam); enterprise-leaning | Yes (easy signup) but see status row | No — KYC asks for GST certificate / business registration | Yes — digital KYC, claims go-live in ~24h; markets to freelancers/solo founders |
| **Subscriptions / UPI Autopay** | Yes: UPI Autopay, card mandates (tokenized), eNACH; feature activation on request | Yes: UPI Autopay, eNACH, cards, physical NACH; mode caps documented (UPI ≤₹15k AFA-free) | Yes (cards, UPI Autopay, eNACH via "Zion" platform) | No real subscription product for standard users | UPI Autopay supported | Yes: UPI Autopay (≤₹15k) + eNACH |
| **Headline fees** (Jul 2026) | 2% platform fee standard (incl. UPI); Subscriptions: cards +0.9% on top; UPI Autopay/eNACH pricing "on request"; ₹0 setup/AMC | 1.95% standard; eNACH ₹5/mandate + ₹5/debit; ₹0 setup/AMC | ~2% standard headline | **5% + ₹3 on digital goods** + 18% GST — punitive for this product | 0% UPI (promotional), ₹0 setup/AMC | ~1.5% average; ₹0 setup/AMC |
| **Settlement** | T+2 working days default (docs); T+1/instant available (paid/marketing) | T+1 default | ~T+2 | T+3 | T+1 typical | T+1–T+2 |
| **Licence / status** (mid-2026) | Final PA licence; onboarding open | Final PA licence; onboarding open | Final online PA 13 May 2025; new-merchant embargo (15 months) only recently behind it | **No own PA licence** (application returned Sep 2023); operates via partner PAs; pivoted to store-builder SaaS | Licensed (PhonePe group); PG opened to all merchants 2023 | RBI-authorised PA (verify current authorisation during onboarding) |
| **Fit for this project** | Primary candidate | Co-primary candidate | Skip | Skip | Skip (needs GST) | Backup |

Also considered:
- **Paytm (PPSL)**: online PA authorisation only since 26 Nov 2025 (Nov 2022 embargo lifted then); no small-merchant onboarding track record yet under the new licence — skip for now, reassess in a year.
- **Stripe India**: invite-only since May 2024 and still invite-only as of 2026, favoring registered export businesses — not available.
- **Merchant-of-record platforms** (Paddle, Lemon Squeezy, Dodo): built for selling abroad; poor/no UPI + INR domestic support and 4–5%+ fees — wrong tool for an India-domestic product.

## Onboarding reliability (the known pain point)

- Documented pattern (2024–2025 reviews and gateway blogs): freelancer/individual applications get rejected **without a stated reason**; manual review; restricted-category screening; slow, unhelpful communication in some cases.
- Razorpay's own KYC guide (2026) says **name mismatch between PAN and bank account causes ~40% of Indian gateway onboarding delays**; other common rejection causes: blurry scans, inactive/incomplete websites, missing policy pages, vague service descriptions. Typical approval 2–7 working days; usually 3–5 resubmission attempts allowed.
- Comparative reputation (2025–2026 roundups): Razorpay/Cashfree KYC completes in ~2–5 business days with clean docs; Cashfree and Easebuzz are repeatedly described as friendlier to individuals; PayU and PhonePe lean on registration proof.
- Mitigation: apply to two gateways in parallel; make the site look like a real business before applying (policy pages, pricing, contact details, product description); exact name match across PAN/Aadhaar/bank; describe the category as Education / e-learning / test preparation (a normal, non-restricted category).
- Note: education/coaching is a standard accepted category — this product has no category risk (unlike gaming, crypto, etc.).

## Validity plans vs auto-recurring billing

**Market norm:** Indian test-prep sells fixed-validity packs (3/6/12/24-month access, one-time payment) — PrepLadder, Marrow, Adda247-style. Testbook Pass Pro is the notable auto-renewal counter-example (UPI Autopay mandates), and it generates a visible tail of cancellation complaints and "how to stop autopay" guides; its UPI-mandate cancellations must be done by the user in their UPI app, card ones by emailing support.

**Auto-recurring (UPI Autopay) mechanics:**
- Pros: involuntary-renewal revenue; smaller psychological ticket (₹99–199/mo); no re-purchase decision.
- Cons: mandate-creation drop-off at checkout (customer must approve in their UPI app); RBI-mandated 24h pre-debit alert before every charge is a recurring cancel prompt; debit failures (insufficient balance, dormant mandates) create involuntary churn and retry engineering; needs webhook/state infrastructure (mandate created/paused/cancelled/failed); UPI Autopay pricing is "on request" at Razorpay (expect per-mandate + per-debit charges, cf. Cashfree eNACH ₹5+₹5); cancellation-support burden.
- Exam-prep-specific: aspirants have a **natural end date** (the exam). Lifetime-value from auto-renewal is capped; a mandate that outlives the exam produces refund demands and ill will.

**Validity plans mechanics:**
- Pros: single 2FA payment, zero mandate infra — works with a hosted payment page/link on day one (no backend); upfront cash for the full period; matches how this audience already buys; longer packs (6–12 months, priced at a discount to monthly-equivalent) capture most of the LTV a subscription would; zero recurring-billing compliance surface.
- Cons: churn happens as non-renewal at expiry (need expiry reminders + renew-discount flows); revenue is lumpier; ARPU depends on pack-length mix.
- Fit: for a few-hundred-rupee product sold to exam-dated customers by a solo dev, validity plans win on every operational axis. Entitlement logic (T07) reduces to `paid_until` timestamps — no mandate state machine.

**Recommendation:** launch with 3 validity SKUs (e.g., 3-month / 6-month / till-exam). Revisit UPI Autopay for a ₹99-tier monthly only after there's evidence of demand and a backend that can process mandate webhooks.

## Recommended shortlist

1. **Razorpay** (primary) — accepts Individual/Unregistered type with personal PAN + Aadhaar + bank proof; best docs and no-code surface (Payment Pages/Links let a static GitHub Pages site sell validity packs with zero backend); full subscription stack (UPI Autopay/cards/eNACH) available later; 2% + GST, ₹0 fixed costs; T+2 settlement. Risk: activation unpredictability — mitigate per checklist and apply to #2 simultaneously.
2. **Cashfree** (co-primary — apply in parallel) — explicit "Unregistered" business handling and a friendlier freelancer reputation; slightly cheaper (1.95%); T+1 settlement; full subscription/mandate stack with published mode limits; cheap eNACH (₹5/mandate + ₹5/debit) if bank-mandate billing is ever wanted.
3. **Easebuzz** (backup) — ~1.5%, fast fully-digital KYC (~24h go-live claim), UPI Autopay + eNACH, strong edtech/coaching presence. Use if both of the above stall.

Rejected: **PayU** (wants business registration; enterprise bias; freshly out of a 15-month onboarding embargo), **PhonePe PG** (0% UPI is attractive but KYC requires GST/registration), **Instamojo** (5% + ₹3 digital-goods fee, no own PA licence since Sep 2023, no real subscriptions), **Paytm** (relicensed only Nov 2025), **Stripe** (invite-only in India).

## KYC / prerequisite checklist (individual, unregistered)

Documents & data:
- [ ] Personal **PAN card** (the merchant-of-record identity).
- [ ] **Aadhaar** with linked mobile (for eKYC/OTP verification); or passport/voter ID as address proof. PAN + address proof must belong to the same person.
- [ ] **Bank account** in the exact PAN name + proof (cancelled cheque or statement). A savings account works for the individual/unregistered type; a current account becomes relevant only if upgrading to sole-proprietor onboarding. **Exact name match PAN ↔ bank is the #1 delay-avoider.**
- [ ] GST: **not required** below ₹20 lakh services turnover — expect to declare non-registration in the gateway form.
- [ ] Clear product/service description: "Online test-preparation content and mock tests for nursing exam (NORCET)"; category Education/EdTech.

Website prerequisites (do before applying — reviewers check the live site):
- [ ] Pages: **Terms of Service, Privacy Policy, Refund/Cancellation Policy, Contact Us** (email + phone + address), About, and **visible pricing** of the plans.
- [ ] Product must look real and complete (no "under construction"); HTTPS (github.io provides this).
- [ ] Recommended: a **custom domain** instead of the bare `amitkumar0902.github.io` — a personal-username subdomain is the kind of thing manual reviewers flag as "inactive/hobby website".
- [ ] State the delivery mechanism (instant online access after payment) and refund window in the refund policy — reviewers look for it on digital-goods merchants.

Process expectations:
- [ ] Apply to Razorpay **and** Cashfree in parallel; approval typically 2–7 working days; 3–5 resubmission attempts before a fresh application is needed.
- [ ] After activation: request Subscriptions/UPI-Autopay feature enablement only when actually needed (it's a separate activation and, at Razorpay, separately priced "on request").

Optional upgrades that improve limits/approval odds later:
- [ ] Free **Udyam (MSME) registration** as a proprietor → unlocks "sole proprietorship" onboarding at every gateway incl. PayU/PhonePe.
- [ ] Current account in trade name; GST registration when turnover approaches thresholds (feeds T10).

## Open questions (for T07 / T10)

- Razorpay/Cashfree per-account acceptance limits for unregistered merchants are set case-by-case at activation — capture the granted limits when the account is approved.
- UPI Autopay per-mandate/per-debit pricing at Razorpay is quote-only — get a written quote if/when the monthly tier is built.
- Verify Easebuzz's current PA authorisation status if it's actually used.

## Sources

- RBI e-mandate framework 2026 (issued 21 Apr 2026): https://taxguru.in/rbi/rbi-issues-consolidated-directions-digital-payments-e-mandate-framework-2026.html ; https://www.businesstoday.in/personal-finance/news/story/rbi-caps-recurring-payments-at-rs15000-without-otp-under-new-e-mandate-framework-526759-2026-04-21 ; https://www.rocketpay.co.in/blog/rbi-e-mandate-recurring-payments-15000
- Razorpay pricing (fetched 2026-07-31): https://razorpay.com/pricing/ ; Subscriptions methods: https://razorpay.com/docs/payments/subscriptions/ ; business-type KYC: https://razorpay.com/docs/payments/business-types-kyc-documents/ ; settlement FAQs (T+2): https://razorpay.com/docs/payments/settlements/faqs/ ; freelancer/unregistered positioning: https://razorpay.com/freelancer-individual-business/
- Razorpay KYC/onboarding guides (2026; doc checklist, name-mismatch stat, timelines): https://razorpay.com/blog/documents-required-for-payment-gateway ; https://razorpay.com/blog/payment-gateway-kyc-onboarding-india/
- Recurring-billing cost comparison incl. UPI Autopay economics (2026): https://razorpay.com/blog/cheapest-payment-gateway-for-recurring-billing-e-nach-upi-autopay-and-subscription/
- Cashfree: subscription payment modes & limits: https://www.cashfree.com/docs/payments/subscription/payment-modes ; eNACH pricing (₹5/₹5): https://www.cashfree.com/enach/ ; charges page: https://www.cashfree.com/payment-gateway-charges/ ; account activation / unregistered type: https://www.cashfree.com/docs/help/account/account-activation
- PayU final PA licence (13 May 2025): https://www.business-standard.com/finance/news/payu-secures-final-rbi-approval-as-online-payment-aggregator-125051301470_1.html ; integrated licence (Nov 2025): https://www.medianama.com/2025/11/223-payu-rbi-approval-cross-border-payment-aggregator/ ; recurring docs: https://docs.payu.in/docs/introduction-recurring-payments-integration
- Instamojo PA application returned / pivot (Sep–Nov 2023): https://inc42.com/buzz/mastercard-backed-instamojo-shuts-core-payments-biz-after-rbi-rejects-its-application/ ; https://entrackr.com/2023/11/instamojo-suspends-payment-aggregator-biz-on-rbi-direction/ ; https://www.medianama.com/2024/02/223-why-instamojo-steering-away-from-payment-aggregation/ ; digital-goods fee 5%+₹3: https://wext.in/business-solutions/instamojo-payment-gateway-review-2025/
- PhonePe PG (zero-fee UPI, onboarding docs incl. GST): https://business.phonepe.com/payment-gateway ; https://inc42.com/buzz/phonepe-launches-own-payment-gateway-offers-free-onboarding-to-new-merchants/ ; https://paykassma.com/blog/payments/phonepe-payment-gateway-guide
- Easebuzz (pricing ~1.5%, digital KYC, autopay): https://easebuzz.in/pricing/ ; https://easebuzz.in/explainers/sme/payment-gateway-for-small-business/ ; https://easebuzz.in/upi-payment-gateway/
- Paytm PPSL PA licence (26 Nov 2025): https://www.medianama.com/2025/11/223-paytm-rbi-approval-online-payment-aggregator/ ; https://yourstory.com/2025/11/rbi-paytm-ppsl-final-approval-payment-aggregator
- Stripe India invite-only (since May 2024, still in 2026): https://support.stripe.com/questions/stripe-accounts-are-invite-only-in-india ; https://www.karboncard.com/blog/stripe-availability-in-india
- Onboarding pain / rejections for individuals: https://rarebetter.com/razorpay-rejected-payment-gateway-request/ ; comparative KYC-speed claims (2026 roundups): https://shop2host.com/best-payment-gateway-india ; https://dhanaay.com/blog/best-payment-gateway-d2c-sellers-india ; https://sarangtechie.medium.com/gatewacheapest-payment-gateway-in-india-in-2026-razorpay-vs-payu-vs-cashfree-vs-instamojo-vs-e5bf033fc1e1
- Testbook Pass autopay/cancellation mechanics (recurring counter-example): https://cancelmates.com/cancel/testbook-pass-subscription-india ; https://testbook.com/pass
- 2022 onboarding-pause history (resolved; context only): https://www.business-standard.com/article/companies/rbi-asks-razorpay-cashfree-to-temporarily-stop-onboarding-of-new-customers-122121600780_1.html
