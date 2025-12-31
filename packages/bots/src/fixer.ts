/**
 * @fixer Bot - CI failure analysis and fix suggestions
 */

import type { Bot, BotContext, BotResponse } from './router.js';

export class FixerBot implements Bot {
    name = 'fixer';
    triggers = ['@fixer', '/fixer', '/fix'];

    async handle(ctx: BotContext): Promise<BotResponse> {
        if (!ctx.isPR) {
            return {
                body: `🔧 **@fixer** works best on Pull Requests with CI failures.

Use on a PR to analyze failing checks.`,
                handled: true,
                postComment: true,
            };
        }

        // Analyze the query or issue body for error patterns
        const analysis = this.analyzeErrors(ctx.body, ctx.query);

        return {
            body: this.formatAnalysis(analysis),
            handled: true,
            postComment: true,
        };
    }

    private analyzeErrors(
        body: string,
        query: string
    ): {
        diagnosis: string;
        fix: string;
        severity: string;
        canAutoFix: boolean;
        commands: string[];
    } {
        const combined = `${body} ${query}`.toLowerCase();
        const _commands: string[] = [];

        // TypeScript errors
        if (combined.match(/type.*error|typescript|ts\d{4}|cannot find name/)) {
            return {
                diagnosis: 'TypeScript type errors detected',
                fix: 'Fix type annotations and imports',
                severity: 'high',
                canAutoFix: true,
                commands: ['pnpm typecheck', 'pnpm lint:fix'],
            };
        }

        // Linting errors
        if (combined.match(/eslint|lint|biome|prettier|formatting/)) {
            return {
                diagnosis: 'Linting/formatting errors detected',
                fix: 'Run the linter with auto-fix',
                severity: 'medium',
                canAutoFix: true,
                commands: ['pnpm lint:fix', 'pnpm format'],
            };
        }

        // Test failures
        if (combined.match(/test.*fail|expect|assert|vitest|jest|pytest/)) {
            return {
                diagnosis: 'Test failures detected',
                fix: 'Review and fix failing tests',
                severity: 'high',
                canAutoFix: false,
                commands: ['pnpm test', 'pnpm test:coverage'],
            };
        }

        // Build errors
        if (combined.match(/build.*fail|compile|bundle|webpack|vite|tsup/)) {
            return {
                diagnosis: 'Build errors detected',
                fix: 'Fix compilation issues',
                severity: 'high',
                canAutoFix: false,
                commands: ['pnpm build'],
            };
        }

        // Module not found
        if (combined.match(/cannot find module|module not found|import.*error/)) {
            return {
                diagnosis: 'Missing dependencies or imports',
                fix: 'Install dependencies and check import paths',
                severity: 'high',
                canAutoFix: true,
                commands: ['pnpm install', 'pnpm build'],
            };
        }

        // Permission errors
        if (combined.match(/permission denied|eacces|eperm/)) {
            return {
                diagnosis: 'Permission issues',
                fix: 'Check file permissions or CI configuration',
                severity: 'medium',
                canAutoFix: false,
                commands: [],
            };
        }

        // Timeout
        if (combined.match(/timeout|timed out|deadline exceeded/)) {
            return {
                diagnosis: 'Timeout error',
                fix: 'Optimize slow operations or increase timeout',
                severity: 'medium',
                canAutoFix: false,
                commands: [],
            };
        }

        // Memory
        if (combined.match(/out of memory|heap|oom|memory limit/)) {
            return {
                diagnosis: 'Memory limit exceeded',
                fix: 'Optimize memory usage or increase limits',
                severity: 'high',
                canAutoFix: false,
                commands: [],
            };
        }

        return {
            diagnosis: 'CI failure - requires investigation',
            fix: 'Review the full logs for details',
            severity: 'medium',
            canAutoFix: false,
            commands: ['gh run view --log-failed'],
        };
    }

    private formatAnalysis(analysis: {
        diagnosis: string;
        fix: string;
        severity: string;
        canAutoFix: boolean;
        commands: string[];
    }): string {
        const severityEmoji: Record<string, string> = {
            critical: '🔴',
            high: '🟠',
            medium: '🟡',
            low: '⚪',
        };

        let body = `🔧 **@fixer** CI Analysis

${severityEmoji[analysis.severity] || '⚪'} **Diagnosis**: ${analysis.diagnosis}

💡 **Suggested Fix**: ${analysis.fix}`;

        if (analysis.commands.length > 0) {
            body += '\n\n**Try these commands**:\n```bash\n';
            body += analysis.commands.join('\n');
            body += '\n```';
        }

        if (analysis.canAutoFix) {
            body += '\n\n✅ This can likely be auto-fixed. Use `@cascade fix` to attempt.';
        }

        return body;
    }
}
