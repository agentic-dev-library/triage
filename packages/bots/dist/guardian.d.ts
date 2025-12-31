import { Bot, BotContext, BotResponse } from './router.js';
import 'ai';

/**
 * @guardian Bot - Enterprise standards enforcement
 */

declare class GuardianBot implements Bot {
    name: string;
    triggers: string[];
    private allowedLicenses;
    private forbiddenLicenses;
    handle(ctx: BotContext): Promise<BotResponse>;
    private runChecks;
    private formatReport;
    private handleHelp;
}

export { GuardianBot };
