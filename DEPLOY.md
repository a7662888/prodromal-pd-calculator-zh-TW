# Deployment

Owner: a7662888. User approved public repository and Pages in this chat on 2026-10-23.

- Repository: https://github.com/a7662888/prodromal-pd-calculator-zh-TW
- Website: https://a7662888.github.io/prodromal-pd-calculator-zh-TW/
- Architecture: static HTML/CSS/ES modules; no backend, process, environment variables, secrets or database.
- Build: `node scripts/build.mjs`; publish `main:/docs` with GitHub Pages.
- Validation: `node --test tests/*.test.js`, `node scripts/build.mjs --check`, local and live browser checks, `QA.md`.
- Rollback: revert the offending commit, rebuild docs, push. For urgent removal disable GitHub Pages in repository settings. No submitted user-data store exists.
- Public scope: interface, documented literature parameters and independent calculation source. No member-only content or patient inputs.
- Residual hosting limitations: provider connection metadata and security headers, documented in SECURITY.md and live QA.
