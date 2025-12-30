import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/e2e-results.json' }],
    ],
    use: {
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'cli',
            testMatch: /cli\..*\.spec\.ts/,
        },
        {
            name: 'github-action',
            testMatch: /action\..*\.spec\.ts/,
        },
    ],
});
