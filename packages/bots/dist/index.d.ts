export { SageBot } from './sage.js';
export { CuratorBot } from './curator.js';
export { FixerBot } from './fixer.js';
export { HarvesterBot } from './harvester.js';
export { GuardianBot } from './guardian.js';
import { BotResponse } from './router.js';
export { Bot, BotContext, BotRouter, createBotRouter } from './router.js';
import { LanguageModel } from 'ai';

/**
 * Webhook Handler - Process GitHub webhook events and route to bots
 */

interface WebhookEvent {
    action: string;
    issue?: {
        number: number;
        title: string;
        body: string;
        pull_request?: unknown;
    };
    pull_request?: {
        number: number;
        title: string;
        body: string;
    };
    comment?: {
        body: string;
        user: {
            login: string;
        };
    };
    repository: {
        name: string;
        owner: {
            login: string;
        };
    };
    sender: {
        login: string;
    };
}
interface WebhookHandlerOptions {
    /** AI model to use for responses */
    model?: LanguageModel;
    /** GitHub token for API calls */
    token?: string;
    /** Whether to actually post comments (false for testing) */
    dryRun?: boolean;
}
declare class WebhookHandler {
    private options;
    constructor(options?: WebhookHandlerOptions);
    /**
     * Handle an incoming webhook event
     */
    handle(event: WebhookEvent): Promise<BotResponse | null>;
    /**
     * Verify webhook signature (for production use)
     */
    static verifySignature(payload: string, signature: string, secret: string): boolean;
}
/**
 * Create a simple HTTP server for webhooks (for testing/local dev)
 */
declare function createWebhookServer(port: number, options?: WebhookHandlerOptions): Promise<void>;

export { BotResponse, type WebhookEvent, WebhookHandler, type WebhookHandlerOptions, createWebhookServer };
