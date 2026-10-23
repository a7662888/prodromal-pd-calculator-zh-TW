# QA and release evidence

Review date: 2026-10-23 (Asia/Taipei). Synthetic inputs only. No real patient data was used, collected or committed.

## Calculation and evidence

- Primary 2019 Tables 1/2 checked against publisher full text and UCL PDF. Independent read-only reviewer checked the values and 2015 dependency rules.
- Reviewer found isolated anxiety must not be treated as absence of depression. Added neutral anxiety-only option (LR 1) and regression test before publication.
- `node --test tests/*.test.js`: **14/14 PASS**. Covers seven age priors and genotype bands, independent Bayes cases, updated illustrative profile, both-direction motor dependencies, RBD/OH alternatives, unknown/NA vs assessed negative, sex-specific exclusions, isolated anxiety, eligibility, malformed selections and risk-only high-probability cases.
- Reference outcomes: 65–69 male + PSG RBD = 76.09756098%; plus objective olfactory loss = 95.32174909%. Recalculated 2015-style illustrative profile using 2019 values = 92.55011881% (display 92.55%).
- `node scripts/build.mjs --check`: published static assets identical to root sources.

## Local runtime and visual review

`scripts/browser-qa.cjs` executed against loopback HTTP with installed Chrome (fresh, isolated context, synthetic input). Report/screenshots in ignored `qa/`.

- Functional PASS: applicability guards, example, live updates, unknown-only prior, male-only exclusion, reset and reload clearing.
- Network PASS: zero additional requests across synthetic input interactions. Only same-origin GET requests for public application assets; no remote data requests.
- Privacy PASS: zero localStorage/sessionStorage entries, cookies, or active service worker. No input in URL. No upload or submit control.
- Runtime PASS: no uncaught JavaScript errors.
- Layout PASS: desktop 1440×1100; mobile 390×844 and 320×740, no horizontal overflow. Screenshots inspected. Reduced-motion mode used for deterministic bar capture; mobile audit starts collapsed.
- Initial sandbox localhost denial was resolved by running the loopback-only server and browser test outside the sandbox. This was an environment constraint, not a published application bypass.

## Four-stage security review

| Stage | Verdict / evidence | Findings and disposition |
|---|---|---|
| A — Source | PASS for static local computation. `app.js` builds text nodes; `calculator.js` validates marker allowlists. No fetch/XHR/beacon, runtime dependencies, analytics, client secret or upload endpoint in published assets. | No S1/S2 finding. Health inputs cannot be sent by application code; CSP connect/form actions deny requests. |
| B — Transport | Live HTTPS 200; HSTS max-age=31556952; HTML meta CSP and no-referrer verified. Runtime input changes produce zero requests. | S4 residual: Pages response omits CSP, Referrer-Policy, X-Content-Type-Options and X-Frame-Options. CSP/referrer are set in HTML; frame-ancestors cannot be set by meta. Host does not offer arbitrary response-header configuration. |
| C — Storage/public surface | No remote storage, database, endpoint or ACL. First commit contains `.gitignore`; public repo includes only source, generic documentation and synthetic test cases. `docs` is an explicit six-file static asset allowlist plus `.nojekyll`. | No patient or credential history. CI is read-only and does not collect or commit inputs. |
| D — Governance | Browser-only calculator. Public notice states scope, no retention/upload, hosting metadata and professional interpretation. Health data are recognized as sensitive under Taiwan PDPA §6. | A new use that collects identifiable health/research data requires a new controlled backend, legal/IRB/consent and security review. Such collection is not approved here. |

Passive scanner used `--tier 2 --allow-private-host`; source patterns found no client secret, endpoint or innerHTML assignment. Its Tier 2 policy deliberately returns provisional BLOCK until backend/storage evidence exists, and reports HTTP response headers only (not HTML meta). Manual source/runtime review resolves backend/ACL/consent-to-upload as **not applicable because no collection or transmission service exists**. This is not a scanner-issued PASS.

**Pre-publication decision: CONDITIONAL — may publish the reviewed, browser-only research calculator; no permission to collect identifiable health data.** No unresolved S1/S2 issue. Conditions are limited to production HTTPS verification and documented static-host header limitations. Final live evidence below must be completed before calling deployment verified.

## Live publication

- Public repository: https://github.com/a7662888/prodromal-pd-calculator-zh-TW
- Public application: https://a7662888.github.io/prodromal-pd-calculator-zh-TW/
- Application commit: `6151e383a8c74a86bda2096c5b7db5d030182b8e`; later documentation-only commits do not change the reviewed assets.
- GitHub Pages API reported `built`, no error. [Deployment run 39958715674](https://github.com/a7662888/prodromal-pd-calculator-zh-TW/actions/runs/39958715674) and [calculator CI run 39958716375](https://github.com/a7662888/prodromal-pd-calculator-zh-TW/actions/runs/39958716375) both completed successfully.
- Browser runtime checks repeated against the public URL: PASS. Same independent example values, applicability/sex exclusions, zero input-triggered requests, zero application storage/cookie/service worker, reset/reload clearing, no uncaught errors, no horizontal overflow at 390px or 320px.
- Live screenshots inspected: 1440×1100 desktop, 390×844 mobile. Local evidence is excluded from git at `qa/live/`.
- Public GET-only scanner: HTTP 200, no secret pattern, supported client endpoint or innerHTML assignment detected; repository reported PUBLIC. Tier 2 provisional BLOCK interpreted as described above, not misrepresented as scanner approval.
- Public asset bytes independently compared with local reviewed `docs` assets: all six match. SHA-256 evidence follows.

| Asset | SHA-256 |
|---|---|
| index.html | `3fafaee1d6d0990b8e447e557c0f53d709768e2849670e075960b86ee6486699` |
| app.js | `3e5aee322d261f7df165e6ae5c7b26cf8ea29c515a60feeb26d5318067e81c08` |
| calculator.js | `35e01eeafe8336c5476cd3638b2b0f8ec1292f8635ed51d62daef64ccdf7e171` |
| data.js | `fa47f95c82a2134362e4a6ad2bc9557e318af3d73dd9b11aefd1e84f3b77da78` |
| styles.css | `f856553ec4c953f377f8a8b42fff8ce65cac43e27cf17708e294feed876584fe` |
| favicon.svg | `4ce4794d64a178cf8044a0b0805966455b5a81dcd747b9252a6c3a9d7fbed53a` |

**Final release decision: CONDITIONAL — the public browser-only research calculator is approved within this reviewed scope, with static-host header limitations accepted and documented. No unresolved S1/S2 finding. It is not approved as a service for collecting identifiable health data or as a clinically validated diagnostic tool.** No upload backend, storage ACL or upload consent is relevant to the current application because no data-collection service exists; adding one changes this decision and requires re-review.
