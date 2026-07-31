/*
 * NurseDrill payment configuration (Phase 3).
 *
 * Paste the three Razorpay Payment Page URLs here once created (one hosted
 * page per SKU — see DEPLOY.md "Phase 3"). Until then checkout.html shows
 * "checkout isn't switched on yet" and nothing breaks.
 *
 * Prices are displayed from here so the go-live commit (launch → list price
 * later) edits exactly one file. Amounts are in ₹; keep them in sync with the
 * amount configured on each Razorpay page — the page is the charging truth.
 */
(function () {
  'use strict';
  var PAGES = {
    '3m':  'YOUR_RAZORPAY_PAGE_URL_3M',
    '6m':  'YOUR_RAZORPAY_PAGE_URL_6M',
    '12m': 'YOUR_RAZORPAY_PAGE_URL_12M'
  };
  var PLANS = {
    '3m':  { label: '3 months',  months: 3,  price: 249, list: 299 },
    '6m':  { label: '6 months',  months: 6,  price: 449, list: 599 },
    '12m': { label: '12 months', months: 12, price: 699, list: 999 }
  };
  var ready = Object.keys(PAGES).every(function (k) { return !/^YOUR_/.test(PAGES[k]); });
  window.ND_PAYMENTS = { pages: PAGES, plans: PLANS, ready: ready };
})();
