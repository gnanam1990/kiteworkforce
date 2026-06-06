# KiteWorkforce Proof of Work

This repository is a public Kite AI project build with source prompts, runnable code, verification commands, a Vercel deployment, and a rendered screenshot.

## Public Links

- GitHub repo: https://github.com/gnanam1990/kiteworkforce
- Live Vercel URL: https://kiteworkforce.vercel.app
- Deployment URL: https://kiteworkforce-k8agdtpsm-gnanam1990s-projects.vercel.app
- Vercel inspect URL: https://vercel.com/gnanam1990s-projects/kiteworkforce/Df1bvWnjVSwy7AsEF6AXGieqX32i
- Vercel deployment ID: `dpl_Df1bvWnjVSwy7AsEF6AXGieqX32i`

## Commit Trail

The visible public history is intentionally split into meaningful work units:

1. `feat: build KiteWorkforce MVP`
2. `chore: add Vercel deployment config`
3. `docs: add deployment proof of work`

## Verification Evidence

Local verification completed before deployment:

```bash
pnpm install --frozen-lockfile=false
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm --filter @kiteworkforce/web build
```

Vercel verification completed during deployment:

- Install command: `pnpm install --frozen-lockfile=false`
- Build command: `pnpm --filter @kiteworkforce/web build`
- Output directory: `packages/web/dist`
- Ready state: `READY`

## Rendered Screenshot

![KiteWorkforce rendered app](./screenshot.jpg)

## Safety Notes

- This is a preview-safe Kite AI application.
- Risky, fund-moving, or wallet actions are clearly approval-first in the product copy and code.
- No official mainnet contract address is invented by this project.
