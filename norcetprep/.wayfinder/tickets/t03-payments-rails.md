---
id: T03
title: India payments & recurring billing rails
labels: [wayfinder:research]
status: closed
assignee: research-agent
blocked-by: []
---

## Question

What are the viable rails for charging Indian aspirants a subscription from a
solo-dev product? Compare Razorpay, Cashfree, PayU, Instamojo (and any
better-fit option): subscription / UPI-Autopay support, RBI e-mandate
constraints on auto-recurring charges, KYC required as an individual vs sole
proprietor (bank account, PAN, website requirements), fees, and settlement
terms. Also weigh the operational alternative many Indian prep products use:
**validity plans** — a one-time payment for N-month access — versus true
auto-recurring billing (churn mechanics vs mandate friction).

Deliverable: recommended shortlist with a KYC/prerequisite checklist, as an
asset file. Feeds [Platform & entitlement architecture](t07-platform-architecture.md)
and [Business & payment prerequisites](t10-business-prereqs.md).

## Resolution

Sell validity plans (one-time payment for 3/6/12-month access), not auto-recurring
billing: it is the Indian test-prep norm, needs no mandate infrastructure (works via
hosted payment links/pages on a static site), and exam-dated customers cap subscription
LTV anyway. RBI's consolidated e-mandate framework (issued 21 Apr 2026) is no blocker
at this price point (AFA-free auto-debits up to ₹15,000), but mandate-creation drop-off,
mandatory 24h pre-debit alerts, and debit failures make Autopay a later, optional add-on.
Shortlist: apply to **Razorpay** and **Cashfree in parallel** (both onboard unregistered
individuals with personal PAN + Aadhaar + bank proof; 2% vs 1.95%, T+2 vs T+1 settlement;
activation unpredictability is the real risk), with **Easebuzz** (~1.5%, fast digital KYC)
as backup. Rejected: PayU and PhonePe PG (require business registration/GST), Instamojo
(5%+₹3 digital-goods fee, lost its PA path in Sep 2023), Paytm (relicensed only Nov 2025),
Stripe (invite-only in India). Before applying: add Terms/Privacy/Refund/Contact/pricing
pages, ensure exact PAN-bank name match, and preferably a custom domain.
[full findings](../assets/research-payments-rails.md)
