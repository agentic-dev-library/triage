import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/github.ts', 'src/jira.ts', 'src/linear.ts', 'src/beads.ts', 'src/octokit.ts', 'src/mcp.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
});
