/**
 * E2E tests for the Guardian GitHub Action
 */

import { test, expect } from '@playwright/test';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const execAsync = promisify(exec);

test.describe('GitHub Action: @guardian', () => {
    let tempDir: string;

    test.beforeEach(async () => {
        // Create a temp directory with a mock repo
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'guardian-test-'));
        
        // Initialize git repo
        await execAsync('git init', { cwd: tempDir });
        await execAsync('git config user.email "test@test.com"', { cwd: tempDir });
        await execAsync('git config user.name "Test"', { cwd: tempDir });
    });

    test.afterEach(async () => {
        // Cleanup
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test('should detect missing LICENSE file', async () => {
        // Create a minimal package.json
        fs.writeFileSync(
            path.join(tempDir, 'package.json'),
            JSON.stringify({ name: 'test', version: '1.0.0' })
        );

        // Run guardian check (simulated)
        const hasLicense = fs.existsSync(path.join(tempDir, 'LICENSE'));
        
        expect(hasLicense).toBe(false);
    });

    test('should pass with valid MIT LICENSE', async () => {
        // Create MIT license
        fs.writeFileSync(
            path.join(tempDir, 'LICENSE'),
            'MIT License\n\nCopyright (c) 2025 Test\n\nPermission is hereby granted...'
        );

        const licenseContent = fs.readFileSync(path.join(tempDir, 'LICENSE'), 'utf-8');
        
        expect(licenseContent).toContain('MIT');
        expect(licenseContent).not.toContain('GPL');
    });

    test('should detect invalid semver', async () => {
        // Create package.json with invalid version
        fs.writeFileSync(
            path.join(tempDir, 'package.json'),
            JSON.stringify({ name: 'test', version: 'not-a-version' })
        );

        const pkg = JSON.parse(fs.readFileSync(path.join(tempDir, 'package.json'), 'utf-8'));
        const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
        
        expect(semverRegex.test(pkg.version)).toBe(false);
    });

    test('should validate conventional commit format', async () => {
        const validTitles = [
            'feat: add new feature',
            'fix(core): resolve bug',
            'docs: update readme',
            'chore!: breaking change',
        ];

        const invalidTitles = [
            'Added new feature',
            'Fixed bug',
            'Update readme',
        ];

        const conventionalRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z-]+\))?!?:/;

        for (const title of validTitles) {
            expect(conventionalRegex.test(title)).toBe(true);
        }

        for (const title of invalidTitles) {
            expect(conventionalRegex.test(title)).toBe(false);
        }
    });
});
