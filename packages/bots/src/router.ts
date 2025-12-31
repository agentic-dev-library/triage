/**
 * Bot Router - Routes @mentions to appropriate bot handlers
 */

import type { LanguageModel } from 'ai';

export interface BotContext {
    /** The full comment body */
    body: string;
    /** Extracted query (text after the @mention) */
    query: string;
    /** Issue or PR number */
    number: number;
    /** Whether this is a PR (vs issue) */
    isPR: boolean;
    /** Repository owner */
    owner: string;
    /** Repository name */
    repo: string;
    /** Comment author */
    author: string;
    /** AI model to use */
    model?: LanguageModel;
    /** GitHub token */
    token?: string;
}

export interface BotResponse {
    /** Response body (markdown) */
    body: string;
    /** Whether to post as a new comment */
    postComment?: boolean;
    /** Labels to add */
    addLabels?: string[];
    /** Labels to remove */
    removeLabels?: string[];
    /** Assignees to add */
    addAssignees?: string[];
    /** Whether the bot handled the request */
    handled: boolean;
    /** Error message if any */
    error?: string;
}

export interface Bot {
    /** Bot name (e.g., 'sage', 'curator') */
    name: string;
    /** Mention triggers (e.g., ['@sage', '/sage']) */
    triggers: string[];
    /** Handle a mention */
    handle(ctx: BotContext): Promise<BotResponse>;
}

/**
 * Bot Registry and Router
 */
export class BotRouter {
    private bots: Map<string, Bot> = new Map();

    /**
     * Register a bot
     */
    register(bot: Bot): void {
        this.bots.set(bot.name, bot);
    }

    /**
     * Find the bot that should handle this comment
     */
    findBot(body: string): Bot | undefined {
        const lowerBody = body.toLowerCase();

        for (const bot of this.bots.values()) {
            for (const trigger of bot.triggers) {
                if (lowerBody.includes(trigger.toLowerCase())) {
                    return bot;
                }
            }
        }

        return undefined;
    }

    /**
     * Extract the query from a comment body
     */
    extractQuery(body: string, bot: Bot): string {
        let query = body;

        // Remove the trigger
        for (const trigger of bot.triggers) {
            const regex = new RegExp(trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            query = query.replace(regex, '');
        }

        return query.trim();
    }

    /**
     * Route a comment to the appropriate bot
     */
    async route(ctx: Omit<BotContext, 'query'>): Promise<BotResponse> {
        const bot = this.findBot(ctx.body);

        if (!bot) {
            return {
                body: '',
                handled: false,
            };
        }

        const query = this.extractQuery(ctx.body, bot);

        try {
            return await bot.handle({ ...ctx, query });
        } catch (error) {
            return {
                body: `❌ **@${bot.name}** encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                handled: true,
                postComment: true,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    /**
     * Get all registered bots
     */
    getBots(): Bot[] {
        return Array.from(this.bots.values());
    }

    /**
     * Get help text for all bots
     */
    getHelp(): string {
        const lines = ['## 🤖 Available Bots\n'];

        for (const bot of this.bots.values()) {
            lines.push(`### @${bot.name}`);
            lines.push(`Triggers: ${bot.triggers.map((t) => `\`${t}\``).join(', ')}\n`);
        }

        return lines.join('\n');
    }
}

/**
 * Create a pre-configured bot router with all triage bots
 */
export async function createBotRouter(): Promise<BotRouter> {
    const router = new BotRouter();

    // Dynamically import bots to avoid circular dependencies
    const { SageBot } = await import('./sage.js');
    const { CuratorBot } = await import('./curator.js');
    const { FixerBot } = await import('./fixer.js');
    const { HarvesterBot } = await import('./harvester.js');
    const { GuardianBot } = await import('./guardian.js');

    router.register(new SageBot());
    router.register(new CuratorBot());
    router.register(new FixerBot());
    router.register(new HarvesterBot());
    router.register(new GuardianBot());

    return router;
}
