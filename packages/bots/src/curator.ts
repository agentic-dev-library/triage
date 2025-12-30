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
        if (combined.match(/bug|error|crash|broken|fix|issue|problem|fail/)) {
            type = 'bug';
            labels.push('bug');
            priority = 'high';
            agent = 'cursor';
        } else if (combined.match(/feature|add|implement|create|new|enhance|request/)) {
            type = 'feature';
            labels.push('enhancement');
            agent = 'jules';
        } else if (combined.match(/question|how|what|why|help|confused|\?/)) {
            type = 'question';
            labels.push('question');
            priority = 'low';
            agent = 'sage';
        } else if (combined.match(/doc|readme|typo|spelling|grammar/)) {
            type = 'docs';
            labels.push('documentation');
            priority = 'low';
            agent = 'jules';
        } else if (combined.match(/refactor|clean|organize|improve|performance|optimize/)) {
            type = 'chore';
            labels.push('refactor');
            agent = 'jules';
        }

        // Detect priority
        if (combined.match(/urgent|critical|blocker|asap|production|breaking|p0|p1/)) {
            priority = 'critical';
            labels.push('priority:critical');
        } else if (combined.match(/security|vulnerability|cve|exploit|auth|password/)) {
            priority = 'critical';
            labels.push('security');
        } else if (combined.match(/important|high|soon|p2/)) {
            priority = 'high';
            labels.push('priority:high');
        } else if (combined.match(/low|minor|nice.to.have|p3|p4/)) {
            priority = 'low';
            labels.push('priority:low');
        }

        // Detect effort
        if (combined.match(/quick|simple|small|minor|trivial|one.line|typo/)) {
            effort = 'xs';
            labels.push('good first issue');
        } else if (combined.match(/complex|large|major|overhaul|rewrite|epic/)) {
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
