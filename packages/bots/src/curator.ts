/**
 * @curator Bot - Issue triage, labeling, and assignment
 */

import type { Bot, BotContext, BotResponse } from './router.js';

export class CuratorBot implements Bot {
    name = 'curator';
    triggers = ['@curator', '/curator', '/triage'];

    async handle(ctx: BotContext): Promise<BotResponse> {
        // Curator auto-triages issues
        const analysis = this.analyzeContent(ctx.body, ctx.query);

        const body = this.formatAnalysis(analysis);

        return {
            body,
            handled: true,
            postComment: true,
            addLabels: analysis.labels,
        };
    }

    private analyzeContent(
        body: string,
        query: string
    ): {
        type: string;
        priority: string;
        effort: string;
        agent: string;
        labels: string[];
    } {
        const combined = `${body} ${query}`.toLowerCase();

        let type = 'chore';
        let priority = 'medium';
        let effort = 'm';
        let agent = 'ollama';
        const labels: string[] = [];

        // Detect type
        if (combined.includes('bug') || combined.includes('error') || combined.includes('crash') || combined.includes('broken') || combined.includes('fix') || combined.includes('issue') || combined.includes('problem') || combined.includes('fail')) {
            type = 'bug';
            labels.push('bug');
            priority = 'high';
            agent = 'cursor';
        } else if (combined.includes('feature') || combined.includes('add') || combined.includes('implement') || combined.includes('create') || combined.includes('new') || combined.includes('enhance') || combined.includes('request')) {
            type = 'feature';
            labels.push('enhancement');
            agent = 'jules';
        } else if (combined.includes('question') || combined.includes('how') || combined.includes('what') || combined.includes('why') || combined.includes('help') || combined.includes('confused') || combined.includes('?')) {
            type = 'question';
            labels.push('question');
            priority = 'low';
            agent = 'sage';
        } else if (combined.includes('doc') || combined.includes('readme') || combined.includes('typo') || combined.includes('spelling') || combined.includes('grammar')) {
            type = 'docs';
            labels.push('documentation');
            priority = 'low';
            agent = 'jules';
        } else if (combined.includes('refactor') || combined.includes('clean') || combined.includes('organize') || combined.includes('improve') || combined.includes('performance') || combined.includes('optimize')) {
            type = 'chore';
            labels.push('refactor');
            agent = 'jules';
        }

        // Detect priority
        if (combined.includes('urgent') || combined.includes('critical') || combined.includes('blocker') || combined.includes('asap') || combined.includes('production') || combined.includes('breaking') || combined.includes('p0') || combined.includes('p1')) {
            priority = 'critical';
            labels.push('priority:critical');
        } else if (combined.includes('security') || combined.includes('vulnerability') || combined.includes('cve') || combined.includes('exploit') || combined.includes('auth') || combined.includes('password')) {
            priority = 'critical';
            labels.push('security');
        } else if (combined.includes('important') || combined.includes('high') || combined.includes('soon') || combined.includes('p2')) {
            priority = 'high';
            labels.push('priority:high');
        } else if (combined.includes('low') || combined.includes('minor') || combined.includes('nice.to.have') || combined.includes('p3') || combined.includes('p4')) {
            priority = 'low';
            labels.push('priority:low');
        }

        // Detect effort
        if (combined.includes('quick') || combined.includes('simple') || combined.includes('small') || combined.includes('minor') || combined.includes('trivial') || combined.includes('one.line') || combined.includes('typo')) {
            effort = 'xs';
            labels.push('good first issue');
        } else if (combined.includes('complex') || combined.includes('large') || combined.includes('major') || combined.includes('overhaul') || combined.includes('rewrite') || combined.includes('epic')) {
            effort = 'xl';
            agent = 'cursor';
        }

        return { type, priority, effort, agent, labels };
    }

    private formatAnalysis(analysis: {
        type: string;
        priority: string;
        effort: string;
        agent: string;
        labels: string[];
    }): string {
        const priorityEmoji: Record<string, string> = {
            critical: '🔴',
            high: '🟠',
            medium: '🟡',
            low: '⚪',
        };

        const typeEmoji: Record<string, string> = {
            bug: '🐛',
            feature: '✨',
            question: '❓',
            docs: '📚',
            chore: '🔧',
        };

        return `📋 **@curator** Triage

| Field | Value |
|-------|-------|
| Type | ${typeEmoji[analysis.type] || ''} \`${analysis.type}\` |
| Priority | ${priorityEmoji[analysis.priority] || ''} \`${analysis.priority}\` |
| Effort | \`${analysis.effort}\` |
| Agent | \`@${analysis.agent}\` |

---
_Use \`@${analysis.agent}\` to start work on this issue._`;
    }
}
