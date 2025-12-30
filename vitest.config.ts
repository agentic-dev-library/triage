import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json', 'html'],
            reportsDirectory: './coverage',
            include: [
                'packages/*/src/**/*.ts',
            ],
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/*.test.ts',
                '**/*.spec.ts',
            ],
            // Thresholds - start low, increase over time
            thresholds: {
                lines: 50,
                functions: 50,
                branches: 50,
                statements: 50,
            },
        },
    },
});
