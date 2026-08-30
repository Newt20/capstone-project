# Support Chat — Delivery Pipeline

This is the platform-engineering repo for the Support Chat application: a
React/Vite frontend and an Express/Socket.IO backend, delivered through
`dev` → `stage` → `prod` under CI/CD, Docker, Kubernetes, and Argo CD.

Full design rationale, branch topology, trigger rules, and a step-by-step
demo walkthrough are documented separately (`understanding.md`, kept
outside this repo).

## Branches

- `main` — deployment ledger only: `k8s/<env>/<component>/{deployment,service}.yaml`
  and `argocd/*.yaml`. Updated exclusively by CD pipeline bot commits.
- `dev` / `stage` / `prod` — application source (`frontend/`, `backend/`,
  Dockerfiles, `.github/workflows/`). Linear ancestry: `main → dev → stage → prod`.

## Quick reference

| Env | Deploy trigger | Image target | Replicas (fe/be) |
|---|---|---|---|
| dev | Manual (`workflow_dispatch` on `cd-dev.yml`) | `development` | 1 / 1 |
| stage | Manual (`workflow_dispatch` on `cd-stage.yml`) | `production` | 1 / 1 |
| prod | Automatic (PR opened against `prod` triggers `cd-prod.yml`) | `production` | 2 / 1 |

Repo: https://github.com/Newt20/capstone-project

Before the first real `cd-dev`/`cd-stage`/`cd-prod` run, set repo variables
for `VITE_API_URL_DEV`/`VITE_API_URL_STAGE`/`VITE_API_URL_PROD` and their
`VITE_SOCKET_URL_*` counterparts once real backend URLs exist (they default
to `http://localhost:5000` otherwise), and give Actions write permission
under Settings → Actions → General → Workflow permissions (needed to push
image-tag commits to `main` and push images to GHCR).
