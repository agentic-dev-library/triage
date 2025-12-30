/**
 * Triage Bots - Mentionable AI-powered GitHub bots
 *
 * Each bot is agnostic to the underlying AI provider and can be triggered
 * via GitHub comments with @mentions:
 *
 * - @sage - Q&A, task decomposition, agent routing
 * - @curator - Issue triage, labeling, assignment
 * - @fixer - CI failure analysis and fix suggestions
 * - @harvester - PR monitoring, merge queue management
 * - @guardian - Enterprise standards enforcement
 */

export { SageBot } from './sage.js';
export { CuratorBot } from './curator.js';
export { FixerBot } from './fixer.js';
export { HarvesterBot } from './harvester.js';
export { GuardianBot } from './guardian.js';
export { BotRouter, type BotContext, type BotResponse } from './router.js';
export { WebhookHandler } from './webhook.js';
