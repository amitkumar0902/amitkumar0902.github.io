---
id: T10
title: Business & payment prerequisites
labels: [wayfinder:task]
status: open
assignee: none
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
