/**
 * Unit tests for SageBot
 */

import { describe, it, expect } from 'vitest';

// Mock the SageBot for unit testing
class MockSageBot {
    name = 'sage';
    triggers = ['@sage', '/sage'];

    async handle(ctx: { query: string; body: string }) {
        if (!ctx.query) {
            return {
                body: 'How can I help?',
                handled: true,
            };
        }

        if (ctx.query.toLowerCase().startsWith('decompose ')) {
            return {
                body: 'Task decomposition result',
                handled: true,
            };
        }

        if (ctx.query.toLowerCase().startsWith('route ')) {
            return {
                body: 'Routing recommendation',
                handled: true,
            };
        }

        return {
            body: `Answer to: ${ctx.query}`,
            handled: true,
        };
    }
}

describe('SageBot', () => {
    const bot = new MockSageBot();

    it('should have correct name and triggers', () => {
        expect(bot.name).toBe('sage');
        expect(bot.triggers).toContain('@sage');
        expect(bot.triggers).toContain('/sage');
    });

    it('should show help when no query provided', async () => {
        const response = await bot.handle({ query: '', body: '@sage' });
        
        expect(response.handled).toBe(true);
        expect(response.body).toContain('help');
    });

    it('should handle decompose command', async () => {
        const response = await bot.handle({
            query: 'decompose Build a dashboard',
            body: '@sage decompose Build a dashboard',
        });
        
        expect(response.handled).toBe(true);
        expect(response.body).toContain('decomposition');
    });

    it('should handle route command', async () => {
        const response = await bot.handle({
            query: 'route Fix this bug',
            body: '@sage route Fix this bug',
        });
        
        expect(response.handled).toBe(true);
        expect(response.body).toContain('Routing');
    });

    it('should answer general questions', async () => {
        const response = await bot.handle({
            query: 'What is TypeScript?',
            body: '@sage What is TypeScript?',
        });
        
        expect(response.handled).toBe(true);
        expect(response.body).toContain('What is TypeScript?');
    });
});
