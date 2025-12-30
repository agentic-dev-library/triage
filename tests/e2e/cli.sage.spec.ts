/**
 * E2E tests for the CLI sage command
 */

import { test, expect } from '@playwright/test';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

test.describe('CLI: triage sage', () => {
    test('should show help when called with --help', async () => {
        const { stdout } = await execAsync('npx triage sage --help');
        
        expect(stdout).toContain('sage');
        expect(stdout).toContain('question');
    });

    test('should return JSON when called with --json', async () => {
        // Skip if no AI provider configured
        if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY && !process.env.OLLAMA_API_KEY) {
            test.skip();
            return;
        }

        const { stdout } = await execAsync('npx triage sage "What is 2+2?" --json');
        
        const result = JSON.parse(stdout);
        expect(result).toHaveProperty('answer');
    });

    test('should decompose tasks with --decompose flag', async () => {
        if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY && !process.env.OLLAMA_API_KEY) {
            test.skip();
            return;
        }

        const { stdout } = await execAsync('npx triage sage "Build a user dashboard" --decompose --json');
        
        const result = JSON.parse(stdout);
        expect(result).toHaveProperty('subtasks');
        expect(Array.isArray(result.subtasks)).toBe(true);
    });

    test('should route to agent with --route flag', async () => {
        if (!process.env.ANTHROPIC_API_KEY && !process.env.OPENAI_API_KEY && !process.env.OLLAMA_API_KEY) {
            test.skip();
            return;
        }

        const { stdout } = await execAsync('npx triage sage "Fix this bug" --route --json');
        
        const result = JSON.parse(stdout);
        expect(result).toHaveProperty('agent');
        expect(result).toHaveProperty('reason');
    });
});
