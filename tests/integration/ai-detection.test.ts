/**
 * Integration tests for AI provider auto-detection
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AI Provider Auto-Detection', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        // Reset environment
        process.env = { ...originalEnv };
        delete process.env.ANTHROPIC_API_KEY;
        delete process.env.OPENAI_API_KEY;
        delete process.env.GOOGLE_API_KEY;
        delete process.env.OLLAMA_API_KEY;
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should detect Anthropic when ANTHROPIC_API_KEY is set', async () => {
        process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
        
        const { detectProvider } = await import('@agentic/triage-ai');
        const provider = await detectProvider();
        
        expect(provider.name).toBe('anthropic');
        expect(provider.source).toBe('ANTHROPIC_API_KEY');
    });

    it('should detect OpenAI when OPENAI_API_KEY is set', async () => {
        process.env.OPENAI_API_KEY = 'sk-test-key';
        
        const { detectProvider } = await import('@agentic/triage-ai');
        const provider = await detectProvider();
        
        expect(provider.name).toBe('openai');
        expect(provider.source).toBe('OPENAI_API_KEY');
    });

    it('should fall back to Ollama when no keys are set', async () => {
        const { detectProvider } = await import('@agentic/triage-ai');
        const provider = await detectProvider();
        
        expect(provider.name).toBe('ollama');
        expect(provider.source).toBe('default (local Ollama)');
    });

    it('should respect priority order (Anthropic > OpenAI)', async () => {
        process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key';
        process.env.OPENAI_API_KEY = 'sk-test-key';
        
        const { detectProvider } = await import('@agentic/triage-ai');
        const provider = await detectProvider();
        
        expect(provider.name).toBe('anthropic');
    });
});
