/**
 * @agentic/triage-bots
 * 
 * Mentionable GitHub bots:
 * - @sage - Q&A, task decomposition, agent routing
 * - @curator - Issue triage, labeling, assignment
 * - @fixer - CI failure analysis, fix suggestions
 * - @harvester - Merge queue management
 * - @guardian - Enterprise standards enforcement
 */

export { SageBot } from './sage.js';
export { CuratorBot } from './curator.js';
export { FixerBot } from './fixer.js';
export { HarvesterBot } from './harvester.js';
export { GuardianBot } from './guardian.js';
export { BotRouter, type BotContext, type BotResponse, type Bot, createBotRouter } from './router.js';
export { WebhookHandler, createWebhookServer, type WebhookEvent, type WebhookHandlerOptions } from './webhook.js';
