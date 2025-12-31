import { Bot, BotContext, BotResponse } from './router.js';
import 'ai';

/**
 * @curator Bot - Issue triage, labeling, and assignment
 */

declare class CuratorBot implements Bot {
    name: string;
    triggers: string[];
    handle(ctx: BotContext): Promise<BotResponse>;
    private analyzeContent;
    private formatAnalysis;
}

export { CuratorBot };
