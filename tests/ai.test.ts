import * as aiSdkOllama from 'ai-sdk-ollama';
import { ollama } from 'ai-sdk-ollama';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CLOUD_HOST, DEFAULT_MODEL, getModel, getProvider, LOCAL_HOST, resolveModel } from '../src/ai.js';

// Mock ai-sdk-ollama
vi.mock('ai-sdk-ollama', () => ({
    createOllama: vi.fn().mockReturnValue(() => ({})),
    ollama: vi.fn().mockReturnValue({}),
}));

describe('AI Utils', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = originalEnv;
        vi.clearAllMocks();
    });

    describe('getProvider', () => {
        it('should return default ollama if no config or env provided', () => {
            delete process.env.OLLAMA_API_KEY;
            delete process.env.OLLAMA_HOST;
            const provider = getProvider({});
            expect(provider).toBe(aiSdkOllama.ollama);
        });

        it('should use OLLAMA_API_KEY and OLLAMA_HOST if provided', () => {
            process.env.OLLAMA_API_KEY = 'test-key';
            process.env.OLLAMA_HOST = 'http://test-host';
            getProvider({});
            expect(aiSdkOllama.createOllama).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseURL: 'http://test-host/api',
                    headers: { Authorization: 'Bearer test-key' },
                })
            );
        });

        it('should use Cloud Host if API key is provided but no host', () => {
            process.env.OLLAMA_API_KEY = 'test-key';
            delete process.env.OLLAMA_HOST;
            getProvider({});
            expect(aiSdkOllama.createOllama).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseURL: CLOUD_HOST,
                })
            );
        });
    });

    describe('getModel', () => {
        it('should return default model if none provided', () => {
            delete process.env.OLLAMA_MODEL;
            expect(getModel({})).toBe(DEFAULT_MODEL);
        });

        it('should use OLLAMA_MODEL env var if provided', () => {
            process.env.OLLAMA_MODEL = 'test-model';
            expect(getModel({})).toBe('test-model');
        });

        it('should prefer config model over env var', () => {
            process.env.OLLAMA_MODEL = 'env-model';
            expect(getModel({ model: 'config-model' })).toBe('config-model');
        });
    });

    describe('resolveModel', () => {
        it('should resolve ollama model correctly', async () => {
            const result = await resolveModel({ provider: 'ollama', model: 'test-model' });
            expect(result.providerName).toBe('ollama');
            expect(result.modelId).toBe('test-model');
            expect(result.model).toBeDefined();
        });

        it('should throw error for unsupported provider', async () => {
            await expect(resolveModel({ provider: 'unsupported' })).rejects.toThrow(
                'Provider unsupported not supported in standalone mode'
            );
        });
    });
});
