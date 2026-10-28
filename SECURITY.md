# Security Policy

## Scope
The project is in its early scaffold stage. The intended application is a local-first browser game that may import user-created JSON challenge files.

## Reporting a vulnerability
Please do not publish exploit details in a public issue if they could affect users. Use GitHub's private vulnerability reporting feature if enabled for this repository. If unavailable, contact the repository maintainer privately through the contact method listed on the GitHub profile.

Include the affected version or commit, steps to reproduce, impact, and a suggested mitigation where possible. Do not attach real credentials or other sensitive data.

## Design requirements
- Treat imported challenge files as untrusted input.
- Validate schema, types, sizes, and supported rule operations.
- Never execute arbitrary code contained in challenge data.
- Bound simulation steps and solver work to avoid runaway computation.
- Avoid collecting personal data or sending challenge contents to external services by default.