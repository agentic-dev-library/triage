/**
 * Unit tests for AI provider detection
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('AI Provider Detection', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        // Clear all AI-related env vars
        vi.resetModules();
        delete process.env.ANTHROPIC_API_KEY;
        delete process.env.OPENAI_API_KEY;
        delete process.env.GOOGLE_API_KEY;
        delete process.env.GROQ_API_KEY;
        delete process.env.MISTRAL_API_KEY;
        delete process.env.OLLAMA_API_KEY;
    });

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    describe('listAIProviders', () => {
        it('should return all supported providers', async () => {
            const { listAIProviders } = await import('../src/index.js');
            const providers = listAIProviders();

            expect(providers).toContain('anthropic');
            expect(providers).toContain('openai');
            expect(providers).toContain('google');
            expect(providers).toContain('ollama');
            expect(providers.length).toBeGreaterThan(5);
        });
    });

    describe('getAvailableAIProviders', () => {
        it('should return only ollama when no keys are set', async () => {
            const { getAvailableAIProviders } = await import('../src/index.js');
            const available = getAvailableAIProviders();

            expect(available).toContain('ollama');
            expect(available).not.toContain('anthropic');
        });

        it('should include anthropic when key is set', async () => {
            process.env.ANTHROPIC_API_KEY = 'test-key';
            
            const { getAvailableAIProviders } = await import('../src/index.js');
            const available = getAvailableAIProviders();

            expect(available).toContain('anthropic');
        });
    });

    describe('DEFAULT_MODELS', () => {
        it('should have default models for all providers', async () => {
            const { DEFAULT_MODELS, listAIProviders } = await import('../src/index.js');
            const providers = listAIProviders();

            for (const provider of providers) {
                expect(DEFAULT_MODELS[provider]).toBeDefined();
                expect(typeof DEFAULT_MODELS[provider]).toBe('string');
            }
        });
    });
});
