import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/github.ts', 'src/jira.ts', 'src/linear.ts', 'src/beads.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
});
