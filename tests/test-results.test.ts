import { describe, expect, it } from 'vitest';
import {
    formatForAI,
    getFailedTests,
    getLowCoverageFiles,
    getTestsByFile,
    getUncoveredFunctions,
    parseTestReport,
    type TestReport,
} from '../src/test-results.js';

const mockReport: TestReport = {
    version: '1.0',
    timestamp: '2025-12-24T10:00:00Z',
    runner: 'vitest',
    type: 'unit',
    summary: {
        total: 2,
        passed: 1,
        failed: 1,
        skipped: 0,
        duration: 1000,
    },
    files: [
        {
            path: 'src/sum.ts',
            duration: 500,
            tests: [
                {
                    id: 'sum-1',
                    name: 'adds 1 + 2 to equal 3',
                    fullName: 'sum adds 1 + 2 to equal 3',
                    file: 'src/sum.ts',
                    status: 'passed',
                    duration: 10,
                },
                {
                    id: 'sum-2',
                    name: 'adds 2 + 2 to equal 5',
                    fullName: 'sum adds 2 + 2 to equal 5',
                    file: 'src/sum.ts',
                    status: 'failed',
                    duration: 5,
                    error: {
                        message: 'expected 4 to be 5',
                        expected: 5,
                        actual: 4,
                        diff: '- 5\n+ 4',
                    },
                },
            ],
        },
    ],
    coverage: {
        lines: { total: 100, covered: 50, percentage: 50 },
        functions: { total: 10, covered: 5, percentage: 50 },
        branches: { total: 20, covered: 10, percentage: 50 },
        statements: { total: 100, covered: 50, percentage: 50 },
        files: [
            {
                path: 'src/sum.ts',
                lines: { total: 10, covered: 5, percentage: 50 },
                uncoveredLines: [6, 7, 8, 9, 10],
                functions: { total: 2, covered: 1, percentage: 50 },
                uncoveredFunctions: ['untestedFunction'],
            },
        ],
    },
    git: {
        branch: 'main',
        commit: 'abcdef123456',
        message: 'Initial commit',
    },
};

describe('test-results', () => {
    describe('parseTestReport', () => {
        it('should parse valid report', () => {
            const json = JSON.stringify(mockReport);
            const report = parseTestReport(json);
            expect(report.version).toBe('1.0');
            expect(report.summary.total).toBe(2);
        });

        it('should throw error for unsupported version', () => {
            const invalidReport = { ...mockReport, version: '2.0' };
            const json = JSON.stringify(invalidReport);
            expect(() => parseTestReport(json)).toThrow('Unsupported report version: 2.0');
        });
    });

    describe('getFailedTests', () => {
        it('should return failed tests', () => {
            const failed = getFailedTests(mockReport);
            expect(failed).toHaveLength(1);
            expect(failed[0].id).toBe('sum-2');
        });
    });

    describe('getTestsByFile', () => {
        it('should return tests for a specific file', () => {
            const tests = getTestsByFile(mockReport, 'src/sum.ts');
            expect(tests).toHaveLength(2);
        });

        it('should return empty array for non-existent file', () => {
            const tests = getTestsByFile(mockReport, 'non-existent.ts');
            expect(tests).toHaveLength(0);
        });
    });

    describe('getLowCoverageFiles', () => {
        it('should return files below threshold', () => {
            const lowCoverage = getLowCoverageFiles(mockReport, 80);
            expect(lowCoverage).toHaveLength(1);
            expect(lowCoverage[0].path).toBe('src/sum.ts');
        });

        it('should return empty array if no coverage data', () => {
            const reportNoCoverage = { ...mockReport, coverage: undefined };
            const lowCoverage = getLowCoverageFiles(reportNoCoverage, 80);
            expect(lowCoverage).toHaveLength(0);
        });
    });

    describe('getUncoveredFunctions', () => {
        it('should return uncovered functions', () => {
            const uncovered = getUncoveredFunctions(mockReport);
            expect(uncovered).toHaveLength(1);
            expect(uncovered[0].file).toBe('src/sum.ts');
            expect(uncovered[0].functions).toContain('untestedFunction');
        });

        it('should return empty array if no coverage data', () => {
            const reportNoCoverage = { ...mockReport, coverage: undefined };
            const uncovered = getUncoveredFunctions(reportNoCoverage);
            expect(uncovered).toHaveLength(0);
        });
    });

    describe('formatForAI', () => {
        it('should format report for AI analysis', () => {
            const formatted = formatForAI(mockReport);
            expect(formatted).toContain('# Test Report (vitest - unit)');
            expect(formatted).toContain('## Summary');
            expect(formatted).toContain('- Failed: 1 ❌');
            expect(formatted).toContain('## Git Context');
            expect(formatted).toContain('## Failed Tests');
            expect(formatted).toContain('### sum adds 2 + 2 to equal 5');
            expect(formatted).toContain('## Coverage');
            expect(formatted).toContain('- Lines: 50.0%');
        });
    });
});
