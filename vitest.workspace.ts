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
        },
    },
]);
