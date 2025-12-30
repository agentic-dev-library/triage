import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/schemas/index.ts', 'src/tools/index.ts', 'src/handlers/index.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
});
