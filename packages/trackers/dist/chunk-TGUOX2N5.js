// src/mcp.ts
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "@ai-sdk/mcp/mcp-stdio";
import { generateText, stepCountIs } from "ai";
import { resolveModel } from "@agentic/triage-ai";
async function createFilesystemClient(workingDirectory) {
  return createInlineFilesystemClient(workingDirectory);
}
async function createInlineFilesystemClient(workingDirectory) {
  const fs = await import("fs/promises");
  const path = await import("path");
  const os = await import("os");
  const serverCode = `
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const BASE_DIR = ${JSON.stringify(workingDirectory)};

function resolvePath(relativePath) {
    const resolved = path.resolve(BASE_DIR, relativePath);
    if (!resolved.startsWith(BASE_DIR)) {
        throw new Error('Path traversal not allowed');
    }
    return resolved;
}

const tools = {
    read_file: {
        name: 'read_file',
        description: 'Read the contents of a file. Use this to examine source code, configs, or any text file. ESSENTIAL - use this instead of guessing file contents!',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to the file relative to workspace root' }
            },
            required: ['path']
        }
    },
    write_file: {
        name: 'write_file',
        description: 'Write content to a file. Creates parent directories if needed. Use this to make actual code changes!',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to the file relative to workspace root' },
                content: { type: 'string', description: 'Complete content to write to the file' }
            },
            required: ['path', 'content']
        }
    },
    list_files: {
        name: 'list_files',
        description: 'List files and directories in a path. Use to explore project structure.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Directory path relative to workspace root', default: '.' }
            }
        }
    },
    search_files: {
        name: 'search_files',
        description: 'Search for files matching a glob pattern. Use to find relevant files quickly.',
        inputSchema: {
            type: 'object',
            properties: {
                pattern: { type: 'string', description: 'Glob pattern like *.ts or **/*.test.ts' },
                path: { type: 'string', description: 'Directory to search in', default: '.' }
            },
            required: ['pattern']
        }
    }
};

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.on('line', async (input) => {
    try {
        const request = JSON.parse(input);

        if (request.method === 'initialize') {
            console.log(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result: {
                    protocolVersion: '2024-11-05',
                    capabilities: { tools: {} },
                    serverInfo: { name: 'strata-filesystem', version: '1.0.0' }
                }
            }));
            return;
        }

        if (request.method === 'notifications/initialized') return;

        if (request.method === 'tools/list') {
            console.log(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result: { tools: Object.values(tools) }
            }));
            return;
        }

        if (request.method === 'tools/call') {
            const { name, arguments: args } = request.params;
            let result;

            try {
                switch (name) {
                    case 'read_file': {
                        const filePath = resolvePath(args.path);
                        const content = await fs.readFile(filePath, 'utf-8');
                        result = { content, path: args.path, lines: content.split('\\n').length };
                        break;
                    }
                    case 'write_file': {
                        const filePath = resolvePath(args.path);
                        await fs.mkdir(path.dirname(filePath), { recursive: true });
                        await fs.writeFile(filePath, args.content, 'utf-8');
                        result = { success: true, path: args.path, bytesWritten: args.content.length };
                        break;
                    }
                    case 'list_files': {
                        const dirPath = resolvePath(args.path || '.');
                        const entries = await fs.readdir(dirPath, { withFileTypes: true });
                        result = {
                            path: args.path || '.',
                            entries: entries.map(e => ({
                                name: e.name,
                                type: e.isDirectory() ? 'directory' : 'file'
                            }))
                        };
                        break;
                    }
                    case 'search_files': {
                        const searchDir = resolvePath(args.path || '.');
                        const pattern = args.pattern.replace(/\\*/g, '.*').replace(/\\?/g, '.');
                        const regex = new RegExp(pattern);
                        const matches = [];

                        async function walk(dir, depth = 0) {
                            if (depth > 10) return;
                            try {
                                const entries = await fs.readdir(dir, { withFileTypes: true });
                                for (const entry of entries) {
                                    const fullPath = path.join(dir, entry.name);
                                    const relativePath = path.relative(BASE_DIR, fullPath);
                                    if (entry.isDirectory()) {
                                        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
                                            await walk(fullPath, depth + 1);
                                        }
                                    } else if (regex.test(entry.name) || regex.test(relativePath)) {
                                        matches.push(relativePath);
                                    }
                                }
                            } catch (e) { /* ignore */ }
                        }
                        await walk(searchDir);
                        result = { pattern: args.pattern, matches: matches.slice(0, 100) };
                        break;
                    }
                    default:
                        result = { error: 'Unknown tool: ' + name };
                }
            } catch (err) {
                result = { error: err.message };
            }

            console.log(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
            }));
        }
    } catch (err) {
        console.log(JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: { code: -1, message: err.message }
        }));
    }
});
`;
  const serverPath = path.join(os.tmpdir(), `strata-fs-mcp-${Date.now()}.cjs`);
  await fs.writeFile(serverPath, serverCode);
  const transport = new StdioMCPTransport({
    command: "node",
    args: [serverPath],
    cwd: workingDirectory
  });
  return createMCPClient({ transport });
}
async function getFilesystemTools(client) {
  return client.tools();
}
async function createGitHubClient() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN or GH_TOKEN required for GitHub MCP");
  }
  const transport = new StdioMCPTransport({
    command: "npx",
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: {
      ...process.env,
      GITHUB_PERSONAL_ACCESS_TOKEN: token
    }
  });
  return createMCPClient({ transport });
}
async function getGitHubTools(client) {
  return client.tools();
}
async function createPlaywrightClient(options = {}) {
  const { headless = true, browser = "chromium", outputDir = "./test-output", testingCapabilities = true } = options;
  const args = ["-y", "@playwright/mcp@latest"];
  if (headless) args.push("--headless");
  args.push("--browser", browser);
  args.push("--output-dir", outputDir);
  if (testingCapabilities) args.push("--caps=testing");
  const transport = new StdioMCPTransport({
    command: "npx",
    args
  });
  return createMCPClient({ transport });
}
async function getPlaywrightTools(client) {
  return client.tools();
}
async function createContext7Client() {
  const apiKey = process.env.CONTEXT7_API_KEY;
  const client = await createMCPClient({
    transport: {
      type: "http",
      url: "https://mcp.context7.com/mcp",
      headers: apiKey ? { CONTEXT7_API_KEY: apiKey } : void 0
    }
  });
  return client;
}
async function getContext7Tools(client) {
  return client.tools();
}
async function createViteReactClient(options = {}) {
  const { port = 5173 } = options;
  const url = options.url || `http://localhost:${port}/sse`;
  const client = await createMCPClient({
    transport: {
      type: "sse",
      url
    }
  });
  return client;
}
async function getViteReactTools(client) {
  return client.tools();
}
async function createGraphQLClient() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN or GH_TOKEN required for GraphQL MCP");
  }
  const transport = new StdioMCPTransport({
    command: "npx",
    args: ["-y", "mcp-graphql"],
    env: {
      ...process.env,
      ENDPOINT: "https://api.github.com/graphql",
      HEADERS: JSON.stringify({
        Authorization: `Bearer ${token}`
      })
    }
  });
  return createMCPClient({
    transport
  });
}
async function getGraphQLTools(client) {
  return client.tools();
}
async function initializeMCPClients(options) {
  const clients = {};
  const initPromises = [];
  if (options.filesystem) {
    const dir = typeof options.filesystem === "string" ? options.filesystem : process.cwd();
    initPromises.push(
      createFilesystemClient(dir).then((client) => {
        clients.filesystem = client;
      }).catch((err) => console.warn("\u26A0\uFE0F Filesystem MCP unavailable:", err.message))
    );
  }
  if (options.github) {
    initPromises.push(
      createGitHubClient().then((client) => {
        clients.github = client;
      }).catch((err) => console.warn("\u26A0\uFE0F GitHub MCP unavailable:", err.message))
    );
  }
  if (options.playwright) {
    const playwrightOpts = typeof options.playwright === "object" ? options.playwright : {};
    initPromises.push(
      createPlaywrightClient(playwrightOpts).then((client) => {
        clients.playwright = client;
      }).catch((err) => console.warn("\u26A0\uFE0F Playwright MCP unavailable:", err.message))
    );
  }
  if (options.context7) {
    initPromises.push(
      createContext7Client().then((client) => {
        clients.context7 = client;
      }).catch((err) => console.warn("\u26A0\uFE0F Context7 MCP unavailable:", err.message))
    );
  }
  if (options.viteReact) {
    const viteOpts = typeof options.viteReact === "object" ? options.viteReact : {};
    initPromises.push(
      createViteReactClient(viteOpts).then((client) => {
        clients.viteReact = client;
      }).catch((err) => console.warn("\u26A0\uFE0F Vite React MCP unavailable:", err.message))
    );
  }
  if (options.graphql) {
    initPromises.push(
      createGraphQLClient().then((client) => {
        clients.graphql = client;
      }).catch((err) => console.warn("\u26A0\uFE0F GraphQL MCP unavailable:", err.message))
    );
  }
  await Promise.all(initPromises);
  return clients;
}
async function getAllTools(clients) {
  const allTools = {};
  const toolPromises = [];
  for (const [name, client] of Object.entries(clients)) {
    if (client) {
      toolPromises.push(
        client.tools().then((tools) => {
          Object.assign(allTools, tools);
        }).catch((err) => console.warn(`\u26A0\uFE0F Failed to get tools from ${name}:`, err.message))
      );
    }
  }
  await Promise.all(toolPromises);
  return allTools;
}
async function closeMCPClients(clients) {
  const closePromises = [];
  for (const client of Object.values(clients)) {
    if (client) {
      closePromises.push(
        client.close().catch(() => {
        })
      );
    }
  }
  await Promise.all(closePromises);
}
async function runAgenticTask(options) {
  const {
    systemPrompt,
    userPrompt,
    mcpClients: clientOptions = { filesystem: true },
    maxSteps = 15,
    onToolCall,
    onStepFinish
  } = options;
  const clients = await initializeMCPClients(clientOptions);
  try {
    const tools = await getAllTools(clients);
    if (Object.keys(tools).length === 0) {
      throw new Error("No MCP tools available - check MCP server connections");
    }
    const resolved = await resolveModel();
    const result = await generateText({
      model: resolved.model,
      system: systemPrompt,
      prompt: userPrompt,
      tools,
      stopWhen: stepCountIs(maxSteps),
      onStepFinish: (step) => {
        if (step.toolCalls && onToolCall) {
          for (const call of step.toolCalls) {
            const tc = call;
            onToolCall(tc.toolName, tc.input || tc.args);
          }
        }
        onStepFinish?.({
          text: step.text,
          toolCalls: step.toolCalls
        });
      }
    });
    const toolCallCount = result.steps?.reduce((acc, step) => acc + (step.toolCalls?.length || 0), 0) || 0;
    return {
      text: result.text,
      toolCallCount,
      steps: result.steps || [],
      finishReason: result.finishReason
    };
  } finally {
    await closeMCPClients(clients);
  }
}
var PLAYWRIGHT_TOOLS = {
  NAVIGATE: "browser_navigate",
  CLICK: "browser_click",
  TYPE: "browser_type",
  SNAPSHOT: "browser_snapshot",
  SCREENSHOT: "browser_take_screenshot",
  CLOSE: "browser_close",
  WAIT: "browser_wait_for",
  EVALUATE: "browser_evaluate",
  VERIFY_ELEMENT_VISIBLE: "browser_verify_element_visible",
  VERIFY_TEXT_VISIBLE: "browser_verify_text_visible",
  VERIFY_VALUE: "browser_verify_value",
  GENERATE_LOCATOR: "browser_generate_locator"
};
var FILESYSTEM_TOOLS = {
  READ_FILE: "read_file",
  WRITE_FILE: "write_file",
  LIST_FILES: "list_files",
  SEARCH_FILES: "search_files"
};
var CONTEXT7_TOOLS = {
  /** Resolve library name to Context7 ID */
  RESOLVE_LIBRARY_ID: "resolve-library-id",
  /** Get library documentation */
  GET_LIBRARY_DOCS: "get-library-docs"
};
var VITE_REACT_TOOLS = {
  /** Highlight a React component */
  HIGHLIGHT_COMPONENT: "highlight-component",
  /** Get component props, states, contexts */
  GET_COMPONENT_STATES: "get-component-states",
  /** Get component tree */
  GET_COMPONENT_TREE: "get-component-tree",
  /** Get unnecessary re-renders */
  GET_UNNECESSARY_RERENDERS: "get-unnecessary-rerenders"
};
var GITHUB_TOOLS = {
  /** Post a comment on an issue or PR */
  ADD_ISSUE_COMMENT: "add_issue_comment",
  /** Create a new issue */
  CREATE_ISSUE: "create_issue",
  /** Get issue details */
  GET_ISSUE: "get_issue",
  /** Update an issue */
  UPDATE_ISSUE: "update_issue",
  /** Search issues */
  SEARCH_ISSUES: "search_issues",
  /** Create a new pull request */
  CREATE_PULL_REQUEST: "create_pull_request",
  /** Get pull request details */
  GET_PULL_REQUEST: "get_pull_request",
  /** Get file contents from a repo */
  GET_FILE_CONTENTS: "get_file_contents",
  /** Create or update a file */
  CREATE_OR_UPDATE_FILE: "create_or_update_file",
  /** List commits */
  LIST_COMMITS: "list_commits",
  /** Fork a repository */
  FORK_REPOSITORY: "fork_repository",
  /** Create a branch */
  CREATE_BRANCH: "create_branch"
};

export {
  createFilesystemClient,
  createInlineFilesystemClient,
  getFilesystemTools,
  createGitHubClient,
  getGitHubTools,
  createPlaywrightClient,
  getPlaywrightTools,
  createContext7Client,
  getContext7Tools,
  createViteReactClient,
  getViteReactTools,
  createGraphQLClient,
  getGraphQLTools,
  initializeMCPClients,
  getAllTools,
  closeMCPClients,
  runAgenticTask,
  PLAYWRIGHT_TOOLS,
  FILESYSTEM_TOOLS,
  CONTEXT7_TOOLS,
  VITE_REACT_TOOLS,
  GITHUB_TOOLS
};
//# sourceMappingURL=chunk-TGUOX2N5.js.map