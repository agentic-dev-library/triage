import { defineConfig } from 'tsup';

export default defineConfig({
    entry: [
        'src/index.ts',
        'src/sage.ts',
        'src/curator.ts',
        'src/fixer.ts',
        'src/harvester.ts',
        'src/guardian.ts',
        'src/router.ts',
    ],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
});
