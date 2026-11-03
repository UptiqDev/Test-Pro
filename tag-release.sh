#!/bin/bash
set -e

# GitHub Actions release script (used by .github/workflows/tag-and-push.yml).
# Inputs (env): RELEASE=a.b.c.d, SOURCE_BRANCH (default main)

if [ "$RELEASE" == "" ]; then
    echo "RELEASE env variable must be set."
    exit 1
fi

if ! [[ "$RELEASE" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "RELEASE env variable is not in proper format a.b.c.d"
    exit 2
fi

RELEASE_BRANCH="release/$(echo "$RELEASE" | grep -oE '^[0-9]+\.[0-9]+\.[0-9]+')"
SOURCE_BRANCH="${SOURCE_BRANCH:-main}"
echo "[test-pro] Release $RELEASE from $SOURCE_BRANCH via $RELEASE_BRANCH"

git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'

git fetch origin '+refs/heads/*:refs/remotes/origin/*'
git fetch origin --tags

if git rev-parse -q --verify "refs/tags/$RELEASE" >/dev/null; then
    echo "Tag $RELEASE already exists."
    exit 3
fi

git checkout -B "$SOURCE_BRANCH" "origin/$SOURCE_BRANCH"

# Create the release branch, or fast-forward it to the source branch so tags
# are always on the latest code. A non-fast-forward is rejected by git push.
echo "[test-pro] Pushing $SOURCE_BRANCH to $RELEASE_BRANCH"
git push origin "HEAD:refs/heads/$RELEASE_BRANCH"

git tag -a "$RELEASE" -m "Release $RELEASE"
git push origin "$RELEASE"
echo "[test-pro] Tagged $RELEASE"
