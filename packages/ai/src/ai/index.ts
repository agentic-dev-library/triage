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


// Provider detection result
export interface DetectedProvider {
    name: string;
    modelId: string;
    model: any;
    source: string; // Which env var triggered detection
}

// Default models for each provider
export const DEFAULT_MODELS: Record<string, string> = {
    anthropic: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o',
    google: 'gemini-2.0-flash',
    groq: 'llama-3.3-70b-versatile',
    mistral: 'mistral-large-latest',
    deepseek: 'deepseek-chat',
    xai: 'grok-2',
    togetherai: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    azure: 'gpt-4o',
    ollama: 'llama3.3',
    bedrock: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
};

/**
 * Detect which provider to use based on environment variables
 */
export async function detectProvider(overrideModel?: string): Promise<DetectedProvider> {
    // Check each provider in priority order

    // 1. Anthropic (Claude)
    if (process.env.ANTHROPIC_API_KEY) {
        const { anthropic } = await import('@ai-sdk/anthropic');
        const modelId = overrideModel || process.env.ANTHROPIC_MODEL || DEFAULT_MODELS.anthropic;
        return {
            name: 'anthropic',
            modelId,
            model: anthropic(modelId),
            source: 'ANTHROPIC_API_KEY',
        };
    }

    // 2. OpenAI
    if (process.env.OPENAI_API_KEY) {
        const { openai } = await import('@ai-sdk/openai');
        const modelId = overrideModel || process.env.OPENAI_MODEL || DEFAULT_MODELS.openai;
        return {
            name: 'openai',
            modelId,
            model: openai(modelId),
            source: 'OPENAI_API_KEY',
        };
    }

    // 3. Google (Gemini)
    if (process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        const { google } = await import('@ai-sdk/google');
        const modelId = overrideModel || process.env.GOOGLE_MODEL || DEFAULT_MODELS.google;
        return {
            name: 'google',
            modelId,
            model: google(modelId),
            source: process.env.GOOGLE_API_KEY ? 'GOOGLE_API_KEY' : 'GOOGLE_GENERATIVE_AI_API_KEY',
        };
    }

    // 4. Groq
    if (process.env.GROQ_API_KEY) {
        const { groq } = await import('@ai-sdk/groq');
        const modelId = overrideModel || process.env.GROQ_MODEL || DEFAULT_MODELS.groq;
        return {
            name: 'groq',
            modelId,
            model: groq(modelId),
            source: 'GROQ_API_KEY',
        };
    }

    // 5. Mistral
    if (process.env.MISTRAL_API_KEY) {
        const { mistral } = await import('@ai-sdk/mistral');
        const modelId = overrideModel || process.env.MISTRAL_MODEL || DEFAULT_MODELS.mistral;
        return {
            name: 'mistral',
            modelId,
            model: mistral(modelId),
            source: 'MISTRAL_API_KEY',
        };
    }

    // 6. DeepSeek
    if (process.env.DEEPSEEK_API_KEY) {
        const { deepseek } = await import('@ai-sdk/deepseek');
        const modelId = overrideModel || process.env.DEEPSEEK_MODEL || DEFAULT_MODELS.deepseek;
        return {
            name: 'deepseek',
            modelId,
            model: deepseek(modelId),
            source: 'DEEPSEEK_API_KEY',
        };
    }

    // 7. xAI (Grok)
    if (process.env.XAI_API_KEY) {
        const { xai } = await import('@ai-sdk/xai');
        const modelId = overrideModel || process.env.XAI_MODEL || DEFAULT_MODELS.xai;
        return {
            name: 'xai',
            modelId,
            model: xai(modelId),
            source: 'XAI_API_KEY',
        };
    }

    // 8. Together.ai
    if (process.env.TOGETHER_API_KEY) {
        const { togetherai } = await import('@ai-sdk/togetherai');
        const modelId = overrideModel || process.env.TOGETHER_MODEL || DEFAULT_MODELS.togetherai;
        return {
            name: 'togetherai',
            modelId,
            model: togetherai(modelId),
            source: 'TOGETHER_API_KEY',
        };
    }

    // 9. Azure OpenAI
    if (process.env.AZURE_OPENAI_API_KEY) {
        const { azure } = await import('@ai-sdk/azure');
        const modelId = overrideModel || process.env.AZURE_MODEL || DEFAULT_MODELS.azure;
        return {
            name: 'azure',
            modelId,
            model: azure(modelId),
            source: 'AZURE_OPENAI_API_KEY',
        };
    }

    // 10. AWS Bedrock (check for AWS credentials)
    if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE) {
        try {
            const { bedrock } = await import('@ai-sdk/amazon-bedrock');
            const modelId = overrideModel || process.env.BEDROCK_MODEL || DEFAULT_MODELS.bedrock;
            return {
                name: 'bedrock',
                modelId,
                model: bedrock(modelId),
                source: process.env.AWS_ACCESS_KEY_ID ? 'AWS_ACCESS_KEY_ID' : 'AWS_PROFILE',
            };
        } catch {
            // Bedrock not available, fall through
        }
    }

    // 11. Ollama (cloud or local - default fallback)
    const { createOllama, ollama } = await import('ai-sdk-ollama');
    const modelId = overrideModel || process.env.OLLAMA_MODEL || DEFAULT_MODELS.ollama;

    if (process.env.OLLAMA_API_KEY) {
        // Ollama Cloud
        const host = process.env.OLLAMA_HOST || 'https://ollama.com/api';
        const provider = createOllama({
            baseURL: host.endsWith('/api') ? host : `${host}/api`,
            headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
        });
        return {
            name: 'ollama',
            modelId,
            model: provider(modelId),
            source: 'OLLAMA_API_KEY',
        };
    }

    // Local Ollama (absolute fallback)
    return {
        name: 'ollama',
        modelId,
        model: ollama(modelId),
        source: 'default (local Ollama)',
    };
}

/**
 * Get a specific provider by name (for explicit configuration)
 */
export async function getAIProvider(
    name: string,
    modelId?: string
): Promise<{ model: any; modelId: string }> {
    const resolvedModel = modelId || DEFAULT_MODELS[name] || 'default';

    switch (name) {
        case 'anthropic': {
            const { anthropic } = await import('@ai-sdk/anthropic');
            return { model: anthropic(resolvedModel), modelId: resolvedModel };
        }
        case 'openai': {
            const { openai } = await import('@ai-sdk/openai');
            return { model: openai(resolvedModel), modelId: resolvedModel };
        }
        case 'google':
        case 'gemini': {
            const { google } = await import('@ai-sdk/google');
            return { model: google(resolvedModel), modelId: resolvedModel };
        }
        case 'groq': {
            const { groq } = await import('@ai-sdk/groq');
            return { model: groq(resolvedModel), modelId: resolvedModel };
        }
        case 'mistral': {
            const { mistral } = await import('@ai-sdk/mistral');
            return { model: mistral(resolvedModel), modelId: resolvedModel };
        }
        case 'deepseek': {
            const { deepseek } = await import('@ai-sdk/deepseek');
            return { model: deepseek(resolvedModel), modelId: resolvedModel };
        }
        case 'xai':
        case 'grok': {
            const { xai } = await import('@ai-sdk/xai');
            return { model: xai(resolvedModel), modelId: resolvedModel };
        }
        case 'togetherai':
        case 'together': {
            const { togetherai } = await import('@ai-sdk/togetherai');
            return { model: togetherai(resolvedModel), modelId: resolvedModel };
        }
        case 'azure': {
            const { azure } = await import('@ai-sdk/azure');
            return { model: azure(resolvedModel), modelId: resolvedModel };
        }
        case 'bedrock': {
            const { bedrock } = await import('@ai-sdk/amazon-bedrock');
            return { model: bedrock(resolvedModel), modelId: resolvedModel };
        }
        default: {
            const { ollama } = await import('ai-sdk-ollama');
            return { model: ollama(resolvedModel), modelId: resolvedModel };
        }
    }
}

/**
 * List all supported providers
 */
export function listAIProviders(): string[] {
    return [
        'anthropic',
        'openai',
        'google',
        'groq',
        'mistral',
        'deepseek',
        'xai',
        'togetherai',
        'azure',
        'bedrock',
        'ollama',
    ];
}

/**
 * Check which providers are available (have API keys configured)
 */
export function getAvailableAIProviders(): string[] {
    const available: string[] = [];

    if (process.env.ANTHROPIC_API_KEY) available.push('anthropic');
    if (process.env.OPENAI_API_KEY) available.push('openai');
    if (process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) available.push('google');
    if (process.env.GROQ_API_KEY) available.push('groq');
    if (process.env.MISTRAL_API_KEY) available.push('mistral');
    if (process.env.DEEPSEEK_API_KEY) available.push('deepseek');
    if (process.env.XAI_API_KEY) available.push('xai');
    if (process.env.TOGETHER_API_KEY) available.push('togetherai');
    if (process.env.AZURE_OPENAI_API_KEY) available.push('azure');
    if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE) available.push('bedrock');
    if (process.env.OLLAMA_API_KEY) available.push('ollama-cloud');

    // Ollama local is always "available" as fallback
    available.push('ollama');

    return available;
}
