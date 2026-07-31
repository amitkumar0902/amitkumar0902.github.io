// Legacy-origin handoff (T08 migration / PRD user story 31).
//
// One repository serves two origins, so the redirect has to be conditional:
// on the legacy github.io host every page hands off to the same path on
// nursedrill.com; on the product domain this file does nothing at all.
//
// Armed by the go-live flip (STUBS_ARMED). Before that it is inert, because
// redirecting to a domain that is not yet serving would take the site down.
//
// Deliberately a client-side hop: GitHub Pages cannot issue a 301 for a
// project site. The canonical tag is what search engines act on, and the
// Search Console change-of-address does the real work — this redirect is for
// humans following an old bookmark or an old Telegram link.
(function () {
  'use strict';

  var STUBS_ARMED = false;
  var LEGACY_HOST = 'amitkumar0902.github.io';
  var LEGACY_BASE = '/norcetprep/';
  var PRODUCT = 'https://nursedrill.com';

  if (!STUBS_ARMED) return;
  if (location.hostname !== LEGACY_HOST) return;          // product domain: untouched
  if (location.pathname.indexOf(LEGACY_BASE) !== 0) return; // the personal site is not ours to move

  var rest = location.pathname.slice(LEGACY_BASE.length);
  var target = PRODUCT + '/' + rest + location.search + location.hash;

  // Point search at the destination even if the hop is blocked or slow.
  try {
    var link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      (document.head || document.documentElement).appendChild(link);
    }
    link.href = PRODUCT + '/' + rest;
  } catch (e) {}

  // Escape hatch: ?stay=1 loads the legacy copy, so the old origin can still
  // be inspected after the move without editing anything.
  if (/[?&]stay=1(&|$)/.test(location.search)) return;

  location.replace(target);
})();
