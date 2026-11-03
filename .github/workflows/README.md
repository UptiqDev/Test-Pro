# CI/CD Pipeline

What happens in `.github/workflows/`. Modelled on `alpha-cash-backend`, but
images go to GitHub Container Registry (ghcr.io) so no secrets are needed.

## At a glance

```
push / PR to any branch ──► pipeline.yml
                               build-and-test ──► push_dev   (main only)
                                                      image tag: 8f3c2a1b9d4e

manual run ───────────────► tag-and-push.yml
                               create-tag ──► build-and-test ──► push_release
                                                      image tag: 1.0.0.0
```

Both paths run the same build and checks, and push to the same image. The only
difference is the tag.

## Files

| File                  | What it does                                                          |
| --------------------- | --------------------------------------------------------------------- |
| `pipeline.yml`        | Runs on every push and PR. Pushes an image only for pushes to `main`. |
| `_build-and-test.yml` | Reusable: checks, security scans, Docker build, vulnerability report. |
| `_push.yml`           | Reusable: stamps `VERSION` on the built image and pushes it to GHCR.  |
| `tag-and-push.yml`    | Manual: cuts `release/x.y.z` + tag `a.b.c.d`, then builds and pushes. |

## Stage order

```
Stage 1 (parallel)        Stage 2   Stage 3              Stage 4               Stage 5
lint ────────────────┐
typecheck ───────────┤
test ────────────────┤
dependency_scanning ─┼──► build ──► container_scanning ──► vulnerability_report ──► push_dev
secret_detection ────┤                                                              (main only)
sast ────────────────┘
```

| Stage | Jobs                                                                           | Why here                                                                         |
| ----- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| 1     | `lint`, `typecheck`, `test`, `dependency_scanning`, `secret_detection`, `sast` | Only need the source code, so they run together for fast feedback                |
| 2     | `build`                                                                        | Slowest job (~1m20s); only runs once stage 1 is done, so broken code isn't built |
| 3     | `container_scanning`                                                           | Needs the image from `build`                                                     |
| 4     | `vulnerability_report`                                                         | Combines the four scans into one downloadable artifact                           |
| 5     | `push_dev` / `push_release`                                                    | Waits for all of the above                                                       |

**What blocks the push:** `lint`, `typecheck`, `test` or `build` failing.
**What doesn't:** security findings or a scanner error. Scans are report-only
(`continue-on-error`); read the **vulnerability-report** artifact on the run.

## Checks

| Job                    | Command / tool                          |
| ---------------------- | --------------------------------------- |
| `lint`                 | `yarn format:check`                     |
| `typecheck`            | `yarn typecheck`                        |
| `test`                 | `yarn test`                             |
| `dependency_scanning`  | Trivy `fs` on lockfiles                 |
| `secret_detection`     | Gitleaks on full git history            |
| `sast`                 | Semgrep `p/default` + `p/typescript`    |
| `build`                | `docker build`                          |
| `container_scanning`   | Trivy on the built image                |
| `vulnerability_report` | Combines scans → `vulnerability-report` |

Full details: [docs/github-vulnerability-report.md](../../docs/github-vulnerability-report.md).

## Image

```
ghcr.io/<owner>/<repo>:<short-sha>     # every merge to main
ghcr.io/<owner>/<repo>:<a.b.c.d>       # every release
```

Published tags are never overwritten: re-running a push for a tag that already
exists is a no-op.

## Releases

Actions → **tag-and-push** → Run workflow → enter a version like `1.0.0.0`.
This pushes the `release/1.0.0` branch and the `1.0.0.0` tag, runs the same
checks against the tag, and pushes `ghcr.io/<owner>/<repo>:1.0.0.0`.

## One-time setup

- Settings → Actions → General → Workflow permissions: **Read and write**
  (needed for `tag-and-push` to push the tag and release branch).
- First image push creates a **private** package under the org. Change its
  visibility under the package's settings if needed.
