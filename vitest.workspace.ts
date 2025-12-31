import { defineWorkspace } from 'vitest/config';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineWorkspace([
    // Unit tests for each package
    'packages/*/vitest.config.ts',
    
    // Integration tests
    {
        test: {
            name: 'integration',
            root: './tests/integration',
            environment: 'node',
            include: ['**/*.test.ts'],
            setupFiles: ['./setup.ts'],
            alias: {
                '@agentic/triage-core': resolve(__dirname, 'packages/core/src'),
                '@agentic/triage-ai': resolve(__dirname, 'packages/ai/src'),
                '@agentic/triage-bots': resolve(__dirname, 'packages/bots/src'),
                '@agentic/triage-trackers': resolve(__dirname, 'packages/trackers/src'),
                '@agentic/triage-cli': resolve(__dirname, 'packages/cli/src'),
            },
            coverage: {
                provider: 'v8',
                reporter: ['text', 'lcov', 'json'],
                reportsDirectory: '../../coverage',
            },
        },
    },
]);
