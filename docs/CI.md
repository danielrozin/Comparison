# CI & Deploy

## Production deploy path

**Vercel direct-git integration is the source of truth for production deploys.**

- Every push to `main` is built and deployed by Vercel directly via its GitHub
  integration on the comparison Vercel project. There is no GitHub-Actions step
  in the critical deploy path.
- The production domain (`https://www.aversusb.net`) is served from the latest
  successful Vercel production deployment.
- Verification: open the Vercel dashboard for the comparison project, or check
  the deployment status badge on the latest commit.

See also [`project_aversusb_routing_pitfall`](../memory) for the known caveat
that `aversusb.net` traffic must be smoke-tested against the user-facing domain
itself, not just against the Vercel-internal alias.

## GitHub Actions workflows

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `ci.yml` | push / PR | Lint, type-check, test, build. **Required signal.** |
| `daily-videos.yml` | schedule | Daily video generation cron. |
| `deploy-production.yml` | manual dispatch | **Emergency fallback only.** Not part of the normal deploy path — Vercel direct-git owns that. Requires `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` secrets. |
| `rollback.yml` | manual dispatch | **Emergency fallback only.** Promote a previous Vercel deployment URL. Same secret requirements as above. |

The previous `deploy-staging.yml` workflow was removed in DAN-857: it ran on
every push to `main`, failed every time due to missing Vercel CLI credentials
on the runner, and was not on the deploy path. If a real staging environment
is needed in the future, point a Vercel preview branch at it rather than
re-introducing CLI-based deploys.

## External checks

### Cloudflare Workers / Pages

A `Workers Builds: comparison` check from the *Cloudflare Workers and Pages*
GitHub App posts a status to every commit. The repo has no `wrangler.toml` and
no Cloudflare runtime config — this check is left over from a deprecated
integration and cannot be removed from inside the repo.

**To remove it**, the repo owner must, in the Cloudflare dashboard:

1. Open **Workers & Pages → comparison** (the Workers project linked to this
   repo).
2. Either delete the project, or disconnect its GitHub source under
   *Settings → Builds & deployments*.

Until that is done, treat a red `Workers Builds: comparison` status on `main`
as a known-false signal. Branch protection is **not** enabled on `main`, so
this check does not block merges.

## Secrets

Production-deploy-related secrets are only needed if `deploy-production.yml`
or `rollback.yml` are ever run manually:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

These are not required for normal CI or for normal production deploys.
