import { describe, expect, it } from 'vitest';
import { formatForAI, getFailedTests, getLowCoverageFiles, parseTestReport } from '../src/test-results.js';

describe('Test Results', () => {
    const mockReport = {
        version: '1.0',
        timestamp: '2023-01-01T00:00:00Z',
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
                path: 'test1.ts',
                duration: 500,
                tests: [
                    {
                        id: 't1',
                        name: 'test 1',
                        fullName: 'test 1',
                        file: 'test1.ts',
                        status: 'passed',
                        duration: 500,
                    },
                ],
            },
            {
                path: 'test2.ts',
                duration: 500,
                tests: [
                    {
                        id: 't2',
                        name: 'test 2',
                        fullName: 'test 2',
                        file: 'test2.ts',
                        status: 'failed',
                        duration: 500,
                        error: { message: 'Failure' },
                    },
                ],
            },
        ],
        coverage: {
            lines: { total: 100, covered: 50, percentage: 50 },
            functions: { total: 10, covered: 5, percentage: 50 },
            branches: { total: 10, covered: 5, percentage: 50 },
            statements: { total: 100, covered: 50, percentage: 50 },
            files: [
                {
                    path: 'src/file1.ts',
                    lines: { total: 10, covered: 5, percentage: 50 },
                    uncoveredLines: [1, 2, 3, 4, 5],
                    functions: { total: 2, covered: 1, percentage: 50 },
                    uncoveredFunctions: ['func1'],
                },
            ],
        },
    };

    it('parseTestReport should parse valid JSON', () => {
        const json = JSON.stringify(mockReport);
        const report = parseTestReport(json);
        expect(report.version).toBe('1.0');
        expect(report.summary.total).toBe(2);
    });

    it('parseTestReport should throw on invalid version', () => {
        const json = JSON.stringify({ ...mockReport, version: '2.0' });
        expect(() => parseTestReport(json)).toThrow('Unsupported report version: 2.0');
    });

    it('getFailedTests should return only failed tests', () => {
        const report = mockReport as any;
        const failed = getFailedTests(report);
        expect(failed.length).toBe(1);
        expect(failed[0].id).toBe('t2');
    });

    it('getLowCoverageFiles should return files below threshold', () => {
        const report = mockReport as any;
        const low = getLowCoverageFiles(report, 80);
        expect(low.length).toBe(1);
        expect(low[0].path).toBe('src/file1.ts');
    });

    it('formatForAI should generate a readable string', () => {
        const report = mockReport as any;
        const formatted = formatForAI(report);
        expect(formatted).toContain('# Test Report (vitest - unit)');
        expect(formatted).toContain('Failed Tests');
        expect(formatted).toContain('test 2');
        expect(formatted).toContain('Coverage');
    });

    it('formatForAI should handle codeFrame and diff', () => {
        const report = {
            ...mockReport,
            files: [
                {
                    path: 'test.ts',
                    duration: 100,
                    tests: [
                        {
                            id: 't1',
                            name: 't1',
                            fullName: 't1',
                            file: 'test.ts',
                            status: 'failed',
                            duration: 100,
                            error: {
                                message: 'fail',
                                codeFrame: 'code context',
                                diff: '- expected\n+ actual',
                            },
                        },
                    ],
                },
            ],
        } as any;
        const formatted = formatForAI(report);
        expect(formatted).toContain('code context');
        expect(formatted).toContain('**Diff:**');
    });
});
