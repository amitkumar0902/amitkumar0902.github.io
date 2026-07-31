---
id: T10
title: Business & payment prerequisites
labels: [wayfinder:task]
status: open
assignee: amit
blocked-by: [T03, T05, T08]
---

## Question

Complete the real-world prerequisites the chosen rails demand — nothing to
decide here, but later decisions and the build are blocked until it's done.
The concrete checklist comes from
[India payments & recurring billing rails](t03-payments-rails.md),
[Legal & compliance baseline](t05-legal-compliance.md), and the name chosen in
[Brand, domain & trust](t08-brand-domain-trust.md). Expected items:

- Payment-gateway KYC (bank account, PAN, entity form) and account activation.
- GST decision per the legal findings.
- T&C / privacy / refund pages drafted and published.
- Custom domain purchased; DNS under control.
- Play Console developer account registered and verified.

Resolved when each item is done; the resolution records the resulting facts
(where credentials live — not the credentials themselves, domain, account
states) that later tickets and the build depend on.

## Progress (2026-07-31)

Everything draftable is drafted; what remains is physically the owner's
(payments, KYC identity, account creation). The ticket stays open until the
facts below are reported back.

**Prepared this session:**
- Availability re-verified: **nursedrill.com still free** (RDAP, this
  evening); .in unverifiable from the sandbox — check in the registrar UI at
  purchase.
- **Four policy pages drafted, ready to publish** (gateway reviewers check
  for exactly these): [terms](../assets/legal/terms.html) ·
  [privacy](../assets/legal/privacy.html) ·
  [refund](../assets/legal/refund.html) ·
  [contact](../assets/legal/contact.html). Each carries visible `[TODO: …]`
  markers only the owner can fill: legal-name confirmation, contact number,
  contact address, governing-law city, publish date, final gateway name.
  They deploy at nursedrill.com/legal/ with Phase 1. (Competent boilerplate,
  not legal advice — an hour of lawyer review is cheap insurance, optional.)

**Owner checklist (ordered by external clocks):**

1. **Domains — today, ~15 min, ~₹2,000/yr.** Buy nursedrill.com + nursedrill.in
   in one registrar account (Cloudflare Registrar is at-cost; Namecheap fine).
   Auto-renew ON, WHOIS privacy ON. Set up free forwarding
   support@nursedrill.com → your Gmail (Cloudflare Email Routing or registrar
   forwarding); add Gmail "send-as" later.
2. **Play Console — today, $25.** play.google.com/console → personal account →
   pay → start government-ID verification immediately (takes days; costs
   nothing to start now). The 12-tester × 14-day soak comes later with the
   app track (Feb-wave scope).
3. **Policy TODOs — ~20 min.** Fill the markers in the four drafts.
4. **Gateway KYC — as soon as the domain serves the site + policy pages
   (Phase 1, target ≤7 Aug).** Apply to **Razorpay and Cashfree the same
   day**. Exact answers:
   - Business type: *Individual / Unregistered*.
   - Category: *Education → EdTech / test preparation*.
   - Description: "Online test-preparation platform for nursing recruitment
     exams (NORCET and staff-nurse exams): question banks, mock tests, and
     study notes sold as fixed-validity plans. Instant online access after
     payment; 7-day refund policy."
   - Website: https://nursedrill.com (pricing visible, policy pages linked in
     the footer).
   - Docs: personal PAN + Aadhaar (linked mobile) + bank proof — **exact name
     match PAN ↔ bank** (the #1 documented delay cause). Savings account is
     fine for this type.
   - GST: declare not registered (services turnover under ₹20L).
   - Expect 2–7 working days and up to 3–5 resubmissions; if both stall,
     Easebuzz is the researched backup.
5. **Firebase — with Phase 1 build.** One project (shared norcetprep+rrbprep
   per the README plan); Firestore region **asia-south1 (Mumbai)** — the
   privacy policy states Mumbai; enable Auth (Google + email/password),
   Firestore, Hosting; upgrade to Blaze and set a budget alert (~₹1,000/mo).

**To close this ticket, report back:** registrar + which TLDs purchased and
that forwarding works · Play account created + verification state · gateway
application dates and activation outcomes (note any granted limits) · policy
TODOs filled and live URL · Firebase project id + region.
