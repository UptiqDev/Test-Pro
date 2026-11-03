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
| `_build-and-test.yml` | Reusable: builds the Docker image once, runs lint, typecheck, test.   |
| `_push.yml`           | Reusable: stamps `VERSION` on the built image and pushes it to GHCR.  |
| `tag-and-push.yml`    | Manual: cuts `release/x.y.z` + tag `a.b.c.d`, then builds and pushes. |

## Checks

| Job         | Command             |
| ----------- | ------------------- |
| `build`     | `docker build`      |
| `lint`      | `yarn format:check` |
| `typecheck` | `yarn typecheck`    |
| `test`      | `yarn test`         |

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
