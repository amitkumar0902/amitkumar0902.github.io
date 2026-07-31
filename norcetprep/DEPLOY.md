# NurseDrill — Phase 1 go-live runbook

Repo side is done (hosting config, deploy workflow, legal + pricing pages, flip
script). These are the console steps only the owner can do, in order. Targets
come from the launch plan (`.wayfinder/tickets/t13-launch-sequencing.md`):
Phase 1 complete by **7 Aug 2026**.

## 1. Domains (registrar)
1. Buy **nursedrill.com** and **nursedrill.in** (auto-renew ON, WHOIS privacy ON).
2. Set up free forwarding: `support@nursedrill.com` → your Gmail
   (Cloudflare Email Routing or registrar forwarding). Test it.

## 2. Firebase project
1. console.firebase.google.com → Add project → name/id **`nursedrill-web`**
   (if the id is taken, pick another and update `.firebaserc` + the
   `projectId` in `.github/workflows/firebase-hosting.yml`).
2. No Firestore/Auth needed for Phase 1 (Phase 2 scope — when creating
   Firestore later, choose region **asia-south1 (Mumbai)**; the privacy
   policy promises it).

## 3. Wire the deploy Action
1. Firebase console → Project settings → Service accounts → Generate new
   private key (or run `firebase init hosting:github` locally if you have the
   CLI — it creates the service account + secret automatically).
2. GitHub repo → Settings → Secrets → Actions → new secret
   **`FIREBASE_SERVICE_ACCOUNT_NURSEDRILL`** = the JSON key.
3. GitHub repo → Settings → Variables → Actions → new variable
   **`FIREBASE_DEPLOY_ENABLED`** = `true` (the workflow is inert without it).
4. Push (or run the workflow manually) → the site deploys to
   `nursedrill-web.web.app`. Verify it loads and that `/legal/…`, `/pricing.html`
   work, and that `/imp/` and PDFs are **absent** (they're excluded by
   `firebase.json`).

## 4. Custom domain
1. Firebase console → Hosting → Add custom domain → `nursedrill.com`
   (add `www.nursedrill.com` as a redirect too).
2. Add the A/TXT records it shows at your registrar; wait for the certificate
   (minutes–hours).

## 5. Flip canonicals (only after the domain serves)
```bash
node norcetprep/scripts/flip-canonicals.mjs          # dry-run
node norcetprep/scripts/flip-canonicals.mjs --write  # apply
git add -A && git commit -m "norcetprep: flip canonicals to nursedrill.com"
git push                                              # deploys via the Action
```
Both origins now serve the same content; every page's canonical points at
nursedrill.com, so search consolidates there. (Old github.io URLs keep
working — no stubs needed until later.)

## 6. Search Console
1. Add property `nursedrill.com` (domain property; verify via DNS TXT).
2. Submit `https://nursedrill.com/sitemap.xml`.
3. On the old `amitkumar0902.github.io` property: Settings → **Change of
   address** → to nursedrill.com.

## 7. Fill the policy TODOs, then apply for payments
1. Edit the amber `[TODO: …]` markers in `norcetprep/legal/*.html`
   (legal name, phone, address, governing-law city, publish date), commit, push.
2. Apply to **Razorpay and Cashfree the same day** — exact form answers are in
   `.wayfinder/tickets/t10-business-prereqs.md`.
3. Create the Play Console developer account ($25) and start ID verification
   (app itself is Feb-wave scope).

When these are done, report the facts back (registrar, project id, activation
outcomes, live URLs) — that closes **Business & payment prerequisites** and
completes the map.

---

# Phase 2 — accounts (console side)

Repo side is built: `account.html` (sign-in/up, progress merge, devices,
account deletion — this page is also the Play data-safety "deletion URL"),
`js/auth.js`, evolved `firebase/firestore.rules`, and the owner grant script.
The legacy allowlist login stays working in parallel (grace overlap); on the
product domain the legacy gate disarms by design and real gating arrives in
Phase 3. Console steps:

1. **Fill the Firebase config** — Firebase console → Project settings → Your
   apps → Add web app → copy the config object into
   `norcetprep/js/firebase-config.js` (replace the `YOUR_…` placeholders).
   Commit + push. Until this is done, account.html shows "accounts aren't
   switched on yet" and everything else still works.
2. **Enable sign-in providers** — Authentication → Sign-in method → enable
   **Google** and **Email/Password** (keep **Anonymous** enabled too — the
   legacy sync-codes use it).
3. **Authorized domains** — Authentication → Settings → add
   `nursedrill.com` and `amitkumar0902.github.io`.
4. **Create Firestore** — region **asia-south1 (Mumbai)** (the privacy policy
   promises it), production mode, then deploy the rules:
   ```bash
   npx firebase-tools deploy --only firestore:rules
   ```
5. **Verify end-to-end** — open `/account.html` on the live site → create an
   account → confirm your local practice progress appears in
   Firestore under `users/{uid}.progress` → sign in on a second device and
   see it merge.
6. **Grandfather the allowlisted user** (decided in Pricing & packaging):
   after they create their account (do it together — grace overlap),
   ```bash
   npm install firebase-admin        # one-off; gitignored
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
     node norcetprep/scripts/grant-entitlement.mjs --email <their-email> --months 12
   ```
   account.html should then show "Premium until …".
7. **Parallel content track** (not console work): the NORCET-9 rewrite batch
   and the bank verification pipeline run alongside Phase 2 — see
   `.wayfinder/tickets/t09-content-engine.md`.

---

# Phase 3 — paywall machinery (console side)

Repo side is built: premium content stays gated behind a **single flag**
(`PAYWALL_ENABLED` in `norcetprep/js/paywall.js`, currently `false`) so all of
this deploys inert. Built: `js/paywall.js` (entitlement gate + TWA app-mode
blackout), `js/content.js` (premium JSON via Firestore
`content/norcet/**`), `scripts/upload-content.mjs`, `checkout.html` +
`checkout-success.html` + `js/payments-config.js`, `functions/` (the one
Razorpay webhook), GA4 funnel events (`js/analytics.js`), and the service
worker now precaches free content only.

Console steps, in order (target: built + E2E-tested by **31 Aug** — the
checkpoint):

1. **Deploy the webhook function**
   ```bash
   cd functions && npm install && cd ..
   npx firebase-tools functions:secrets:set RAZORPAY_WEBHOOK_SECRET   # paste a long random string; keep it
   npx firebase-tools deploy --only functions
   ```
   Note the printed `razorpayWebhook` URL (asia-south1). The GitHub Action
   only deploys hosting — functions deploy from your machine.
2. **Razorpay Payment Pages** (dashboard → Payment Pages, test mode first):
   create **three pages** — 3-month ₹249 / 6-month ₹449 / 12-month ₹699
   (launch amounts; the page is the charging truth). On each:
   - add two custom text fields named exactly **`uid`** and **`plan`**
     (checkout.html prefills them via URL; they arrive in `payment.notes`,
     which the webhook reads — without `uid` a payment lands "unmatched");
   - set the success redirect to `https://nursedrill.com/checkout-success.html`.
3. **Razorpay webhook** (dashboard → Settings → Webhooks): URL = the function
   URL from step 1, secret = the same `RAZORPAY_WEBHOOK_SECRET`, events:
   **payment.captured** and **refund.processed**.
4. **Paste the three page URLs** into `norcetprep/js/payments-config.js`
   (replace the `YOUR_…` placeholders), commit, push.
5. **Upload premium content to Firestore** (repeat whenever content changes):
   ```bash
   node norcetprep/scripts/upload-content.mjs            # dry-run list
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
     node norcetprep/scripts/upload-content.mjs --write
   ```
6. **GA4**: Firebase console → Project settings → Integrations → enable
   Google Analytics → copy the `measurementId` (G-…) into
   `norcetprep/js/firebase-config.js`. Funnel events then flow: signup ·
   paywall_view · checkout_click · purchase (quiz and share events wire up
   when the daily quiz / report cards ship — T12 growth plumbing).
7. **End-to-end test** (= checkpoint gate 3, with pages still in test mode):
   sign in → `/checkout.html?plan=3m` → pay with a test method → success page
   flips to "You're in" within seconds → `account.html` shows "Premium
   until …" → a premium mock loads → issue a refund from the dashboard →
   entitlement revoked (account shows Free tier). checkout.html is reachable
   before go-live **by design** (it needs the pasted URLs, not the paywall
   flag) — nothing on the site links to it until the flag flips.

## Go-live flip (green checkpoint → ~5 Sep; hard gate 18 Sep)

Prereqs: gateway activated (live mode), NORCET-9 rewrite shipped + official
PDF unpublished (legal gate), E2E test green, the grandfathered user's
account verified working. Then ONE commit:

1. `js/paywall.js` → `PAYWALL_ENABLED = true`.
2. `js/payments-config.js` → swap test-mode page URLs for **live-mode** URLs.
3. `pricing.html` → rewrite the status block: paid is live; print the launch
   offer end date (**today + 30 days — printed once, never moved**, per T13).
4. `firebase.json` → add the premium statics to `hosting.ignore` so the
   product domain stops serving them (they're in Firestore now):
   ```json
   "norcetprep/data/mains/question-bank.json",
   "norcetprep/data/mains/mock-blueprint.json",
   "norcetprep/data/mains/frequency-analysis.json",
   "norcetprep/data/mains/drill-drug-calc.json",
   "norcetprep/data/mains/mocks/mock-*.json",
   "norcetprep/data/mains/pyqs/**",
   "norcetprep/data/mains/day-slices/**",
   "norcetprep/data/mains/topics/**",
   "norcetprep/data/mains/flashcards/**",
   "norcetprep/data/mains/_audit/**",
   "norcetprep/data/mains/notes/anatomy.json",
   "norcetprep/data/mains/notes/biochem.json",
   "norcetprep/data/mains/notes/child.json",
   "norcetprep/data/mains/notes/chn.json",
   "norcetprep/data/mains/notes/ent.json",
   "norcetprep/data/mains/notes/gyn.json",
   "norcetprep/data/mains/notes/medicine.json",
   "norcetprep/data/mains/notes/mental.json",
   "norcetprep/data/mains/notes/micro.json",
   "norcetprep/data/mains/notes/midwifery.json",
   "norcetprep/data/mains/notes/pharma.json",
   "norcetprep/data/mains/notes/surgery.json"
   ```
   (`notes/foundation.json` stays served — it's the open sample. `mocks/index.json`,
   `stats/syllabus/videos.json` stay too.)
5. `sw.js` → bump the `CACHE` name (e.g. `…-v16-paid`) so grace-period caches
   holding premium JSON are purged on activate.
6. **Retire the allowlist** (T13: at paid go-live, never before the
   grandfathered account is verified): delete `js/allowlist.js`, remove the
   legacy gate block at the top of `js/core.js`, point `login.html` /
   `signup.html` at `account.html` (or replace them with redirect stubs).
7. Commit, push (deploys via the Action). Announce per T13 — pricing page
   carries the honesty block; end date appears exactly once, there.

**Sample designation (owner content call, any time):** mark specific library
mocks free by adding `"free": true` to their entry in
`data/mains/mocks/index.json` — the mock library shows them unlocked; the
Foundation notes section is already the open notes sample. If you free a
mock, also remove it from the go-live ignore list above and from
`PREMIUM`/`FREE_EXCEPTIONS` in `js/content.js` + `scripts/upload-content.mjs`.

**Known accepted gaps (v1):**
- Day-page notes (`mains-plan/day-*.html`) and cheatsheets are **inline
  HTML** — the paywall interstitial guards them, but the underlying HTML
  remains fetchable by a determined user. The real fix (extract into
  Firestore like the JSON content) is content-track work, post-launch.
- The old github.io origin serves everything from the public repo until its
  pages become canonical stubs (T08 migration step, after go-live). The repo
  is public anyway — piracy exposure is unchanged from today.
- Labelled diagram SVGs stay static (T07 moved banks/mocks/notes JSON only);
  the pages presenting them are gated.
