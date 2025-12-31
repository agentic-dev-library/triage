import "./chunk-4V4FHS4X.js";

// ../../node_modules/.pnpm/@ai-sdk+provider@2.0.1/node_modules/@ai-sdk/provider/dist/index.mjs
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a;
var _b;
var AISDKError = class _AISDKError extends (_b = Error, _a = symbol, _b) {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name14,
    message,
    cause
  }) {
    super(message);
    this[_a] = true;
    this.name = name14;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker);
  }
  static hasMarker(error, marker15) {
    const markerSymbol = Symbol.for(marker15);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
};
var name = "AI_APICallError";
var marker2 = `vercel.ai.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var _b2;
var APICallError = class extends (_b2 = AISDKError, _a2 = symbol2, _b2) {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name, message, cause });
    this[_a2] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2);
  }
};
var name2 = "AI_EmptyResponseBodyError";
var marker3 = `vercel.ai.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var _b3;
var EmptyResponseBodyError = class extends (_b3 = AISDKError, _a3 = symbol3, _b3) {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2, message });
    this[_a3] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3);
  }
};
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}
var name3 = "AI_InvalidArgumentError";
var marker4 = `vercel.ai.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var _b4;
var InvalidArgumentError = class extends (_b4 = AISDKError, _a4 = symbol4, _b4) {
  constructor({
    message,
    cause,
    argument
  }) {
    super({ name: name3, message, cause });
    this[_a4] = true;
    this.argument = argument;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4);
  }
};
var name4 = "AI_InvalidPromptError";
var marker5 = `vercel.ai.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var _b5;
var InvalidPromptError = class extends (_b5 = AISDKError, _a5 = symbol5, _b5) {
  constructor({
    prompt,
    message,
    cause
  }) {
    super({ name: name4, message: `Invalid prompt: ${message}`, cause });
    this[_a5] = true;
    this.prompt = prompt;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5);
  }
};
var name5 = "AI_InvalidResponseDataError";
var marker6 = `vercel.ai.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var _b6;
var InvalidResponseDataError = class extends (_b6 = AISDKError, _a6 = symbol6, _b6) {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name5, message });
    this[_a6] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6);
  }
};
var name6 = "AI_JSONParseError";
var marker7 = `vercel.ai.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var _b7;
var JSONParseError = class extends (_b7 = AISDKError, _a7 = symbol7, _b7) {
  constructor({ text, cause }) {
    super({
      name: name6,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a7] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
};
var name7 = "AI_LoadAPIKeyError";
var marker8 = `vercel.ai.error.${name7}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var _b8;
var LoadAPIKeyError = class extends (_b8 = AISDKError, _a8 = symbol8, _b8) {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7, message });
    this[_a8] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8);
  }
};
var name8 = "AI_LoadSettingError";
var marker9 = `vercel.ai.error.${name8}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var _b9;
var LoadSettingError = class extends (_b9 = AISDKError, _a9 = symbol9, _b9) {
  // used in isInstance
  constructor({ message }) {
    super({ name: name8, message });
    this[_a9] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker9);
  }
};
var name9 = "AI_NoContentGeneratedError";
var marker10 = `vercel.ai.error.${name9}`;
var symbol10 = Symbol.for(marker10);
var _a10;
var _b10;
var NoContentGeneratedError = class extends (_b10 = AISDKError, _a10 = symbol10, _b10) {
  // used in isInstance
  constructor({
    message = "No content generated."
  } = {}) {
    super({ name: name9, message });
    this[_a10] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker10);
  }
};
var name10 = "AI_NoSuchModelError";
var marker11 = `vercel.ai.error.${name10}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var _b11;
var NoSuchModelError = class extends (_b11 = AISDKError, _a11 = symbol11, _b11) {
  constructor({
    errorName = name10,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a11] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker11);
  }
};
var name11 = "AI_TooManyEmbeddingValuesForCallError";
var marker12 = `vercel.ai.error.${name11}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var _b12;
var TooManyEmbeddingValuesForCallError = class extends (_b12 = AISDKError, _a12 = symbol12, _b12) {
  constructor(options) {
    super({
      name: name11,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a12] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker12);
  }
};
var name12 = "AI_TypeValidationError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var _b13;
var TypeValidationError = class _TypeValidationError extends (_b13 = AISDKError, _a13 = symbol13, _b13) {
  constructor({ value, cause }) {
    super({
      name: name12,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a13] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
};
var name13 = "AI_UnsupportedFunctionalityError";
var marker14 = `vercel.ai.error.${name13}`;
var symbol14 = Symbol.for(marker14);
var _a14;
var _b14;
var UnsupportedFunctionalityError = class extends (_b14 = AISDKError, _a14 = symbol14, _b14) {
  constructor({
    functionality,
    message = `'${functionality}' functionality not supported.`
  }) {
    super({ name: name13, message });
    this[_a14] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker14);
  }
};

// ../../node_modules/.pnpm/@ai-sdk+provider-utils@3.0.20_zod@4.2.1/node_modules/@ai-sdk/provider-utils/dist/index.mjs
import * as z4 from "zod/v4";
import { ZodFirstPartyTypeKind as ZodFirstPartyTypeKind3 } from "zod/v3";
import { ZodFirstPartyTypeKind } from "zod/v3";
import {
  ZodFirstPartyTypeKind as ZodFirstPartyTypeKind2
} from "zod/v3";
function combineHeaders(...headers) {
  return headers.reduce(
    (combinedHeaders, currentHeaders) => ({
      ...combinedHeaders,
      ...currentHeaders != null ? currentHeaders : {}
    }),
    {}
  );
}
function extractResponseHeaders(response) {
  return Object.fromEntries([...response.headers]);
}
var createIdGenerator = ({
  prefix,
  size = 16,
  alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  separator = "-"
} = {}) => {
  const generator = () => {
    const alphabetLength = alphabet.length;
    const chars = new Array(size);
    for (let i = 0; i < size; i++) {
      chars[i] = alphabet[Math.random() * alphabetLength | 0];
    }
    return chars.join("");
  };
  if (prefix == null) {
    return generator;
  }
  if (alphabet.includes(separator)) {
    throw new InvalidArgumentError({
      argument: "separator",
      message: `The separator "${separator}" must not be part of the alphabet "${alphabet}".`
    });
  }
  return () => `${prefix}${separator}${generator()}`;
};
var generateId = createIdGenerator();
function isAbortError(error) {
  return (error instanceof Error || error instanceof DOMException) && (error.name === "AbortError" || error.name === "ResponseAborted" || // Next.js
  error.name === "TimeoutError");
}
var FETCH_FAILED_ERROR_MESSAGES = ["fetch failed", "failed to fetch"];
function handleFetchError({
  error,
  url,
  requestBodyValues
}) {
  if (isAbortError(error)) {
    return error;
  }
  if (error instanceof TypeError && FETCH_FAILED_ERROR_MESSAGES.includes(error.message.toLowerCase())) {
    const cause = error.cause;
    if (cause != null) {
      return new APICallError({
        message: `Cannot connect to API: ${cause.message}`,
        cause,
        url,
        requestBodyValues,
        isRetryable: true
        // retry when network error
      });
    }
  }
  return error;
}
function getRuntimeEnvironmentUserAgent(globalThisAny = globalThis) {
  var _a15, _b15, _c;
  if (globalThisAny.window) {
    return `runtime/browser`;
  }
  if ((_a15 = globalThisAny.navigator) == null ? void 0 : _a15.userAgent) {
    return `runtime/${globalThisAny.navigator.userAgent.toLowerCase()}`;
  }
  if ((_c = (_b15 = globalThisAny.process) == null ? void 0 : _b15.versions) == null ? void 0 : _c.node) {
    return `runtime/node.js/${globalThisAny.process.version.substring(0)}`;
  }
  if (globalThisAny.EdgeRuntime) {
    return `runtime/vercel-edge`;
  }
  return "runtime/unknown";
}
function normalizeHeaders(headers) {
  if (headers == null) {
    return {};
  }
  const normalized = {};
  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalized[key.toLowerCase()] = value;
    });
  } else {
    if (!Array.isArray(headers)) {
      headers = Object.entries(headers);
    }
    for (const [key, value] of headers) {
      if (value != null) {
        normalized[key.toLowerCase()] = value;
      }
    }
  }
  return normalized;
}
function withUserAgentSuffix(headers, ...userAgentSuffixParts) {
  const normalizedHeaders = new Headers(normalizeHeaders(headers));
  const currentUserAgentHeader = normalizedHeaders.get("user-agent") || "";
  normalizedHeaders.set(
    "user-agent",
    [currentUserAgentHeader, ...userAgentSuffixParts].filter(Boolean).join(" ")
  );
  return Object.fromEntries(normalizedHeaders.entries());
}
var VERSION = true ? "3.0.20" : "0.0.0-test";
function loadOptionalSetting({
  settingValue,
  environmentVariableName
}) {
  if (typeof settingValue === "string") {
    return settingValue;
  }
  if (settingValue != null || typeof process === "undefined") {
    return void 0;
  }
  settingValue = process.env[environmentVariableName];
  if (settingValue == null || typeof settingValue !== "string") {
    return void 0;
  }
  return settingValue;
}
function loadSetting({
  settingValue,
  environmentVariableName,
  settingName,
  description
}) {
  if (typeof settingValue === "string") {
    return settingValue;
  }
  if (settingValue != null) {
    throw new LoadSettingError({
      message: `${description} setting must be a string.`
    });
  }
  if (typeof process === "undefined") {
    throw new LoadSettingError({
      message: `${description} setting is missing. Pass it using the '${settingName}' parameter. Environment variables is not supported in this environment.`
    });
  }
  settingValue = process.env[environmentVariableName];
  if (settingValue == null) {
    throw new LoadSettingError({
      message: `${description} setting is missing. Pass it using the '${settingName}' parameter or the ${environmentVariableName} environment variable.`
    });
  }
  if (typeof settingValue !== "string") {
    throw new LoadSettingError({
      message: `${description} setting must be a string. The value of the ${environmentVariableName} environment variable is not a string.`
    });
  }
  return settingValue;
}
var suspectProtoRx = /"__proto__"\s*:/;
var suspectConstructorRx = /"constructor"\s*:/;
function _parse(text) {
  const obj = JSON.parse(text);
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
    return obj;
  }
  return filter(obj);
}
function filter(obj) {
  let next = [obj];
  while (next.length) {
    const nodes = next;
    next = [];
    for (const node of nodes) {
      if (Object.prototype.hasOwnProperty.call(node, "__proto__")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      if (Object.prototype.hasOwnProperty.call(node, "constructor") && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
        throw new SyntaxError("Object contains forbidden prototype property");
      }
      for (const key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          next.push(value);
        }
      }
    }
  }
  return obj;
}
function secureJsonParse(text) {
  const { stackTraceLimit } = Error;
  try {
    Error.stackTraceLimit = 0;
  } catch (e) {
    return _parse(text);
  }
  try {
    return _parse(text);
  } finally {
    Error.stackTraceLimit = stackTraceLimit;
  }
}
var validatorSymbol = /* @__PURE__ */ Symbol.for("vercel.ai.validator");
function validator(validate) {
  return { [validatorSymbol]: true, validate };
}
function isValidator(value) {
  return typeof value === "object" && value !== null && validatorSymbol in value && value[validatorSymbol] === true && "validate" in value;
}
function asValidator(value) {
  return isValidator(value) ? value : typeof value === "function" ? value() : standardSchemaValidator(value);
}
function standardSchemaValidator(standardSchema) {
  return validator(async (value) => {
    const result = await standardSchema["~standard"].validate(value);
    return result.issues == null ? { success: true, value: result.value } : {
      success: false,
      error: new TypeValidationError({
        value,
        cause: result.issues
      })
    };
  });
}
async function validateTypes({
  value,
  schema
}) {
  const result = await safeValidateTypes({ value, schema });
  if (!result.success) {
    throw TypeValidationError.wrap({ value, cause: result.error });
  }
  return result.value;
}
async function safeValidateTypes({
  value,
  schema
}) {
  const validator2 = asValidator(schema);
  try {
    if (validator2.validate == null) {
      return { success: true, value, rawValue: value };
    }
    const result = await validator2.validate(value);
    if (result.success) {
      return { success: true, value: result.value, rawValue: value };
    }
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: result.error }),
      rawValue: value
    };
  } catch (error) {
    return {
      success: false,
      error: TypeValidationError.wrap({ value, cause: error }),
      rawValue: value
    };
  }
}
async function parseJSON({
  text,
  schema
}) {
  try {
    const value = secureJsonParse(text);
    if (schema == null) {
      return value;
    }
    return validateTypes({ value, schema });
  } catch (error) {
    if (JSONParseError.isInstance(error) || TypeValidationError.isInstance(error)) {
      throw error;
    }
    throw new JSONParseError({ text, cause: error });
  }
}
async function safeParseJSON({
  text,
  schema
}) {
  try {
    const value = secureJsonParse(text);
    if (schema == null) {
      return { success: true, value, rawValue: value };
    }
    return await safeValidateTypes({ value, schema });
  } catch (error) {
    return {
      success: false,
      error: JSONParseError.isInstance(error) ? error : new JSONParseError({ text, cause: error }),
      rawValue: void 0
    };
  }
}
async function parseProviderOptions({
  provider,
  providerOptions,
  schema
}) {
  if ((providerOptions == null ? void 0 : providerOptions[provider]) == null) {
    return void 0;
  }
  const parsedProviderOptions = await safeValidateTypes({
    value: providerOptions[provider],
    schema
  });
  if (!parsedProviderOptions.success) {
    throw new InvalidArgumentError({
      argument: "providerOptions",
      message: `invalid ${provider} provider options`,
      cause: parsedProviderOptions.error
    });
  }
  return parsedProviderOptions.value;
}
var getOriginalFetch2 = () => globalThis.fetch;
var postJsonToApi = async ({
  url,
  headers,
  body,
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
}) => postToApi({
  url,
  headers: {
    "Content-Type": "application/json",
    ...headers
  },
  body: {
    content: JSON.stringify(body),
    values: body
  },
  failedResponseHandler,
  successfulResponseHandler,
  abortSignal,
  fetch: fetch2
});
var postToApi = async ({
  url,
  headers = {},
  body,
  successfulResponseHandler,
  failedResponseHandler,
  abortSignal,
  fetch: fetch2 = getOriginalFetch2()
}) => {
  try {
    const response = await fetch2(url, {
      method: "POST",
      headers: withUserAgentSuffix(
        headers,
        `ai-sdk/provider-utils/${VERSION}`,
        getRuntimeEnvironmentUserAgent()
      ),
      body: body.content,
      signal: abortSignal
    });
    const responseHeaders = extractResponseHeaders(response);
    if (!response.ok) {
      let errorInformation;
      try {
        errorInformation = await failedResponseHandler({
          response,
          url,
          requestBodyValues: body.values
        });
      } catch (error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
        throw new APICallError({
          message: "Failed to process error response",
          cause: error,
          statusCode: response.status,
          url,
          responseHeaders,
          requestBodyValues: body.values
        });
      }
      throw errorInformation.value;
    }
    try {
      return await successfulResponseHandler({
        response,
        url,
        requestBodyValues: body.values
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isAbortError(error) || APICallError.isInstance(error)) {
          throw error;
        }
      }
      throw new APICallError({
        message: "Failed to process successful response",
        cause: error,
        statusCode: response.status,
        url,
        responseHeaders,
        requestBodyValues: body.values
      });
    }
  } catch (error) {
    throw handleFetchError({ error, url, requestBodyValues: body.values });
  }
};
function tool(tool2) {
  return tool2;
}
function createProviderDefinedToolFactory({
  id,
  name: name14,
  inputSchema
}) {
  return ({
    execute,
    outputSchema,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool({
    type: "provider-defined",
    id,
    name: name14,
    args,
    inputSchema,
    outputSchema,
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}
function createProviderDefinedToolFactoryWithOutputSchema({
  id,
  name: name14,
  inputSchema,
  outputSchema
}) {
  return ({
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable,
    ...args
  }) => tool({
    type: "provider-defined",
    id,
    name: name14,
    args,
    inputSchema,
    outputSchema,
    execute,
    toModelOutput,
    onInputStart,
    onInputDelta,
    onInputAvailable
  });
}
async function resolve(value) {
  if (typeof value === "function") {
    value = value();
  }
  return Promise.resolve(value);
}
var createJsonErrorResponseHandler = ({
  errorSchema,
  errorToMessage,
  isRetryable
}) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const responseHeaders = extractResponseHeaders(response);
  if (responseBody.trim() === "") {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
  try {
    const parsedError = await parseJSON({
      text: responseBody,
      schema: errorSchema
    });
    return {
      responseHeaders,
      value: new APICallError({
        message: errorToMessage(parsedError),
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        data: parsedError,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response, parsedError)
      })
    };
  } catch (parseError) {
    return {
      responseHeaders,
      value: new APICallError({
        message: response.statusText,
        url,
        requestBodyValues,
        statusCode: response.status,
        responseHeaders,
        responseBody,
        isRetryable: isRetryable == null ? void 0 : isRetryable(response)
      })
    };
  }
};
var createJsonResponseHandler = (responseSchema) => async ({ response, url, requestBodyValues }) => {
  const responseBody = await response.text();
  const parsedResult = await safeParseJSON({
    text: responseBody,
    schema: responseSchema
  });
  const responseHeaders = extractResponseHeaders(response);
  if (!parsedResult.success) {
    throw new APICallError({
      message: "Invalid JSON response",
      cause: parsedResult.error,
      statusCode: response.status,
      responseHeaders,
      responseBody,
      url,
      requestBodyValues
    });
  }
  return {
    responseHeaders,
    value: parsedResult.value,
    rawValue: parsedResult.rawValue
  };
};
function addAdditionalPropertiesToJsonSchema(jsonSchema2) {
  if (jsonSchema2.type === "object") {
    jsonSchema2.additionalProperties = false;
    const properties = jsonSchema2.properties;
    if (properties != null) {
      for (const property in properties) {
        properties[property] = addAdditionalPropertiesToJsonSchema(
          properties[property]
        );
      }
    }
  }
  if (jsonSchema2.type === "array" && jsonSchema2.items != null) {
    if (Array.isArray(jsonSchema2.items)) {
      jsonSchema2.items = jsonSchema2.items.map(
        (item) => addAdditionalPropertiesToJsonSchema(item)
      );
    } else {
      jsonSchema2.items = addAdditionalPropertiesToJsonSchema(
        jsonSchema2.items
      );
    }
  }
  return jsonSchema2;
}
var getRelativePath = (pathA, pathB) => {
  let i = 0;
  for (; i < pathA.length && i < pathB.length; i++) {
    if (pathA[i] !== pathB[i]) break;
  }
  return [(pathA.length - i).toString(), ...pathB.slice(i)].join("/");
};
var ignoreOverride = /* @__PURE__ */ Symbol(
  "Let zodToJsonSchema decide on which parser to use"
);
var defaultOptions = {
  name: void 0,
  $refStrategy: "root",
  basePath: ["#"],
  effectStrategy: "input",
  pipeStrategy: "all",
  dateStrategy: "format:date-time",
  mapStrategy: "entries",
  removeAdditionalStrategy: "passthrough",
  allowedAdditionalProperties: true,
  rejectedAdditionalProperties: false,
  definitionPath: "definitions",
  strictUnions: false,
  definitions: {},
  errorMessages: false,
  patternStrategy: "escape",
  applyRegexFlags: false,
  emailStrategy: "format:email",
  base64Strategy: "contentEncoding:base64",
  nameStrategy: "ref"
};
var getDefaultOptions = (options) => typeof options === "string" ? {
  ...defaultOptions,
  name: options
} : {
  ...defaultOptions,
  ...options
};
function parseAnyDef() {
  return {};
}
function parseArrayDef(def, refs) {
  var _a15, _b15, _c;
  const res = {
    type: "array"
  };
  if (((_a15 = def.type) == null ? void 0 : _a15._def) && ((_c = (_b15 = def.type) == null ? void 0 : _b15._def) == null ? void 0 : _c.typeName) !== ZodFirstPartyTypeKind.ZodAny) {
    res.items = parseDef(def.type._def, {
      ...refs,
      currentPath: [...refs.currentPath, "items"]
    });
  }
  if (def.minLength) {
    res.minItems = def.minLength.value;
  }
  if (def.maxLength) {
    res.maxItems = def.maxLength.value;
  }
  if (def.exactLength) {
    res.minItems = def.exactLength.value;
    res.maxItems = def.exactLength.value;
  }
  return res;
}
function parseBigintDef(def) {
  const res = {
    type: "integer",
    format: "int64"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}
function parseBooleanDef() {
  return { type: "boolean" };
}
function parseBrandedDef(_def, refs) {
  return parseDef(_def.type._def, refs);
}
var parseCatchDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};
function parseDateDef(def, refs, overrideDateStrategy) {
  const strategy = overrideDateStrategy != null ? overrideDateStrategy : refs.dateStrategy;
  if (Array.isArray(strategy)) {
    return {
      anyOf: strategy.map((item, i) => parseDateDef(def, refs, item))
    };
  }
  switch (strategy) {
    case "string":
    case "format:date-time":
      return {
        type: "string",
        format: "date-time"
      };
    case "format:date":
      return {
        type: "string",
        format: "date"
      };
    case "integer":
      return integerDateParser(def);
  }
}
var integerDateParser = (def) => {
  const res = {
    type: "integer",
    format: "unix-time"
  };
  for (const check of def.checks) {
    switch (check.kind) {
      case "min":
        res.minimum = check.value;
        break;
      case "max":
        res.maximum = check.value;
        break;
    }
  }
  return res;
};
function parseDefaultDef(_def, refs) {
  return {
    ...parseDef(_def.innerType._def, refs),
    default: _def.defaultValue()
  };
}
function parseEffectsDef(_def, refs) {
  return refs.effectStrategy === "input" ? parseDef(_def.schema._def, refs) : parseAnyDef();
}
function parseEnumDef(def) {
  return {
    type: "string",
    enum: Array.from(def.values)
  };
}
var isJsonSchema7AllOfType = (type) => {
  if ("type" in type && type.type === "string") return false;
  return "allOf" in type;
};
function parseIntersectionDef(def, refs) {
  const allOf = [
    parseDef(def.left._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "0"]
    }),
    parseDef(def.right._def, {
      ...refs,
      currentPath: [...refs.currentPath, "allOf", "1"]
    })
  ].filter((x) => !!x);
  const mergedAllOf = [];
  allOf.forEach((schema) => {
    if (isJsonSchema7AllOfType(schema)) {
      mergedAllOf.push(...schema.allOf);
    } else {
      let nestedSchema = schema;
      if ("additionalProperties" in schema && schema.additionalProperties === false) {
        const { additionalProperties, ...rest } = schema;
        nestedSchema = rest;
      }
      mergedAllOf.push(nestedSchema);
    }
  });
  return mergedAllOf.length ? { allOf: mergedAllOf } : void 0;
}
function parseLiteralDef(def) {
  const parsedType = typeof def.value;
  if (parsedType !== "bigint" && parsedType !== "number" && parsedType !== "boolean" && parsedType !== "string") {
    return {
      type: Array.isArray(def.value) ? "array" : "object"
    };
  }
  return {
    type: parsedType === "bigint" ? "integer" : parsedType,
    const: def.value
  };
}
var emojiRegex = void 0;
var zodPatterns = {
  /**
   * `c` was changed to `[cC]` to replicate /i flag
   */
  cuid: /^[cC][^\s-]{8,}$/,
  cuid2: /^[0-9a-z]+$/,
  ulid: /^[0-9A-HJKMNP-TV-Z]{26}$/,
  /**
   * `a-z` was added to replicate /i flag
   */
  email: /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]*)[a-zA-Z0-9_+-]@([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]{2,}$/,
  /**
   * Constructed a valid Unicode RegExp
   *
   * Lazily instantiate since this type of regex isn't supported
   * in all envs (e.g. React Native).
   *
   * See:
   * https://github.com/colinhacks/zod/issues/2433
   * Fix in Zod:
   * https://github.com/colinhacks/zod/commit/9340fd51e48576a75adc919bff65dbc4a5d4c99b
   */
  emoji: () => {
    if (emojiRegex === void 0) {
      emojiRegex = RegExp(
        "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$",
        "u"
      );
    }
    return emojiRegex;
  },
  /**
   * Unused
   */
  uuid: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  /**
   * Unused
   */
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  ipv4Cidr: /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  /**
   * Unused
   */
  ipv6: /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/,
  ipv6Cidr: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  base64: /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  base64url: /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  nanoid: /^[a-zA-Z0-9_-]{21}$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
};
function parseStringDef(def, refs) {
  const res = {
    type: "string"
  };
  if (def.checks) {
    for (const check of def.checks) {
      switch (check.kind) {
        case "min":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          break;
        case "max":
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "email":
          switch (refs.emailStrategy) {
            case "format:email":
              addFormat(res, "email", check.message, refs);
              break;
            case "format:idn-email":
              addFormat(res, "idn-email", check.message, refs);
              break;
            case "pattern:zod":
              addPattern(res, zodPatterns.email, check.message, refs);
              break;
          }
          break;
        case "url":
          addFormat(res, "uri", check.message, refs);
          break;
        case "uuid":
          addFormat(res, "uuid", check.message, refs);
          break;
        case "regex":
          addPattern(res, check.regex, check.message, refs);
          break;
        case "cuid":
          addPattern(res, zodPatterns.cuid, check.message, refs);
          break;
        case "cuid2":
          addPattern(res, zodPatterns.cuid2, check.message, refs);
          break;
        case "startsWith":
          addPattern(
            res,
            RegExp(`^${escapeLiteralCheckValue(check.value, refs)}`),
            check.message,
            refs
          );
          break;
        case "endsWith":
          addPattern(
            res,
            RegExp(`${escapeLiteralCheckValue(check.value, refs)}$`),
            check.message,
            refs
          );
          break;
        case "datetime":
          addFormat(res, "date-time", check.message, refs);
          break;
        case "date":
          addFormat(res, "date", check.message, refs);
          break;
        case "time":
          addFormat(res, "time", check.message, refs);
          break;
        case "duration":
          addFormat(res, "duration", check.message, refs);
          break;
        case "length":
          res.minLength = typeof res.minLength === "number" ? Math.max(res.minLength, check.value) : check.value;
          res.maxLength = typeof res.maxLength === "number" ? Math.min(res.maxLength, check.value) : check.value;
          break;
        case "includes": {
          addPattern(
            res,
            RegExp(escapeLiteralCheckValue(check.value, refs)),
            check.message,
            refs
          );
          break;
        }
        case "ip": {
          if (check.version !== "v6") {
            addFormat(res, "ipv4", check.message, refs);
          }
          if (check.version !== "v4") {
            addFormat(res, "ipv6", check.message, refs);
          }
          break;
        }
        case "base64url":
          addPattern(res, zodPatterns.base64url, check.message, refs);
          break;
        case "jwt":
          addPattern(res, zodPatterns.jwt, check.message, refs);
          break;
        case "cidr": {
          if (check.version !== "v6") {
            addPattern(res, zodPatterns.ipv4Cidr, check.message, refs);
          }
          if (check.version !== "v4") {
            addPattern(res, zodPatterns.ipv6Cidr, check.message, refs);
          }
          break;
        }
        case "emoji":
          addPattern(res, zodPatterns.emoji(), check.message, refs);
          break;
        case "ulid": {
          addPattern(res, zodPatterns.ulid, check.message, refs);
          break;
        }
        case "base64": {
          switch (refs.base64Strategy) {
            case "format:binary": {
              addFormat(res, "binary", check.message, refs);
              break;
            }
            case "contentEncoding:base64": {
              res.contentEncoding = "base64";
              break;
            }
            case "pattern:zod": {
              addPattern(res, zodPatterns.base64, check.message, refs);
              break;
            }
          }
          break;
        }
        case "nanoid": {
          addPattern(res, zodPatterns.nanoid, check.message, refs);
        }
        case "toLowerCase":
        case "toUpperCase":
        case "trim":
          break;
        default:
          /* @__PURE__ */ ((_) => {
          })(check);
      }
    }
  }
  return res;
}
function escapeLiteralCheckValue(literal, refs) {
  return refs.patternStrategy === "escape" ? escapeNonAlphaNumeric(literal) : literal;
}
var ALPHA_NUMERIC = new Set(
  "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz0123456789"
);
function escapeNonAlphaNumeric(source) {
  let result = "";
  for (let i = 0; i < source.length; i++) {
    if (!ALPHA_NUMERIC.has(source[i])) {
      result += "\\";
    }
    result += source[i];
  }
  return result;
}
function addFormat(schema, value, message, refs) {
  var _a15;
  if (schema.format || ((_a15 = schema.anyOf) == null ? void 0 : _a15.some((x) => x.format))) {
    if (!schema.anyOf) {
      schema.anyOf = [];
    }
    if (schema.format) {
      schema.anyOf.push({
        format: schema.format
      });
      delete schema.format;
    }
    schema.anyOf.push({
      format: value,
      ...message && refs.errorMessages && { errorMessage: { format: message } }
    });
  } else {
    schema.format = value;
  }
}
function addPattern(schema, regex, message, refs) {
  var _a15;
  if (schema.pattern || ((_a15 = schema.allOf) == null ? void 0 : _a15.some((x) => x.pattern))) {
    if (!schema.allOf) {
      schema.allOf = [];
    }
    if (schema.pattern) {
      schema.allOf.push({
        pattern: schema.pattern
      });
      delete schema.pattern;
    }
    schema.allOf.push({
      pattern: stringifyRegExpWithFlags(regex, refs),
      ...message && refs.errorMessages && { errorMessage: { pattern: message } }
    });
  } else {
    schema.pattern = stringifyRegExpWithFlags(regex, refs);
  }
}
function stringifyRegExpWithFlags(regex, refs) {
  var _a15;
  if (!refs.applyRegexFlags || !regex.flags) {
    return regex.source;
  }
  const flags = {
    i: regex.flags.includes("i"),
    // Case-insensitive
    m: regex.flags.includes("m"),
    // `^` and `$` matches adjacent to newline characters
    s: regex.flags.includes("s")
    // `.` matches newlines
  };
  const source = flags.i ? regex.source.toLowerCase() : regex.source;
  let pattern = "";
  let isEscaped = false;
  let inCharGroup = false;
  let inCharRange = false;
  for (let i = 0; i < source.length; i++) {
    if (isEscaped) {
      pattern += source[i];
      isEscaped = false;
      continue;
    }
    if (flags.i) {
      if (inCharGroup) {
        if (source[i].match(/[a-z]/)) {
          if (inCharRange) {
            pattern += source[i];
            pattern += `${source[i - 2]}-${source[i]}`.toUpperCase();
            inCharRange = false;
          } else if (source[i + 1] === "-" && ((_a15 = source[i + 2]) == null ? void 0 : _a15.match(/[a-z]/))) {
            pattern += source[i];
            inCharRange = true;
          } else {
            pattern += `${source[i]}${source[i].toUpperCase()}`;
          }
          continue;
        }
      } else if (source[i].match(/[a-z]/)) {
        pattern += `[${source[i]}${source[i].toUpperCase()}]`;
        continue;
      }
    }
    if (flags.m) {
      if (source[i] === "^") {
        pattern += `(^|(?<=[\r
]))`;
        continue;
      } else if (source[i] === "$") {
        pattern += `($|(?=[\r
]))`;
        continue;
      }
    }
    if (flags.s && source[i] === ".") {
      pattern += inCharGroup ? `${source[i]}\r
` : `[${source[i]}\r
]`;
      continue;
    }
    pattern += source[i];
    if (source[i] === "\\") {
      isEscaped = true;
    } else if (inCharGroup && source[i] === "]") {
      inCharGroup = false;
    } else if (!inCharGroup && source[i] === "[") {
      inCharGroup = true;
    }
  }
  try {
    new RegExp(pattern);
  } catch (e) {
    console.warn(
      `Could not convert regex pattern at ${refs.currentPath.join(
        "/"
      )} to a flag-independent form! Falling back to the flag-ignorant source`
    );
    return regex.source;
  }
  return pattern;
}
function parseRecordDef(def, refs) {
  var _a15, _b15, _c, _d, _e, _f;
  const schema = {
    type: "object",
    additionalProperties: (_a15 = parseDef(def.valueType._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    })) != null ? _a15 : refs.allowedAdditionalProperties
  };
  if (((_b15 = def.keyType) == null ? void 0 : _b15._def.typeName) === ZodFirstPartyTypeKind2.ZodString && ((_c = def.keyType._def.checks) == null ? void 0 : _c.length)) {
    const { type, ...keyType } = parseStringDef(def.keyType._def, refs);
    return {
      ...schema,
      propertyNames: keyType
    };
  } else if (((_d = def.keyType) == null ? void 0 : _d._def.typeName) === ZodFirstPartyTypeKind2.ZodEnum) {
    return {
      ...schema,
      propertyNames: {
        enum: def.keyType._def.values
      }
    };
  } else if (((_e = def.keyType) == null ? void 0 : _e._def.typeName) === ZodFirstPartyTypeKind2.ZodBranded && def.keyType._def.type._def.typeName === ZodFirstPartyTypeKind2.ZodString && ((_f = def.keyType._def.type._def.checks) == null ? void 0 : _f.length)) {
    const { type, ...keyType } = parseBrandedDef(
      def.keyType._def,
      refs
    );
    return {
      ...schema,
      propertyNames: keyType
    };
  }
  return schema;
}
function parseMapDef(def, refs) {
  if (refs.mapStrategy === "record") {
    return parseRecordDef(def, refs);
  }
  const keys = parseDef(def.keyType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "0"]
  }) || parseAnyDef();
  const values = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items", "items", "1"]
  }) || parseAnyDef();
  return {
    type: "array",
    maxItems: 125,
    items: {
      type: "array",
      items: [keys, values],
      minItems: 2,
      maxItems: 2
    }
  };
}
function parseNativeEnumDef(def) {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter((key) => {
    return typeof object[object[key]] !== "number";
  });
  const actualValues = actualKeys.map((key) => object[key]);
  const parsedTypes = Array.from(
    new Set(actualValues.map((values) => typeof values))
  );
  return {
    type: parsedTypes.length === 1 ? parsedTypes[0] === "string" ? "string" : "number" : ["string", "number"],
    enum: actualValues
  };
}
function parseNeverDef() {
  return { not: parseAnyDef() };
}
function parseNullDef() {
  return {
    type: "null"
  };
}
var primitiveMappings = {
  ZodString: "string",
  ZodNumber: "number",
  ZodBigInt: "integer",
  ZodBoolean: "boolean",
  ZodNull: "null"
};
function parseUnionDef(def, refs) {
  const options = def.options instanceof Map ? Array.from(def.options.values()) : def.options;
  if (options.every(
    (x) => x._def.typeName in primitiveMappings && (!x._def.checks || !x._def.checks.length)
  )) {
    const types = options.reduce((types2, x) => {
      const type = primitiveMappings[x._def.typeName];
      return type && !types2.includes(type) ? [...types2, type] : types2;
    }, []);
    return {
      type: types.length > 1 ? types : types[0]
    };
  } else if (options.every((x) => x._def.typeName === "ZodLiteral" && !x.description)) {
    const types = options.reduce(
      (acc, x) => {
        const type = typeof x._def.value;
        switch (type) {
          case "string":
          case "number":
          case "boolean":
            return [...acc, type];
          case "bigint":
            return [...acc, "integer"];
          case "object":
            if (x._def.value === null) return [...acc, "null"];
          case "symbol":
          case "undefined":
          case "function":
          default:
            return acc;
        }
      },
      []
    );
    if (types.length === options.length) {
      const uniqueTypes = types.filter((x, i, a) => a.indexOf(x) === i);
      return {
        type: uniqueTypes.length > 1 ? uniqueTypes : uniqueTypes[0],
        enum: options.reduce(
          (acc, x) => {
            return acc.includes(x._def.value) ? acc : [...acc, x._def.value];
          },
          []
        )
      };
    }
  } else if (options.every((x) => x._def.typeName === "ZodEnum")) {
    return {
      type: "string",
      enum: options.reduce(
        (acc, x) => [
          ...acc,
          ...x._def.values.filter((x2) => !acc.includes(x2))
        ],
        []
      )
    };
  }
  return asAnyOf(def, refs);
}
var asAnyOf = (def, refs) => {
  const anyOf = (def.options instanceof Map ? Array.from(def.options.values()) : def.options).map(
    (x, i) => parseDef(x._def, {
      ...refs,
      currentPath: [...refs.currentPath, "anyOf", `${i}`]
    })
  ).filter(
    (x) => !!x && (!refs.strictUnions || typeof x === "object" && Object.keys(x).length > 0)
  );
  return anyOf.length ? { anyOf } : void 0;
};
function parseNullableDef(def, refs) {
  if (["ZodString", "ZodNumber", "ZodBigInt", "ZodBoolean", "ZodNull"].includes(
    def.innerType._def.typeName
  ) && (!def.innerType._def.checks || !def.innerType._def.checks.length)) {
    return {
      type: [
        primitiveMappings[def.innerType._def.typeName],
        "null"
      ]
    };
  }
  const base = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "0"]
  });
  return base && { anyOf: [base, { type: "null" }] };
}
function parseNumberDef(def) {
  const res = {
    type: "number"
  };
  if (!def.checks) return res;
  for (const check of def.checks) {
    switch (check.kind) {
      case "int":
        res.type = "integer";
        break;
      case "min":
        if (check.inclusive) {
          res.minimum = check.value;
        } else {
          res.exclusiveMinimum = check.value;
        }
        break;
      case "max":
        if (check.inclusive) {
          res.maximum = check.value;
        } else {
          res.exclusiveMaximum = check.value;
        }
        break;
      case "multipleOf":
        res.multipleOf = check.value;
        break;
    }
  }
  return res;
}
function parseObjectDef(def, refs) {
  const result = {
    type: "object",
    properties: {}
  };
  const required = [];
  const shape = def.shape();
  for (const propName in shape) {
    let propDef = shape[propName];
    if (propDef === void 0 || propDef._def === void 0) {
      continue;
    }
    const propOptional = safeIsOptional(propDef);
    const parsedDef = parseDef(propDef._def, {
      ...refs,
      currentPath: [...refs.currentPath, "properties", propName],
      propertyPath: [...refs.currentPath, "properties", propName]
    });
    if (parsedDef === void 0) {
      continue;
    }
    result.properties[propName] = parsedDef;
    if (!propOptional) {
      required.push(propName);
    }
  }
  if (required.length) {
    result.required = required;
  }
  const additionalProperties = decideAdditionalProperties(def, refs);
  if (additionalProperties !== void 0) {
    result.additionalProperties = additionalProperties;
  }
  return result;
}
function decideAdditionalProperties(def, refs) {
  if (def.catchall._def.typeName !== "ZodNever") {
    return parseDef(def.catchall._def, {
      ...refs,
      currentPath: [...refs.currentPath, "additionalProperties"]
    });
  }
  switch (def.unknownKeys) {
    case "passthrough":
      return refs.allowedAdditionalProperties;
    case "strict":
      return refs.rejectedAdditionalProperties;
    case "strip":
      return refs.removeAdditionalStrategy === "strict" ? refs.allowedAdditionalProperties : refs.rejectedAdditionalProperties;
  }
}
function safeIsOptional(schema) {
  try {
    return schema.isOptional();
  } catch (e) {
    return true;
  }
}
var parseOptionalDef = (def, refs) => {
  var _a15;
  if (refs.currentPath.toString() === ((_a15 = refs.propertyPath) == null ? void 0 : _a15.toString())) {
    return parseDef(def.innerType._def, refs);
  }
  const innerSchema = parseDef(def.innerType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "anyOf", "1"]
  });
  return innerSchema ? { anyOf: [{ not: parseAnyDef() }, innerSchema] } : parseAnyDef();
};
var parsePipelineDef = (def, refs) => {
  if (refs.pipeStrategy === "input") {
    return parseDef(def.in._def, refs);
  } else if (refs.pipeStrategy === "output") {
    return parseDef(def.out._def, refs);
  }
  const a = parseDef(def.in._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", "0"]
  });
  const b = parseDef(def.out._def, {
    ...refs,
    currentPath: [...refs.currentPath, "allOf", a ? "1" : "0"]
  });
  return {
    allOf: [a, b].filter((x) => x !== void 0)
  };
};
function parsePromiseDef(def, refs) {
  return parseDef(def.type._def, refs);
}
function parseSetDef(def, refs) {
  const items = parseDef(def.valueType._def, {
    ...refs,
    currentPath: [...refs.currentPath, "items"]
  });
  const schema = {
    type: "array",
    uniqueItems: true,
    items
  };
  if (def.minSize) {
    schema.minItems = def.minSize.value;
  }
  if (def.maxSize) {
    schema.maxItems = def.maxSize.value;
  }
  return schema;
}
function parseTupleDef(def, refs) {
  if (def.rest) {
    return {
      type: "array",
      minItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      ),
      additionalItems: parseDef(def.rest._def, {
        ...refs,
        currentPath: [...refs.currentPath, "additionalItems"]
      })
    };
  } else {
    return {
      type: "array",
      minItems: def.items.length,
      maxItems: def.items.length,
      items: def.items.map(
        (x, i) => parseDef(x._def, {
          ...refs,
          currentPath: [...refs.currentPath, "items", `${i}`]
        })
      ).reduce(
        (acc, x) => x === void 0 ? acc : [...acc, x],
        []
      )
    };
  }
}
function parseUndefinedDef() {
  return {
    not: parseAnyDef()
  };
}
function parseUnknownDef() {
  return parseAnyDef();
}
var parseReadonlyDef = (def, refs) => {
  return parseDef(def.innerType._def, refs);
};
var selectParser = (def, typeName, refs) => {
  switch (typeName) {
    case ZodFirstPartyTypeKind3.ZodString:
      return parseStringDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodNumber:
      return parseNumberDef(def);
    case ZodFirstPartyTypeKind3.ZodObject:
      return parseObjectDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodBigInt:
      return parseBigintDef(def);
    case ZodFirstPartyTypeKind3.ZodBoolean:
      return parseBooleanDef();
    case ZodFirstPartyTypeKind3.ZodDate:
      return parseDateDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodUndefined:
      return parseUndefinedDef();
    case ZodFirstPartyTypeKind3.ZodNull:
      return parseNullDef();
    case ZodFirstPartyTypeKind3.ZodArray:
      return parseArrayDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodUnion:
    case ZodFirstPartyTypeKind3.ZodDiscriminatedUnion:
      return parseUnionDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodIntersection:
      return parseIntersectionDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodTuple:
      return parseTupleDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodRecord:
      return parseRecordDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodLiteral:
      return parseLiteralDef(def);
    case ZodFirstPartyTypeKind3.ZodEnum:
      return parseEnumDef(def);
    case ZodFirstPartyTypeKind3.ZodNativeEnum:
      return parseNativeEnumDef(def);
    case ZodFirstPartyTypeKind3.ZodNullable:
      return parseNullableDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodOptional:
      return parseOptionalDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodMap:
      return parseMapDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodSet:
      return parseSetDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodLazy:
      return () => def.getter()._def;
    case ZodFirstPartyTypeKind3.ZodPromise:
      return parsePromiseDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodNaN:
    case ZodFirstPartyTypeKind3.ZodNever:
      return parseNeverDef();
    case ZodFirstPartyTypeKind3.ZodEffects:
      return parseEffectsDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodAny:
      return parseAnyDef();
    case ZodFirstPartyTypeKind3.ZodUnknown:
      return parseUnknownDef();
    case ZodFirstPartyTypeKind3.ZodDefault:
      return parseDefaultDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodBranded:
      return parseBrandedDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodReadonly:
      return parseReadonlyDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodCatch:
      return parseCatchDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodPipeline:
      return parsePipelineDef(def, refs);
    case ZodFirstPartyTypeKind3.ZodFunction:
    case ZodFirstPartyTypeKind3.ZodVoid:
    case ZodFirstPartyTypeKind3.ZodSymbol:
      return void 0;
    default:
      return /* @__PURE__ */ ((_) => void 0)(typeName);
  }
};
function parseDef(def, refs, forceResolution = false) {
  var _a15;
  const seenItem = refs.seen.get(def);
  if (refs.override) {
    const overrideResult = (_a15 = refs.override) == null ? void 0 : _a15.call(
      refs,
      def,
      refs,
      seenItem,
      forceResolution
    );
    if (overrideResult !== ignoreOverride) {
      return overrideResult;
    }
  }
  if (seenItem && !forceResolution) {
    const seenSchema = get$ref(seenItem, refs);
    if (seenSchema !== void 0) {
      return seenSchema;
    }
  }
  const newItem = { def, path: refs.currentPath, jsonSchema: void 0 };
  refs.seen.set(def, newItem);
  const jsonSchemaOrGetter = selectParser(def, def.typeName, refs);
  const jsonSchema2 = typeof jsonSchemaOrGetter === "function" ? parseDef(jsonSchemaOrGetter(), refs) : jsonSchemaOrGetter;
  if (jsonSchema2) {
    addMeta(def, refs, jsonSchema2);
  }
  if (refs.postProcess) {
    const postProcessResult = refs.postProcess(jsonSchema2, def, refs);
    newItem.jsonSchema = jsonSchema2;
    return postProcessResult;
  }
  newItem.jsonSchema = jsonSchema2;
  return jsonSchema2;
}
var get$ref = (item, refs) => {
  switch (refs.$refStrategy) {
    case "root":
      return { $ref: item.path.join("/") };
    case "relative":
      return { $ref: getRelativePath(refs.currentPath, item.path) };
    case "none":
    case "seen": {
      if (item.path.length < refs.currentPath.length && item.path.every((value, index) => refs.currentPath[index] === value)) {
        console.warn(
          `Recursive reference detected at ${refs.currentPath.join(
            "/"
          )}! Defaulting to any`
        );
        return parseAnyDef();
      }
      return refs.$refStrategy === "seen" ? parseAnyDef() : void 0;
    }
  }
};
var addMeta = (def, refs, jsonSchema2) => {
  if (def.description) {
    jsonSchema2.description = def.description;
  }
  return jsonSchema2;
};
var getRefs = (options) => {
  const _options = getDefaultOptions(options);
  const currentPath = _options.name !== void 0 ? [..._options.basePath, _options.definitionPath, _options.name] : _options.basePath;
  return {
    ..._options,
    currentPath,
    propertyPath: void 0,
    seen: new Map(
      Object.entries(_options.definitions).map(([name14, def]) => [
        def._def,
        {
          def: def._def,
          path: [..._options.basePath, _options.definitionPath, name14],
          // Resolution of references will be forced even though seen, so it's ok that the schema is undefined here for now.
          jsonSchema: void 0
        }
      ])
    )
  };
};
var zodToJsonSchema = (schema, options) => {
  var _a15;
  const refs = getRefs(options);
  let definitions = typeof options === "object" && options.definitions ? Object.entries(options.definitions).reduce(
    (acc, [name22, schema2]) => {
      var _a22;
      return {
        ...acc,
        [name22]: (_a22 = parseDef(
          schema2._def,
          {
            ...refs,
            currentPath: [...refs.basePath, refs.definitionPath, name22]
          },
          true
        )) != null ? _a22 : parseAnyDef()
      };
    },
    {}
  ) : void 0;
  const name14 = typeof options === "string" ? options : (options == null ? void 0 : options.nameStrategy) === "title" ? void 0 : options == null ? void 0 : options.name;
  const main = (_a15 = parseDef(
    schema._def,
    name14 === void 0 ? refs : {
      ...refs,
      currentPath: [...refs.basePath, refs.definitionPath, name14]
    },
    false
  )) != null ? _a15 : parseAnyDef();
  const title = typeof options === "object" && options.name !== void 0 && options.nameStrategy === "title" ? options.name : void 0;
  if (title !== void 0) {
    main.title = title;
  }
  const combined = name14 === void 0 ? definitions ? {
    ...main,
    [refs.definitionPath]: definitions
  } : main : {
    $ref: [
      ...refs.$refStrategy === "relative" ? [] : refs.basePath,
      refs.definitionPath,
      name14
    ].join("/"),
    [refs.definitionPath]: {
      ...definitions,
      [name14]: main
    }
  };
  combined.$schema = "http://json-schema.org/draft-07/schema#";
  return combined;
};
var zod_to_json_schema_default = zodToJsonSchema;
function zod3Schema(zodSchema2, options) {
  var _a15;
  const useReferences = (_a15 = options == null ? void 0 : options.useReferences) != null ? _a15 : false;
  return jsonSchema(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => zod_to_json_schema_default(zodSchema2, {
      $refStrategy: useReferences ? "root" : "none"
    }),
    {
      validate: async (value) => {
        const result = await zodSchema2.safeParseAsync(value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function zod4Schema(zodSchema2, options) {
  var _a15;
  const useReferences = (_a15 = options == null ? void 0 : options.useReferences) != null ? _a15 : false;
  return jsonSchema(
    // defer json schema creation to avoid unnecessary computation when only validation is needed
    () => addAdditionalPropertiesToJsonSchema(
      z4.toJSONSchema(zodSchema2, {
        target: "draft-7",
        io: "input",
        reused: useReferences ? "ref" : "inline"
      })
    ),
    {
      validate: async (value) => {
        const result = await z4.safeParseAsync(zodSchema2, value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
function isZod4Schema(zodSchema2) {
  return "_zod" in zodSchema2;
}
function zodSchema(zodSchema2, options) {
  if (isZod4Schema(zodSchema2)) {
    return zod4Schema(zodSchema2, options);
  } else {
    return zod3Schema(zodSchema2, options);
  }
}
var schemaSymbol = /* @__PURE__ */ Symbol.for("vercel.ai.schema");
function lazySchema(createSchema) {
  let schema;
  return () => {
    if (schema == null) {
      schema = createSchema();
    }
    return schema;
  };
}
function jsonSchema(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol]: true,
    _type: void 0,
    // should never be used directly
    [validatorSymbol]: true,
    get jsonSchema() {
      if (typeof jsonSchema2 === "function") {
        jsonSchema2 = jsonSchema2();
      }
      return jsonSchema2;
    },
    validate
  };
}
function isSchema(value) {
  return typeof value === "object" && value !== null && schemaSymbol in value && value[schemaSymbol] === true && "jsonSchema" in value && "validate" in value;
}
function asSchema(schema) {
  return schema == null ? jsonSchema({
    properties: {},
    additionalProperties: false
  }) : isSchema(schema) ? schema : typeof schema === "function" ? schema() : zodSchema(schema);
}
var { btoa, atob } = globalThis;
function convertUint8ArrayToBase64(array) {
  let latin1string = "";
  for (let i = 0; i < array.length; i++) {
    latin1string += String.fromCodePoint(array[i]);
  }
  return btoa(latin1string);
}
function convertToBase64(value) {
  return value instanceof Uint8Array ? convertUint8ArrayToBase64(value) : value;
}
function withoutTrailingSlash(url) {
  return url == null ? void 0 : url.replace(/\/$/, "");
}

// ../../node_modules/.pnpm/@ai-sdk+anthropic@2.0.57_zod@4.2.1/node_modules/@ai-sdk/anthropic/dist/internal/index.mjs
import { z } from "zod/v4";
import { z as z2 } from "zod/v4";
import { z as z3 } from "zod/v4";
import { z as z42 } from "zod/v4";
import { z as z5 } from "zod/v4";
import { z as z6 } from "zod/v4";
import { z as z7 } from "zod/v4";
import { z as z8 } from "zod/v4";
import { z as z9 } from "zod/v4";
import { z as z10 } from "zod/v4";
import { z as z11 } from "zod/v4";
import { z as z12 } from "zod/v4";
import { z as z13 } from "zod/v4";
import { z as z14 } from "zod/v4";
import { z as z15 } from "zod/v4";
import { z as z16 } from "zod/v4";
var anthropicErrorDataSchema = lazySchema(
  () => zodSchema(
    z.object({
      type: z.literal("error"),
      error: z.object({
        type: z.string(),
        message: z.string()
      })
    })
  )
);
var anthropicFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: anthropicErrorDataSchema,
  errorToMessage: (data) => data.error.message
});
var anthropicMessagesResponseSchema = lazySchema(
  () => zodSchema(
    z2.object({
      type: z2.literal("message"),
      id: z2.string().nullish(),
      model: z2.string().nullish(),
      content: z2.array(
        z2.discriminatedUnion("type", [
          z2.object({
            type: z2.literal("text"),
            text: z2.string(),
            citations: z2.array(
              z2.discriminatedUnion("type", [
                z2.object({
                  type: z2.literal("web_search_result_location"),
                  cited_text: z2.string(),
                  url: z2.string(),
                  title: z2.string(),
                  encrypted_index: z2.string()
                }),
                z2.object({
                  type: z2.literal("page_location"),
                  cited_text: z2.string(),
                  document_index: z2.number(),
                  document_title: z2.string().nullable(),
                  start_page_number: z2.number(),
                  end_page_number: z2.number()
                }),
                z2.object({
                  type: z2.literal("char_location"),
                  cited_text: z2.string(),
                  document_index: z2.number(),
                  document_title: z2.string().nullable(),
                  start_char_index: z2.number(),
                  end_char_index: z2.number()
                })
              ])
            ).optional()
          }),
          z2.object({
            type: z2.literal("thinking"),
            thinking: z2.string(),
            signature: z2.string()
          }),
          z2.object({
            type: z2.literal("redacted_thinking"),
            data: z2.string()
          }),
          z2.object({
            type: z2.literal("tool_use"),
            id: z2.string(),
            name: z2.string(),
            input: z2.unknown()
          }),
          z2.object({
            type: z2.literal("server_tool_use"),
            id: z2.string(),
            name: z2.string(),
            input: z2.record(z2.string(), z2.unknown()).nullish()
          }),
          z2.object({
            type: z2.literal("web_fetch_tool_result"),
            tool_use_id: z2.string(),
            content: z2.union([
              z2.object({
                type: z2.literal("web_fetch_result"),
                url: z2.string(),
                retrieved_at: z2.string(),
                content: z2.object({
                  type: z2.literal("document"),
                  title: z2.string().nullable(),
                  citations: z2.object({ enabled: z2.boolean() }).optional(),
                  source: z2.union([
                    z2.object({
                      type: z2.literal("base64"),
                      media_type: z2.literal("application/pdf"),
                      data: z2.string()
                    }),
                    z2.object({
                      type: z2.literal("text"),
                      media_type: z2.literal("text/plain"),
                      data: z2.string()
                    })
                  ])
                })
              }),
              z2.object({
                type: z2.literal("web_fetch_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          z2.object({
            type: z2.literal("web_search_tool_result"),
            tool_use_id: z2.string(),
            content: z2.union([
              z2.array(
                z2.object({
                  type: z2.literal("web_search_result"),
                  url: z2.string(),
                  title: z2.string(),
                  encrypted_content: z2.string(),
                  page_age: z2.string().nullish()
                })
              ),
              z2.object({
                type: z2.literal("web_search_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          // code execution results for code_execution_20250522 tool:
          z2.object({
            type: z2.literal("code_execution_tool_result"),
            tool_use_id: z2.string(),
            content: z2.union([
              z2.object({
                type: z2.literal("code_execution_result"),
                stdout: z2.string(),
                stderr: z2.string(),
                return_code: z2.number()
              }),
              z2.object({
                type: z2.literal("code_execution_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          // bash code execution results for code_execution_20250825 tool:
          z2.object({
            type: z2.literal("bash_code_execution_tool_result"),
            tool_use_id: z2.string(),
            content: z2.discriminatedUnion("type", [
              z2.object({
                type: z2.literal("bash_code_execution_result"),
                content: z2.array(
                  z2.object({
                    type: z2.literal("bash_code_execution_output"),
                    file_id: z2.string()
                  })
                ),
                stdout: z2.string(),
                stderr: z2.string(),
                return_code: z2.number()
              }),
              z2.object({
                type: z2.literal("bash_code_execution_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          // text editor code execution results for code_execution_20250825 tool:
          z2.object({
            type: z2.literal("text_editor_code_execution_tool_result"),
            tool_use_id: z2.string(),
            content: z2.discriminatedUnion("type", [
              z2.object({
                type: z2.literal("text_editor_code_execution_tool_result_error"),
                error_code: z2.string()
              }),
              z2.object({
                type: z2.literal("text_editor_code_execution_view_result"),
                content: z2.string(),
                file_type: z2.string(),
                num_lines: z2.number().nullable(),
                start_line: z2.number().nullable(),
                total_lines: z2.number().nullable()
              }),
              z2.object({
                type: z2.literal("text_editor_code_execution_create_result"),
                is_file_update: z2.boolean()
              }),
              z2.object({
                type: z2.literal(
                  "text_editor_code_execution_str_replace_result"
                ),
                lines: z2.array(z2.string()).nullable(),
                new_lines: z2.number().nullable(),
                new_start: z2.number().nullable(),
                old_lines: z2.number().nullable(),
                old_start: z2.number().nullable()
              })
            ])
          })
        ])
      ),
      stop_reason: z2.string().nullish(),
      stop_sequence: z2.string().nullish(),
      usage: z2.looseObject({
        input_tokens: z2.number(),
        output_tokens: z2.number(),
        cache_creation_input_tokens: z2.number().nullish(),
        cache_read_input_tokens: z2.number().nullish()
      }),
      container: z2.object({
        expires_at: z2.string(),
        id: z2.string(),
        skills: z2.array(
          z2.object({
            type: z2.union([z2.literal("anthropic"), z2.literal("custom")]),
            skill_id: z2.string(),
            version: z2.string()
          })
        ).nullish()
      }).nullish()
    })
  )
);
var anthropicMessagesChunkSchema = lazySchema(
  () => zodSchema(
    z2.discriminatedUnion("type", [
      z2.object({
        type: z2.literal("message_start"),
        message: z2.object({
          id: z2.string().nullish(),
          model: z2.string().nullish(),
          usage: z2.looseObject({
            input_tokens: z2.number(),
            cache_creation_input_tokens: z2.number().nullish(),
            cache_read_input_tokens: z2.number().nullish()
          })
        })
      }),
      z2.object({
        type: z2.literal("content_block_start"),
        index: z2.number(),
        content_block: z2.discriminatedUnion("type", [
          z2.object({
            type: z2.literal("text"),
            text: z2.string()
          }),
          z2.object({
            type: z2.literal("thinking"),
            thinking: z2.string()
          }),
          z2.object({
            type: z2.literal("tool_use"),
            id: z2.string(),
            name: z2.string()
          }),
          z2.object({
            type: z2.literal("redacted_thinking"),
            data: z2.string()
          }),
          z2.object({
            type: z2.literal("server_tool_use"),
            id: z2.string(),
            name: z2.string(),
            input: z2.record(z2.string(), z2.unknown()).nullish()
          }),
          z2.object({
            type: z2.literal("web_fetch_tool_result"),
            tool_use_id: z2.string(),
            content: z2.union([
              z2.object({
                type: z2.literal("web_fetch_result"),
                url: z2.string(),
                retrieved_at: z2.string(),
                content: z2.object({
                  type: z2.literal("document"),
                  title: z2.string().nullable(),
                  citations: z2.object({ enabled: z2.boolean() }).optional(),
                  source: z2.union([
                    z2.object({
                      type: z2.literal("base64"),
                      media_type: z2.literal("application/pdf"),
                      data: z2.string()
                    }),
                    z2.object({
                      type: z2.literal("text"),
                      media_type: z2.literal("text/plain"),
                      data: z2.string()
                    })
                  ])
                })
              }),
              z2.object({
                type: z2.literal("web_fetch_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          z2.object({
            type: z2.literal("web_search_tool_result"),
            tool_use_id: z2.string(),
            content: z2.union([
              z2.array(
                z2.object({
                  type: z2.literal("web_search_result"),
                  url: z2.string(),
                  title: z2.string(),
                  encrypted_content: z2.string(),
                  page_age: z2.string().nullish()
                })
              ),
              z2.object({
                type: z2.literal("web_search_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          // code execution results for code_execution_20250522 tool:
          z2.object({
            type: z2.literal("code_execution_tool_result"),
            tool_use_id: z2.string(),
            content: z2.union([
              z2.object({
                type: z2.literal("code_execution_result"),
                stdout: z2.string(),
                stderr: z2.string(),
                return_code: z2.number()
              }),
              z2.object({
                type: z2.literal("code_execution_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          // bash code execution results for code_execution_20250825 tool:
          z2.object({
            type: z2.literal("bash_code_execution_tool_result"),
            tool_use_id: z2.string(),
            content: z2.discriminatedUnion("type", [
              z2.object({
                type: z2.literal("bash_code_execution_result"),
                content: z2.array(
                  z2.object({
                    type: z2.literal("bash_code_execution_output"),
                    file_id: z2.string()
                  })
                ),
                stdout: z2.string(),
                stderr: z2.string(),
                return_code: z2.number()
              }),
              z2.object({
                type: z2.literal("bash_code_execution_tool_result_error"),
                error_code: z2.string()
              })
            ])
          }),
          // text editor code execution results for code_execution_20250825 tool:
          z2.object({
            type: z2.literal("text_editor_code_execution_tool_result"),
            tool_use_id: z2.string(),
            content: z2.discriminatedUnion("type", [
              z2.object({
                type: z2.literal("text_editor_code_execution_tool_result_error"),
                error_code: z2.string()
              }),
              z2.object({
                type: z2.literal("text_editor_code_execution_view_result"),
                content: z2.string(),
                file_type: z2.string(),
                num_lines: z2.number().nullable(),
                start_line: z2.number().nullable(),
                total_lines: z2.number().nullable()
              }),
              z2.object({
                type: z2.literal("text_editor_code_execution_create_result"),
                is_file_update: z2.boolean()
              }),
              z2.object({
                type: z2.literal(
                  "text_editor_code_execution_str_replace_result"
                ),
                lines: z2.array(z2.string()).nullable(),
                new_lines: z2.number().nullable(),
                new_start: z2.number().nullable(),
                old_lines: z2.number().nullable(),
                old_start: z2.number().nullable()
              })
            ])
          })
        ])
      }),
      z2.object({
        type: z2.literal("content_block_delta"),
        index: z2.number(),
        delta: z2.discriminatedUnion("type", [
          z2.object({
            type: z2.literal("input_json_delta"),
            partial_json: z2.string()
          }),
          z2.object({
            type: z2.literal("text_delta"),
            text: z2.string()
          }),
          z2.object({
            type: z2.literal("thinking_delta"),
            thinking: z2.string()
          }),
          z2.object({
            type: z2.literal("signature_delta"),
            signature: z2.string()
          }),
          z2.object({
            type: z2.literal("citations_delta"),
            citation: z2.discriminatedUnion("type", [
              z2.object({
                type: z2.literal("web_search_result_location"),
                cited_text: z2.string(),
                url: z2.string(),
                title: z2.string(),
                encrypted_index: z2.string()
              }),
              z2.object({
                type: z2.literal("page_location"),
                cited_text: z2.string(),
                document_index: z2.number(),
                document_title: z2.string().nullable(),
                start_page_number: z2.number(),
                end_page_number: z2.number()
              }),
              z2.object({
                type: z2.literal("char_location"),
                cited_text: z2.string(),
                document_index: z2.number(),
                document_title: z2.string().nullable(),
                start_char_index: z2.number(),
                end_char_index: z2.number()
              })
            ])
          })
        ])
      }),
      z2.object({
        type: z2.literal("content_block_stop"),
        index: z2.number()
      }),
      z2.object({
        type: z2.literal("error"),
        error: z2.object({
          type: z2.string(),
          message: z2.string()
        })
      }),
      z2.object({
        type: z2.literal("message_delta"),
        delta: z2.object({
          stop_reason: z2.string().nullish(),
          stop_sequence: z2.string().nullish(),
          container: z2.object({
            expires_at: z2.string(),
            id: z2.string(),
            skills: z2.array(
              z2.object({
                type: z2.union([
                  z2.literal("anthropic"),
                  z2.literal("custom")
                ]),
                skill_id: z2.string(),
                version: z2.string()
              })
            ).nullish()
          }).nullish()
        }),
        usage: z2.looseObject({
          output_tokens: z2.number(),
          cache_creation_input_tokens: z2.number().nullish()
        })
      }),
      z2.object({
        type: z2.literal("message_stop")
      }),
      z2.object({
        type: z2.literal("ping")
      })
    ])
  )
);
var anthropicReasoningMetadataSchema = lazySchema(
  () => zodSchema(
    z2.object({
      signature: z2.string().optional(),
      redactedData: z2.string().optional()
    })
  )
);
var anthropicFilePartProviderOptions = z3.object({
  /**
   * Citation configuration for this document.
   * When enabled, this document will generate citations in the response.
   */
  citations: z3.object({
    /**
     * Enable citations for this document
     */
    enabled: z3.boolean()
  }).optional(),
  /**
   * Custom title for the document.
   * If not provided, the filename will be used.
   */
  title: z3.string().optional(),
  /**
   * Context about the document that will be passed to the model
   * but not used towards cited content.
   * Useful for storing document metadata as text or stringified JSON.
   */
  context: z3.string().optional()
});
var anthropicProviderOptions = z3.object({
  sendReasoning: z3.boolean().optional(),
  /**
   * Determines how structured outputs are generated.
   *
   * - `outputFormat`: Use the `output_format` parameter to specify the structured output format.
   * - `jsonTool`: Use a special 'json' tool to specify the structured output format (default).
   * - `auto`: Use 'outputFormat' when supported, otherwise use 'jsonTool'.
   */
  structuredOutputMode: z3.enum(["outputFormat", "jsonTool", "auto"]).optional(),
  /**
   * Configuration for enabling Claude's extended thinking.
   *
   * When enabled, responses include thinking content blocks showing Claude's thinking process before the final answer.
   * Requires a minimum budget of 1,024 tokens and counts towards the `max_tokens` limit.
   */
  thinking: z3.object({
    type: z3.union([z3.literal("enabled"), z3.literal("disabled")]),
    budgetTokens: z3.number().optional()
  }).optional(),
  /**
   * Whether to disable parallel function calling during tool use. Default is false.
   * When set to true, Claude will use at most one tool per response.
   */
  disableParallelToolUse: z3.boolean().optional(),
  /**
   * Cache control settings for this message.
   * See https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
   */
  cacheControl: z3.object({
    type: z3.literal("ephemeral"),
    ttl: z3.union([z3.literal("5m"), z3.literal("1h")]).optional()
  }).optional(),
  /**
   * Agent Skills configuration. Skills enable Claude to perform specialized tasks
   * like document processing (PPTX, DOCX, PDF, XLSX) and data analysis.
   * Requires code execution tool to be enabled.
   */
  container: z3.object({
    id: z3.string().optional(),
    skills: z3.array(
      z3.object({
        type: z3.union([z3.literal("anthropic"), z3.literal("custom")]),
        skillId: z3.string(),
        version: z3.string().optional()
      })
    ).optional()
  }).optional(),
  /**
   * @default 'high'
   */
  effort: z3.enum(["low", "medium", "high"]).optional()
});
var MAX_CACHE_BREAKPOINTS = 4;
function getCacheControl(providerMetadata) {
  var _a15;
  const anthropic = providerMetadata == null ? void 0 : providerMetadata.anthropic;
  const cacheControlValue = (_a15 = anthropic == null ? void 0 : anthropic.cacheControl) != null ? _a15 : anthropic == null ? void 0 : anthropic.cache_control;
  return cacheControlValue;
}
var CacheControlValidator = class {
  constructor() {
    this.breakpointCount = 0;
    this.warnings = [];
  }
  getCacheControl(providerMetadata, context) {
    const cacheControlValue = getCacheControl(providerMetadata);
    if (!cacheControlValue) {
      return void 0;
    }
    if (!context.canCache) {
      this.warnings.push({
        type: "unsupported-setting",
        setting: "cacheControl",
        details: `cache_control cannot be set on ${context.type}. It will be ignored.`
      });
      return void 0;
    }
    this.breakpointCount++;
    if (this.breakpointCount > MAX_CACHE_BREAKPOINTS) {
      this.warnings.push({
        type: "unsupported-setting",
        setting: "cacheControl",
        details: `Maximum ${MAX_CACHE_BREAKPOINTS} cache breakpoints exceeded (found ${this.breakpointCount}). This breakpoint will be ignored.`
      });
      return void 0;
    }
    return cacheControlValue;
  }
  getWarnings() {
    return this.warnings;
  }
};
var textEditor_20250728ArgsSchema = lazySchema(
  () => zodSchema(
    z42.object({
      maxCharacters: z42.number().optional()
    })
  )
);
var textEditor_20250728InputSchema = lazySchema(
  () => zodSchema(
    z42.object({
      command: z42.enum(["view", "create", "str_replace", "insert"]),
      path: z42.string(),
      file_text: z42.string().optional(),
      insert_line: z42.number().int().optional(),
      new_str: z42.string().optional(),
      old_str: z42.string().optional(),
      view_range: z42.array(z42.number().int()).optional()
    })
  )
);
var factory = createProviderDefinedToolFactory({
  id: "anthropic.text_editor_20250728",
  name: "str_replace_based_edit_tool",
  inputSchema: textEditor_20250728InputSchema
});
var textEditor_20250728 = (args = {}) => {
  return factory(args);
};
var webSearch_20250305ArgsSchema = lazySchema(
  () => zodSchema(
    z5.object({
      maxUses: z5.number().optional(),
      allowedDomains: z5.array(z5.string()).optional(),
      blockedDomains: z5.array(z5.string()).optional(),
      userLocation: z5.object({
        type: z5.literal("approximate"),
        city: z5.string().optional(),
        region: z5.string().optional(),
        country: z5.string().optional(),
        timezone: z5.string().optional()
      }).optional()
    })
  )
);
var webSearch_20250305OutputSchema = lazySchema(
  () => zodSchema(
    z5.array(
      z5.object({
        url: z5.string(),
        title: z5.string().nullable(),
        pageAge: z5.string().nullable(),
        encryptedContent: z5.string(),
        type: z5.literal("web_search_result")
      })
    )
  )
);
var webSearch_20250305InputSchema = lazySchema(
  () => zodSchema(
    z5.object({
      query: z5.string()
    })
  )
);
var factory2 = createProviderDefinedToolFactoryWithOutputSchema({
  id: "anthropic.web_search_20250305",
  name: "web_search",
  inputSchema: webSearch_20250305InputSchema,
  outputSchema: webSearch_20250305OutputSchema
});
var webSearch_20250305 = (args = {}) => {
  return factory2(args);
};
var webFetch_20250910ArgsSchema = lazySchema(
  () => zodSchema(
    z6.object({
      maxUses: z6.number().optional(),
      allowedDomains: z6.array(z6.string()).optional(),
      blockedDomains: z6.array(z6.string()).optional(),
      citations: z6.object({ enabled: z6.boolean() }).optional(),
      maxContentTokens: z6.number().optional()
    })
  )
);
var webFetch_20250910OutputSchema = lazySchema(
  () => zodSchema(
    z6.object({
      type: z6.literal("web_fetch_result"),
      url: z6.string(),
      content: z6.object({
        type: z6.literal("document"),
        title: z6.string().nullable(),
        citations: z6.object({ enabled: z6.boolean() }).optional(),
        source: z6.union([
          z6.object({
            type: z6.literal("base64"),
            mediaType: z6.literal("application/pdf"),
            data: z6.string()
          }),
          z6.object({
            type: z6.literal("text"),
            mediaType: z6.literal("text/plain"),
            data: z6.string()
          })
        ])
      }),
      retrievedAt: z6.string().nullable()
    })
  )
);
var webFetch_20250910InputSchema = lazySchema(
  () => zodSchema(
    z6.object({
      url: z6.string()
    })
  )
);
var factory3 = createProviderDefinedToolFactoryWithOutputSchema({
  id: "anthropic.web_fetch_20250910",
  name: "web_fetch",
  inputSchema: webFetch_20250910InputSchema,
  outputSchema: webFetch_20250910OutputSchema
});
var webFetch_20250910 = (args = {}) => {
  return factory3(args);
};
async function prepareTools({
  tools,
  toolChoice,
  disableParallelToolUse,
  cacheControlValidator
}) {
  tools = (tools == null ? void 0 : tools.length) ? tools : void 0;
  const toolWarnings = [];
  const betas = /* @__PURE__ */ new Set();
  const validator2 = cacheControlValidator || new CacheControlValidator();
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0, toolWarnings, betas };
  }
  const anthropicTools2 = [];
  for (const tool2 of tools) {
    switch (tool2.type) {
      case "function": {
        const cacheControl = validator2.getCacheControl(tool2.providerOptions, {
          type: "tool definition",
          canCache: true
        });
        anthropicTools2.push({
          name: tool2.name,
          description: tool2.description,
          input_schema: tool2.inputSchema,
          cache_control: cacheControl
        });
        break;
      }
      case "provider-defined": {
        switch (tool2.id) {
          case "anthropic.code_execution_20250522": {
            betas.add("code-execution-2025-05-22");
            anthropicTools2.push({
              type: "code_execution_20250522",
              name: "code_execution",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.code_execution_20250825": {
            betas.add("code-execution-2025-08-25");
            anthropicTools2.push({
              type: "code_execution_20250825",
              name: "code_execution"
            });
            break;
          }
          case "anthropic.computer_20250124": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "computer",
              type: "computer_20250124",
              display_width_px: tool2.args.displayWidthPx,
              display_height_px: tool2.args.displayHeightPx,
              display_number: tool2.args.displayNumber,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.computer_20241022": {
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: "computer",
              type: "computer_20241022",
              display_width_px: tool2.args.displayWidthPx,
              display_height_px: tool2.args.displayHeightPx,
              display_number: tool2.args.displayNumber,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20250124": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "str_replace_editor",
              type: "text_editor_20250124",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20241022": {
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: "str_replace_editor",
              type: "text_editor_20241022",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20250429": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "str_replace_based_edit_tool",
              type: "text_editor_20250429",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.text_editor_20250728": {
            const args = await validateTypes({
              value: tool2.args,
              schema: textEditor_20250728ArgsSchema
            });
            anthropicTools2.push({
              name: "str_replace_based_edit_tool",
              type: "text_editor_20250728",
              max_characters: args.maxCharacters,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.bash_20250124": {
            betas.add("computer-use-2025-01-24");
            anthropicTools2.push({
              name: "bash",
              type: "bash_20250124",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.bash_20241022": {
            betas.add("computer-use-2024-10-22");
            anthropicTools2.push({
              name: "bash",
              type: "bash_20241022",
              cache_control: void 0
            });
            break;
          }
          case "anthropic.memory_20250818": {
            betas.add("context-management-2025-06-27");
            anthropicTools2.push({
              name: "memory",
              type: "memory_20250818"
            });
            break;
          }
          case "anthropic.web_fetch_20250910": {
            betas.add("web-fetch-2025-09-10");
            const args = await validateTypes({
              value: tool2.args,
              schema: webFetch_20250910ArgsSchema
            });
            anthropicTools2.push({
              type: "web_fetch_20250910",
              name: "web_fetch",
              max_uses: args.maxUses,
              allowed_domains: args.allowedDomains,
              blocked_domains: args.blockedDomains,
              citations: args.citations,
              max_content_tokens: args.maxContentTokens,
              cache_control: void 0
            });
            break;
          }
          case "anthropic.web_search_20250305": {
            const args = await validateTypes({
              value: tool2.args,
              schema: webSearch_20250305ArgsSchema
            });
            anthropicTools2.push({
              type: "web_search_20250305",
              name: "web_search",
              max_uses: args.maxUses,
              allowed_domains: args.allowedDomains,
              blocked_domains: args.blockedDomains,
              user_location: args.userLocation,
              cache_control: void 0
            });
            break;
          }
          default: {
            toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
            break;
          }
        }
        break;
      }
      default: {
        toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
        break;
      }
    }
  }
  if (toolChoice == null) {
    return {
      tools: anthropicTools2,
      toolChoice: disableParallelToolUse ? { type: "auto", disable_parallel_tool_use: disableParallelToolUse } : void 0,
      toolWarnings,
      betas
    };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return {
        tools: anthropicTools2,
        toolChoice: {
          type: "auto",
          disable_parallel_tool_use: disableParallelToolUse
        },
        toolWarnings,
        betas
      };
    case "required":
      return {
        tools: anthropicTools2,
        toolChoice: {
          type: "any",
          disable_parallel_tool_use: disableParallelToolUse
        },
        toolWarnings,
        betas
      };
    case "none":
      return { tools: void 0, toolChoice: void 0, toolWarnings, betas };
    case "tool":
      return {
        tools: anthropicTools2,
        toolChoice: {
          type: "tool",
          name: toolChoice.toolName,
          disable_parallel_tool_use: disableParallelToolUse
        },
        toolWarnings,
        betas
      };
    default: {
      const _exhaustiveCheck = type;
      throw new UnsupportedFunctionalityError({
        functionality: `tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}
var codeExecution_20250522OutputSchema = lazySchema(
  () => zodSchema(
    z7.object({
      type: z7.literal("code_execution_result"),
      stdout: z7.string(),
      stderr: z7.string(),
      return_code: z7.number()
    })
  )
);
var codeExecution_20250522InputSchema = lazySchema(
  () => zodSchema(
    z7.object({
      code: z7.string()
    })
  )
);
var factory4 = createProviderDefinedToolFactoryWithOutputSchema({
  id: "anthropic.code_execution_20250522",
  name: "code_execution",
  inputSchema: codeExecution_20250522InputSchema,
  outputSchema: codeExecution_20250522OutputSchema
});
var codeExecution_20250522 = (args = {}) => {
  return factory4(args);
};
var codeExecution_20250825OutputSchema = lazySchema(
  () => zodSchema(
    z8.discriminatedUnion("type", [
      z8.object({
        type: z8.literal("bash_code_execution_result"),
        content: z8.array(
          z8.object({
            type: z8.literal("bash_code_execution_output"),
            file_id: z8.string()
          })
        ),
        stdout: z8.string(),
        stderr: z8.string(),
        return_code: z8.number()
      }),
      z8.object({
        type: z8.literal("bash_code_execution_tool_result_error"),
        error_code: z8.string()
      }),
      z8.object({
        type: z8.literal("text_editor_code_execution_tool_result_error"),
        error_code: z8.string()
      }),
      z8.object({
        type: z8.literal("text_editor_code_execution_view_result"),
        content: z8.string(),
        file_type: z8.string(),
        num_lines: z8.number().nullable(),
        start_line: z8.number().nullable(),
        total_lines: z8.number().nullable()
      }),
      z8.object({
        type: z8.literal("text_editor_code_execution_create_result"),
        is_file_update: z8.boolean()
      }),
      z8.object({
        type: z8.literal("text_editor_code_execution_str_replace_result"),
        lines: z8.array(z8.string()).nullable(),
        new_lines: z8.number().nullable(),
        new_start: z8.number().nullable(),
        old_lines: z8.number().nullable(),
        old_start: z8.number().nullable()
      })
    ])
  )
);
var codeExecution_20250825InputSchema = lazySchema(
  () => zodSchema(
    z8.discriminatedUnion("type", [
      z8.object({
        type: z8.literal("bash_code_execution"),
        command: z8.string()
      }),
      z8.discriminatedUnion("command", [
        z8.object({
          type: z8.literal("text_editor_code_execution"),
          command: z8.literal("view"),
          path: z8.string()
        }),
        z8.object({
          type: z8.literal("text_editor_code_execution"),
          command: z8.literal("create"),
          path: z8.string(),
          file_text: z8.string().nullish()
        }),
        z8.object({
          type: z8.literal("text_editor_code_execution"),
          command: z8.literal("str_replace"),
          path: z8.string(),
          old_str: z8.string(),
          new_str: z8.string()
        })
      ])
    ])
  )
);
var factory5 = createProviderDefinedToolFactoryWithOutputSchema({
  id: "anthropic.code_execution_20250825",
  name: "code_execution",
  inputSchema: codeExecution_20250825InputSchema,
  outputSchema: codeExecution_20250825OutputSchema
});
var codeExecution_20250825 = (args = {}) => {
  return factory5(args);
};
var bash_20241022InputSchema = lazySchema(
  () => zodSchema(
    z9.object({
      command: z9.string(),
      restart: z9.boolean().optional()
    })
  )
);
var bash_20241022 = createProviderDefinedToolFactory({
  id: "anthropic.bash_20241022",
  name: "bash",
  inputSchema: bash_20241022InputSchema
});
var bash_20250124InputSchema = lazySchema(
  () => zodSchema(
    z10.object({
      command: z10.string(),
      restart: z10.boolean().optional()
    })
  )
);
var bash_20250124 = createProviderDefinedToolFactory({
  id: "anthropic.bash_20250124",
  name: "bash",
  inputSchema: bash_20250124InputSchema
});
var computer_20241022InputSchema = lazySchema(
  () => zodSchema(
    z11.object({
      action: z11.enum([
        "key",
        "type",
        "mouse_move",
        "left_click",
        "left_click_drag",
        "right_click",
        "middle_click",
        "double_click",
        "screenshot",
        "cursor_position"
      ]),
      coordinate: z11.array(z11.number().int()).optional(),
      text: z11.string().optional()
    })
  )
);
var computer_20241022 = createProviderDefinedToolFactory({
  id: "anthropic.computer_20241022",
  name: "computer",
  inputSchema: computer_20241022InputSchema
});
var computer_20250124InputSchema = lazySchema(
  () => zodSchema(
    z12.object({
      action: z12.enum([
        "key",
        "hold_key",
        "type",
        "cursor_position",
        "mouse_move",
        "left_mouse_down",
        "left_mouse_up",
        "left_click",
        "left_click_drag",
        "right_click",
        "middle_click",
        "double_click",
        "triple_click",
        "scroll",
        "wait",
        "screenshot"
      ]),
      coordinate: z12.tuple([z12.number().int(), z12.number().int()]).optional(),
      duration: z12.number().optional(),
      scroll_amount: z12.number().optional(),
      scroll_direction: z12.enum(["up", "down", "left", "right"]).optional(),
      start_coordinate: z12.tuple([z12.number().int(), z12.number().int()]).optional(),
      text: z12.string().optional()
    })
  )
);
var computer_20250124 = createProviderDefinedToolFactory({
  id: "anthropic.computer_20250124",
  name: "computer",
  inputSchema: computer_20250124InputSchema
});
var memory_20250818InputSchema = lazySchema(
  () => zodSchema(
    z13.discriminatedUnion("command", [
      z13.object({
        command: z13.literal("view"),
        path: z13.string(),
        view_range: z13.tuple([z13.number(), z13.number()]).optional()
      }),
      z13.object({
        command: z13.literal("create"),
        path: z13.string(),
        file_text: z13.string()
      }),
      z13.object({
        command: z13.literal("str_replace"),
        path: z13.string(),
        old_str: z13.string(),
        new_str: z13.string()
      }),
      z13.object({
        command: z13.literal("insert"),
        path: z13.string(),
        insert_line: z13.number(),
        insert_text: z13.string()
      }),
      z13.object({
        command: z13.literal("delete"),
        path: z13.string()
      }),
      z13.object({
        command: z13.literal("rename"),
        old_path: z13.string(),
        new_path: z13.string()
      })
    ])
  )
);
var memory_20250818 = createProviderDefinedToolFactory({
  id: "anthropic.memory_20250818",
  name: "memory",
  inputSchema: memory_20250818InputSchema
});
var textEditor_20241022InputSchema = lazySchema(
  () => zodSchema(
    z14.object({
      command: z14.enum(["view", "create", "str_replace", "insert", "undo_edit"]),
      path: z14.string(),
      file_text: z14.string().optional(),
      insert_line: z14.number().int().optional(),
      new_str: z14.string().optional(),
      old_str: z14.string().optional(),
      view_range: z14.array(z14.number().int()).optional()
    })
  )
);
var textEditor_20241022 = createProviderDefinedToolFactory({
  id: "anthropic.text_editor_20241022",
  name: "str_replace_editor",
  inputSchema: textEditor_20241022InputSchema
});
var textEditor_20250124InputSchema = lazySchema(
  () => zodSchema(
    z15.object({
      command: z15.enum(["view", "create", "str_replace", "insert", "undo_edit"]),
      path: z15.string(),
      file_text: z15.string().optional(),
      insert_line: z15.number().int().optional(),
      new_str: z15.string().optional(),
      old_str: z15.string().optional(),
      view_range: z15.array(z15.number().int()).optional()
    })
  )
);
var textEditor_20250124 = createProviderDefinedToolFactory({
  id: "anthropic.text_editor_20250124",
  name: "str_replace_editor",
  inputSchema: textEditor_20250124InputSchema
});
var textEditor_20250429InputSchema = lazySchema(
  () => zodSchema(
    z16.object({
      command: z16.enum(["view", "create", "str_replace", "insert"]),
      path: z16.string(),
      file_text: z16.string().optional(),
      insert_line: z16.number().int().optional(),
      new_str: z16.string().optional(),
      old_str: z16.string().optional(),
      view_range: z16.array(z16.number().int()).optional()
    })
  )
);
var textEditor_20250429 = createProviderDefinedToolFactory({
  id: "anthropic.text_editor_20250429",
  name: "str_replace_based_edit_tool",
  inputSchema: textEditor_20250429InputSchema
});
var anthropicTools = {
  /**
   * The bash tool enables Claude to execute shell commands in a persistent bash session,
   * allowing system operations, script execution, and command-line automation.
   *
   * Image results are supported.
   *
   * Tool name must be `bash`.
   */
  bash_20241022,
  /**
   * The bash tool enables Claude to execute shell commands in a persistent bash session,
   * allowing system operations, script execution, and command-line automation.
   *
   * Image results are supported.
   *
   * Tool name must be `bash`.
   */
  bash_20250124,
  /**
   * Claude can analyze data, create visualizations, perform complex calculations,
   * run system commands, create and edit files, and process uploaded files directly within
   * the API conversation.
   *
   * The code execution tool allows Claude to run Bash commands and manipulate files,
   * including writing code, in a secure, sandboxed environment.
   *
   * Tool name must be `code_execution`.
   */
  codeExecution_20250522,
  /**
   * Claude can analyze data, create visualizations, perform complex calculations,
   * run system commands, create and edit files, and process uploaded files directly within
   * the API conversation.
   *
   * The code execution tool allows Claude to run both Python and Bash commands and manipulate files,
   * including writing code, in a secure, sandboxed environment.
   *
   * This is the latest version with enhanced Bash support and file operations.
   *
   * Tool name must be `code_execution`.
   */
  codeExecution_20250825,
  /**
   * Claude can interact with computer environments through the computer use tool, which
   * provides screenshot capabilities and mouse/keyboard control for autonomous desktop interaction.
   *
   * Image results are supported.
   *
   * Tool name must be `computer`.
   *
   * @param displayWidthPx - The width of the display being controlled by the model in pixels.
   * @param displayHeightPx - The height of the display being controlled by the model in pixels.
   * @param displayNumber - The display number to control (only relevant for X11 environments). If specified, the tool will be provided a display number in the tool definition.
   */
  computer_20241022,
  /**
   * Claude can interact with computer environments through the computer use tool, which
   * provides screenshot capabilities and mouse/keyboard control for autonomous desktop interaction.
   *
   * Image results are supported.
   *
   * Tool name must be `computer`.
   *
   * @param displayWidthPx - The width of the display being controlled by the model in pixels.
   * @param displayHeightPx - The height of the display being controlled by the model in pixels.
   * @param displayNumber - The display number to control (only relevant for X11 environments). If specified, the tool will be provided a display number in the tool definition.
   */
  computer_20250124,
  /**
   * The memory tool enables Claude to store and retrieve information across conversations through a memory file directory.
   * Claude can create, read, update, and delete files that persist between sessions,
   * allowing it to build knowledge over time without keeping everything in the context window.
   * The memory tool operates client-side—you control where and how the data is stored through your own infrastructure.
   *
   * Supported models: Claude Sonnet 4.5, Claude Sonnet 4, Claude Opus 4.1, Claude Opus 4.
   *
   * Tool name must be `memory`.
   */
  memory_20250818,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Supported models: Claude Sonnet 3.5
   *
   * Tool name must be `str_replace_editor`.
   */
  textEditor_20241022,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Supported models: Claude Sonnet 3.7
   *
   * Tool name must be `str_replace_editor`.
   */
  textEditor_20250124,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Note: This version does not support the "undo_edit" command.
   *
   * Tool name must be `str_replace_based_edit_tool`.
   *
   * @deprecated Use textEditor_20250728 instead
   */
  textEditor_20250429,
  /**
   * Claude can use an Anthropic-defined text editor tool to view and modify text files,
   * helping you debug, fix, and improve your code or other text documents. This allows Claude
   * to directly interact with your files, providing hands-on assistance rather than just suggesting changes.
   *
   * Note: This version does not support the "undo_edit" command and adds optional max_characters parameter.
   *
   * Supported models: Claude Sonnet 4, Opus 4, and Opus 4.1
   *
   * Tool name must be `str_replace_based_edit_tool`.
   *
   * @param maxCharacters - Optional maximum number of characters to view in the file
   */
  textEditor_20250728,
  /**
   * Creates a web fetch tool that gives Claude direct access to real-time web content.
   *
   * Tool name must be `web_fetch`.
   *
   * @param maxUses - The max_uses parameter limits the number of web fetches performed
   * @param allowedDomains - Only fetch from these domains
   * @param blockedDomains - Never fetch from these domains
   * @param citations - Unlike web search where citations are always enabled, citations are optional for web fetch. Set "citations": {"enabled": true} to enable Claude to cite specific passages from fetched documents.
   * @param maxContentTokens - The max_content_tokens parameter limits the amount of content that will be included in the context.
   */
  webFetch_20250910,
  /**
   * Creates a web search tool that gives Claude direct access to real-time web content.
   *
   * Tool name must be `web_search`.
   *
   * @param maxUses - Maximum number of web searches Claude can perform during the conversation.
   * @param allowedDomains - Optional list of domains that Claude is allowed to search.
   * @param blockedDomains - Optional list of domains that Claude should avoid when searching.
   * @param userLocation - Optional user location information to provide geographically relevant search results.
   */
  webSearch_20250305
};

// ../../node_modules/.pnpm/@ai-sdk+amazon-bedrock@3.0.73_zod@4.2.1/node_modules/@ai-sdk/amazon-bedrock/dist/index.mjs
import { z as z32 } from "zod/v4";
import { z as z17 } from "zod/v4";
import { z as z22 } from "zod/v4";

// ../../node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve2) {
      resolve2(value);
    });
  }
  return new (P || (P = Promise))(function(resolve2, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

// ../../node_modules/.pnpm/@smithy+util-buffer-from@2.2.0/node_modules/@smithy/util-buffer-from/dist-es/index.js
import { Buffer as Buffer2 } from "buffer";
var fromString = (input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return encoding ? Buffer2.from(input, encoding) : Buffer2.from(input);
};

// ../../node_modules/.pnpm/@smithy+util-utf8@2.3.0/node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var fromUtf8 = (input) => {
  const buf = fromString(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/module/convertToBuffer.js
var fromUtf82 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
  return Buffer.from(input, "utf8");
} : fromUtf8;
function convertToBuffer(data) {
  if (data instanceof Uint8Array)
    return data;
  if (typeof data === "string") {
    return fromUtf82(data);
  }
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  }
  return new Uint8Array(data);
}

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/module/isEmptyData.js
function isEmptyData(data) {
  if (typeof data === "string") {
    return data.length === 0;
  }
  return data.byteLength === 0;
}

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/module/numToUint8.js
function numToUint8(num) {
  return new Uint8Array([
    (num & 4278190080) >> 24,
    (num & 16711680) >> 16,
    (num & 65280) >> 8,
    num & 255
  ]);
}

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/module/uint32ArrayFrom.js
function uint32ArrayFrom(a_lookUpTable2) {
  if (!Uint32Array.from) {
    var return_array = new Uint32Array(a_lookUpTable2.length);
    var a_index = 0;
    while (a_index < a_lookUpTable2.length) {
      return_array[a_index] = a_lookUpTable2[a_index];
      a_index += 1;
    }
    return return_array;
  }
  return Uint32Array.from(a_lookUpTable2);
}

// ../../node_modules/.pnpm/@aws-crypto+crc32@5.2.0/node_modules/@aws-crypto/crc32/build/module/aws_crc32.js
var AwsCrc32 = (
  /** @class */
  (function() {
    function AwsCrc322() {
      this.crc32 = new Crc32();
    }
    AwsCrc322.prototype.update = function(toHash) {
      if (isEmptyData(toHash))
        return;
      this.crc32.update(convertToBuffer(toHash));
    };
    AwsCrc322.prototype.digest = function() {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a15) {
          return [2, numToUint8(this.crc32.digest())];
        });
      });
    };
    AwsCrc322.prototype.reset = function() {
      this.crc32 = new Crc32();
    };
    return AwsCrc322;
  })()
);

// ../../node_modules/.pnpm/@aws-crypto+crc32@5.2.0/node_modules/@aws-crypto/crc32/build/module/index.js
var Crc32 = (
  /** @class */
  (function() {
    function Crc322() {
      this.checksum = 4294967295;
    }
    Crc322.prototype.update = function(data) {
      var e_1, _a15;
      try {
        for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
          var byte = data_1_1.value;
          this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (data_1_1 && !data_1_1.done && (_a15 = data_1.return)) _a15.call(data_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      return this;
    };
    Crc322.prototype.digest = function() {
      return (this.checksum ^ 4294967295) >>> 0;
    };
    return Crc322;
  })()
);
var a_lookUpTable = [
  0,
  1996959894,
  3993919788,
  2567524794,
  124634137,
  1886057615,
  3915621685,
  2657392035,
  249268274,
  2044508324,
  3772115230,
  2547177864,
  162941995,
  2125561021,
  3887607047,
  2428444049,
  498536548,
  1789927666,
  4089016648,
  2227061214,
  450548861,
  1843258603,
  4107580753,
  2211677639,
  325883990,
  1684777152,
  4251122042,
  2321926636,
  335633487,
  1661365465,
  4195302755,
  2366115317,
  997073096,
  1281953886,
  3579855332,
  2724688242,
  1006888145,
  1258607687,
  3524101629,
  2768942443,
  901097722,
  1119000684,
  3686517206,
  2898065728,
  853044451,
  1172266101,
  3705015759,
  2882616665,
  651767980,
  1373503546,
  3369554304,
  3218104598,
  565507253,
  1454621731,
  3485111705,
  3099436303,
  671266974,
  1594198024,
  3322730930,
  2970347812,
  795835527,
  1483230225,
  3244367275,
  3060149565,
  1994146192,
  31158534,
  2563907772,
  4023717930,
  1907459465,
  112637215,
  2680153253,
  3904427059,
  2013776290,
  251722036,
  2517215374,
  3775830040,
  2137656763,
  141376813,
  2439277719,
  3865271297,
  1802195444,
  476864866,
  2238001368,
  4066508878,
  1812370925,
  453092731,
  2181625025,
  4111451223,
  1706088902,
  314042704,
  2344532202,
  4240017532,
  1658658271,
  366619977,
  2362670323,
  4224994405,
  1303535960,
  984961486,
  2747007092,
  3569037538,
  1256170817,
  1037604311,
  2765210733,
  3554079995,
  1131014506,
  879679996,
  2909243462,
  3663771856,
  1141124467,
  855842277,
  2852801631,
  3708648649,
  1342533948,
  654459306,
  3188396048,
  3373015174,
  1466479909,
  544179635,
  3110523913,
  3462522015,
  1591671054,
  702138776,
  2966460450,
  3352799412,
  1504918807,
  783551873,
  3082640443,
  3233442989,
  3988292384,
  2596254646,
  62317068,
  1957810842,
  3939845945,
  2647816111,
  81470997,
  1943803523,
  3814918930,
  2489596804,
  225274430,
  2053790376,
  3826175755,
  2466906013,
  167816743,
  2097651377,
  4027552580,
  2265490386,
  503444072,
  1762050814,
  4150417245,
  2154129355,
  426522225,
  1852507879,
  4275313526,
  2312317920,
  282753626,
  1742555852,
  4189708143,
  2394877945,
  397917763,
  1622183637,
  3604390888,
  2714866558,
  953729732,
  1340076626,
  3518719985,
  2797360999,
  1068828381,
  1219638859,
  3624741850,
  2936675148,
  906185462,
  1090812512,
  3747672003,
  2825379669,
  829329135,
  1181335161,
  3412177804,
  3160834842,
  628085408,
  1382605366,
  3423369109,
  3138078467,
  570562233,
  1426400815,
  3317316542,
  2998733608,
  733239954,
  1555261956,
  3268935591,
  3050360625,
  752459403,
  1541320221,
  2607071920,
  3965973030,
  1969922972,
  40735498,
  2617837225,
  3943577151,
  1913087877,
  83908371,
  2512341634,
  3803740692,
  2075208622,
  213261112,
  2463272603,
  3855990285,
  2094854071,
  198958881,
  2262029012,
  4057260610,
  1759359992,
  534414190,
  2176718541,
  4139329115,
  1873836001,
  414664567,
  2282248934,
  4279200368,
  1711684554,
  285281116,
  2405801727,
  4167216745,
  1634467795,
  376229701,
  2685067896,
  3608007406,
  1308918612,
  956543938,
  2808555105,
  3495958263,
  1231636301,
  1047427035,
  2932959818,
  3654703836,
  1088359270,
  936918e3,
  2847714899,
  3736837829,
  1202900863,
  817233897,
  3183342108,
  3401237130,
  1404277552,
  615818150,
  3134207493,
  3453421203,
  1423857449,
  601450431,
  3009837614,
  3294710456,
  1567103746,
  711928724,
  3020668471,
  3272380065,
  1510334235,
  755167117
];
var lookupTable = uint32ArrayFrom(a_lookUpTable);

// ../../node_modules/.pnpm/@smithy+util-hex-encoding@4.2.0/node_modules/@smithy/util-hex-encoding/dist-es/index.js
var SHORT_TO_HEX = {};
var HEX_TO_SHORT = {};
for (let i = 0; i < 256; i++) {
  let encodedByte = i.toString(16).toLowerCase();
  if (encodedByte.length === 1) {
    encodedByte = `0${encodedByte}`;
  }
  SHORT_TO_HEX[i] = encodedByte;
  HEX_TO_SHORT[encodedByte] = i;
}
function fromHex(encoded) {
  if (encoded.length % 2 !== 0) {
    throw new Error("Hex encoded strings must have an even number length");
  }
  const out = new Uint8Array(encoded.length / 2);
  for (let i = 0; i < encoded.length; i += 2) {
    const encodedByte = encoded.slice(i, i + 2).toLowerCase();
    if (encodedByte in HEX_TO_SHORT) {
      out[i / 2] = HEX_TO_SHORT[encodedByte];
    } else {
      throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
    }
  }
  return out;
}
function toHex(bytes) {
  let out = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    out += SHORT_TO_HEX[bytes[i]];
  }
  return out;
}

// ../../node_modules/.pnpm/@smithy+eventstream-codec@4.2.7/node_modules/@smithy/eventstream-codec/dist-es/Int64.js
var Int64 = class _Int64 {
  bytes;
  constructor(bytes) {
    this.bytes = bytes;
    if (bytes.byteLength !== 8) {
      throw new Error("Int64 buffers must be exactly 8 bytes");
    }
  }
  static fromNumber(number) {
    if (number > 9223372036854776e3 || number < -9223372036854776e3) {
      throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
    }
    const bytes = new Uint8Array(8);
    for (let i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) {
      bytes[i] = remaining;
    }
    if (number < 0) {
      negate(bytes);
    }
    return new _Int64(bytes);
  }
  valueOf() {
    const bytes = this.bytes.slice(0);
    const negative = bytes[0] & 128;
    if (negative) {
      negate(bytes);
    }
    return parseInt(toHex(bytes), 16) * (negative ? -1 : 1);
  }
  toString() {
    return String(this.valueOf());
  }
};
function negate(bytes) {
  for (let i = 0; i < 8; i++) {
    bytes[i] ^= 255;
  }
  for (let i = 7; i > -1; i--) {
    bytes[i]++;
    if (bytes[i] !== 0)
      break;
  }
}

// ../../node_modules/.pnpm/@smithy+eventstream-codec@4.2.7/node_modules/@smithy/eventstream-codec/dist-es/HeaderMarshaller.js
var HeaderMarshaller = class {
  toUtf8;
  fromUtf8;
  constructor(toUtf82, fromUtf84) {
    this.toUtf8 = toUtf82;
    this.fromUtf8 = fromUtf84;
  }
  format(headers) {
    const chunks = [];
    for (const headerName of Object.keys(headers)) {
      const bytes = this.fromUtf8(headerName);
      chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
    }
    const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
    let position = 0;
    for (const chunk of chunks) {
      out.set(chunk, position);
      position += chunk.byteLength;
    }
    return out;
  }
  formatHeaderValue(header) {
    switch (header.type) {
      case "boolean":
        return Uint8Array.from([header.value ? 0 : 1]);
      case "byte":
        return Uint8Array.from([2, header.value]);
      case "short":
        const shortView = new DataView(new ArrayBuffer(3));
        shortView.setUint8(0, 3);
        shortView.setInt16(1, header.value, false);
        return new Uint8Array(shortView.buffer);
      case "integer":
        const intView = new DataView(new ArrayBuffer(5));
        intView.setUint8(0, 4);
        intView.setInt32(1, header.value, false);
        return new Uint8Array(intView.buffer);
      case "long":
        const longBytes = new Uint8Array(9);
        longBytes[0] = 5;
        longBytes.set(header.value.bytes, 1);
        return longBytes;
      case "binary":
        const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
        binView.setUint8(0, 6);
        binView.setUint16(1, header.value.byteLength, false);
        const binBytes = new Uint8Array(binView.buffer);
        binBytes.set(header.value, 3);
        return binBytes;
      case "string":
        const utf8Bytes = this.fromUtf8(header.value);
        const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
        strView.setUint8(0, 7);
        strView.setUint16(1, utf8Bytes.byteLength, false);
        const strBytes = new Uint8Array(strView.buffer);
        strBytes.set(utf8Bytes, 3);
        return strBytes;
      case "timestamp":
        const tsBytes = new Uint8Array(9);
        tsBytes[0] = 8;
        tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
        return tsBytes;
      case "uuid":
        if (!UUID_PATTERN.test(header.value)) {
          throw new Error(`Invalid UUID received: ${header.value}`);
        }
        const uuidBytes = new Uint8Array(17);
        uuidBytes[0] = 9;
        uuidBytes.set(fromHex(header.value.replace(/\-/g, "")), 1);
        return uuidBytes;
    }
  }
  parse(headers) {
    const out = {};
    let position = 0;
    while (position < headers.byteLength) {
      const nameLength = headers.getUint8(position++);
      const name14 = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
      position += nameLength;
      switch (headers.getUint8(position++)) {
        case 0:
          out[name14] = {
            type: BOOLEAN_TAG,
            value: true
          };
          break;
        case 1:
          out[name14] = {
            type: BOOLEAN_TAG,
            value: false
          };
          break;
        case 2:
          out[name14] = {
            type: BYTE_TAG,
            value: headers.getInt8(position++)
          };
          break;
        case 3:
          out[name14] = {
            type: SHORT_TAG,
            value: headers.getInt16(position, false)
          };
          position += 2;
          break;
        case 4:
          out[name14] = {
            type: INT_TAG,
            value: headers.getInt32(position, false)
          };
          position += 4;
          break;
        case 5:
          out[name14] = {
            type: LONG_TAG,
            value: new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
          };
          position += 8;
          break;
        case 6:
          const binaryLength = headers.getUint16(position, false);
          position += 2;
          out[name14] = {
            type: BINARY_TAG,
            value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
          };
          position += binaryLength;
          break;
        case 7:
          const stringLength = headers.getUint16(position, false);
          position += 2;
          out[name14] = {
            type: STRING_TAG,
            value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
          };
          position += stringLength;
          break;
        case 8:
          out[name14] = {
            type: TIMESTAMP_TAG,
            value: new Date(new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
          };
          position += 8;
          break;
        case 9:
          const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
          position += 16;
          out[name14] = {
            type: UUID_TAG,
            value: `${toHex(uuidBytes.subarray(0, 4))}-${toHex(uuidBytes.subarray(4, 6))}-${toHex(uuidBytes.subarray(6, 8))}-${toHex(uuidBytes.subarray(8, 10))}-${toHex(uuidBytes.subarray(10))}`
          };
          break;
        default:
          throw new Error(`Unrecognized header type tag`);
      }
    }
    return out;
  }
};
var HEADER_VALUE_TYPE;
(function(HEADER_VALUE_TYPE2) {
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
  HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
var BOOLEAN_TAG = "boolean";
var BYTE_TAG = "byte";
var SHORT_TAG = "short";
var INT_TAG = "integer";
var LONG_TAG = "long";
var BINARY_TAG = "binary";
var STRING_TAG = "string";
var TIMESTAMP_TAG = "timestamp";
var UUID_TAG = "uuid";
var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

// ../../node_modules/.pnpm/@smithy+eventstream-codec@4.2.7/node_modules/@smithy/eventstream-codec/dist-es/splitMessage.js
var PRELUDE_MEMBER_LENGTH = 4;
var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
var CHECKSUM_LENGTH = 4;
var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
function splitMessage({ byteLength, byteOffset, buffer }) {
  if (byteLength < MINIMUM_MESSAGE_LENGTH) {
    throw new Error("Provided message too short to accommodate event stream message overhead");
  }
  const view = new DataView(buffer, byteOffset, byteLength);
  const messageLength = view.getUint32(0, false);
  if (byteLength !== messageLength) {
    throw new Error("Reported message length does not match received message length");
  }
  const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
  const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
  const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
  const checksummer = new Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
  if (expectedPreludeChecksum !== checksummer.digest()) {
    throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
  }
  checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
  if (expectedMessageChecksum !== checksummer.digest()) {
    throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
  }
  return {
    headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
    body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
  };
}

// ../../node_modules/.pnpm/@smithy+eventstream-codec@4.2.7/node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js
var EventStreamCodec = class {
  headerMarshaller;
  messageBuffer;
  isEndOfStream;
  constructor(toUtf82, fromUtf84) {
    this.headerMarshaller = new HeaderMarshaller(toUtf82, fromUtf84);
    this.messageBuffer = [];
    this.isEndOfStream = false;
  }
  feed(message) {
    this.messageBuffer.push(this.decode(message));
  }
  endOfStream() {
    this.isEndOfStream = true;
  }
  getMessage() {
    const message = this.messageBuffer.pop();
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessage() {
        return message;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  getAvailableMessages() {
    const messages = this.messageBuffer;
    this.messageBuffer = [];
    const isEndOfStream = this.isEndOfStream;
    return {
      getMessages() {
        return messages;
      },
      isEndOfStream() {
        return isEndOfStream;
      }
    };
  }
  encode({ headers: rawHeaders, body }) {
    const headers = this.headerMarshaller.format(rawHeaders);
    const length = headers.byteLength + body.byteLength + 16;
    const out = new Uint8Array(length);
    const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
    const checksum = new Crc32();
    view.setUint32(0, length, false);
    view.setUint32(4, headers.byteLength, false);
    view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
    out.set(headers, 12);
    out.set(body, headers.byteLength + 12);
    view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
    return out;
  }
  decode(message) {
    const { headers, body } = splitMessage(message);
    return { headers: this.headerMarshaller.parse(headers), body };
  }
  formatHeaders(rawHeaders) {
    return this.headerMarshaller.format(rawHeaders);
  }
};

// ../../node_modules/.pnpm/@smithy+is-array-buffer@4.2.0/node_modules/@smithy/is-array-buffer/dist-es/index.js
var isArrayBuffer2 = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";

// ../../node_modules/.pnpm/@smithy+util-buffer-from@4.2.0/node_modules/@smithy/util-buffer-from/dist-es/index.js
import { Buffer as Buffer3 } from "buffer";
var fromArrayBuffer2 = (input, offset = 0, length = input.byteLength - offset) => {
  if (!isArrayBuffer2(input)) {
    throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
  }
  return Buffer3.from(input, offset, length);
};
var fromString2 = (input, encoding) => {
  if (typeof input !== "string") {
    throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
  }
  return encoding ? Buffer3.from(input, encoding) : Buffer3.from(input);
};

// ../../node_modules/.pnpm/@smithy+util-utf8@4.2.0/node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var fromUtf83 = (input) => {
  const buf = fromString2(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};

// ../../node_modules/.pnpm/@smithy+util-utf8@4.2.0/node_modules/@smithy/util-utf8/dist-es/toUtf8.js
var toUtf8 = (input) => {
  if (typeof input === "string") {
    return input;
  }
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
    throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  }
  return fromArrayBuffer2(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};

// ../../node_modules/.pnpm/@ai-sdk+amazon-bedrock@3.0.73_zod@4.2.1/node_modules/@ai-sdk/amazon-bedrock/dist/index.mjs
import { z as z43 } from "zod/v4";
import { z as z52 } from "zod/v4";
import { z as z62 } from "zod/v4";

// ../../node_modules/.pnpm/aws4fetch@1.0.20/node_modules/aws4fetch/dist/aws4fetch.esm.mjs
var encoder = new TextEncoder();
var HOST_SERVICES = {
  appstream2: "appstream",
  cloudhsmv2: "cloudhsm",
  email: "ses",
  marketplace: "aws-marketplace",
  mobile: "AWSMobileHubService",
  pinpoint: "mobiletargeting",
  queue: "sqs",
  "git-codecommit": "codecommit",
  "mturk-requester-sandbox": "mturk-requester",
  "personalize-runtime": "personalize"
};
var UNSIGNABLE_HEADERS = /* @__PURE__ */ new Set([
  "authorization",
  "content-type",
  "content-length",
  "user-agent",
  "presigned-expires",
  "expect",
  "x-amzn-trace-id",
  "range",
  "connection"
]);
var AwsV4Signer = class {
  constructor({ method, url, headers, body, accessKeyId, secretAccessKey, sessionToken, service, region, cache, datetime, signQuery, appendSessionToken, allHeaders, singleEncode }) {
    if (url == null) throw new TypeError("url is a required option");
    if (accessKeyId == null) throw new TypeError("accessKeyId is a required option");
    if (secretAccessKey == null) throw new TypeError("secretAccessKey is a required option");
    this.method = method || (body ? "POST" : "GET");
    this.url = new URL(url);
    this.headers = new Headers(headers || {});
    this.body = body;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.sessionToken = sessionToken;
    let guessedService, guessedRegion;
    if (!service || !region) {
      [guessedService, guessedRegion] = guessServiceRegion(this.url, this.headers);
    }
    this.service = service || guessedService || "";
    this.region = region || guessedRegion || "us-east-1";
    this.cache = cache || /* @__PURE__ */ new Map();
    this.datetime = datetime || (/* @__PURE__ */ new Date()).toISOString().replace(/[:-]|\.\d{3}/g, "");
    this.signQuery = signQuery;
    this.appendSessionToken = appendSessionToken || this.service === "iotdevicegateway";
    this.headers.delete("Host");
    if (this.service === "s3" && !this.signQuery && !this.headers.has("X-Amz-Content-Sha256")) {
      this.headers.set("X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD");
    }
    const params = this.signQuery ? this.url.searchParams : this.headers;
    params.set("X-Amz-Date", this.datetime);
    if (this.sessionToken && !this.appendSessionToken) {
      params.set("X-Amz-Security-Token", this.sessionToken);
    }
    this.signableHeaders = ["host", ...this.headers.keys()].filter((header) => allHeaders || !UNSIGNABLE_HEADERS.has(header)).sort();
    this.signedHeaders = this.signableHeaders.join(";");
    this.canonicalHeaders = this.signableHeaders.map((header) => header + ":" + (header === "host" ? this.url.host : (this.headers.get(header) || "").replace(/\s+/g, " "))).join("\n");
    this.credentialString = [this.datetime.slice(0, 8), this.region, this.service, "aws4_request"].join("/");
    if (this.signQuery) {
      if (this.service === "s3" && !params.has("X-Amz-Expires")) {
        params.set("X-Amz-Expires", "86400");
      }
      params.set("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
      params.set("X-Amz-Credential", this.accessKeyId + "/" + this.credentialString);
      params.set("X-Amz-SignedHeaders", this.signedHeaders);
    }
    if (this.service === "s3") {
      try {
        this.encodedPath = decodeURIComponent(this.url.pathname.replace(/\+/g, " "));
      } catch (e) {
        this.encodedPath = this.url.pathname;
      }
    } else {
      this.encodedPath = this.url.pathname.replace(/\/+/g, "/");
    }
    if (!singleEncode) {
      this.encodedPath = encodeURIComponent(this.encodedPath).replace(/%2F/g, "/");
    }
    this.encodedPath = encodeRfc3986(this.encodedPath);
    const seenKeys = /* @__PURE__ */ new Set();
    this.encodedSearch = [...this.url.searchParams].filter(([k]) => {
      if (!k) return false;
      if (this.service === "s3") {
        if (seenKeys.has(k)) return false;
        seenKeys.add(k);
      }
      return true;
    }).map((pair) => pair.map((p) => encodeRfc3986(encodeURIComponent(p)))).sort(([k1, v1], [k2, v2]) => k1 < k2 ? -1 : k1 > k2 ? 1 : v1 < v2 ? -1 : v1 > v2 ? 1 : 0).map((pair) => pair.join("=")).join("&");
  }
  async sign() {
    if (this.signQuery) {
      this.url.searchParams.set("X-Amz-Signature", await this.signature());
      if (this.sessionToken && this.appendSessionToken) {
        this.url.searchParams.set("X-Amz-Security-Token", this.sessionToken);
      }
    } else {
      this.headers.set("Authorization", await this.authHeader());
    }
    return {
      method: this.method,
      url: this.url,
      headers: this.headers,
      body: this.body
    };
  }
  async authHeader() {
    return [
      "AWS4-HMAC-SHA256 Credential=" + this.accessKeyId + "/" + this.credentialString,
      "SignedHeaders=" + this.signedHeaders,
      "Signature=" + await this.signature()
    ].join(", ");
  }
  async signature() {
    const date = this.datetime.slice(0, 8);
    const cacheKey = [this.secretAccessKey, date, this.region, this.service].join();
    let kCredentials = this.cache.get(cacheKey);
    if (!kCredentials) {
      const kDate = await hmac("AWS4" + this.secretAccessKey, date);
      const kRegion = await hmac(kDate, this.region);
      const kService = await hmac(kRegion, this.service);
      kCredentials = await hmac(kService, "aws4_request");
      this.cache.set(cacheKey, kCredentials);
    }
    return buf2hex(await hmac(kCredentials, await this.stringToSign()));
  }
  async stringToSign() {
    return [
      "AWS4-HMAC-SHA256",
      this.datetime,
      this.credentialString,
      buf2hex(await hash(await this.canonicalString()))
    ].join("\n");
  }
  async canonicalString() {
    return [
      this.method.toUpperCase(),
      this.encodedPath,
      this.encodedSearch,
      this.canonicalHeaders + "\n",
      this.signedHeaders,
      await this.hexBodyHash()
    ].join("\n");
  }
  async hexBodyHash() {
    let hashHeader = this.headers.get("X-Amz-Content-Sha256") || (this.service === "s3" && this.signQuery ? "UNSIGNED-PAYLOAD" : null);
    if (hashHeader == null) {
      if (this.body && typeof this.body !== "string" && !("byteLength" in this.body)) {
        throw new Error("body must be a string, ArrayBuffer or ArrayBufferView, unless you include the X-Amz-Content-Sha256 header");
      }
      hashHeader = buf2hex(await hash(this.body || ""));
    }
    return hashHeader;
  }
};
async function hmac(key, string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    typeof key === "string" ? encoder.encode(key) : key,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(string));
}
async function hash(content) {
  return crypto.subtle.digest("SHA-256", typeof content === "string" ? encoder.encode(content) : content);
}
var HEX_CHARS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
function buf2hex(arrayBuffer) {
  const buffer = new Uint8Array(arrayBuffer);
  let out = "";
  for (let idx = 0; idx < buffer.length; idx++) {
    const n = buffer[idx];
    out += HEX_CHARS[n >>> 4 & 15];
    out += HEX_CHARS[n & 15];
  }
  return out;
}
function encodeRfc3986(urlEncodedStr) {
  return urlEncodedStr.replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}
function guessServiceRegion(url, headers) {
  const { hostname, pathname } = url;
  if (hostname.endsWith(".on.aws")) {
    const match2 = hostname.match(/^[^.]{1,63}\.lambda-url\.([^.]{1,63})\.on\.aws$/);
    return match2 != null ? ["lambda", match2[1] || ""] : ["", ""];
  }
  if (hostname.endsWith(".r2.cloudflarestorage.com")) {
    return ["s3", "auto"];
  }
  if (hostname.endsWith(".backblazeb2.com")) {
    const match2 = hostname.match(/^(?:[^.]{1,63}\.)?s3\.([^.]{1,63})\.backblazeb2\.com$/);
    return match2 != null ? ["s3", match2[1] || ""] : ["", ""];
  }
  const match = hostname.replace("dualstack.", "").match(/([^.]{1,63})\.(?:([^.]{0,63})\.)?amazonaws\.com(?:\.cn)?$/);
  let service = match && match[1] || "";
  let region = match && match[2];
  if (region === "us-gov") {
    region = "us-gov-west-1";
  } else if (region === "s3" || region === "s3-accelerate") {
    region = "us-east-1";
    service = "s3";
  } else if (service === "iot") {
    if (hostname.startsWith("iot.")) {
      service = "execute-api";
    } else if (hostname.startsWith("data.jobs.iot.")) {
      service = "iot-jobs-data";
    } else {
      service = pathname === "/mqtt" ? "iotdevicegateway" : "iotdata";
    }
  } else if (service === "autoscaling") {
    const targetPrefix = (headers.get("X-Amz-Target") || "").split(".")[0];
    if (targetPrefix === "AnyScaleFrontendService") {
      service = "application-autoscaling";
    } else if (targetPrefix === "AnyScaleScalingPlannerFrontendService") {
      service = "autoscaling-plans";
    }
  } else if (region == null && service.startsWith("s3-")) {
    region = service.slice(3).replace(/^fips-|^external-1/, "");
    service = "s3";
  } else if (service.endsWith("-fips")) {
    service = service.slice(0, -5);
  } else if (region && /-\d$/.test(service) && !/-\d$/.test(region)) {
    [service, region] = [region, service];
  }
  return [HOST_SERVICES[service] || service, region || ""];
}

// ../../node_modules/.pnpm/@ai-sdk+amazon-bedrock@3.0.73_zod@4.2.1/node_modules/@ai-sdk/amazon-bedrock/dist/index.mjs
var VERSION2 = true ? "3.0.73" : "0.0.0-test";
var BEDROCK_CACHE_POINT = {
  cachePoint: { type: "default" }
};
var BEDROCK_STOP_REASONS = [
  "stop",
  "stop_sequence",
  "end_turn",
  "length",
  "max_tokens",
  "content-filter",
  "content_filtered",
  "guardrail_intervened",
  "tool-calls",
  "tool_use"
];
var BEDROCK_IMAGE_MIME_TYPES = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp"
};
var BEDROCK_DOCUMENT_MIME_TYPES = {
  "application/pdf": "pdf",
  "text/csv": "csv",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/html": "html",
  "text/plain": "txt",
  "text/markdown": "md"
};
var bedrockFilePartProviderOptions = z17.object({
  /**
   * Citation configuration for this document.
   * When enabled, this document will generate citations in the response.
   */
  citations: z17.object({
    /**
     * Enable citations for this document
     */
    enabled: z17.boolean()
  }).optional()
});
var bedrockProviderOptions = z17.object({
  /**
   * Additional inference parameters that the model supports,
   * beyond the base set of inference parameters that Converse
   * supports in the inferenceConfig field
   */
  additionalModelRequestFields: z17.record(z17.string(), z17.any()).optional(),
  reasoningConfig: z17.object({
    type: z17.union([z17.literal("enabled"), z17.literal("disabled")]).optional(),
    budgetTokens: z17.number().optional(),
    maxReasoningEffort: z17.enum(["low", "medium", "high"]).optional()
  }).optional(),
  /**
   * Anthropic beta features to enable
   */
  anthropicBeta: z17.array(z17.string()).optional()
});
var BedrockErrorSchema = z22.object({
  message: z22.string(),
  type: z22.string().nullish()
});
var createBedrockEventStreamResponseHandler = (chunkSchema) => async ({ response }) => {
  const responseHeaders = extractResponseHeaders(response);
  if (response.body == null) {
    throw new EmptyResponseBodyError({});
  }
  const codec = new EventStreamCodec(toUtf8, fromUtf83);
  let buffer = new Uint8Array(0);
  const textDecoder = new TextDecoder();
  return {
    responseHeaders,
    value: response.body.pipeThrough(
      new TransformStream({
        async transform(chunk, controller) {
          var _a15, _b15;
          const newBuffer = new Uint8Array(buffer.length + chunk.length);
          newBuffer.set(buffer);
          newBuffer.set(chunk, buffer.length);
          buffer = newBuffer;
          while (buffer.length >= 4) {
            const totalLength = new DataView(
              buffer.buffer,
              buffer.byteOffset,
              buffer.byteLength
            ).getUint32(0, false);
            if (buffer.length < totalLength) {
              break;
            }
            try {
              const subView = buffer.subarray(0, totalLength);
              const decoded = codec.decode(subView);
              buffer = buffer.slice(totalLength);
              if (((_a15 = decoded.headers[":message-type"]) == null ? void 0 : _a15.value) === "event") {
                const data = textDecoder.decode(decoded.body);
                const parsedDataResult = await safeParseJSON({ text: data });
                if (!parsedDataResult.success) {
                  controller.enqueue(parsedDataResult);
                  break;
                }
                delete parsedDataResult.value.p;
                let wrappedData = {
                  [(_b15 = decoded.headers[":event-type"]) == null ? void 0 : _b15.value]: parsedDataResult.value
                };
                const validatedWrappedData = await safeValidateTypes({
                  value: wrappedData,
                  schema: chunkSchema
                });
                if (!validatedWrappedData.success) {
                  controller.enqueue(validatedWrappedData);
                } else {
                  controller.enqueue({
                    success: true,
                    value: validatedWrappedData.value,
                    rawValue: wrappedData
                  });
                }
              }
            } catch (e) {
              break;
            }
          }
        }
      })
    )
  };
};
async function prepareTools2({
  tools,
  toolChoice,
  modelId
}) {
  var _a15;
  const toolWarnings = [];
  const betas = /* @__PURE__ */ new Set();
  if (tools == null || tools.length === 0) {
    return {
      toolConfig: {},
      additionalTools: void 0,
      betas,
      toolWarnings
    };
  }
  const supportedTools = tools.filter((tool2) => {
    if (tool2.type === "provider-defined" && tool2.id === "anthropic.web_search_20250305") {
      toolWarnings.push({
        type: "unsupported-tool",
        tool: tool2,
        details: "The web_search_20250305 tool is not supported on Amazon Bedrock."
      });
      return false;
    }
    return true;
  });
  if (supportedTools.length === 0) {
    return {
      toolConfig: {},
      additionalTools: void 0,
      betas,
      toolWarnings
    };
  }
  const isAnthropicModel = modelId.includes("anthropic.");
  const providerDefinedTools = supportedTools.filter(
    (t) => t.type === "provider-defined"
  );
  const functionTools = supportedTools.filter((t) => t.type === "function");
  let additionalTools = void 0;
  const bedrockTools = [];
  const usingAnthropicTools = isAnthropicModel && providerDefinedTools.length > 0;
  if (usingAnthropicTools) {
    if (functionTools.length > 0) {
      toolWarnings.push({
        type: "unsupported-setting",
        setting: "tools",
        details: "Mixed Anthropic provider-defined tools and standard function tools are not supported in a single call to Bedrock. Only Anthropic tools will be used."
      });
    }
    const {
      toolChoice: preparedAnthropicToolChoice,
      toolWarnings: anthropicToolWarnings,
      betas: anthropicBetas
    } = await prepareTools({
      tools: providerDefinedTools,
      toolChoice
    });
    toolWarnings.push(...anthropicToolWarnings);
    anthropicBetas.forEach((beta) => betas.add(beta));
    if (preparedAnthropicToolChoice) {
      additionalTools = {
        tool_choice: preparedAnthropicToolChoice
      };
    }
    for (const tool2 of providerDefinedTools) {
      const toolFactory = Object.values(anthropicTools).find((factory6) => {
        const instance = factory6({});
        return instance.id === tool2.id;
      });
      if (toolFactory != null) {
        const fullToolDefinition = toolFactory({});
        bedrockTools.push({
          toolSpec: {
            name: tool2.name,
            inputSchema: {
              json: asSchema(fullToolDefinition.inputSchema).jsonSchema
            }
          }
        });
      } else {
        toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
      }
    }
  } else {
    for (const tool2 of providerDefinedTools) {
      toolWarnings.push({ type: "unsupported-tool", tool: tool2 });
    }
  }
  for (const tool2 of functionTools) {
    bedrockTools.push({
      toolSpec: {
        name: tool2.name,
        ...((_a15 = tool2.description) == null ? void 0 : _a15.trim()) !== "" ? { description: tool2.description } : {},
        inputSchema: {
          json: tool2.inputSchema
        }
      }
    });
  }
  let bedrockToolChoice = void 0;
  if (!usingAnthropicTools && bedrockTools.length > 0 && toolChoice) {
    const type = toolChoice.type;
    switch (type) {
      case "auto":
        bedrockToolChoice = { auto: {} };
        break;
      case "required":
        bedrockToolChoice = { any: {} };
        break;
      case "none":
        bedrockTools.length = 0;
        bedrockToolChoice = void 0;
        break;
      case "tool":
        bedrockToolChoice = { tool: { name: toolChoice.toolName } };
        break;
      default: {
        const _exhaustiveCheck = type;
        throw new UnsupportedFunctionalityError({
          functionality: `tool choice type: ${_exhaustiveCheck}`
        });
      }
    }
  }
  const toolConfig = bedrockTools.length > 0 ? { tools: bedrockTools, toolChoice: bedrockToolChoice } : {};
  return {
    toolConfig,
    additionalTools,
    betas,
    toolWarnings
  };
}
function getCachePoint(providerMetadata) {
  var _a15;
  return (_a15 = providerMetadata == null ? void 0 : providerMetadata.bedrock) == null ? void 0 : _a15.cachePoint;
}
async function shouldEnableCitations(providerMetadata) {
  var _a15, _b15;
  const bedrockOptions = await parseProviderOptions({
    provider: "bedrock",
    providerOptions: providerMetadata,
    schema: bedrockFilePartProviderOptions
  });
  return (_b15 = (_a15 = bedrockOptions == null ? void 0 : bedrockOptions.citations) == null ? void 0 : _a15.enabled) != null ? _b15 : false;
}
async function convertToBedrockChatMessages(prompt) {
  var _a15;
  const blocks = groupIntoBlocks(prompt);
  let system = [];
  const messages = [];
  let documentCounter = 0;
  const generateDocumentName = () => `document-${++documentCounter}`;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isLastBlock = i === blocks.length - 1;
    const type = block.type;
    switch (type) {
      case "system": {
        if (messages.length > 0) {
          throw new UnsupportedFunctionalityError({
            functionality: "Multiple system messages that are separated by user/assistant messages"
          });
        }
        for (const message of block.messages) {
          system.push({ text: message.content });
          if (getCachePoint(message.providerOptions)) {
            system.push(BEDROCK_CACHE_POINT);
          }
        }
        break;
      }
      case "user": {
        const bedrockContent = [];
        for (const message of block.messages) {
          const { role, content, providerOptions } = message;
          switch (role) {
            case "user": {
              for (let j = 0; j < content.length; j++) {
                const part = content[j];
                switch (part.type) {
                  case "text": {
                    bedrockContent.push({
                      text: part.text
                    });
                    break;
                  }
                  case "file": {
                    if (part.data instanceof URL) {
                      throw new UnsupportedFunctionalityError({
                        functionality: "File URL data"
                      });
                    }
                    if (part.mediaType.startsWith("image/")) {
                      bedrockContent.push({
                        image: {
                          format: getBedrockImageFormat(part.mediaType),
                          source: { bytes: convertToBase64(part.data) }
                        }
                      });
                    } else {
                      if (!part.mediaType) {
                        throw new UnsupportedFunctionalityError({
                          functionality: "file without mime type",
                          message: "File mime type is required in user message part content"
                        });
                      }
                      const enableCitations = await shouldEnableCitations(
                        part.providerOptions
                      );
                      bedrockContent.push({
                        document: {
                          format: getBedrockDocumentFormat(part.mediaType),
                          name: (_a15 = part.filename) != null ? _a15 : generateDocumentName(),
                          source: { bytes: convertToBase64(part.data) },
                          ...enableCitations && {
                            citations: { enabled: true }
                          }
                        }
                      });
                    }
                    break;
                  }
                }
              }
              break;
            }
            case "tool": {
              for (const part of content) {
                let toolResultContent;
                const output = part.output;
                switch (output.type) {
                  case "content": {
                    toolResultContent = output.value.map((contentPart) => {
                      switch (contentPart.type) {
                        case "text":
                          return { text: contentPart.text };
                        case "media":
                          if (!contentPart.mediaType.startsWith("image/")) {
                            throw new UnsupportedFunctionalityError({
                              functionality: `media type: ${contentPart.mediaType}`
                            });
                          }
                          const format = getBedrockImageFormat(
                            contentPart.mediaType
                          );
                          return {
                            image: {
                              format,
                              source: { bytes: contentPart.data }
                            }
                          };
                      }
                    });
                    break;
                  }
                  case "text":
                  case "error-text":
                    toolResultContent = [{ text: output.value }];
                    break;
                  case "json":
                  case "error-json":
                  default:
                    toolResultContent = [
                      { text: JSON.stringify(output.value) }
                    ];
                    break;
                }
                bedrockContent.push({
                  toolResult: {
                    toolUseId: part.toolCallId,
                    content: toolResultContent
                  }
                });
              }
              break;
            }
            default: {
              const _exhaustiveCheck = role;
              throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
            }
          }
          if (getCachePoint(providerOptions)) {
            bedrockContent.push(BEDROCK_CACHE_POINT);
          }
        }
        messages.push({ role: "user", content: bedrockContent });
        break;
      }
      case "assistant": {
        const bedrockContent = [];
        for (let j = 0; j < block.messages.length; j++) {
          const message = block.messages[j];
          const isLastMessage = j === block.messages.length - 1;
          const { content } = message;
          for (let k = 0; k < content.length; k++) {
            const part = content[k];
            const isLastContentPart = k === content.length - 1;
            switch (part.type) {
              case "text": {
                if (!part.text.trim()) {
                  break;
                }
                bedrockContent.push({
                  text: (
                    // trim the last text part if it's the last message in the block
                    // because Bedrock does not allow trailing whitespace
                    // in pre-filled assistant responses
                    trimIfLast(
                      isLastBlock,
                      isLastMessage,
                      isLastContentPart,
                      part.text
                    )
                  )
                });
                break;
              }
              case "reasoning": {
                const reasoningMetadata = await parseProviderOptions({
                  provider: "bedrock",
                  providerOptions: part.providerOptions,
                  schema: bedrockReasoningMetadataSchema
                });
                if (reasoningMetadata != null) {
                  if (reasoningMetadata.signature != null) {
                    bedrockContent.push({
                      reasoningContent: {
                        reasoningText: {
                          // trim the last text part if it's the last message in the block
                          // because Bedrock does not allow trailing whitespace
                          // in pre-filled assistant responses
                          text: trimIfLast(
                            isLastBlock,
                            isLastMessage,
                            isLastContentPart,
                            part.text
                          ),
                          signature: reasoningMetadata.signature
                        }
                      }
                    });
                  } else if (reasoningMetadata.redactedData != null) {
                    bedrockContent.push({
                      reasoningContent: {
                        redactedReasoning: {
                          data: reasoningMetadata.redactedData
                        }
                      }
                    });
                  }
                }
                break;
              }
              case "tool-call": {
                bedrockContent.push({
                  toolUse: {
                    toolUseId: part.toolCallId,
                    name: part.toolName,
                    input: part.input
                  }
                });
                break;
              }
            }
          }
          if (getCachePoint(message.providerOptions)) {
            bedrockContent.push(BEDROCK_CACHE_POINT);
          }
        }
        messages.push({ role: "assistant", content: bedrockContent });
        break;
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  return { system, messages };
}
function getBedrockImageFormat(mimeType) {
  if (!mimeType) {
    throw new UnsupportedFunctionalityError({
      functionality: "image without mime type",
      message: "Image mime type is required in user message part content"
    });
  }
  const format = BEDROCK_IMAGE_MIME_TYPES[mimeType];
  if (!format) {
    throw new UnsupportedFunctionalityError({
      functionality: `image mime type: ${mimeType}`,
      message: `Unsupported image mime type: ${mimeType}, expected one of: ${Object.keys(BEDROCK_IMAGE_MIME_TYPES).join(", ")}`
    });
  }
  return format;
}
function getBedrockDocumentFormat(mimeType) {
  const format = BEDROCK_DOCUMENT_MIME_TYPES[mimeType];
  if (!format) {
    throw new UnsupportedFunctionalityError({
      functionality: `file mime type: ${mimeType}`,
      message: `Unsupported file mime type: ${mimeType}, expected one of: ${Object.keys(BEDROCK_DOCUMENT_MIME_TYPES).join(", ")}`
    });
  }
  return format;
}
function trimIfLast(isLastBlock, isLastMessage, isLastContentPart, text) {
  return isLastBlock && isLastMessage && isLastContentPart ? text.trim() : text;
}
function groupIntoBlocks(prompt) {
  const blocks = [];
  let currentBlock = void 0;
  for (const message of prompt) {
    const { role } = message;
    switch (role) {
      case "system": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "system") {
          currentBlock = { type: "system", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "assistant": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "assistant") {
          currentBlock = { type: "assistant", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "user": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "tool": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return blocks;
}
function mapBedrockFinishReason(finishReason, isJsonResponseFromTool) {
  switch (finishReason) {
    case "stop_sequence":
    case "end_turn":
      return "stop";
    case "max_tokens":
      return "length";
    case "content_filtered":
    case "guardrail_intervened":
      return "content-filter";
    case "tool_use":
      return isJsonResponseFromTool ? "stop" : "tool-calls";
    default:
      return "unknown";
  }
}
var BedrockChatLanguageModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
    this.provider = "amazon-bedrock";
    this.supportedUrls = {
      // no supported urls for bedrock
    };
  }
  async getArgs({
    prompt,
    maxOutputTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed,
    tools,
    toolChoice,
    providerOptions
  }) {
    var _a15, _b15, _c, _d, _e, _f, _g, _h, _i;
    const bedrockOptions = (_a15 = await parseProviderOptions({
      provider: "bedrock",
      providerOptions,
      schema: bedrockProviderOptions
    })) != null ? _a15 : {};
    const warnings = [];
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    if (temperature != null && temperature > 1) {
      warnings.push({
        type: "unsupported-setting",
        setting: "temperature",
        details: `${temperature} exceeds bedrock maximum of 1.0. clamped to 1.0`
      });
      temperature = 1;
    } else if (temperature != null && temperature < 0) {
      warnings.push({
        type: "unsupported-setting",
        setting: "temperature",
        details: `${temperature} is below bedrock minimum of 0. clamped to 0`
      });
      temperature = 0;
    }
    if (responseFormat != null && responseFormat.type !== "text" && responseFormat.type !== "json") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "Only text and json response formats are supported."
      });
    }
    const jsonResponseTool = (responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null ? {
      type: "function",
      name: "json",
      description: "Respond with a JSON object.",
      inputSchema: responseFormat.schema
    } : void 0;
    const { toolConfig, additionalTools, toolWarnings, betas } = await prepareTools2({
      tools: jsonResponseTool ? [...tools != null ? tools : [], jsonResponseTool] : tools,
      toolChoice: jsonResponseTool != null ? { type: "required" } : toolChoice,
      modelId: this.modelId
    });
    warnings.push(...toolWarnings);
    if (additionalTools) {
      bedrockOptions.additionalModelRequestFields = {
        ...bedrockOptions.additionalModelRequestFields,
        ...additionalTools
      };
    }
    if (betas.size > 0 || bedrockOptions.anthropicBeta) {
      const existingBetas = (_b15 = bedrockOptions.anthropicBeta) != null ? _b15 : [];
      const mergedBetas = betas.size > 0 ? [...existingBetas, ...Array.from(betas)] : existingBetas;
      bedrockOptions.additionalModelRequestFields = {
        ...bedrockOptions.additionalModelRequestFields,
        anthropic_beta: mergedBetas
      };
    }
    const isAnthropicModel = this.modelId.includes("anthropic");
    const isThinkingRequested = ((_c = bedrockOptions.reasoningConfig) == null ? void 0 : _c.type) === "enabled";
    const thinkingBudget = (_d = bedrockOptions.reasoningConfig) == null ? void 0 : _d.budgetTokens;
    const isAnthropicThinkingEnabled = isAnthropicModel && isThinkingRequested;
    const inferenceConfig = {
      ...maxOutputTokens != null && { maxTokens: maxOutputTokens },
      ...temperature != null && { temperature },
      ...topP != null && { topP },
      ...topK != null && { topK },
      ...stopSequences != null && { stopSequences }
    };
    if (isAnthropicThinkingEnabled && thinkingBudget != null) {
      if (inferenceConfig.maxTokens != null) {
        inferenceConfig.maxTokens += thinkingBudget;
      } else {
        inferenceConfig.maxTokens = thinkingBudget + 4096;
      }
      bedrockOptions.additionalModelRequestFields = {
        ...bedrockOptions.additionalModelRequestFields,
        thinking: {
          type: (_e = bedrockOptions.reasoningConfig) == null ? void 0 : _e.type,
          budget_tokens: thinkingBudget
        }
      };
    } else if (!isAnthropicModel && thinkingBudget != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "providerOptions",
        details: "budgetTokens applies only to Anthropic models on Bedrock and will be ignored for this model."
      });
    }
    const maxReasoningEffort = (_f = bedrockOptions.reasoningConfig) == null ? void 0 : _f.maxReasoningEffort;
    if (maxReasoningEffort != null && !isAnthropicModel) {
      bedrockOptions.additionalModelRequestFields = {
        ...bedrockOptions.additionalModelRequestFields,
        reasoningConfig: {
          ...((_g = bedrockOptions.reasoningConfig) == null ? void 0 : _g.type) != null && {
            type: bedrockOptions.reasoningConfig.type
          },
          maxReasoningEffort
        }
      };
    } else if (maxReasoningEffort != null && isAnthropicModel) {
      warnings.push({
        type: "unsupported-setting",
        setting: "providerOptions",
        details: "maxReasoningEffort applies only to Amazon Nova models on Bedrock and will be ignored for this model."
      });
    }
    if (isAnthropicThinkingEnabled && inferenceConfig.temperature != null) {
      delete inferenceConfig.temperature;
      warnings.push({
        type: "unsupported-setting",
        setting: "temperature",
        details: "temperature is not supported when thinking is enabled"
      });
    }
    if (isAnthropicThinkingEnabled && inferenceConfig.topP != null) {
      delete inferenceConfig.topP;
      warnings.push({
        type: "unsupported-setting",
        setting: "topP",
        details: "topP is not supported when thinking is enabled"
      });
    }
    if (isAnthropicThinkingEnabled && inferenceConfig.topK != null) {
      delete inferenceConfig.topK;
      warnings.push({
        type: "unsupported-setting",
        setting: "topK",
        details: "topK is not supported when thinking is enabled"
      });
    }
    const hasAnyTools = ((_i = (_h = toolConfig.tools) == null ? void 0 : _h.length) != null ? _i : 0) > 0 || additionalTools;
    let filteredPrompt = prompt;
    if (!hasAnyTools) {
      const hasToolContent = prompt.some(
        (message) => "content" in message && Array.isArray(message.content) && message.content.some(
          (part) => part.type === "tool-call" || part.type === "tool-result"
        )
      );
      if (hasToolContent) {
        filteredPrompt = prompt.map(
          (message) => message.role === "system" ? message : {
            ...message,
            content: message.content.filter(
              (part) => part.type !== "tool-call" && part.type !== "tool-result"
            )
          }
        ).filter(
          (message) => message.role === "system" || message.content.length > 0
        );
        warnings.push({
          type: "unsupported-setting",
          setting: "toolContent",
          details: "Tool calls and results removed from conversation because Bedrock does not support tool content without active tools."
        });
      }
    }
    const { system, messages } = await convertToBedrockChatMessages(filteredPrompt);
    const {
      reasoningConfig: _,
      additionalModelRequestFields: __,
      ...filteredBedrockOptions
    } = (providerOptions == null ? void 0 : providerOptions.bedrock) || {};
    const additionalModelResponseFieldPaths = isAnthropicModel ? ["/delta/stop_sequence"] : void 0;
    return {
      command: {
        system,
        messages,
        additionalModelRequestFields: bedrockOptions.additionalModelRequestFields,
        ...additionalModelResponseFieldPaths && {
          additionalModelResponseFieldPaths
        },
        ...Object.keys(inferenceConfig).length > 0 && {
          inferenceConfig
        },
        ...filteredBedrockOptions,
        ...toolConfig.tools !== void 0 && toolConfig.tools.length > 0 ? { toolConfig } : {}
      },
      warnings,
      usesJsonResponseTool: jsonResponseTool != null,
      betas
    };
  }
  async getHeaders({
    headers
  }) {
    return combineHeaders(await resolve(this.config.headers), headers);
  }
  async doGenerate(options) {
    var _a15, _b15, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    const {
      command: args,
      warnings,
      usesJsonResponseTool
    } = await this.getArgs(options);
    const url = `${this.getUrl(this.modelId)}/converse`;
    const { value: response, responseHeaders } = await postJsonToApi({
      url,
      headers: await this.getHeaders({ headers: options.headers }),
      body: args,
      failedResponseHandler: createJsonErrorResponseHandler({
        errorSchema: BedrockErrorSchema,
        errorToMessage: (error) => {
          var _a22;
          return `${(_a22 = error.message) != null ? _a22 : "Unknown error"}`;
        }
      }),
      successfulResponseHandler: createJsonResponseHandler(
        BedrockResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const content = [];
    let isJsonResponseFromTool = false;
    for (const part of response.output.message.content) {
      if (part.text) {
        content.push({ type: "text", text: part.text });
      }
      if (part.reasoningContent) {
        if ("reasoningText" in part.reasoningContent) {
          const reasoning = {
            type: "reasoning",
            text: part.reasoningContent.reasoningText.text
          };
          if (part.reasoningContent.reasoningText.signature) {
            reasoning.providerMetadata = {
              bedrock: {
                signature: part.reasoningContent.reasoningText.signature
              }
            };
          }
          content.push(reasoning);
        } else if ("redactedReasoning" in part.reasoningContent) {
          content.push({
            type: "reasoning",
            text: "",
            providerMetadata: {
              bedrock: {
                redactedData: (_a15 = part.reasoningContent.redactedReasoning.data) != null ? _a15 : ""
              }
            }
          });
        }
      }
      if (part.toolUse) {
        const isJsonResponseTool = usesJsonResponseTool && part.toolUse.name === "json";
        if (isJsonResponseTool) {
          isJsonResponseFromTool = true;
          content.push({
            type: "text",
            text: JSON.stringify(part.toolUse.input)
          });
        } else {
          content.push({
            type: "tool-call",
            toolCallId: (_c = (_b15 = part.toolUse) == null ? void 0 : _b15.toolUseId) != null ? _c : this.config.generateId(),
            toolName: (_e = (_d = part.toolUse) == null ? void 0 : _d.name) != null ? _e : `tool-${this.config.generateId()}`,
            input: JSON.stringify((_g = (_f = part.toolUse) == null ? void 0 : _f.input) != null ? _g : {})
          });
        }
      }
    }
    const stopSequence = (_j = (_i = (_h = response.additionalModelResponseFields) == null ? void 0 : _h.delta) == null ? void 0 : _i.stop_sequence) != null ? _j : null;
    const providerMetadata = response.trace || response.usage || isJsonResponseFromTool || stopSequence ? {
      bedrock: {
        ...response.trace && typeof response.trace === "object" ? { trace: response.trace } : {},
        ...((_k = response.usage) == null ? void 0 : _k.cacheWriteInputTokens) != null && {
          usage: {
            cacheWriteInputTokens: response.usage.cacheWriteInputTokens
          }
        },
        ...isJsonResponseFromTool && { isJsonResponseFromTool: true },
        stopSequence
      }
    } : void 0;
    return {
      content,
      finishReason: mapBedrockFinishReason(
        response.stopReason,
        isJsonResponseFromTool
      ),
      usage: {
        inputTokens: (_l = response.usage) == null ? void 0 : _l.inputTokens,
        outputTokens: (_m = response.usage) == null ? void 0 : _m.outputTokens,
        totalTokens: ((_n = response.usage) == null ? void 0 : _n.inputTokens) + ((_o = response.usage) == null ? void 0 : _o.outputTokens),
        cachedInputTokens: (_q = (_p = response.usage) == null ? void 0 : _p.cacheReadInputTokens) != null ? _q : void 0
      },
      response: {
        // TODO add id, timestamp, etc
        headers: responseHeaders
      },
      warnings,
      ...providerMetadata && { providerMetadata }
    };
  }
  async doStream(options) {
    const {
      command: args,
      warnings,
      usesJsonResponseTool
    } = await this.getArgs(options);
    const url = `${this.getUrl(this.modelId)}/converse-stream`;
    const { value: response, responseHeaders } = await postJsonToApi({
      url,
      headers: await this.getHeaders({ headers: options.headers }),
      body: args,
      failedResponseHandler: createJsonErrorResponseHandler({
        errorSchema: BedrockErrorSchema,
        errorToMessage: (error) => `${error.type}: ${error.message}`
      }),
      successfulResponseHandler: createBedrockEventStreamResponseHandler(BedrockStreamSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    let finishReason = "unknown";
    const usage = {
      inputTokens: void 0,
      outputTokens: void 0,
      totalTokens: void 0
    };
    let providerMetadata = void 0;
    let isJsonResponseFromTool = false;
    let stopSequence = null;
    const contentBlocks = {};
    return {
      stream: response.pipeThrough(
        new TransformStream({
          start(controller) {
            controller.enqueue({ type: "stream-start", warnings });
          },
          transform(chunk, controller) {
            var _a15, _b15, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
            function enqueueError(bedrockError) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: bedrockError });
            }
            if (options.includeRawChunks) {
              controller.enqueue({ type: "raw", rawValue: chunk.rawValue });
            }
            if (!chunk.success) {
              enqueueError(chunk.error);
              return;
            }
            const value = chunk.value;
            if (value.internalServerException) {
              enqueueError(value.internalServerException);
              return;
            }
            if (value.modelStreamErrorException) {
              enqueueError(value.modelStreamErrorException);
              return;
            }
            if (value.throttlingException) {
              enqueueError(value.throttlingException);
              return;
            }
            if (value.validationException) {
              enqueueError(value.validationException);
              return;
            }
            if (value.messageStop) {
              finishReason = mapBedrockFinishReason(
                value.messageStop.stopReason,
                isJsonResponseFromTool
              );
              stopSequence = (_c = (_b15 = (_a15 = value.messageStop.additionalModelResponseFields) == null ? void 0 : _a15.delta) == null ? void 0 : _b15.stop_sequence) != null ? _c : null;
            }
            if (value.metadata) {
              usage.inputTokens = (_e = (_d = value.metadata.usage) == null ? void 0 : _d.inputTokens) != null ? _e : usage.inputTokens;
              usage.outputTokens = (_g = (_f = value.metadata.usage) == null ? void 0 : _f.outputTokens) != null ? _g : usage.outputTokens;
              usage.totalTokens = ((_h = usage.inputTokens) != null ? _h : 0) + ((_i = usage.outputTokens) != null ? _i : 0);
              usage.cachedInputTokens = (_k = (_j = value.metadata.usage) == null ? void 0 : _j.cacheReadInputTokens) != null ? _k : usage.cachedInputTokens;
              const cacheUsage = ((_l = value.metadata.usage) == null ? void 0 : _l.cacheWriteInputTokens) != null ? {
                usage: {
                  cacheWriteInputTokens: value.metadata.usage.cacheWriteInputTokens
                }
              } : void 0;
              const trace = value.metadata.trace ? {
                trace: value.metadata.trace
              } : void 0;
              if (cacheUsage || trace) {
                providerMetadata = {
                  bedrock: {
                    ...cacheUsage,
                    ...trace
                  }
                };
              }
            }
            if (((_m = value.contentBlockStart) == null ? void 0 : _m.contentBlockIndex) != null && !((_o = (_n = value.contentBlockStart) == null ? void 0 : _n.start) == null ? void 0 : _o.toolUse)) {
              const blockIndex = value.contentBlockStart.contentBlockIndex;
              contentBlocks[blockIndex] = { type: "text" };
              controller.enqueue({
                type: "text-start",
                id: String(blockIndex)
              });
            }
            if (((_p = value.contentBlockDelta) == null ? void 0 : _p.delta) && "text" in value.contentBlockDelta.delta && value.contentBlockDelta.delta.text) {
              const blockIndex = value.contentBlockDelta.contentBlockIndex || 0;
              if (contentBlocks[blockIndex] == null) {
                contentBlocks[blockIndex] = { type: "text" };
                controller.enqueue({
                  type: "text-start",
                  id: String(blockIndex)
                });
              }
              controller.enqueue({
                type: "text-delta",
                id: String(blockIndex),
                delta: value.contentBlockDelta.delta.text
              });
            }
            if (((_q = value.contentBlockStop) == null ? void 0 : _q.contentBlockIndex) != null) {
              const blockIndex = value.contentBlockStop.contentBlockIndex;
              const contentBlock = contentBlocks[blockIndex];
              if (contentBlock != null) {
                if (contentBlock.type === "reasoning") {
                  controller.enqueue({
                    type: "reasoning-end",
                    id: String(blockIndex)
                  });
                } else if (contentBlock.type === "text") {
                  controller.enqueue({
                    type: "text-end",
                    id: String(blockIndex)
                  });
                } else if (contentBlock.type === "tool-call") {
                  if (contentBlock.isJsonResponseTool) {
                    isJsonResponseFromTool = true;
                    controller.enqueue({
                      type: "text-start",
                      id: String(blockIndex)
                    });
                    controller.enqueue({
                      type: "text-delta",
                      id: String(blockIndex),
                      delta: contentBlock.jsonText
                    });
                    controller.enqueue({
                      type: "text-end",
                      id: String(blockIndex)
                    });
                  } else {
                    controller.enqueue({
                      type: "tool-input-end",
                      id: contentBlock.toolCallId
                    });
                    controller.enqueue({
                      type: "tool-call",
                      toolCallId: contentBlock.toolCallId,
                      toolName: contentBlock.toolName,
                      input: contentBlock.jsonText === "" ? "{}" : contentBlock.jsonText
                    });
                  }
                }
                delete contentBlocks[blockIndex];
              }
            }
            if (((_r = value.contentBlockDelta) == null ? void 0 : _r.delta) && "reasoningContent" in value.contentBlockDelta.delta && value.contentBlockDelta.delta.reasoningContent) {
              const blockIndex = value.contentBlockDelta.contentBlockIndex || 0;
              const reasoningContent = value.contentBlockDelta.delta.reasoningContent;
              if ("text" in reasoningContent && reasoningContent.text) {
                if (contentBlocks[blockIndex] == null) {
                  contentBlocks[blockIndex] = { type: "reasoning" };
                  controller.enqueue({
                    type: "reasoning-start",
                    id: String(blockIndex)
                  });
                }
                controller.enqueue({
                  type: "reasoning-delta",
                  id: String(blockIndex),
                  delta: reasoningContent.text
                });
              } else if ("signature" in reasoningContent && reasoningContent.signature) {
                controller.enqueue({
                  type: "reasoning-delta",
                  id: String(blockIndex),
                  delta: "",
                  providerMetadata: {
                    bedrock: {
                      signature: reasoningContent.signature
                    }
                  }
                });
              } else if ("data" in reasoningContent && reasoningContent.data) {
                controller.enqueue({
                  type: "reasoning-delta",
                  id: String(blockIndex),
                  delta: "",
                  providerMetadata: {
                    bedrock: {
                      redactedData: reasoningContent.data
                    }
                  }
                });
              }
            }
            const contentBlockStart = value.contentBlockStart;
            if (((_s = contentBlockStart == null ? void 0 : contentBlockStart.start) == null ? void 0 : _s.toolUse) != null) {
              const toolUse = contentBlockStart.start.toolUse;
              const blockIndex = contentBlockStart.contentBlockIndex;
              const isJsonResponseTool = usesJsonResponseTool && toolUse.name === "json";
              contentBlocks[blockIndex] = {
                type: "tool-call",
                toolCallId: toolUse.toolUseId,
                toolName: toolUse.name,
                jsonText: "",
                isJsonResponseTool
              };
              if (!isJsonResponseTool) {
                controller.enqueue({
                  type: "tool-input-start",
                  id: toolUse.toolUseId,
                  toolName: toolUse.name
                });
              }
            }
            const contentBlockDelta = value.contentBlockDelta;
            if ((contentBlockDelta == null ? void 0 : contentBlockDelta.delta) && "toolUse" in contentBlockDelta.delta && contentBlockDelta.delta.toolUse) {
              const blockIndex = contentBlockDelta.contentBlockIndex;
              const contentBlock = contentBlocks[blockIndex];
              if ((contentBlock == null ? void 0 : contentBlock.type) === "tool-call") {
                const delta = (_t = contentBlockDelta.delta.toolUse.input) != null ? _t : "";
                if (!contentBlock.isJsonResponseTool) {
                  controller.enqueue({
                    type: "tool-input-delta",
                    id: contentBlock.toolCallId,
                    delta
                  });
                }
                contentBlock.jsonText += delta;
              }
            }
          },
          flush(controller) {
            if (isJsonResponseFromTool || stopSequence != null) {
              if (providerMetadata) {
                providerMetadata.bedrock = {
                  ...providerMetadata.bedrock,
                  ...isJsonResponseFromTool && {
                    isJsonResponseFromTool: true
                  },
                  stopSequence
                };
              } else {
                providerMetadata = {
                  bedrock: {
                    ...isJsonResponseFromTool && {
                      isJsonResponseFromTool: true
                    },
                    stopSequence
                  }
                };
              }
            }
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              ...providerMetadata && { providerMetadata }
            });
          }
        })
      ),
      // TODO request?
      response: { headers: responseHeaders }
    };
  }
  getUrl(modelId) {
    const encodedModelId = encodeURIComponent(modelId);
    return `${this.config.baseUrl()}/model/${encodedModelId}`;
  }
};
var BedrockStopReasonSchema = z32.union([
  z32.enum(BEDROCK_STOP_REASONS),
  z32.string()
]);
var BedrockAdditionalModelResponseFieldsSchema = z32.object({
  delta: z32.object({
    stop_sequence: z32.string().nullish()
  }).nullish()
}).catchall(z32.unknown());
var BedrockToolUseSchema = z32.object({
  toolUseId: z32.string(),
  name: z32.string(),
  input: z32.unknown()
});
var BedrockReasoningTextSchema = z32.object({
  signature: z32.string().nullish(),
  text: z32.string()
});
var BedrockRedactedReasoningSchema = z32.object({
  data: z32.string()
});
var BedrockResponseSchema = z32.object({
  metrics: z32.object({
    latencyMs: z32.number()
  }).nullish(),
  output: z32.object({
    message: z32.object({
      content: z32.array(
        z32.object({
          text: z32.string().nullish(),
          toolUse: BedrockToolUseSchema.nullish(),
          reasoningContent: z32.union([
            z32.object({
              reasoningText: BedrockReasoningTextSchema
            }),
            z32.object({
              redactedReasoning: BedrockRedactedReasoningSchema
            })
          ]).nullish()
        })
      ),
      role: z32.string()
    })
  }),
  stopReason: BedrockStopReasonSchema,
  additionalModelResponseFields: BedrockAdditionalModelResponseFieldsSchema.nullish(),
  trace: z32.unknown().nullish(),
  usage: z32.object({
    inputTokens: z32.number(),
    outputTokens: z32.number(),
    totalTokens: z32.number(),
    cacheReadInputTokens: z32.number().nullish(),
    cacheWriteInputTokens: z32.number().nullish()
  })
});
var BedrockStreamSchema = z32.object({
  contentBlockDelta: z32.object({
    contentBlockIndex: z32.number(),
    delta: z32.union([
      z32.object({ text: z32.string() }),
      z32.object({ toolUse: z32.object({ input: z32.string() }) }),
      z32.object({
        reasoningContent: z32.object({ text: z32.string() })
      }),
      z32.object({
        reasoningContent: z32.object({
          signature: z32.string()
        })
      }),
      z32.object({
        reasoningContent: z32.object({ data: z32.string() })
      })
    ]).nullish()
  }).nullish(),
  contentBlockStart: z32.object({
    contentBlockIndex: z32.number(),
    start: z32.object({
      toolUse: BedrockToolUseSchema.nullish()
    }).nullish()
  }).nullish(),
  contentBlockStop: z32.object({
    contentBlockIndex: z32.number()
  }).nullish(),
  internalServerException: z32.record(z32.string(), z32.unknown()).nullish(),
  messageStop: z32.object({
    additionalModelResponseFields: BedrockAdditionalModelResponseFieldsSchema.nullish(),
    stopReason: BedrockStopReasonSchema
  }).nullish(),
  metadata: z32.object({
    trace: z32.unknown().nullish(),
    usage: z32.object({
      cacheReadInputTokens: z32.number().nullish(),
      cacheWriteInputTokens: z32.number().nullish(),
      inputTokens: z32.number(),
      outputTokens: z32.number()
    }).nullish()
  }).nullish(),
  modelStreamErrorException: z32.record(z32.string(), z32.unknown()).nullish(),
  throttlingException: z32.record(z32.string(), z32.unknown()).nullish(),
  validationException: z32.record(z32.string(), z32.unknown()).nullish()
});
var bedrockReasoningMetadataSchema = z32.object({
  signature: z32.string().optional(),
  redactedData: z32.string().optional()
});
var bedrockEmbeddingProviderOptions = z43.object({
  /**
  The number of dimensions the resulting output embeddings should have (defaults to 1024).
  Only supported in amazon.titan-embed-text-v2:0.
     */
  dimensions: z43.union([z43.literal(1024), z43.literal(512), z43.literal(256)]).optional(),
  /**
  Flag indicating whether or not to normalize the output embeddings. Defaults to true
  Only supported in amazon.titan-embed-text-v2:0.
   */
  normalize: z43.boolean().optional()
});
var BedrockEmbeddingModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
    this.provider = "amazon-bedrock";
    this.maxEmbeddingsPerCall = 1;
    this.supportsParallelCalls = true;
  }
  getUrl(modelId) {
    const encodedModelId = encodeURIComponent(modelId);
    return `${this.config.baseUrl()}/model/${encodedModelId}/invoke`;
  }
  async doEmbed({
    values,
    headers,
    abortSignal,
    providerOptions
  }) {
    var _a15;
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const bedrockOptions = (_a15 = await parseProviderOptions({
      provider: "bedrock",
      providerOptions,
      schema: bedrockEmbeddingProviderOptions
    })) != null ? _a15 : {};
    const args = {
      inputText: values[0],
      dimensions: bedrockOptions.dimensions,
      normalize: bedrockOptions.normalize
    };
    const url = this.getUrl(this.modelId);
    const { value: response } = await postJsonToApi({
      url,
      headers: await resolve(
        combineHeaders(await resolve(this.config.headers), headers)
      ),
      body: args,
      failedResponseHandler: createJsonErrorResponseHandler({
        errorSchema: BedrockErrorSchema,
        errorToMessage: (error) => `${error.type}: ${error.message}`
      }),
      successfulResponseHandler: createJsonResponseHandler(
        BedrockEmbeddingResponseSchema
      ),
      fetch: this.config.fetch,
      abortSignal
    });
    return {
      embeddings: [response.embedding],
      usage: { tokens: response.inputTextTokenCount }
    };
  }
};
var BedrockEmbeddingResponseSchema = z52.object({
  embedding: z52.array(z52.number()),
  inputTextTokenCount: z52.number()
});
var modelMaxImagesPerCall = {
  "amazon.nova-canvas-v1:0": 5
};
var BedrockImageModel = class {
  constructor(modelId, config) {
    this.modelId = modelId;
    this.config = config;
    this.specificationVersion = "v2";
    this.provider = "amazon-bedrock";
  }
  get maxImagesPerCall() {
    var _a15;
    return (_a15 = modelMaxImagesPerCall[this.modelId]) != null ? _a15 : 1;
  }
  getUrl(modelId) {
    const encodedModelId = encodeURIComponent(modelId);
    return `${this.config.baseUrl()}/model/${encodedModelId}/invoke`;
  }
  async doGenerate({
    prompt,
    n,
    size,
    aspectRatio,
    seed,
    providerOptions,
    headers,
    abortSignal
  }) {
    var _a15, _b15, _c, _d, _e, _f, _g;
    const warnings = [];
    const [width, height] = size ? size.split("x").map(Number) : [];
    const args = {
      taskType: "TEXT_IMAGE",
      textToImageParams: {
        text: prompt,
        ...((_a15 = providerOptions == null ? void 0 : providerOptions.bedrock) == null ? void 0 : _a15.negativeText) ? {
          negativeText: providerOptions.bedrock.negativeText
        } : {},
        ...((_b15 = providerOptions == null ? void 0 : providerOptions.bedrock) == null ? void 0 : _b15.style) ? {
          style: providerOptions.bedrock.style
        } : {}
      },
      imageGenerationConfig: {
        ...width ? { width } : {},
        ...height ? { height } : {},
        ...seed ? { seed } : {},
        ...n ? { numberOfImages: n } : {},
        ...((_c = providerOptions == null ? void 0 : providerOptions.bedrock) == null ? void 0 : _c.quality) ? { quality: providerOptions.bedrock.quality } : {},
        ...((_d = providerOptions == null ? void 0 : providerOptions.bedrock) == null ? void 0 : _d.cfgScale) ? { cfgScale: providerOptions.bedrock.cfgScale } : {}
      }
    };
    if (aspectRatio != void 0) {
      warnings.push({
        type: "unsupported-setting",
        setting: "aspectRatio",
        details: "This model does not support aspect ratio. Use `size` instead."
      });
    }
    const currentDate = (_g = (_f = (_e = this.config._internal) == null ? void 0 : _e.currentDate) == null ? void 0 : _f.call(_e)) != null ? _g : /* @__PURE__ */ new Date();
    const { value: response, responseHeaders } = await postJsonToApi({
      url: this.getUrl(this.modelId),
      headers: await resolve(
        combineHeaders(await resolve(this.config.headers), headers)
      ),
      body: args,
      failedResponseHandler: createJsonErrorResponseHandler({
        errorSchema: BedrockErrorSchema,
        errorToMessage: (error) => `${error.type}: ${error.message}`
      }),
      successfulResponseHandler: createJsonResponseHandler(
        bedrockImageResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      images: response.images,
      warnings,
      response: {
        timestamp: currentDate,
        modelId: this.modelId,
        headers: responseHeaders
      }
    };
  }
};
var bedrockImageResponseSchema = z62.object({
  images: z62.array(z62.string())
});
function createSigV4FetchFunction(getCredentials, fetch2 = globalThis.fetch) {
  return async (input, init) => {
    var _a15, _b15;
    const request = input instanceof Request ? input : void 0;
    const originalHeaders = combineHeaders(
      normalizeHeaders(request == null ? void 0 : request.headers),
      normalizeHeaders(init == null ? void 0 : init.headers)
    );
    const headersWithUserAgent = withUserAgentSuffix(
      originalHeaders,
      `ai-sdk/amazon-bedrock/${VERSION2}`,
      getRuntimeEnvironmentUserAgent()
    );
    let effectiveBody = (_a15 = init == null ? void 0 : init.body) != null ? _a15 : void 0;
    if (effectiveBody === void 0 && request && request.body !== null) {
      try {
        effectiveBody = await request.clone().text();
      } catch (e) {
      }
    }
    const effectiveMethod = (_b15 = init == null ? void 0 : init.method) != null ? _b15 : request == null ? void 0 : request.method;
    if ((effectiveMethod == null ? void 0 : effectiveMethod.toUpperCase()) !== "POST" || !effectiveBody) {
      return fetch2(input, {
        ...init,
        headers: headersWithUserAgent
      });
    }
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const body = prepareBodyString(effectiveBody);
    const credentials = await getCredentials();
    const signer = new AwsV4Signer({
      url,
      method: "POST",
      headers: Object.entries(headersWithUserAgent),
      body,
      region: credentials.region,
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      sessionToken: credentials.sessionToken,
      service: "bedrock"
    });
    const signingResult = await signer.sign();
    const signedHeaders = normalizeHeaders(signingResult.headers);
    const combinedHeaders = combineHeaders(headersWithUserAgent, signedHeaders);
    return fetch2(input, {
      ...init,
      body,
      headers: combinedHeaders
    });
  };
}
function prepareBodyString(body) {
  if (typeof body === "string") {
    return body;
  } else if (body instanceof Uint8Array) {
    return new TextDecoder().decode(body);
  } else if (body instanceof ArrayBuffer) {
    return new TextDecoder().decode(new Uint8Array(body));
  } else {
    return JSON.stringify(body);
  }
}
function createApiKeyFetchFunction(apiKey, fetch2 = globalThis.fetch) {
  return async (input, init) => {
    const originalHeaders = normalizeHeaders(init == null ? void 0 : init.headers);
    const headersWithUserAgent = withUserAgentSuffix(
      originalHeaders,
      `ai-sdk/amazon-bedrock/${VERSION2}`,
      getRuntimeEnvironmentUserAgent()
    );
    const finalHeaders = combineHeaders(headersWithUserAgent, {
      Authorization: `Bearer ${apiKey}`
    });
    return fetch2(input, {
      ...init,
      headers: finalHeaders
    });
  };
}
function createAmazonBedrock(options = {}) {
  const rawApiKey = loadOptionalSetting({
    settingValue: options.apiKey,
    environmentVariableName: "AWS_BEARER_TOKEN_BEDROCK"
  });
  const apiKey = rawApiKey && rawApiKey.trim().length > 0 ? rawApiKey.trim() : void 0;
  const fetchFunction = apiKey ? createApiKeyFetchFunction(apiKey, options.fetch) : createSigV4FetchFunction(async () => {
    const region = loadSetting({
      settingValue: options.region,
      settingName: "region",
      environmentVariableName: "AWS_REGION",
      description: "AWS region"
    });
    if (options.credentialProvider) {
      try {
        return {
          ...await options.credentialProvider(),
          region
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(
          `AWS credential provider failed: ${errorMessage}. Please ensure your credential provider returns valid AWS credentials with accessKeyId and secretAccessKey properties.`
        );
      }
    }
    try {
      return {
        region,
        accessKeyId: loadSetting({
          settingValue: options.accessKeyId,
          settingName: "accessKeyId",
          environmentVariableName: "AWS_ACCESS_KEY_ID",
          description: "AWS access key ID"
        }),
        secretAccessKey: loadSetting({
          settingValue: options.secretAccessKey,
          settingName: "secretAccessKey",
          environmentVariableName: "AWS_SECRET_ACCESS_KEY",
          description: "AWS secret access key"
        }),
        sessionToken: loadOptionalSetting({
          settingValue: options.sessionToken,
          environmentVariableName: "AWS_SESSION_TOKEN"
        })
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("AWS_ACCESS_KEY_ID") || errorMessage.includes("accessKeyId")) {
        throw new Error(
          `AWS SigV4 authentication requires AWS credentials. Please provide either:
1. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
2. Provide accessKeyId and secretAccessKey in options
3. Use a credentialProvider function
4. Use API key authentication with AWS_BEARER_TOKEN_BEDROCK or apiKey option
Original error: ${errorMessage}`
        );
      }
      if (errorMessage.includes("AWS_SECRET_ACCESS_KEY") || errorMessage.includes("secretAccessKey")) {
        throw new Error(
          `AWS SigV4 authentication requires both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. Please ensure both credentials are provided.
Original error: ${errorMessage}`
        );
      }
      throw error;
    }
  }, options.fetch);
  const getBaseUrl = () => {
    var _a15, _b15;
    return (_b15 = withoutTrailingSlash(
      (_a15 = options.baseURL) != null ? _a15 : `https://bedrock-runtime.${loadSetting({
        settingValue: options.region,
        settingName: "region",
        environmentVariableName: "AWS_REGION",
        description: "AWS region"
      })}.amazonaws.com`
    )) != null ? _b15 : `https://bedrock-runtime.us-east-1.amazonaws.com`;
  };
  const getHeaders = () => {
    var _a15;
    const baseHeaders = (_a15 = options.headers) != null ? _a15 : {};
    return withUserAgentSuffix(baseHeaders, `ai-sdk/amazon-bedrock/${VERSION2}`);
  };
  const createChatModel = (modelId) => new BedrockChatLanguageModel(modelId, {
    baseUrl: getBaseUrl,
    headers: getHeaders,
    fetch: fetchFunction,
    generateId
  });
  const provider = function(modelId) {
    if (new.target) {
      throw new Error(
        "The Amazon Bedrock model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId);
  };
  const createEmbeddingModel = (modelId) => new BedrockEmbeddingModel(modelId, {
    baseUrl: getBaseUrl,
    headers: getHeaders,
    fetch: fetchFunction
  });
  const createImageModel = (modelId) => new BedrockImageModel(modelId, {
    baseUrl: getBaseUrl,
    headers: getHeaders,
    fetch: fetchFunction
  });
  provider.languageModel = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  provider.image = createImageModel;
  provider.imageModel = createImageModel;
  provider.tools = anthropicTools;
  return provider;
}
var bedrock = createAmazonBedrock();
export {
  VERSION2 as VERSION,
  bedrock,
  createAmazonBedrock
};
/*! Bundled license information:

aws4fetch/dist/aws4fetch.esm.mjs:
  (**
   * @license MIT <https://opensource.org/licenses/MIT>
   * @copyright Michael Hart 2024
   *)
*/
//# sourceMappingURL=dist-2WVWAF5V.js.map