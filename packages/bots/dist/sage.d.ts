import { Bot, BotContext, BotResponse } from './router.js';
import 'ai';

/**
 * @sage Bot - Q&A, task decomposition, and agent routing
 */

declare class SageBot implements Bot {
    name: string;
    triggers: string[];
    handle(ctx: BotContext): Promise<BotResponse>;
    private formatAnswer;
    private formatDecomposition;
    private formatRouting;
    private formatUnblock;
    private patternBasedResponse;
}

export { SageBot };
