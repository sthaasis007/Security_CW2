# Containerization and CI/CD

## Services

Docker Compose runs three services on a private network:

- `frontend`: the Next.js standalone production server on `http://localhost:3000`
- `backend`: the Express API, reachable by the frontend inside the network
- `mongo`: MongoDB with authentication and a persistent named volume

Redis is not included because this project does not currently use Redis.

The frontend and backend use multi-stage Node Alpine builds, run as non-root
users, have read-only root filesystems, drop Linux capabilities, and include
health checks and resource limits. MongoDB is not exposed to the host.

## Local setup

Docker Desktop and Docker Compose v2 or later are required.

1. Copy `.env.docker.example` to `.env.docker`.
2. Replace every placeholder in `.env.docker` with a real value. Never commit
   this file.
3. Create a root `.env` file for Compose interpolation:

   ```dotenv
   MONGO_ROOT_USERNAME=everblue
   MONGO_ROOT_PASSWORD=use-a-long-url-safe-random-password
   ```

Use URL-safe characters for the MongoDB credentials because they are embedded
in the connection URI.

Generate strong application secrets with Node:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Use independent random values for JWT, audit-log integrity, and other keys.
`FIELD_ENCRYPTION_KEY` must be a base64-encoded 32-byte key. Email, CAPTCHA,
Khalti, and encryption secrets stay in `.env.docker` or a production secret
manager; they are never Docker build arguments or image layers.

Validate and start the stack:

```powershell
docker compose config --quiet
docker compose build --pull
docker compose up -d
docker compose ps
```

Check the health endpoints:

```powershell
Invoke-WebRequest http://localhost:3000/healthz
docker compose exec backend wget -qO- http://127.0.0.1:5000/healthz
```

View logs and stop the stack:

```powershell
docker compose logs --tail 100 frontend backend
docker compose down
```

`docker compose down` preserves named data volumes. Adding `--volumes`
permanently removes MongoDB and upload data, so only use it intentionally.

To select a different backend environment file, set `BACKEND_ENV_FILE` before
running Compose. In production, provide secrets through the deployment
platform's secret manager, set the frontend URL to its HTTPS origin, and leave
`KHALTI_TEST_MODE=false`.

## Image behavior

The frontend is built with `BACKEND_INTERNAL_URL=http://backend:5000`, so its
same-origin `/api` and `/uploads` rewrites use the private Compose network.
Only port 3000 is published to the host. The API and database remain reachable
only on the private container network.

Runtime images contain only compiled output and production dependencies.
`.dockerignore` files exclude source-control metadata, dependency folders,
build output, logs, uploads, and environment files.

## CI/CD security checks

Pull requests and pushes to `main` or `master` run:

- reproducible `npm ci` installs for frontend and backend;
- production dependency audits that fail on high or critical findings;
- frontend linting and frontend/backend TypeScript checks;
- backend security tests plus frontend and backend production builds;
- Docker image builds and Compose configuration validation;
- Gitleaks secret scanning;
- GitHub CodeQL JavaScript/TypeScript static analysis.

The workflow fails on install failures, lint errors, type errors, failed tests,
failed builds, high-severity production dependency findings, discovered
secrets, invalid Compose configuration, or failed image builds. CodeQL reports
findings to GitHub code scanning for review and branch-protection enforcement.

Configure branch protection and require the security and CodeQL checks before
merging. Dependabot monitors npm, GitHub Actions, and both Dockerfiles weekly.

Run the main checks locally with:

```powershell
npm ci
npm audit --omit=dev --audit-level=high
npm run lint
npm run typecheck
npm run build

Set-Location backend
npm ci
npm audit --omit=dev --audit-level=high
npm run typecheck
npm test
npm run build
```
