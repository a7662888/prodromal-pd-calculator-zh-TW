# Privacy and security decisions

## Six pre-build decisions

1. **Minimum inputs:** age band, sex and research marker categories only. No name, birthday, email, patient ID, hospital, free text, attachments or real-patient examples.
2. **Data location:** current browser page memory only. No backend, API, cookies, local/session storage, URL parameters, service worker, analytics or remote fonts. The application makes no requests containing inputs. The hosting provider can process ordinary connection metadata, including IP addresses.
3. **Who writes:** the user changes their current in-memory form. There is no remote read/write endpoint and therefore no server authorization or rate-limiting surface. Only repository maintainers can change published application code.
4. **Never in version control:** credentials, patient data, exports, logs and local QA artifacts are excluded from the first commit. No CI step collects inputs or commits generated datasets.
5. **User notice:** the page explains local computation and hosting metadata, research-only scope, non-official status and limitations. It does not claim encrypted storage or absolute anonymity. No consent-to-upload is requested because no upload exists.
6. **Retention and owner:** application memory is cleared on page reload, restored-page navigation or explicit reset. Browser/OS memory recovery and hosting logs are outside the application guarantee. Repository owner controls deletion/rollback and Pages removal. No response database exists to retain or erase.

## Controls

- Fixed select allowlists, validation in the calculation module, safe `textContent` and DOM construction. No user input enters HTML parsing.
- CSP: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'`.
- `Referrer-Policy: no-referrer` via HTML meta; all external links have `noopener noreferrer`.
- Local JS/CSS only; no runtime dependency or CDN. Form submission prevented and additionally blocked by CSP.
- Pages cannot set arbitrary response headers. Meta CSP does not support `frame-ancestors`; the absence of a response frame policy and `X-Content-Type-Options` must be recorded from live evidence. Strict framing/header requirements would need a different host.
- Any future collection, transmission, storage, export or integration requires a new security review, controlled backend, authorization, input validation and a retention decision before use.

## Release review

See `QA.md` for dated static/runtime/live evidence and release decision. The approved architecture is a public static research calculator with no health-data collection service. It is **not approved to collect identifiable medical or research-participant records**. Taiwan Personal Data Protection Act §6 and applicable IRB/consent requirements must be reassessed if that scope changes.
