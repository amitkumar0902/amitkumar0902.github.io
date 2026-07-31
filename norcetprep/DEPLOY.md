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
