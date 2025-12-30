/**
 * Unit tests for GuardianBot
 */

import { describe, it, expect } from 'vitest';

describe('GuardianBot Checks', () => {
    describe('Conventional Commits', () => {
        const conventionalRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z-]+\))?!?:/;

        it('should accept valid conventional commit formats', () => {
            const validFormats = [
                'feat: add new feature',
                'fix: resolve bug',
                'docs: update readme',
                'feat(core): add module',
                'fix(api)!: breaking change',
                'chore: update deps',
            ];

            for (const format of validFormats) {
                expect(conventionalRegex.test(format)).toBe(true);
            }
        });

        it('should reject invalid formats', () => {
            const invalidFormats = [
                'Add new feature',
                'Fixed the bug',
                'Update readme',
                'feat add feature', // missing colon
                'Feature: add thing', // wrong type
            ];

            for (const format of invalidFormats) {
                expect(conventionalRegex.test(format)).toBe(false);
            }
        });
    });

    describe('Semver Validation', () => {
        const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;

        it('should accept valid semver versions', () => {
            const validVersions = [
                '1.0.0',
                '0.1.0',
                '10.20.30',
                '1.0.0-alpha',
                '1.0.0-alpha.1',
                '1.0.0-beta+build.123',
                '1.0.0+20231225',
            ];

            for (const version of validVersions) {
                expect(semverRegex.test(version)).toBe(true);
            }
        });

        it('should reject invalid versions', () => {
            const invalidVersions = [
                '1.0',
                'v1.0.0',
                '1.0.0.0',
                'latest',
                '1.x.0',
            ];

            for (const version of invalidVersions) {
                expect(semverRegex.test(version)).toBe(false);
            }
        });
    });

    describe('License Detection', () => {
        const forbiddenLicenses = ['GPL', 'LGPL', 'AGPL', 'SSPL'];
        const allowedLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC'];

        it('should detect forbidden licenses', () => {
            const gplLicense = 'GNU General Public License';
            
            const hasForbidden = forbiddenLicenses.some(l => 
                gplLicense.toUpperCase().includes(l)
            );
            
            expect(hasForbidden).toBe(true);
        });

        it('should allow MIT license', () => {
            const mitLicense = 'MIT License';
            
            const hasForbidden = forbiddenLicenses.some(l => 
                mitLicense.toUpperCase().includes(l)
            );
            
            expect(hasForbidden).toBe(false);
        });
    });

    describe('SHA Pinning Detection', () => {
        const shaRegex = /@[a-f0-9]{40}/;
        const versionTagRegex = /@v\d+(\.\d+)?(\.\d+)?$/;

        it('should detect SHA-pinned actions', () => {
            const pinnedAction = 'uses: actions/checkout@8e8c483db84b4bee98b60c0593521ed34d9990e8';
            
            expect(shaRegex.test(pinnedAction)).toBe(true);
        });

        it('should detect unpinned actions', () => {
            const unpinnedAction = 'uses: actions/checkout@v4';
            
            expect(shaRegex.test(unpinnedAction)).toBe(false);
            expect(versionTagRegex.test(unpinnedAction)).toBe(true);
        });
    });
});
