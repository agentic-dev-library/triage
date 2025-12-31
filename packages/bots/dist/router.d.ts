import { LanguageModel } from 'ai';

/**
 * Bot Router - Routes @mentions to appropriate bot handlers
 */

interface BotContext {
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
interface BotResponse {
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
interface Bot {
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
declare class BotRouter {
    private bots;
    /**
     * Register a bot
     */
    register(bot: Bot): void;
    /**
     * Find the bot that should handle this comment
     */
    findBot(body: string): Bot | undefined;
    /**
     * Extract the query from a comment body
     */
    extractQuery(body: string, bot: Bot): string;
    /**
     * Route a comment to the appropriate bot
     */
    route(ctx: Omit<BotContext, 'query'>): Promise<BotResponse>;
    /**
     * Get all registered bots
     */
    getBots(): Bot[];
    /**
     * Get help text for all bots
     */
    getHelp(): string;
}
/**
 * Create a pre-configured bot router with all triage bots
 */
declare function createBotRouter(): Promise<BotRouter>;

export { type Bot, type BotContext, type BotResponse, BotRouter, createBotRouter };
