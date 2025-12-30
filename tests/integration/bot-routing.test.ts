/**
 * Integration tests for bot routing
 */

import { describe, it, expect } from 'vitest';

describe('Bot Router', () => {
    it('should route @sage mentions to SageBot', async () => {
        const { BotRouter, SageBot } = await import('@agentic/triage-bots');
        
        const router = new BotRouter();
        router.register(new SageBot());
        
        const bot = router.findBot('@sage How do I fix this?');
        
        expect(bot).toBeDefined();
        expect(bot?.name).toBe('sage');
    });

    it('should route @curator mentions to CuratorBot', async () => {
        const { BotRouter, CuratorBot } = await import('@agentic/triage-bots');
        
        const router = new BotRouter();
        router.register(new CuratorBot());
        
        const bot = router.findBot('@curator please triage this issue');
        
        expect(bot).toBeDefined();
        expect(bot?.name).toBe('curator');
    });

    it('should extract query from mention', async () => {
        const { BotRouter, SageBot } = await import('@agentic/triage-bots');
        
        const router = new BotRouter();
        const sage = new SageBot();
        router.register(sage);
        
        const query = router.extractQuery('@sage How do I fix this?', sage);
        
        expect(query).toBe('How do I fix this?');
    });

    it('should return undefined for unrecognized mentions', async () => {
        const { BotRouter, SageBot } = await import('@agentic/triage-bots');
        
        const router = new BotRouter();
        router.register(new SageBot());
        
        const bot = router.findBot('Just a regular comment');
        
        expect(bot).toBeUndefined();
    });
});
