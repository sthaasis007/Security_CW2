# Third-party dependency risk assessment

Assessment date: 2026-07-28

| Component | Purpose and data | Main risks | Controls and residual risk |
|---|---|---|---|
| Khalti ePayment API | Payment initiation and verification; receives order reference, amount and customer identity details | Provider outage, API change, redirect tampering, compromised provider credentials, and incorrect payment status | Server calculates amounts, binds references to the authenticated user/order, verifies status directly, uses idempotent transitions, redacts secrets, and disables mock mode in production. Availability and Khalti-side compromise remain external risks. |
| MongoDB/Mongoose | Stores accounts, carts, orders and audit events | Database compromise, injection, availability failure and migration incompatibility | Strict validation, operator sanitisation, least-privilege deployment credentials, TLS in production, password/token hashing, selected field encryption, transactions and pinned lockfiles. Managed-service and operational risks remain. |
| Next.js/React | Frontend rendering, routing and server-side request handling | Framework/RSC vulnerabilities, DoS, cache confusion and transitive image/CSS parser flaws | Next.js is pinned to the latest stable compatible release, vulnerable transitive packages are overridden, security headers are configured, Dependabot monitors releases, and production audit/build gates run in CI. |
| Express security stack | API routing, CORS, Helmet, JWT, Multer and Zod validation | Middleware bypass, malformed uploads, token misuse and configuration error | Strict schemas, signature-based uploads, secure cookies/CSRF, bounded bodies, explicit CORS origins, Helmet and regression tests. Updates still require compatibility testing. |
| Nodemailer/Gmail SMTP | Verification, MFA, reset and security-alert email | Delivery failure, account takeover and secret leakage | Gmail app password stored outside source control, errors are safe, secrets are redacted, and authentication does not rely on successful notification delivery except where the email challenge is required. |
| npm/GitHub Actions | Package installation and CI automation | Malicious package/version, compromised maintainer, lockfile drift and compromised action tag | Lockfiles are committed, production dependencies are audit-gated, updates are reviewed through Dependabot, and workflow permissions are read-only. Action tags and npm registry trust remain residual supply-chain risks. |

Production dependencies have a stricter release gate than development-only tooling. Development advisories are reviewed but are not automatically “fixed” through incompatible downgrades; test inputs and CI permissions remain constrained while upstream fixes are monitored.
