import { beforeEach, describe, expect, it, vi } from 'vitest';

const { generateTextMock, ollamaFn, createOllamaFn } = vi.hoisted(() => {
    const generateTextMock = vi.fn(async (args: any) => {
        // Provide the shape used by ai.ts
        const result = {
            text: `echo:${args.prompt ?? ''}`,
            finishReason: 'stop',
            steps: [
                {
                    toolCalls: [{ name: 't1' }],
                    toolResults: [{ name: 't1', result: 123 }],
                    text: 'step text',
                },
            ],
        };

        // Simulate the AI SDK invoking onStepFinish
        if (typeof args.onStepFinish === 'function') {
            await args.onStepFinish(result.steps[0]);
        }

        return result;
    });

    const ollamaFn = vi.fn((modelId: string) => ({ provider: 'ollama', modelId }));
    const createOllamaFn = vi.fn((_opts: any) => (modelId: string) => ({ provider: 'ollama-custom', modelId }));

    return { generateTextMock, ollamaFn, createOllamaFn };
});

// Note: vi.mock() factories are hoisted, so they must only reference hoisted vars.
vi.mock('ai', async () => {
    return {
        generateText: (...args: any[]) => generateTextMock(...args),
        streamText: vi.fn(),
        tool: (cfg: any) => ({ ...cfg, __tool: true }),
    };
});

vi.mock('ai-sdk-ollama', async () => {
    return {
        ollama: ollamaFn,
        createOllama: createOllamaFn,
    };
});

import { createTool, generate, generateWithTools, getModel, resolveModel, DEFAULT_MODELS } from '../src/ai.ts';

describe('ai', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        delete process.env.ANTHROPIC_API_KEY;
        delete process.env.OPENAI_API_KEY;
        delete process.env.OLLAMA_API_KEY;
        delete process.env.OLLAMA_HOST;
        delete process.env.OLLAMA_MODEL;
    });

    it('getModel auto-detects provider', async () => {
        const provider = await getModel(true);
        expect(provider.name).toBe('ollama'); // Default fallback
    });

    it('resolveModel handles explicit provider', async () => {
        const res = await resolveModel({ provider: 'ollama', model: 'test-model' });
        expect(res.providerName).toBe('ollama');
        expect(res.modelId).toBe('test-model');
    });

    it('generate delegates to generateText', async () => {
        const out = await generate('hello', { system: 'sys', temperature: 0.1 });

        expect(out).toBe('echo:hello');
        expect(generateTextMock).toHaveBeenCalledTimes(1);
        const call = generateTextMock.mock.calls[0][0];
        expect(call.system).toBe('sys');
        expect(call.prompt).toBe('hello');
    });

    it('generateWithTools aggregates tool calls/results and forwards onStepFinish', async () => {
        const onStepFinish = vi.fn();
        const res = await generateWithTools(
            'p',
            { someTool: { description: 'x', execute: async () => 1 } },
            { maxSteps: 3, onStepFinish }
        );

        expect(res.text).toBe('echo:p');
        expect(res.toolCalls).toEqual([{ name: 't1' }]);
        expect(res.toolResults).toEqual([{ name: 't1', result: 123 }]);
        expect(onStepFinish).toHaveBeenCalledTimes(1);
    });

    it('createTool wraps ai.tool with schema + execute', async () => {
        const t = createTool({
            description: 'desc',
            inputSchema: { _def: { typeName: 'ZodObject' } } as any,
            execute: async (input) => input,
        });

        expect(t.__tool).toBe(true);
        expect(t.description).toBe('desc');
        expect(typeof t.execute).toBe('function');
    });
});
