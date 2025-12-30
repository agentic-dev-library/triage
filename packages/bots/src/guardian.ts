/**
 * @guardian Bot - Enterprise standards enforcement
 */

import type { Bot, BotContext, BotResponse } from './router.js';

interface Violation {
    check: string;
    status: 'pass' | 'fail' | 'skip';
    details?: string;
}

export class GuardianBot implements Bot {
    name = 'guardian';
    triggers = ['@guardian', '/guardian', '/standards', '/lint-pr'];

    // Configurable settings
    private allowedLicenses = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC', 'Unlicense'];
    private forbiddenLicenses = ['GPL', 'LGPL', 'AGPL', 'SSPL', 'Commons-Clause'];
    private requiredFiles = ['LICENSE', 'README.md'];

    async handle(ctx: BotContext): Promise<BotResponse> {
        const query = ctx.query.toLowerCase().trim();

        if (query === 'help' || query === '') {
            return this.handleHelp();
        }

        // Run all checks
        const violations = await this.runChecks(ctx);

        return {
            body: this.formatReport(violations),
            handled: true,
            postComment: true,
        };
    }

    private async runChecks(_ctx: BotContext): Promise<Violation[]> {
        const violations: Violation[] = [];

        // SHA Pinning (would need file access)
        violations.push({
            check: 'sha-pinning',
            status: 'skip',
            details: 'Requires repository checkout',
        });

        // Conventional Commits (can check from context)
        // In a real implementation, we'd check the PR title
        violations.push({
            check: 'conventional-commits',
            status: 'skip',
            details: 'Requires PR title access',
        });

        // License
        violations.push({
            check: 'license',
            status: 'skip',
            details: 'Requires file access',
        });

        // Semver
        violations.push({
            check: 'semver',
            status: 'skip',
            details: 'Requires package.json access',
        });

        // Changelog
        violations.push({
            check: 'changelog',
            status: 'skip',
            details: 'Requires file access',
        });

        return violations;
    }

    private formatReport(violations: Violation[]): string {
        const passCount = violations.filter((v) => v.status === 'pass').length;
        const failCount = violations.filter((v) => v.status === 'fail').length;
        const skipCount = violations.filter((v) => v.status === 'skip').length;

        let body = `🛡️ **@guardian** Enterprise Standards Check

**Results**: ${passCount} passed, ${failCount} failed, ${skipCount} skipped

| Check | Status | Details |
|-------|--------|---------|`;

        for (const v of violations) {
            const statusEmoji = v.status === 'pass' ? '✅' : v.status === 'fail' ? '❌' : '⏭️';
            body += `\n| ${v.check} | ${statusEmoji} | ${v.details || '-'} |`;
        }

        if (failCount > 0) {
            body += '\n\n---\n⚠️ **Action Required**: Fix the failing checks before merge.';
        } else if (skipCount === violations.length) {
            body += `\n\n---\n_Run as a GitHub Action for full checks._`;
        }

        return body;
    }

    private handleHelp(): BotResponse {
        return {
            body: `🛡️ **@guardian** - Enterprise Standards Enforcement

## Checks

| Check | Description |
|-------|-------------|
| \`sha-pinning\` | GitHub Actions pinned to exact SHAs |
| \`conventional-commits\` | PR titles follow conventional commit format |
| \`license\` | MIT license, no GPL/LGPL |
| \`semver\` | Valid semantic versioning |
| \`changelog\` | CHANGELOG.md exists and is updated |
| \`branch-naming\` | Branch follows naming convention |
| \`required-files\` | Required files exist (LICENSE, README) |

## Usage

- \`@guardian\` - Run all checks
- \`@guardian check sha-pinning\` - Run specific check
- \`@guardian help\` - Show this help

## Allowed Licenses

${this.allowedLicenses.map((l) => `\`${l}\``).join(', ')}

## Forbidden Licenses

${this.forbiddenLicenses.map((l) => `\`${l}\``).join(', ')}`,
            handled: true,
            postComment: true,
        };
    }
}
