// src/ai.ts
import { generateText, streamText, tool } from "ai";

// src/ai/index.ts
var DEFAULT_MODELS = {
  anthropic: "claude-sonnet-4-20250514",
  openai: "gpt-4o",
  google: "gemini-2.0-flash",
  groq: "llama-3.3-70b-versatile",
  mistral: "mistral-large-latest",
  deepseek: "deepseek-chat",
  xai: "grok-2",
  togetherai: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  azure: "gpt-4o",
  ollama: "llama3.3",
  bedrock: "anthropic.claude-3-5-sonnet-20241022-v2:0"
};
async function detectProvider(overrideModel) {
  if (process.env.ANTHROPIC_API_KEY) {
    const { anthropic } = await import("./dist-BQZGWCI7.js");
    const modelId2 = overrideModel || process.env.ANTHROPIC_MODEL || DEFAULT_MODELS.anthropic;
    return {
      name: "anthropic",
      modelId: modelId2,
      model: anthropic(modelId2),
      source: "ANTHROPIC_API_KEY"
    };
  }
  if (process.env.OPENAI_API_KEY) {
    const { openai } = await import("./dist-MNKJ32WU.js");
    const modelId2 = overrideModel || process.env.OPENAI_MODEL || DEFAULT_MODELS.openai;
    return {
      name: "openai",
      modelId: modelId2,
      model: openai(modelId2),
      source: "OPENAI_API_KEY"
    };
  }
  if (process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    const { google } = await import("./dist-WUZJYBDM.js");
    const modelId2 = overrideModel || process.env.GOOGLE_MODEL || DEFAULT_MODELS.google;
    return {
      name: "google",
      modelId: modelId2,
      model: google(modelId2),
      source: process.env.GOOGLE_API_KEY ? "GOOGLE_API_KEY" : "GOOGLE_GENERATIVE_AI_API_KEY"
    };
  }
  if (process.env.GROQ_API_KEY) {
    const { groq } = await import("./dist-CGWTYQAH.js");
    const modelId2 = overrideModel || process.env.GROQ_MODEL || DEFAULT_MODELS.groq;
    return {
      name: "groq",
      modelId: modelId2,
      model: groq(modelId2),
      source: "GROQ_API_KEY"
    };
  }
  if (process.env.MISTRAL_API_KEY) {
    const { mistral } = await import("./dist-UBMHWC2J.js");
    const modelId2 = overrideModel || process.env.MISTRAL_MODEL || DEFAULT_MODELS.mistral;
    return {
      name: "mistral",
      modelId: modelId2,
      model: mistral(modelId2),
      source: "MISTRAL_API_KEY"
    };
  }
  if (process.env.DEEPSEEK_API_KEY) {
    const { deepseek } = await import("./dist-B6RG5K6T.js");
    const modelId2 = overrideModel || process.env.DEEPSEEK_MODEL || DEFAULT_MODELS.deepseek;
    return {
      name: "deepseek",
      modelId: modelId2,
      model: deepseek(modelId2),
      source: "DEEPSEEK_API_KEY"
    };
  }
  if (process.env.XAI_API_KEY) {
    const { xai } = await import("./dist-EW3ATHWG.js");
    const modelId2 = overrideModel || process.env.XAI_MODEL || DEFAULT_MODELS.xai;
    return {
      name: "xai",
      modelId: modelId2,
      model: xai(modelId2),
      source: "XAI_API_KEY"
    };
  }
  if (process.env.TOGETHER_API_KEY) {
    const { togetherai } = await import("./dist-7Y7JVV5N.js");
    const modelId2 = overrideModel || process.env.TOGETHER_MODEL || DEFAULT_MODELS.togetherai;
    return {
      name: "togetherai",
      modelId: modelId2,
      model: togetherai(modelId2),
      source: "TOGETHER_API_KEY"
    };
  }
  if (process.env.AZURE_OPENAI_API_KEY) {
    const { azure } = await import("./dist-MLX7F5EW.js");
    const modelId2 = overrideModel || process.env.AZURE_MODEL || DEFAULT_MODELS.azure;
    return {
      name: "azure",
      modelId: modelId2,
      model: azure(modelId2),
      source: "AZURE_OPENAI_API_KEY"
    };
  }
  if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE) {
    try {
      const { bedrock } = await import("./dist-2WVWAF5V.js");
      const modelId2 = overrideModel || process.env.BEDROCK_MODEL || DEFAULT_MODELS.bedrock;
      return {
        name: "bedrock",
        modelId: modelId2,
        model: bedrock(modelId2),
        source: process.env.AWS_ACCESS_KEY_ID ? "AWS_ACCESS_KEY_ID" : "AWS_PROFILE"
      };
    } catch {
    }
  }
  const { createOllama, ollama } = await import("ai-sdk-ollama");
  const modelId = overrideModel || process.env.OLLAMA_MODEL || DEFAULT_MODELS.ollama;
  if (process.env.OLLAMA_API_KEY) {
    const host = process.env.OLLAMA_HOST || "https://ollama.com/api";
    const provider = createOllama({
      baseURL: host.endsWith("/api") ? host : `${host}/api`,
      headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` }
    });
    return {
      name: "ollama",
      modelId,
      model: provider(modelId),
      source: "OLLAMA_API_KEY"
    };
  }
  return {
    name: "ollama",
    modelId,
    model: ollama(modelId),
    source: "default (local Ollama)"
  };
}
async function getAIProvider(name, modelId) {
  const resolvedModel = modelId || DEFAULT_MODELS[name] || "default";
  switch (name) {
    case "anthropic": {
      const { anthropic } = await import("./dist-BQZGWCI7.js");
      return { model: anthropic(resolvedModel), modelId: resolvedModel };
    }
    case "openai": {
      const { openai } = await import("./dist-MNKJ32WU.js");
      return { model: openai(resolvedModel), modelId: resolvedModel };
    }
    case "google":
    case "gemini": {
      const { google } = await import("./dist-WUZJYBDM.js");
      return { model: google(resolvedModel), modelId: resolvedModel };
    }
    case "groq": {
      const { groq } = await import("./dist-CGWTYQAH.js");
      return { model: groq(resolvedModel), modelId: resolvedModel };
    }
    case "mistral": {
      const { mistral } = await import("./dist-UBMHWC2J.js");
      return { model: mistral(resolvedModel), modelId: resolvedModel };
    }
    case "deepseek": {
      const { deepseek } = await import("./dist-B6RG5K6T.js");
      return { model: deepseek(resolvedModel), modelId: resolvedModel };
    }
    case "xai":
    case "grok": {
      const { xai } = await import("./dist-EW3ATHWG.js");
      return { model: xai(resolvedModel), modelId: resolvedModel };
    }
    case "togetherai":
    case "together": {
      const { togetherai } = await import("./dist-7Y7JVV5N.js");
      return { model: togetherai(resolvedModel), modelId: resolvedModel };
    }
    case "azure": {
      const { azure } = await import("./dist-MLX7F5EW.js");
      return { model: azure(resolvedModel), modelId: resolvedModel };
    }
    case "bedrock": {
      const { bedrock } = await import("./dist-2WVWAF5V.js");
      return { model: bedrock(resolvedModel), modelId: resolvedModel };
    }
    case "ollama":
    default: {
      const { ollama } = await import("ai-sdk-ollama");
      return { model: ollama(resolvedModel), modelId: resolvedModel };
    }
  }
}
function listAIProviders() {
  return [
    "anthropic",
    "openai",
    "google",
    "groq",
    "mistral",
    "deepseek",
    "xai",
    "togetherai",
    "azure",
    "bedrock",
    "ollama"
  ];
}
function getAvailableAIProviders() {
  const available = [];
  if (process.env.ANTHROPIC_API_KEY) available.push("anthropic");
  if (process.env.OPENAI_API_KEY) available.push("openai");
  if (process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) available.push("google");
  if (process.env.GROQ_API_KEY) available.push("groq");
  if (process.env.MISTRAL_API_KEY) available.push("mistral");
  if (process.env.DEEPSEEK_API_KEY) available.push("deepseek");
  if (process.env.XAI_API_KEY) available.push("xai");
  if (process.env.TOGETHER_API_KEY) available.push("togetherai");
  if (process.env.AZURE_OPENAI_API_KEY) available.push("azure");
  if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_PROFILE) available.push("bedrock");
  if (process.env.OLLAMA_API_KEY) available.push("ollama-cloud");
  available.push("ollama");
  return available;
}

// src/ai.ts
import { tool as tool2, generateText as generateText2, streamText as streamText2 } from "ai";
import { z } from "zod";
var cachedProvider = null;
async function getModel(forceRefresh = false) {
  if (!cachedProvider || forceRefresh) {
    cachedProvider = await detectProvider();
  }
  return cachedProvider;
}
async function resolveModel(options = {}) {
  if (options.provider) {
    const { model, modelId } = await getAIProvider(options.provider, options.model);
    return { providerName: options.provider, modelId, model };
  }
  const detected = await getModel();
  return {
    providerName: detected.name,
    modelId: detected.modelId,
    model: detected.model
  };
}
async function generate(prompt, options = {}) {
  const { model } = await resolveModel(options);
  const result = await generateText({
    model,
    system: options.system,
    prompt,
    temperature: options.temperature,
    maxTokens: options.maxTokens
  });
  return result.text;
}
async function stream(prompt, options = {}) {
  const { model } = await resolveModel(options);
  return streamText({
    model,
    system: options.system,
    prompt,
    temperature: options.temperature,
    maxTokens: options.maxTokens
  });
}
async function generateWithTools(prompt, tools, options = {}) {
  const { model } = await resolveModel(options);
  const result = await generateText({
    model,
    system: options.system,
    prompt,
    tools,
    maxSteps: options.maxSteps ?? 10,
    temperature: options.temperature,
    maxTokens: options.maxTokens,
    onStepFinish: options.onStepFinish ? (step) => {
      options.onStepFinish?.({
        toolCalls: step.toolCalls,
        toolResults: step.toolResults,
        text: step.text
      });
    } : void 0
  });
  const allToolCalls = [];
  const allToolResults = [];
  for (const step of result.steps || []) {
    if (step.toolCalls) allToolCalls.push(...step.toolCalls);
    if (step.toolResults) allToolResults.push(...step.toolResults);
  }
  return {
    text: result.text,
    toolCalls: allToolCalls,
    toolResults: allToolResults,
    steps: result.steps || [],
    finishReason: result.finishReason
  };
}
function createTool(config) {
  return tool({
    description: config.description,
    parameters: config.inputSchema,
    execute: config.execute
  });
}

export {
  DEFAULT_MODELS,
  detectProvider,
  getAIProvider,
  listAIProviders,
  getAvailableAIProviders,
  getModel,
  resolveModel,
  generate,
  stream,
  generateWithTools,
  createTool,
  tool2 as tool,
  generateText2 as generateText,
  streamText2 as streamText,
  z
};
//# sourceMappingURL=chunk-SRXDQD2N.js.map