---
id: T05
title: Legal & compliance baseline
labels: [wayfinder:research]
status: closed
assignee: research-agent
blocked-by: []
---

## Question

What must a small Indian paid-edtech site have in place to charge users
lawfully and safely? Establish: GST registration thresholds and treatment for
digital services sold by an individual; consumer-protection / refund
expectations for digital subscriptions; DPDP Act 2023 privacy obligations at
this scale; the T&C / privacy-policy / refund-policy pages a payment gateway
and the Play Store each require; PYQ copyright posture — memory-based recall
questions vs verbatim official papers (**note: the repo currently ships a
verbatim NORCET-9 Mains replay transcribed from the official PDF — flag what
must change before charging**); and "not affiliated with AIIMS" disclaimer
norms.

Deliverable: a compliance checklist split into *must-do before charging* vs
*can wait*, as an asset file. Feeds
[Business & payment prerequisites](t10-business-prereqs.md) and
[Content engine & quality bar](t09-content-engine.md).

## Resolution

Researched 2026-07-31. An individual can charge lawfully with **no GST registration
until ₹20L turnover** — inter-state service sales (Notif. 10/2017-IT) and selling via a
payment gateway (not an ECO; own-site sales outside TCS s.52) don't change that; once
registered, edtech/OIDAR is 18%. Real launch blockers: (1) four gateway-gated policy
pages (T&C, Privacy, Refund with timelines, Contact — Razorpay auto-checks them);
(2) CPA 2019 / E-Commerce Rules 2020 compliance — refund terms before checkout,
grievance contact, and no "subscription trap" (CCPA Dark Patterns Guidelines 2023:
cancel must be as easy as signup); (3) **the verbatim NORCET-9 Mains replay must be
rewritten or removed before the paywall** — exam papers are copyrighted literary works
(Rupendra Kashyap 1996; Ravinder Singh v. Evergreen 2018: verbatim + answers = still
infringement) and AIIMS actively asserts copyright in its own papers; reworded
memory-based recall items with original explanations are the accepted industry posture
(Testbook/Adda247/PW/NPrep). DPDP Act substantive duties start only 13 May 2027 —
prepare, don't panic; SPDI Rules 2011 apply meanwhile. Add a prominent "not affiliated
with AIIMS" disclaimer everywhere, never the AIIMS logo (AIIMS Jun-2026 branding memo);
"NORCET" used descriptively is fine. Play Store later adds: privacy policy in-app +
Console, Data safety form, account-deletion web URL, Play Billing (15%), and you still
handle your own GST as an India-based developer.

[full findings](../assets/research-legal-compliance.md)
