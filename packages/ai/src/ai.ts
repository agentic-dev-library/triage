/**
 * AI Client - Auto-detecting, provider-agnostic AI integration
 *
 * Just set your API key and it works:
 *   ANTHROPIC_API_KEY → Uses Claude
 *   OPENAI_API_KEY → Uses GPT-4
 *   GOOGLE_API_KEY → Uses Gemini
 *   (etc.)
 *
 * Or explicitly configure:
 *   const { model } = await getProvider('anthropic', 'claude-3-opus');
 */

import { generateText, streamText, tool, type LanguageModelV1 } from 'ai';
import type { z } from 'zod';
import { detectProvider, getAIProvider, type DetectedProvider } from './ai/index.js';

// Re-export provider utilities
export { detectProvider, getAIProvider, getAvailableAIProviders, listAIProviders, DEFAULT_MODELS } from './ai/index.js';
export type { DetectedProvider } from './ai/index.js';

// Tool type (loose to avoid version conflicts)
export type ToolSet = Record<string, ReturnType<typeof tool>>;

// Cached detected provider
let cachedProvider: DetectedProvider | null = null;

/**
 * Get the auto-detected AI model
 * Caches the result for performance
 */
export async function getModel(forceRefresh = false): Promise<DetectedProvider> {
    if (!cachedProvider || forceRefresh) {
        cachedProvider = await detectProvider();
    }
    return cachedProvider;
}

/**
 * Resolve a model - either auto-detect or use explicit provider/model
 */
export async function resolveModel(options: {
    provider?: string;
    model?: string;
} = {}): Promise<{ providerName: string; modelId: string; model: LanguageModelV1 }> {
    if (options.provider) {
        // Explicit provider requested
        const { model, modelId } = await getAIProvider(options.provider, options.model);
        return { providerName: options.provider, modelId, model };
    }

    // Auto-detect
    const detected = await getModel();
    return {
        providerName: detected.name,
        modelId: detected.modelId,
        model: detected.model,
    };
}

export interface GenerateOptions {
    /** Explicit provider name (auto-detects if not set) */
    provider?: string;
    /** Model ID (uses provider default if not set) */
    model?: string;
    /** System prompt */
    system?: string;
    /** Max output tokens */
    maxTokens?: number;
    /** Temperature (0-1) */
    temperature?: number;
}

/**
 * Generate text using auto-detected or specified provider
 */
export async function generate(prompt: string, options: GenerateOptions = {}): Promise<string> {
    const { model } = await resolveModel(options);

    const result = await generateText({
        model,
        system: options.system,
        prompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
    });

    return result.text;
}

/**
 * Stream text using auto-detected or specified provider
 */
export async function stream(prompt: string, options: GenerateOptions = {}) {
    const { model } = await resolveModel(options);

    return streamText({
        model,
        system: options.system,
        prompt,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
    });
}

export interface GenerateWithToolsOptions extends GenerateOptions {
    /** Maximum tool call steps */
    maxSteps?: number;
    /** Callback for each step */
    onStepFinish?: (step: { toolCalls?: unknown[]; toolResults?: unknown[]; text?: string }) => void;
}

export interface GenerateWithToolsResult {
    text: string;
    toolCalls: unknown[];
    toolResults: unknown[];
    steps: unknown[];
    finishReason: string;
}

/**
 * Generate with tools - multi-step agent execution
 */
export async function generateWithTools(
    prompt: string,
    tools: ToolSet,
    options: GenerateWithToolsOptions = {}
): Promise<GenerateWithToolsResult> {
    const { model } = await resolveModel(options);

    const result = await generateText({
        model,
        system: options.system,
        prompt,
        tools,
        maxSteps: options.maxSteps ?? 10,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        onStepFinish: options.onStepFinish
            ? (step) => {
                  options.onStepFinish?.({
                      toolCalls: step.toolCalls,
                      toolResults: step.toolResults,
                      text: step.text,
                  });
              }
            : undefined,
    });

    // Collect all tool calls and results
    const allToolCalls: unknown[] = [];
    const allToolResults: unknown[] = [];

    for (const step of result.steps || []) {
        if (step.toolCalls) allToolCalls.push(...step.toolCalls);
        if (step.toolResults) allToolResults.push(...step.toolResults);
    }

    return {
        text: result.text,
        toolCalls: allToolCalls,
        toolResults: allToolResults,
        steps: result.steps || [],
        finishReason: result.finishReason,
    };
}

/**
 * Create a tool definition
 */
export function createTool<T extends z.ZodType>(config: {
    description: string;
    parameters: T;
    execute: (input: z.infer<T>) => Promise<unknown>;
}) {
    return tool({
        description: config.description,
        parameters: config.parameters,
        execute: config.execute,
    });
}

// Re-export from ai package
export { tool, generateText, streamText } from 'ai';
export { z } from 'zod';
