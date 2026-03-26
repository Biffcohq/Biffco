---
description: "Onboard a new developer to the BIFFCO project in < 10 minutes"
---

# Dev Setup

Set up the BIFFCO development environment from scratch.

## Steps

1. Verify prerequisites are installed:
```bash
node --version    # must be v22+
pnpm --version    # must be 9.x
git --version     # must be 2.40+
docker --version  # must be 4.x
doppler --version # must be 3.x
```

2. Clone and enter the repo:
```bash
git clone git@github.com:biffco-co/biffco.git && cd biffco
```

3. Run the automated setup:
```bash
./scripts/setup.sh
```

4. Verify all checks pass (PostGIS, trigger, ESLint invariant, build).

5. Start developing:
```bash
doppler run -- pnpm dev
```

6. If setup.sh takes > 10 minutes or fails → it's a P0 bug.
