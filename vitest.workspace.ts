import { defineWorkspace } from 'vitest/config';

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
                '@agentic/triage-core': '/workspace/packages/core/src',
                '@agentic/triage-ai': '/workspace/packages/ai/src',
                '@agentic/triage-bots': '/workspace/packages/bots/src',
                '@agentic/triage-trackers': '/workspace/packages/trackers/src',
                '@agentic/triage-cli': '/workspace/packages/cli/src',
            },
            coverage: {
                provider: 'v8',
                reporter: ['text', 'lcov', 'json'],
                reportsDirectory: '../../coverage',
            },
        },
    },
]);
