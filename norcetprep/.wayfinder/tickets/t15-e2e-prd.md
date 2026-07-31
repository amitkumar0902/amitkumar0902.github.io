---
id: T15
title: "PRD: NurseDrill end-to-end product spec"
labels: [wayfinder:task]
status: closed
assignee: amit
blocked-by: []
---

## Question

Materialize the map's destination as one document: a consolidated PRD covering
the complete end-to-end product — everything decided across the 13 closed
tickets plus the build state — so downstream planning (`plan-from-prd` /
`issues-from-prd`) and any future collaborator can work from a single spec
instead of re-reading the ticket set. The PRD must add **no new decisions**:
it synthesizes; where a fact is still owner-pending it says so and points at
[Business & payment prerequisites](t10-business-prereqs.md).

## Resolution

Written 2026-08-01, in two complementary forms:

1. **[Formal PRD (write-prd format)](../../../docs/prds/2026-08-01/nursedrill-e2e.md)**
   — problem/solution narrative, 31 user stories with acceptance criteria
   across six actors (anonymous aspirant, account holder, buyer, premium
   subscriber, app user, owner-operator), implementation decisions,
   testing decisions (flags the webhook function as the highest-value
   untested module), out-of-scope, notes. The canonical PRD.
2. **[Requirement register](../assets/prd-nursedrill-e2e.md)** — the compact
   companion: same decisions as a status-tagged id register
   (BUILT/CONSOLE/TODO/FEB-WAVE/RED-PATH), the quickest view of the E2E gap.

Eleven sections: product & wedge, users/market, business model, brand/trust,
design (Clinical Excellence + locked prototype), the full requirement register
(FREE/ACCT/PAY/CONT/QUAL/GROW/ANLY/LEGAL/OPS/APP ids, each tagged
BUILT / CONSOLE / TODO / FEB-WAVE / RED-PATH and citing its source ticket),
architecture, the two-gate launch calendar, a Definition of E2E-complete for
both the web cycle and the Feb-wave app, risks, and the decision index.

Deliberate properties: zero new decisions (pure synthesis — anything
owner-pending points at [Business & payment prerequisites](t10-business-prereqs.md));
requirement ids sized for `issues-from-prd`/`plan-from-prd` consumption; the
status tags double as the E2E gap register, making "what remains" readable
without the ticket set. Remaining TODO clusters it surfaces: the content legal
gate (QUAL-1/2/3), growth plumbing (GROW-1/2/4/5), ops alarms (OPS-3), and the
Feb-wave app (APP-1/2).
