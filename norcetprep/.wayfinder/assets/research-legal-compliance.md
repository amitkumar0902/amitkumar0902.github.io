# Research: Legal & compliance baseline for charging money (T05)

Researched: 2026-07-31. Jurisdiction: India. Subject: solo individual (no registered
business yet) selling a NORCET prep subscription from a static site, later possibly a
Play Store app.

## TL;DR

An unregistered Indian individual can lawfully charge for online exam prep **without GST
registration until ₹20 lakh aggregate annual turnover** (inter-state sales and selling
via a payment aggregator do not change this). What actually blocks go-live is (1) the
four policy pages every payment gateway requires (T&C, Privacy, Refund/Cancellation,
Contact), (2) a compliant refund/cancellation flow under the Consumer Protection
framework (no "subscription trap"), and (3) **removing or rewriting the verbatim
NORCET-9 Mains replay** — verbatim reproduction of official exam papers is copyright
infringement under settled Delhi HC case law, and AIIMS actively asserts copyright in
its papers. Memory-based, reworded recall questions with original explanations are the
accepted industry posture (Testbook, Adda247, PW, NPrep all do this). DPDP Act
substantive duties don't bite until May 2027, but a privacy policy is required now
anyway by gateways/Play Store. Add a prominent "not affiliated with AIIMS" disclaimer
and never use the AIIMS logo.

---

## Checklist: must-do BEFORE charging

1. **Rewrite/remove the verbatim NORCET-9 Mains replay.** Convert the 121 transcribed
   questions into reworded, memory-based-style items with original explanations; stop
   reproducing the official AIIMS PDF text/structure; label the set "based on candidate
   recall, not the official paper." (See PYQ verdict below.) Selling verbatim official
   paper content is the single largest legal exposure in the current repo.
2. **Publish the four policy pages** on the site (payment-gateway activation is gated on
   them — Razorpay's checklist as of 2026: Terms & Conditions, Privacy Policy,
   Cancellation & Refunds policy with concrete timelines, Contact Us with working
   email/phone/address; plus Pricing details visible; "Shipping policy" applies to goods
   only). Razorpay runs automated checks on these URLs before enabling live payments.
3. **Refund/cancellation policy that complies with consumer law.** Under the Consumer
   Protection (E-Commerce) Rules, 2020 (in force since 23 Jul 2020) an e-commerce
   entity — which includes someone selling their own digital service through their own
   site — must state refund/return/exchange terms *before* checkout, cannot refuse
   refunds for deficient or misrepresented services, and needs a grievance contact
   (acknowledge in 48 hours, resolve within one month). Practical minimum for a
   subscription: a short no-questions window (e.g. 7 days) or pro-rata policy, stated
   timelines for refund processing (5–7 business days is the norm gateways expect), and
   in-product cancellation.
4. **No dark patterns in the subscription flow.** CCPA Guidelines for Prevention and
   Regulation of Dark Patterns (notified 30 Nov 2023) ban 13 patterns including
   "subscription trap": cancellation must be as easy as signup (online, not
   email-a-human), no forced auto-debit capture for a free tier, no hidden cancel
   option. CCPA has run enforcement sweeps against e-commerce players in 2025–26.
5. **Prominent "not affiliated" disclaimer.** Footer + landing page + T&C: "norcetprep
   is an independent study resource and is not affiliated with, endorsed by, or
   sponsored by AIIMS or any government body. NORCET is an examination conducted by
   AIIMS, New Delhi." Never use the AIIMS logo/emblem (AIIMS issued an office
   memorandum in June 2026 barring unauthorised use of its name/logo/branding;
   government-institution emblems are also protected territory under the Emblems and
   Names (Prevention of Improper Use) Act, 1950). Using the word "NORCET"
   descriptively to identify the exam is standard nominative use (honest-practices use
   under s.30, Trade Marks Act 1999) — the whole industry does it — but do not put
   "AIIMS" in the product name, domain, or app title.
6. **Recurring billing, if offered, must follow the RBI e-mandate framework**: one-time
   Additional Factor Authentication at mandate setup, auto-debits without AFA only up to
   ₹15,000 per charge (limit raised to ₹15k in Jun 2022; ₹1 lakh only for
   mutual-fund/insurance/card-bill categories, Dec 2023; consolidated framework refresh
   effective 2026), 24-hour pre-debit notification, and online pause/cancel. In
   practice: use Razorpay/Cashfree Subscriptions or UPI Autopay and this is handled for
   you — or sidestep it entirely with manual-renewal plans (simplest for v1).
7. **Basic privacy notice + data hygiene now, even though DPDP isn't fully live**: state
   what you collect (email, payment metadata, quiz activity), why, and a contact for
   deletion requests; don't store card data yourself (the gateway tokenises); delete
   accounts on request. This satisfies today's operative law (IT Act 2000 + SPDI Rules
   2011) and is required content for the gateway/Play Store privacy policy anyway.

## Checklist: can wait (with trigger points)

1. **GST registration — not needed until ₹20 lakh aggregate turnover** (₹10 lakh if
   resident in a special-category state). Details and nuances in the GST section below.
   Trigger: approaching ₹20L in a financial year, or wanting input-tax credit /
   B2B-invoice credibility → register voluntarily (then you must charge 18% from day
   one of registration).
2. **Business entity.** An individual can legally sell online and sign up with Razorpay
   as an unregistered/sole-proprietor merchant. A sole proprietorship (current-account +
   maybe Udyam MSME registration) is a hygiene upgrade; an LLP/Pvt Ltd can wait until
   revenue justifies it. (Feeds T10.)
3. **Full DPDP Act 2023 compliance.** Rules were notified 14 Nov 2025; enforcement is
   phased: Data Protection Board stood up Nov 2025; penalty framework and consent
   -manager registration from Nov 2026; the substantive consent/notice/security/data
   -principal-rights obligations commence **13–14 May 2027**. So as of Jul 2026 nothing
   substantive is enforceable yet — but penalties are severe later (up to ₹250 crore for
   security-safeguard failures), and the Act may give startups partial exemptions
   (s.17(3)). Trigger: revisit ~early 2027 — add DPDP-style consent notice, breach
   -notification readiness, and a data-retention/deletion story.
4. **Play Store–specific work** (only when an Android app ships): privacy policy link in
   Play Console *and* in-app; Data safety form; **in-app account deletion + a web
   deletion URL** (enforced since May–Jun 2024 for all apps with account creation); paid
   digital content must use Google Play Billing (15% service fee up to $1M/yr revenue).
   India tax nuance: for an India-based developer selling to Indian users, **Google does
   not become your GST-payer — you determine your own GST obligation** (same ₹20L
   threshold logic); Google as marketplace handles TCS/withholding where applicable.
   Google Play is an "e-commerce operator," but Notification 65/2017-Central Tax (15 Nov
   2017, amended 6/2019) exempts service suppliers below ₹20L from the compulsory
   -registration rule even when selling through an ECO.
5. **Trademark registration for your own brand** ("norcetprep" or successor name) — nice
   to have once revenue exists; not a launch blocker.
6. **Professional terms review.** The self-drafted policy pages are fine to launch;
   trigger a lawyer review at meaningful revenue or the first legal notice.

---

## GST detail (all claims as of Jul 2026)

- **Threshold**: ₹20 lakh aggregate turnover for suppliers of services (₹10 lakh in
  special-category states). Unchanged since 2017.
- **Inter-state sales don't force registration.** Section 24 CGST/IGST normally mandates
  registration for inter-state supplies regardless of turnover, but **Notification
  10/2017-Integrated Tax (13 Oct 2017)**, as amended by 3/2019, exempts inter-state
  suppliers *of services* below ₹20L from registration. Selling to students all over
  India from a static site is fine while unregistered.
- **Selling via a payment gateway changes nothing.** A payment aggregator
  (Razorpay/PayU/Cashfree) only processes payments; it is not an e-commerce operator
  collecting TCS u/s 52 for your supply, and direct sales of your own service through
  your own website are outside s.52 entirely (CBIC e-commerce FAQ). No TCS, no forced
  registration.
- **Selling via a true marketplace/ECO** (Google Play, an edtech marketplace): s.24(ix)
  compulsory registration is neutralised for *service* suppliers below ₹20L by
  Notification 65/2017-Central Tax. ECO TCS rate is 0.5% (reduced from 1% w.e.f. 10 Jul
  2024) and applies to registered suppliers.
- **OIDAR**: self-paced online courses/test-series qualify as OIDAR, and the Finance Act
  2023 (effective 1 Oct 2023) removed the "minimal human intervention" qualifier, so
  even courses with some human element are covered. Consequences: the **no-threshold,
  register-from-rupee-one rule applies only to *foreign* OIDAR providers** serving
  Indian consumers; a *domestic* individual provider gets the normal ₹20L threshold.
  Once registered, rate is **18%** (commercial coaching/edtech is not an exempt
  "educational institution" service).
- Income tax still applies from rupee one (normal slab; presumptive taxation u/s 44ADA/
  44AD available) — out of scope here but flag for T10.

## Consumer protection & refunds detail

- Consumer Protection Act 2019 + Consumer Protection (E-Commerce) Rules 2020 (effective
  23 Jul 2020) apply to anyone selling digital services online, including single-seller
  own-inventory sites. Requirements: display total price and all charges, refund/
  cancellation/return terms before purchase, seller identity and contact details,
  grievance redressal (48-hour acknowledgement, one-month resolution), no unfair trade
  practices or unilateral "no refunds under any circumstances" positions for deficient
  service.
- Dark Patterns Guidelines 2023 (CCPA, 30 Nov 2023): "subscription trap" is explicitly
  banned — cancellation path must mirror the signup path.
- Digital subscriptions are "services"; a dissatisfied subscriber can file in consumer
  court cheaply, so a clean refund window is cheap insurance.

## Policy pages required — who demands what

| Page | Razorpay (activation-gated, auto-checked) | Google Play |
|---|---|---|
| Terms & Conditions | Yes | Implicitly (store listing + consumer law) |
| Privacy Policy | Yes | Yes — link in Console + in-app; Data safety form must match |
| Refund/Cancellation policy with timelines | Yes | Play refund policy governs IAP; your policy still needed for consumer law |
| Contact Us (email/phone/address) | Yes | Support email public on listing |
| Pricing clearly shown | Yes | Managed via Play Billing |
| Account deletion path | — | Yes — in-app + web URL (enforced 2024) |

## PYQ copyright verdict

**Are official exam papers protected works? Yes — settled law.**
- *Rupendra Kashyap v. Jiwan Publishing House* (Delhi HC, 1 Jul 1996): CBSE exam
  question papers are original "literary works" under the Copyright Act 1957;
  publishing them without licence infringes.
- *Ravinder Singh & Sons v. Evergreen Publications* (Delhi HC, 10 Jan 2018, FAO
  235/2017): reproducing ICSE question papers **verbatim** in commercial guidebooks is
  infringement; "educational purpose" is not a defence; derivative works must add
  transformative value — merely appending answers to copied questions does not.
- **AIIMS specifically asserts copyright in its papers**: in the *Sakshi Mathur* RTI
  matter, AIIMS argued its entrance papers are original literary works whose copyright
  vests in AIIMS, and the Delhi HC set aside a CIC order directing disclosure of
  1991–2010 papers; AIIMS exam terms also prohibit candidates from copying or
  circulating original questions. AIIMS's June 2026 memorandum on unauthorised use of
  its name/branding shows an institution in active enforcement mode.
- Fair-dealing exceptions (s.52, Copyright Act) cover private research and classroom
  instruction — not selling reproduced papers by subscription. Infringement carries
  civil remedies (s.55: injunction + damages) and criminal exposure (s.63: 6 months–3
  years + fine for knowing commercial infringement).
- That AIIMS itself published the NORCET-9 PDF (e.g. during answer-key challenge) does
  **not** licence republication: publication ≠ waiver, exactly the fact pattern in the
  AIIMS RTI case (obtaining the paper lawfully, then commercially exploiting it, was
  the objection).

**The verbatim NORCET-9 Mains replay (121 questions transcribed from the official PDF)
must change before charging.** Options, best first:
1. **Rewrite into recall-style items** (recommended, do before paywall): reword every
   stem and option in your own words, write original explanations, drop the claim of
   being a transcript of the official paper, keep only the unprotectable layer (the
   facts/concepts tested and the topic mix). Label: "memory-based, reconstructed from
   candidate recall; not the official AIIMS paper."
2. Remove the paper entirely and keep only topic-tagged original questions.
3. (Theoretical) obtain a licence from AIIMS — no known precedent, not practical.
   Keeping the verbatim replay behind a paywall is the one clearly indefensible option:
   commercial use eliminates any fair-dealing argument and increases damages.

**Are reworded memory-based recalls the accepted industry posture? Yes.** Every major
player — Testbook, Adda247, Physics Wallah, NPrep, PrepLadder, CollegeDekho — openly
publishes "memory-based" NORCET/NEET-PG papers reconstructed from candidate recall,
because official papers aren't released for republication. This is a widespread,
tolerated practice (copyright arguably doesn't attach to a candidate's paraphrased
recollection of ideas, and enforcement against it is unheard of), whereas suits that do
happen target verbatim reproduction. Residual risk isn't zero — near-verbatim recall of
a distinctive question could still copy protected expression — so keep recall items
genuinely reworded and add original explanatory value (which also differentiates the
product).

## Disclaimer norms

- Standard formula used across the industry, to place in footer + about + T&C + Play
  listing description: "An independent preparation resource. Not affiliated with,
  endorsed by, or approved by AIIMS, New Delhi or any government body. 'NORCET' and
  'AIIMS' are used solely to identify the examination."
- Never use the AIIMS logo/emblem or an official-looking layout (June 2026 AIIMS
  memorandum; Emblems and Names Act 1950 risk for government-institution insignia;
  passing-off risk under trade-mark law).
- Don't claim "official," "authorised," or imply the mock replicates the real paper
  verbatim (that claim is both a copyright admission and a misleading-advertisement
  risk under CPA 2019).

## Sources

- OIDAR under GST, thresholds, Finance Act 2023 change: https://www.india-briefing.com/news/oidar-compliance-india-gst-registration-ntor-gstr5a-digital-tax-43951.html/ ; https://cleartax.in/s/oidar-gst-registration ; https://taxadda.com/decoding-oidar-services-under-gst/ ; https://www.indiafilings.com/gst/cross-border-digital-services-oidar
- GST on online education, 18% rate, exemption only for formal institutions: https://busy.in/gst-rates/online-education/ ; https://www.mastersindia.co/blog/gst-online-courses/
- Inter-state services below ₹20L exempt from registration (Notif. 10/2017-IT, amended 3/2019): https://www.taxwink.com/blog/gst-on-inter-state-supply-of-services ; notification PDF: https://d23z1tp9il9etb.cloudfront.net/download/gstlaw/NOTIFICATION%20NO.10_2017-INTEGRATED%20TAX1731046621.pdf
- Services via e-commerce operator below ₹20L exempt (Notif. 65/2017-CT): https://studycafe.in/cgst-notification-no-652017-exempts-suppliers-e-commerce-platform-registration-15948.html ; https://carajput.com/blog/taxability-under-gst-for-e-commerce-sale-of-services/ ; https://tax2win.in/guide/compulsory-registration-gst-act-section-24
- Direct sales via own website outside TCS s.52; ECO/TCS FAQ (CBIC/GST Council): https://gstcouncil.gov.in/sites/default/files/2024-02/faq-e-commerc.pdf ; https://gsthero.com/blog/tcs-on-gst-for-e-commerce-operators-applicability-and-rates/
- Consumer Protection (E-Commerce) Rules 2020 obligations: https://www.teamleaseregtech.com/blogs/134/e-commerce-compliance-in-india-understanding-the-consumer-protection-e-commerce-rules-2020/ ; https://www.legalserviceindia.com/legal/article-6999-refund-and-cancellation-policy-under-e-commerce-platform.html
- Dark Patterns Guidelines 2023 incl. subscription trap; CCPA enforcement: https://trilegal.com/wp-content/uploads/2023/12/Guidelines-for-Prevention-and-Regulation-of-Dark-Patterns-2023.pdf ; https://www.azbpartners.com/bank/regulatory-crackdown-on-dark-patterns-ccpas-enforcement-actions-and-emerging-compliance-landscape-in-indian-e-commerce/
- DPDP Rules notified 14 Nov 2025, phased enforcement to May 2027: https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf ; https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/ ; https://en.wikipedia.org/wiki/Digital_Personal_Data_Protection_Rules,_2025 ; https://consentos.in/learn/dpdp-compliance-timeline/
- Razorpay mandatory website pages / activation checks: https://razorpay.com/docs/payments/dashboard/account-settings/business-website-details/ ; https://razorpay.com/blog/payment-gateway-compliance/
- RBI e-mandate recurring-payment rules (AFA, ₹15k, pre-debit notice; 2026 framework): https://www.business-standard.com/article/finance/new-e-mandate-guidelines-rbi-enhances-limit-for-e-mandates-on-credit-debit-cards-to-rs-15-000-122060800417_1.html ; https://www.outlookbusiness.com/ampstories/news/rbi-e-mandate-framework-2026-new-rules-for-auto-pay-upi-cards-wallets ; https://www.businesstoday.in/amp/personal-finance/news/story/rbi-auto-debit-rules-explained-what-new-changes-mean-for-your-upi-and-card-payments-528507-2026-05-02
- Google Play: privacy policy & Data safety: https://support.google.com/googleplay/android-developer/answer/10144311 ; account deletion requirement: https://support.google.com/googleplay/android-developer/answer/13327111 ; India GST responsibility of India-based developers: https://support.google.com/paymentscenter/answer/7421525
- Question-paper copyright: Rupendra Kashyap v. Jiwan Publishing (Del HC 1996): https://indiankanoon.org/doc/134584/ ; Ravinder Singh & Sons v. Evergreen (Del HC 2018) analysis: https://www.legalserviceindia.com/legal/article-19599-copyright-infringement-in-relation-to-literary-work-in-question-paper.html ; AIIMS RTI/copyright (papers as literary works, HC setting aside CIC disclosure order): https://www.deccanherald.com/archives/aiims-not-liable-to-reveal-question-papers-under-rti-high-court-288408.html ; https://spicyip.com/2012/04/cic-on-rti-act-and-copyright.html
- Memory-based recall as industry norm for NORCET: https://testbook.com/news/aiims-norcet-10-question-paper-2026-nursing-officer-memory-based-questions/ ; https://www.adda247.com/exams/nursing/aiims-nursing-officer-previous-year-question-papers/ ; https://nprep.in/blogs/free-norcet-10-pyqs-and-answer-keys-pdf-download---practice-smarter-with-nprep ; https://www.pw.live/nursing/exams/aiims-norcet-previous-year-papers
- AIIMS June 2026 name/logo guidelines: https://theprint.in/feature/aiims-cracks-down-on-reels-blogs-with-their-name-logo-warns-of-legal-consequences/2969651/ ; Emblems and Names Act 1950: https://en.wikipedia.org/wiki/Emblems_and_Names_(Prevention_of_Improper_Use)_Act,_1950
