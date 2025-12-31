/**
 * Webhook Handler - Process GitHub webhook events and route to bots
 */

import type { LanguageModel } from 'ai';
import { createBotRouter, type BotContext, type BotResponse } from './router.js';
import { commentOnIssue, commentOnPR } from '@agentic/triage-trackers';

export interface WebhookEvent {
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

export interface WebhookHandlerOptions {
    /** AI model to use for responses */
    model?: LanguageModel;
    /** GitHub token for API calls */
    token?: string;
    /** Whether to actually post comments (false for testing) */
    dryRun?: boolean;
}

export class WebhookHandler {
    private options: WebhookHandlerOptions;

    constructor(options: WebhookHandlerOptions = {}) {
        this.options = options;
    }

    /**
     * Handle an incoming webhook event
     */
    async handle(event: WebhookEvent): Promise<BotResponse | null> {
        // Only handle issue_comment and pull_request_review_comment events
        if (event.action !== 'created' || !event.comment) {
            return null;
        }

        const body = event.comment.body;

        // Create router
        const router = await createBotRouter();

        // Check if any bot should handle this
        const bot = router.findBot(body);
        if (!bot) {
            return null;
        }

        // Build context
        const isPR = !!event.issue?.pull_request || !!event.pull_request;
        const number = event.issue?.number || event.pull_request?.number || 0;

        const ctx: Omit<BotContext, 'query'> = {
            body,
            number,
            isPR,
            owner: event.repository.owner.login,
            repo: event.repository.name,
            author: event.sender.login,
            model: this.options.model,
            token: this.options.token,
        };

        // Route to bot
        const response = await router.route(ctx);

        // Post comment if requested
        if (response.handled && response.postComment && response.body && !this.options.dryRun) {
            try {
                if (isPR) {
                    commentOnPR(number, response.body);
                } else {
                    commentOnIssue(number, response.body);
                }
            } catch (error) {
                console.error('Failed to post comment:', error);
            }
        }

        return response;
    }

    /**
     * Verify webhook signature (for production use)
     */
    static verifySignature(payload: string, signature: string, secret: string): boolean {
        const crypto = require('node:crypto');
        const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;

        const signatureBuffer = Buffer.from(signature);
        const expectedBuffer = Buffer.from(expected);

        if (signatureBuffer.length !== expectedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
    }
}

/**
 * Create a simple HTTP server for webhooks (for testing/local dev)
 */
export async function createWebhookServer(port: number, options: WebhookHandlerOptions = {}): Promise<void> {
    const http = require('node:http');
    const handler = new WebhookHandler(options);

    const server = http.createServer(async (req: any, res: any) => {
        if (req.method !== 'POST' || req.url !== '/webhook') {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        let body = '';
        req.on('data', (chunk: string) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const event = JSON.parse(body) as WebhookEvent;
                const response = await handler.handle(event);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ handled: response?.handled ?? false }));
            } catch (error) {
                console.error('Webhook error:', error);
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    });

    server.listen(port, () => {
        console.log(`🤖 Triage Bots webhook server running on port ${port}`);
        console.log(`   POST http://localhost:${port}/webhook`);
    });
}
