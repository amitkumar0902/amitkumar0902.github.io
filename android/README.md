# NurseDrill Android app (TWA) — Feb-2027 wave

A Trusted Web Activity wrapper around the PWA at nursedrill.com. **One
codebase**: there is no separate native app, no separate content, no separate
login. The app is a browser window without the browser chrome.

It is **consumption-only**. Every rupee is charged on the web, so Play's
billing policy does not apply to us — but only as long as the app shows no
prices, no plans, no unlock buttons and no links to pricing or checkout. That
blackout is already implemented client-side (`js/paywall.js`, app-mode) and is
covered by tests in `norcetprep/test/frontend.test.js`. The device audit in
§5 is what proves it end to end.

Timing: a new personal developer account needs a **12-tester × 14-day closed
test** before production, so this track targets the **February–April 2027**
demand wave. The web carries the September 2026 season.

---

## 1. Prerequisites

- nursedrill.com live on Firebase Hosting, serving the product at the origin
  root, with a valid certificate. The TWA binds to that origin — it cannot
  wrap a subdirectory.
- Play Console developer account ($25) with identity verification complete.
  Start this early; verification is the slow part.
- Node 20+ and a JDK (Bubblewrap installs its own Android SDK bits).

## 2. Generate the project

```bash
npm install -g @bubblewrap/cli
cd android
bubblewrap init --manifest https://nursedrill.com/manifest.webmanifest
```

Answers that matter (the rest can take defaults):

| Prompt | Answer | Why |
|---|---|---|
| Application ID | `com.nursedrill.app` | Permanent — it cannot be changed after the first upload. |
| Start URL | `/?src=twa` | Arms app-mode from the first paint, before any purchase surface can render. |
| Display mode | `standalone` | |
| Status-bar colour | `#042f2e` | Deep slate teal, matching the theme colour. |
| Include support for shortcuts | yes | The manifest defines "Today's quiz" and "Mock library". |
| Signing key | create new, **back it up** | Losing it means never updating this listing again. |

`twa-manifest.json` lands here; commit it (it is configuration, not a secret).
The keystore is **not** committed — `.gitignore` covers `*.keystore` and
`*.jks`. Keep it in a password manager.

## 3. Digital Asset Links (removes the URL bar)

```bash
bubblewrap fingerprint list        # prints the SHA-256 of your signing key
```

Put that fingerprint in `norcetprep/.well-known/assetlinks.json` (a template is
committed there), then push. Firebase Hosting serves `/.well-known/...` from
the site root — verify with:

```bash
curl -s https://nursedrill.com/.well-known/assetlinks.json | jq .
```

Both the upload key and the Play App Signing key need to be listed; Play shows
the latter under *Setup → App integrity* after the first upload. **If the URL
bar still shows in the installed app, the fingerprint is wrong** — that is
always what it means.

## 4. Build and upload

```bash
bubblewrap build          # produces app-release-bundle.aab
```

Target API level: whatever Play currently requires for new submissions
(35 at the time of writing, 36 from Aug 2026 — check the console, it is
enforced at upload).

## 5. App-mode compliance audit (do this on a real device, before submitting)

From a **fresh install**, with a **signed-out** account, walk every route and
confirm:

- [ ] No screen anywhere shows a price, a plan name, an unlock button, or a
      link to pricing or checkout.
- [ ] Opening a locked mock or notes section shows neutral copy plus a sign-in
      button — never a purchase path.
- [ ] Deep-linking to `/pricing.html` and `/checkout.html` inside the app
      renders the blackout card, not the page.
- [ ] The footer's pricing link is absent (site-chrome removes it in app-mode).
- [ ] No URL bar is visible on any screen (asset links verified).

Then, with an account that **bought on the web**:

- [ ] Premium content opens in the app after sign-in, with no purchase path
      shown anywhere.
- [ ] Progress, streaks and mock results match the web for the same account.
- [ ] Airplane mode: content already opened stays readable.

Finally, back in **normal Chrome on the same device**:

- [ ] Pricing and checkout render normally. App-mode must not leak into the
      browser — it lives in sessionStorage precisely for this reason, and
      there is a test for it, but verify on hardware anyway.

## 6. Play Console

- **Data safety form**: collected — email address, name (if Google sign-in),
  app activity (study progress), device identifiers (telemetry only). Purposes:
  app functionality and account management. Encrypted in transit: yes.
  Users can request deletion: yes.
- **Account deletion URL**: `https://nursedrill.com/account.html` — the page
  deletes the auth user, the synced data and the device records.
- **Privacy policy URL**: `https://nursedrill.com/legal/privacy.html`
- **Content rating**: education, no sensitive content.
- **Listing copy**: carries "Not affiliated with or endorsed by AIIMS", no
  rank or selection promises, no invented faculty. Same register as the site.
- **Closed test**: 12 testers × 14 continuous days. The launch cohort is the
  tester pool — invite from the Telegram channel.

## 7. Releasing an update

The app is a wrapper: **content and features ship by pushing the website**.
A new APK is only needed when the wrapper itself changes — target API bump,
icon, app name, shortcuts. That is roughly once a year.
