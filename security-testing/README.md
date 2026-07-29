# Security Testing Evidence Pack

This directory contains the Phase 12 coursework materials:

- `PENETRATION_TEST_PLAN.md`: authorization, scope, ethics, method, evidence,
  severity, and exit criteria;
- `TEST_MATRIX.md`: manual cases mapped to OWASP WSTG and API Security Top 10;
- `VULNERABILITY_REPORT_TEMPLATE.md`: one template per confirmed finding;
- `BEFORE_AFTER_DEMONSTRATIONS.md`: safe, reproducible demonstration procedures.

## Suggested execution order

1. Create an isolated local test database and synthetic accounts.
2. Record the current commit with `git rev-parse HEAD`.
3. Complete the matrix manually and capture sanitized evidence.
4. Run the supplementary backend security tests:

   ```powershell
   Set-Location backend
   npm test -- --runInBand
   ```

5. Report confirmed findings using the template.
6. Apply fixes on a separate commit and repeat the original manual steps.
7. Complete the demonstration tables only with observed results.
8. Hash evidence files:

   ```powershell
   Get-FileHash .\path\to\evidence-file -Algorithm SHA256
   ```

Do not commit raw evidence, secrets, test credentials, database exports, or
screenshots containing personal information. Store submission-ready evidence
in the location required by the coursework after redaction.

