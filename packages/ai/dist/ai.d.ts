import { LanguageModel, streamText } from 'ai';
export { generateText, streamText, tool } from 'ai';
import { z } from 'zod';
export { z } from 'zod';

/**
 * AI Provider Auto-Detection and Re-exports
 *
 * Automatically detects which AI provider to use based on environment variables.
 * Just set your API key and triage will use the right provider.
 *
 * Priority order (first key found wins):
 * 1. ANTHROPIC_API_KEY → Claude
 * 2. OPENAI_API_KEY → OpenAI
 * 3. GOOGLE_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY → Gemini
 * 4. GROQ_API_KEY → Groq
 * 5. MISTRAL_API_KEY → Mistral
 * 6. DEEPSEEK_API_KEY → DeepSeek
 * 7. XAI_API_KEY → xAI/Grok
 * 8. TOGETHER_API_KEY → Together.ai
 * 9. AZURE_OPENAI_API_KEY → Azure OpenAI
 * 10. OLLAMA_API_KEY / OLLAMA_HOST → Ollama (cloud or local)
 * 11. (none) → Ollama local (default)
 */
interface DetectedProvider {
    name: string;
    modelId: string;
    model: any;
    source: string;
}
declare const DEFAULT_MODELS: Record<string, string>;
/**
 * Detect which provider to use based on environment variables
 */
declare function detectProvider(overrideModel?: string): Promise<DetectedProvider>;
/**
 * Get a specific provider by name (for explicit configuration)
 */
declare function getAIProvider(name: string, modelId?: string): Promise<{
    model: any;
    modelId: string;
}>;
/**
 * List all supported providers
 */
declare function listAIProviders(): string[];
/**
 * Check which providers are available (have API keys configured)
 */
declare function getAvailableAIProviders(): string[];

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

type ToolSet = Record<string, any>;
/**
 * Get the auto-detected AI model
 * Caches the result for performance
 */
declare function getModel(forceRefresh?: boolean): Promise<DetectedProvider>;
/**
 * Resolve a model - either auto-detect or use explicit provider/model
 */
declare function resolveModel(options?: {
    provider?: string;
    model?: string;
}): Promise<{
    providerName: string;
    modelId: string;
    model: LanguageModel;
}>;
interface GenerateOptions {
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
declare function generate(prompt: string, options?: GenerateOptions): Promise<string>;
/**
 * Stream text using auto-detected or specified provider
 */
declare function stream(prompt: string, options?: GenerateOptions): Promise<ReturnType<typeof streamText>>;
interface GenerateWithToolsOptions extends GenerateOptions {
    /** Maximum tool call steps */
    maxSteps?: number;
    /** Callback for each step */
    onStepFinish?: (step: {
        toolCalls?: unknown[];
        toolResults?: unknown[];
        text?: string;
    }) => void;
}
interface GenerateWithToolsResult {
    text: string;
    toolCalls: unknown[];
    toolResults: unknown[];
    steps: unknown[];
    finishReason: string;
}
/**
 * Generate with tools - multi-step agent execution
 */
declare function generateWithTools(prompt: string, tools: ToolSet, options?: GenerateWithToolsOptions): Promise<GenerateWithToolsResult>;
/**
 * Create a tool definition
 */
declare function createTool<T extends z.ZodType>(config: {
    description: string;
    inputSchema: T;
    execute: (input: z.infer<T>) => Promise<unknown>;
}): any;

export { DEFAULT_MODELS, type DetectedProvider, type GenerateOptions, type GenerateWithToolsOptions, type GenerateWithToolsResult, type ToolSet, createTool, detectProvider, generate, generateWithTools, getAIProvider, getAvailableAIProviders, getModel, listAIProviders, resolveModel, stream };
