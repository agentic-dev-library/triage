import { Bot, BotContext, BotResponse } from './router.js';
import 'ai';

/**
 * @fixer Bot - CI failure analysis and fix suggestions
 */

declare class FixerBot implements Bot {
    name: string;
    triggers: string[];
    handle(ctx: BotContext): Promise<BotResponse>;
    private analyzeErrors;
    private formatAnalysis;
}

export { FixerBot };
