# Research: Play Store path & billing policy (T04)

Researched 2026-07-31. All claims dated; primary sources (Google policy/help pages) cited in
[Sources](#sources).

## Verdict (one screen)

**Wrapper: TWA via Bubblewrap** (PWABuilder as a GUI convenience — it generates the same
TWA/Bubblewrap package). The site is already a working PWA (`manifest.webmanifest` + `sw.js`),
so a TWA reuses it as-is; Capacitor would mean maintaining a second native project for zero gain.

**Billing: ship the Android app as a "consumption-only" app** — login + consume only, purchases
happen on the web (Razorpay et al., ~2% PSP fee). Google Play's Payments policy explicitly
permits this (verified 2026-07-31): *"Google Play allows any app to be consumption-only, even if
it is part of a paid service. For example, a user could log in when the app opens and access
content paid for somewhere else."* The alternative — selling the subscription in-app — forces
Google Play Billing at **15% of subscription revenue in India** (11% via India user-choice
billing, plus your own PSP fee, plus mandatory side-by-side GPB). The Epic-settlement fee cuts
(10% subs) do **not** reach India until the global rollout completes (target Sept 2027).

**The one hard architecture constraint for T07:** when the site runs inside the Android app, it
must show **no purchase flow and no link/CTA to the web checkout**. A Razorpay checkout rendered
inside the TWA *is* an in-app purchase of digital goods → Play Billing violation. The app must
detect app-mode and hide/neutralize all buy/pricing paths; the same origin in a normal browser
keeps the full checkout.

---

## 1. Wrapper path

### TWA (Trusted Web Activity) — recommended

- A TWA renders the live site full-screen in Chrome (no browser UI), verified by Digital Asset
  Links. Google's supported path for PWAs in Play; packaged with
  [Bubblewrap CLI](https://github.com/GoogleChromeLabs/bubblewrap) (GoogleChromeLabs) or
  [PWABuilder](https://www.pwabuilder.com/) (generates a Bubblewrap-based `.aab`). Both active
  as of mid-2026.
- **What it demands:**
  - **HTTPS on an origin you control** — satisfied: GitHub Pages serves
    `https://amitkumar0902.github.io` over HTTPS.
  - **Digital Asset Links**: `https://amitkumar0902.github.io/.well-known/assetlinks.json`
    containing the app's package name + SHA-256 signing-cert fingerprint (use the **Play App
    Signing** certificate fingerprint from Play Console, not the upload key). If DAL
    verification fails, the app still runs but shows browser UI (URL bar) — looks broken, and
    reviewers notice.
  - **PWA quality bar**: valid manifest (name, icons ≥512px, `start_url`, `display:
    standalone`), a service worker with a real **offline fallback** (Chrome's guidance;
    Lighthouse PWA/performance ≈80 is the long-standing published bar for TWA quality). Play's
    *minimum functionality* policy is the actual review gate: a thin website wrapper with no
    offline behavior risks rejection; a real PWA (which norcetprep is) passes.
- **GitHub Pages specifics (checked against this repo 2026-07-31):**
  - Repo **is** the user site `amitkumar0902.github.io`, so it controls the origin root —
    `.well-known/assetlinks.json` goes at the **repo root** (not inside `norcetprep/`); the TWA
    origin is `https://amitkumar0902.github.io` with `start_url` `/norcetprep/`.
  - **Gotcha:** the repo has **no `.nojekyll` and no `_config.yml`**. GitHub Pages runs Jekyll
    by default and Jekyll **excludes dot-directories**, so `/.well-known/` would 404. Fix: add
    an empty `.nojekyll` at repo root (safe for this plain-HTML site) or `include:
    [".well-known"]` in a `_config.yml`.
  - `*.github.io` is on the Public Suffix List; each `username.github.io` is its own
    registrable origin — DAL works fine at origin level. Real caveat is **portability**: the
    package is bound to the origin. Moving to a custom domain later = app update + new
    assetlinks + users' installed app breaks until updated. Decide the final domain **before**
    Play submission.
- **Play Billing inside a TWA is possible** if in-app sales are ever wanted: Chrome for Android
  supports the **Digital Goods API + Payment Request API** in TWA context, wired to Google Play
  Billing (subscriptions supported); PWABuilder/Bubblewrap can scaffold it. Keeps the door open
  without Capacitor. (Native apps must be on Billing Library 8+ for new apps/updates by
  2026-08-31; for TWAs this means keeping `android-browser-helper`/Bubblewrap dependencies
  current.)

### Capacitor — not recommended here

Full native shell + WebView: a second project (Gradle, plugins, upgrades), app assets usually
bundled rather than the live site, and pointing a Capacitor WebView at a remote URL is
explicitly discouraged and reads as a low-quality wrapper in review. Its advantages (native
plugins, native Play Billing SDKs, iOS from the same codebase) aren't needed: no native features
are used, and billing is available in TWA via Digital Goods API anyway. Revisit only if an iOS
App Store build becomes a goal (TWA has no iOS equivalent).

---

## 2. Billing policy — constraints T07 must satisfy

All verified 2026-07-31 against Google's Payments policy and Service fees pages.

1. **When Play Billing is mandatory:** any purchase of digital goods/services made *inside* the
   app — explicitly including "subscription services (fitness, … education …)" and "app
   functionality or premium features" — must use Google Play Billing
   ([Payments policy](https://support.google.com/googleplay/android-developer/answer/10281818)).
   Physical goods are exempt. An embedded web checkout (Razorpay) shown inside the app counts as
   an in-app purchase → violation.
2. **Consumption-only is explicitly allowed** (same policy page, FAQ, quoted above): login-only
   apps unlocking web-purchased entitlements are compliant, "even if part of a paid service."
   This is the Netflix model and the recommended model here.
3. **Anti-steering still applies in India:** outside enrolled regional programs, apps must not
   lead users to non-Play payment methods (links, CTAs, even pricing-with-URL screens). The US
   carve-out (external links + non-GPB in-app billing, per the Epic injunction/settlement —
   effective 2025-10-29, formalized 2026) is **US-only**; EEA has its own program. **No
   link-out program exists for India as of July 2026.** So in app-mode: no "buy on our website"
   link. Stating that content is locked, with no purchase path, is fine.
4. **Fees if selling in-app (India, today):** legacy tiers still apply in India — **15% on
   auto-renewing subscriptions** (any revenue level); other IAP 15% on first $1M/yr, 30% above.
   **India user-choice billing** (post-CCI): offer your own biller *alongside* GPB in-app; when
   the user picks yours, Google's fee drops **4 points → 11%** for subscriptions, but you still
   pay your PSP ~2%, must keep GPB as an option, and must report every alt-billing transaction
   to Google within 24h. Net ~13% + integration burden — poor vs ~2% web-only.
5. **Epic v. Google settlement (approved 2026-03-04):** new structure **effective 2026-06-30 in
   US/UK/EEA only** — auto-renewing subscriptions **10% + 5% "billing fee"** when GPB is used;
   other IAP 10%+5% on new installs, 25%+5% (or 20% via approved external web links) on
   existing installs; enrolled-program developers get reduced existing-install rates. Press
   shorthand: "20% IAP / 10% subs / +5% for Play billing." Also: US developers may use their own
   in-app billing or link out (fee reporting to Google starts 2026-10-01), and a Registered App
   Stores program opened 2026-07-22. **Global rollout target ≈ Sept 2027 — until then India
   stays on 15%/11%.** Even at a future 10%+5%, web-only at ~2% wins for a low-ARPU India
   product.
6. **Decision for T07:** entitlements are created by **web** purchases only (Razorpay →
   backend/entitlement store); the app is a pure consumer of entitlements. Design the
   entitlement check so a *future* second source (Play Billing via Digital Goods API) could be
   added without schema change, in case Play-side conversion ever justifies 15% (or a
   post-rollout 10%+5%).

**App-mode detection (implementation note for T07):** launch the TWA with a marker, e.g.
`start_url: /norcetprep/?src=twa` persisted to storage, and/or check
`document.referrer === "android-app://<package-id>"` on first load. In app-mode: hide pricing
page, hide checkout routes, replace "Subscribe" with neutral "locked" messaging. Server should
also refuse to serve checkout to app-mode sessions (belt and braces — reviewers do look).

---

## 3. Play Console checklist (as of 2026-07-31)

- [ ] **Developer account**: $25 one-time fee. Personal account → government-ID identity
      verification; organization account → **D-U-N-S number** + website. (Broader Android
      developer-verification regime — ID/D-U-N-S even for off-Play distribution — starts
      phasing in **Sept 2026**; being Play-verified covers it.)
- [ ] **12-tester rule**: personal accounts created after 2023-11-13 must run a **closed test
      with ≥12 opted-in testers for 14 consecutive days** before they can apply for production
      access (reduced from 20 on 2024-12-11; still 12 as of mid-2026). Organization accounts
      are exempt. Plan: recruit 12+ NORCET aspirants (Telegram/WhatsApp groups) on day one —
      this is the long pole in the schedule (~2–3 weeks minimum from account creation to
      production eligibility).
- [ ] **Target API level**: today new apps must target **API 35 (Android 15)**; from
      **2026-08-31**, new apps and updates must target **API 36 (Android 16)** (extension to
      2026-11-01 requestable). Action: generate the TWA with current Bubblewrap and explicitly
      verify/bump `targetSdkVersion` to 36 — a stale wrapper template is the classic rejection.
- [ ] **Digital Asset Links**: `.well-known/assetlinks.json` at repo root + `.nojekyll` (see
      §1); fingerprint = Play App Signing cert.
- [ ] **Data safety form** (required pre-publish): declare email/password collection for login;
      requires a **privacy policy URL**.
- [ ] **Account deletion requirement** (in force since 2024, enforced from 2024-04/05): because
      the site has signup/login, the app must offer an **in-app account-deletion path and a web
      deletion URL** (declared in Data safety). The current static allowlist login has no
      deletion flow — T07 must add one (even a request-deletion form/email endpoint).
- [ ] **Content rating questionnaire**, app category (Education), store listing assets
      (512px icon, feature graphic, screenshots).
- [ ] **Review timelines**: typically hours–7 days; **longer for brand-new personal accounts**
      and first submissions. Budget: account verification (days) + 14-day closed test + review
      → realistically ~4–6 weeks from zero to public listing.
- [ ] **Quality pass before submission**: Lighthouse ≥80, offline fallback verified in airplane
      mode inside the TWA build (avoid the Chrome dino page), maskable icons.

## 4. Recommended sequence

1. Decide final domain (stay on `amitkumar0902.github.io` or buy a custom domain **now** —
   changing later breaks installed TWAs).
2. Create Play developer account (personal, $25) → start ID verification immediately.
3. Add `.nojekyll` + `.well-known/assetlinks.json`; build TWA with Bubblewrap (target API 36).
4. Implement T07's app-mode gating (no purchase UI in app) + account-deletion flow + privacy
   policy page.
5. Internal test → closed test with 12+ aspirant-testers for 14 days → apply for production.
6. Data safety + content rating + listing → submit.

## Sources

Primary (Google):
- Payments policy ("Understanding Google Play's Payments policy" — Play Billing scope,
  consumption-only FAQ, regional carve-outs): https://support.google.com/googleplay/android-developer/answer/10281818 (verified 2026-07-31)
- Service fees (legacy 15%/30% + 15% subs; new US/UK/EEA table eff. 2026-06-30): https://support.google.com/googleplay/android-developer/answer/112622 (verified 2026-07-31)
- US policy changes (Epic injunction/settlement: external links, alt in-app billing, dates
  2025-10-29 / 2026-07-22 / 2026-10-01): https://support.google.com/googleplay/android-developer/answer/15582165 (verified 2026-07-31)
- India billing requirements (user-choice billing, −4% fee, 24h reporting): https://support.google.com/googleplay/android-developer/answer/13306652 and https://support.google.com/googleplay/android-developer/answer/13821247 (verified 2026-07-31)
- Target API level requirements (API 35 now; API 36 from 2026-08-31): https://support.google.com/googleplay/android-developer/answer/11926878 ; https://developer.android.com/google/play/requirements/target-sdk
- Testing requirements for new personal accounts (12 testers / 14 days): https://support.google.com/googleplay/android-developer/answer/14151465
- Play Console registration ($25, account types, D-U-N-S): https://support.google.com/googleplay/android-developer/answer/6112435 ; https://support.google.com/googleplay/android-developer/answer/13628312 ; identity verification: https://support.google.com/googleplay/android-developer/answer/10841920
- Data safety section: https://support.google.com/googleplay/android-developer/answer/10787469
- Account deletion requirements: https://support.google.com/googleplay/android-developer/answer/13327111
- Play Billing in TWA (Digital Goods API + Payment Request API): https://developer.chrome.com/docs/android/trusted-web-activity/receive-payments-play-billing ; https://developers.google.com/chromeos/app-development/publish/pwa-play-billing ; sample: https://github.com/chromeos/pwa-play-billing
- Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap ; PWABuilder: https://www.pwabuilder.com/ ; TWA codelab: https://developers.google.com/codelabs/pwa-in-play

Secondary (settlement coverage & mechanics, 2026):
- Settlement approval 2026-03-04 + phased fee rollout from 2026-06-30 (US/UK/EEA), global
  target Sept 2027: https://gigazine.net/gsc_news/en/20260305-google-epic-settlement/ ;
  https://alternativeto.net/news/2026/3/google-and-epic-settlement-ends-30-play-store-fees-and-eases-third-party-app-store-rules ;
  https://www.coda.co/blog/epic-v-google-policy-update-2026/
- 20→12 tester change (2024-12-11) context: https://www.revenuecat.com/blog/engineering/google-play-14-day ; https://primetestlab.com/blog/google-play-changed-20-to-12-testers
- Sept-2026 developer verification expansion: https://www.biometricupdate.com/202508/google-unveils-identity-verification-rules-for-android-app-developers
- India UCB post-CCI background: https://inc42.com/buzz/following-cci-order-google-extends-user-choice-billing-indian-devs/
- .well-known on GitHub Pages / Jekyll dot-dir exclusion: https://maxchadwick.xyz/blog/the-well-known-folder-and-github-pages-jekyll
