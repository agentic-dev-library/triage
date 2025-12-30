/**
 * @sage Bot - Q&A, task decomposition, and agent routing
 */

import type { Bot, BotContext, BotResponse } from './router.js';
import { sage, decomposeTask, routeToAgent, unblock } from '../handlers/sage.js';

export class SageBot implements Bot {
    name = 'sage';
    triggers = ['@sage', '/sage'];

    async handle(ctx: BotContext): Promise<BotResponse> {
        if (!ctx.query) {
            return {
                body: `🔮 **@sage** - How can I help?

Usage:
- \`@sage <question>\` - Ask a question
- \`@sage decompose <task>\` - Break down a task
- \`@sage route <task>\` - Get agent recommendation
- \`@sage unblock <blocker>\` - Get help with a blocker`,
                handled: true,
                postComment: true,
            };
        }

        const query = ctx.query.toLowerCase();

        try {
            let result: any;
            let responseBody: string;

            if (query.startsWith('decompose ')) {
                const task = ctx.query.replace(/^decompose\s+/i, '');
                if (ctx.model) {
                    result = await decomposeTask(task, ctx.model);
                    responseBody = this.formatDecomposition(result);
                } else {
                    responseBody = '❌ No AI model configured for decomposition';
                }
            } else if (query.startsWith('route ')) {
                const task = ctx.query.replace(/^route\s+/i, '');
                if (ctx.model) {
                    result = await routeToAgent(task, ctx.model);
                    responseBody = this.formatRouting(result);
                } else {
                    responseBody = '❌ No AI model configured for routing';
                }
            } else if (query.startsWith('unblock ')) {
                const blocker = ctx.query.replace(/^unblock\s+/i, '');
                if (ctx.model) {
                    result = await unblock(blocker, ctx.model);
                    responseBody = this.formatUnblock(result);
                } else {
                    responseBody = '❌ No AI model configured for unblock';
                }
            } else {
                // Default: answer question
                if (ctx.model) {
                    result = await sage(ctx.query, ctx.model);
                    responseBody = this.formatAnswer(result);
                } else {
                    // Fallback to pattern-based response
                    responseBody = this.patternBasedResponse(ctx.query);
                }
            }

            return {
                body: responseBody,
                handled: true,
                postComment: true,
            };
        } catch (error) {
            return {
                body: `❌ **@sage** error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                handled: true,
                postComment: true,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    private formatAnswer(result: any): string {
        let body = `🔮 **@sage**\n\n${result.answer || result}`;

        if (result.agentRecommendation) {
            body += `\n\n📌 **Recommended**: \`@${result.agentRecommendation.agent}\``;
            body += `\n_${result.agentRecommendation.reason}_`;
        }

        if (result.confidence) {
            body += `\n\n_(Confidence: ${Math.round(result.confidence * 100)}%)_`;
        }

        return body;
    }

    private formatDecomposition(result: any): string {
        let body = '📋 **@sage** Task Decomposition\n\n';

        if (result.subtasks) {
            for (const task of result.subtasks) {
                body += `### ${task.id}: ${task.title}\n`;
                body += `- **Agent**: \`@${task.agent}\`\n`;
                body += `- **Priority**: ${task.priority}\n`;
                body += `- **Effort**: ${task.effort}\n`;
                body += `- ${task.description}\n\n`;
            }
        }

        return body;
    }

    private formatRouting(result: any): string {
        let body = '🎯 **@sage** Agent Routing\n\n';
        body += `**Recommended Agent**: \`@${result.agent}\`\n\n`;
        body += `**Reason**: ${result.reason}\n\n`;
        body += `**Instructions**: ${result.instructions}\n\n`;
        body += `_(Confidence: ${Math.round(result.confidence * 100)}%)_`;

        return body;
    }

    private formatUnblock(result: any): string {
        let body = '🔓 **@sage** Unblock Analysis\n\n';
        body += `**Diagnosis**: ${result.diagnosis}\n\n`;
        body += `**Root Cause**: ${result.rootCause}\n\n`;
        body += `⚡ **Immediate Action**: ${result.immediateAction}\n\n`;

        if (result.needsHuman) {
            body += `⚠️ **Human intervention required**: ${result.escalationReason}\n`;
        }

        return body;
    }

    private patternBasedResponse(query: string): string {
        // Simple pattern matching when no LLM is available
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('how') && lowerQuery.includes('test')) {
            return `🔮 **@sage**

To run tests, typically use:
- \`npm test\` or \`pnpm test\` for Node.js
- \`pytest\` for Python
- \`go test ./...\` for Go

Check the project's README or package.json for specific test commands.`;
        }

        if (lowerQuery.includes('deploy') || lowerQuery.includes('release')) {
            return `🔮 **@sage**

For deployments:
1. Ensure all tests pass
2. Update version using conventional commits
3. Create a release PR
4. Merge and let CI handle the release

Check \`.github/workflows/\` for specific deployment workflows.`;
        }

        return `🔮 **@sage**

I can help with:
- \`@sage <question>\` - Ask me anything
- \`@sage decompose <task>\` - Break down into subtasks
- \`@sage route <task>\` - Get the best agent for the job
- \`@sage unblock <issue>\` - Get help with blockers

_(AI-powered responses require model configuration)_`;
    }
}
