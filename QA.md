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
| B — Transport | Local loopback HTTP only for QA; production HTTPS/headers pending live check below. HTML contains restrictive meta CSP and no-referrer. | Pages header limitations are documented in SECURITY.md; meta CSP cannot enforce frame-ancestors. |
| C — Storage/public surface | No remote storage, database, endpoint or ACL. First commit contains `.gitignore`; public repo includes only source, generic documentation and synthetic test cases. `docs` is an explicit six-file static asset allowlist plus `.nojekyll`. | No patient or credential history. CI is read-only and does not collect or commit inputs. |
| D — Governance | Browser-only calculator. Public notice states scope, no retention/upload, hosting metadata and professional interpretation. Health data are recognized as sensitive under Taiwan PDPA §6. | A new use that collects identifiable health/research data requires a new controlled backend, legal/IRB/consent and security review. Such collection is not approved here. |

Passive scanner used `--tier 2 --allow-private-host`; source patterns found no client secret, endpoint or innerHTML assignment. Its Tier 2 policy deliberately returns provisional BLOCK until backend/storage evidence exists, and reports HTTP response headers only (not HTML meta). Manual source/runtime review resolves backend/ACL/consent-to-upload as **not applicable because no collection or transmission service exists**. This is not a scanner-issued PASS.

**Pre-publication decision: CONDITIONAL — may publish the reviewed, browser-only research calculator; no permission to collect identifiable health data.** No unresolved S1/S2 issue. Conditions are limited to production HTTPS verification and documented static-host header limitations. Final live evidence below must be completed before calling deployment verified.

## Live publication

Pending publication and verification; do not interpret an approved deployment configuration as a live site.
