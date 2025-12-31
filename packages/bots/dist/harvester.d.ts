import { Bot, BotContext, BotResponse } from './router.js';
import 'ai';

/**
 * @harvester Bot - PR monitoring, merge queue management
 */

declare class HarvesterBot implements Bot {
    name: string;
    triggers: string[];
    handle(ctx: BotContext): Promise<BotResponse>;
    private handleStatus;
    private handleAdd;
    private handleRemove;
    private handleHelp;
}

export { HarvesterBot };
