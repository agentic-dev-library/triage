# Active Context

## Current Status

Part of the jbcom multi-organization ecosystem.

See control-center for ecosystem-wide documentation.

## Session: 2025-12-31
- Fixed CI failure in PR #93 caused by Vitest v4 upgrade.
- Updated `src/reporters/vitest.ts` to use new Vitest v4 type names (`RunnerTestFile`, `RunnerTask`) and imports from `vitest/node`.
- Verified fix with `pnpm run build` and `pnpm run test`.
