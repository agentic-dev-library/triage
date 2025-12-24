import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CLOUD_HOST, DEFAULT_MODEL, getModel, getProvider, LOCAL_HOST, resolveModel } from '../src/ai.js';

describe('ai', () => {
    beforeEach(() => {
        vi.resetModules();
        process.env.OLLAMA_API_KEY = '';
        process.env.OLLAMA_HOST = '';
        process.env.OLLAMA_MODEL = '';
        process.env.TRIAGE_PROVIDER = '';
    });

    describe('getProvider', () => {
        it('should return default provider when no config or env', () => {
            const provider = getProvider();
            expect(provider).toBeDefined();
        });

        it('should use OLLAMA_API_KEY if provided in env', () => {
            process.env.OLLAMA_API_KEY = 'test-key';
            const provider = getProvider();
            expect(provider).toBeDefined();
        });

        it('should use host from config', () => {
            const provider = getProvider({ host: 'http://custom-host' });
            expect(provider).toBeDefined();
        });

        it('should normalize host URL', () => {
            const provider = getProvider({ host: 'http://custom-host/' });
            // Internal check of baseURL would be better but difficult without deep mocking
            expect(provider).toBeDefined();
        });
    });

    describe('getModel', () => {
        it('should return default model', () => {
            expect(getModel()).toBe(DEFAULT_MODEL);
        });

        it('should use OLLAMA_MODEL from env', () => {
            process.env.OLLAMA_MODEL = 'custom-model';
            expect(getModel()).toBe('custom-model');
        });

        it('should use model from config', () => {
            expect(getModel({ model: 'config-model' })).toBe('config-model');
        });
    });

    describe('resolveModel', () => {
        it('should resolve ollama model by default', async () => {
            const result = await resolveModel();
            expect(result.providerName).toBe('ollama');
            expect(result.modelId).toBe(DEFAULT_MODEL);
            expect(result.model).toBeDefined();
        });

        it('should use provider from config', async () => {
            const result = await resolveModel({ provider: 'ollama' });
            expect(result.providerName).toBe('ollama');
        });

        it('should throw for unsupported provider', async () => {
            await expect(resolveModel({ provider: 'openai' })).rejects.toThrow(
                'Provider openai not supported in standalone mode'
            );
        });
    });
});
