import {
  AgentRoutingSchema,
  IssueTriageSchema,
  SageResponseSchema,
  TaskDecompositionSchema,
  UnblockResponseSchema
} from "./chunk-CCUCZVAV.js";

// src/triage/connectors.ts
import { createBestProvider, createProvider } from "@agentic/triage-trackers";
var TriageConnectors = class {
  config;
  _provider = null;
  _initPromise = null;
  /**
   * Issue operations API
   */
  issues;
  /**
   * Project operations API (boards, sprints, epics)
   * @remarks Coming soon - currently returns stubs
   */
  projects;
  /**
   * Review operations API (PR feedback, comments)
   * @remarks Coming soon - currently returns stubs
   */
  reviews;
  constructor(config = {}) {
    this.config = config;
    this.issues = new IssueAPI(this);
    this.projects = new ProjectAPI();
    this.reviews = new ReviewAPI();
  }
  /**
   * Get or initialize the underlying provider
   */
  async getProvider() {
    if (this._provider) {
      return this._provider;
    }
    if (this._initPromise) {
      await this._initPromise;
      if (!this._provider) {
        throw new Error("Provider initialization failed");
      }
      return this._provider;
    }
    this._initPromise = this.initializeProvider();
    await this._initPromise;
    if (!this._provider) {
      throw new Error("Provider initialization failed");
    }
    return this._provider;
  }
  /**
   * Reconfigure the connectors with a new configuration.
   * This will reset the underlying provider.
   */
  async reconfigure(config) {
    this.config = config;
    this._provider = null;
    this._initPromise = null;
    await this.getProvider();
  }
  async initializeProvider() {
    if (this.config.provider) {
      this._provider = createProvider(this.config.provider);
    } else {
      this._provider = await createBestProvider({
        workingDir: this.config.workingDir,
        repo: this.config.repo,
        preferBeads: this.config.preferBeads
      });
    }
  }
  /**
   * Get the provider name
   */
  async getProviderName() {
    const provider = await this.getProvider();
    return provider.name;
  }
  /**
   * Check if the connector is ready
   */
  async isReady() {
    try {
      const provider = await this.getProvider();
      return provider.isReady();
    } catch {
      return false;
    }
  }
  /**
   * Sync with remote (for providers that support it)
   */
  async sync() {
    const provider = await this.getProvider();
    if (provider.sync) {
      await provider.sync();
    }
  }
};
var IssueAPI = class {
  constructor(connectors) {
    this.connectors = connectors;
  }
  /**
   * Create a new issue
   */
  async create(options) {
    const provider = await this.connectors.getProvider();
    return provider.createIssue(options);
  }
  /**
   * Get an issue by ID
   */
  async get(id) {
    const provider = await this.connectors.getProvider();
    return provider.getIssue(id);
  }
  /**
   * Update an existing issue
   */
  async update(id, options) {
    const provider = await this.connectors.getProvider();
    return provider.updateIssue(id, options);
  }
  /**
   * Close an issue
   */
  async close(id, reason) {
    const provider = await this.connectors.getProvider();
    return provider.closeIssue(id, reason);
  }
  /**
   * Reopen an issue
   */
  async reopen(id, reason) {
    const provider = await this.connectors.getProvider();
    return provider.reopenIssue(id, reason);
  }
  /**
   * Delete an issue (if supported by provider)
   */
  async delete(id) {
    const provider = await this.connectors.getProvider();
    if (provider.deleteIssue) {
      await provider.deleteIssue(id);
    } else {
      throw new Error(`Delete not supported by ${provider.name} provider`);
    }
  }
  /**
   * List issues with optional filters
   */
  async list(options) {
    const provider = await this.connectors.getProvider();
    return provider.listIssues(options);
  }
  /**
   * Search issues by text query
   */
  async search(query, options) {
    const provider = await this.connectors.getProvider();
    return provider.searchIssues(query, options);
  }
  /**
   * Get issues ready to work on (no blockers)
   */
  async getReadyWork(options) {
    const provider = await this.connectors.getProvider();
    return provider.getReadyWork(options);
  }
  /**
   * Get blocked issues
   */
  async getBlocked() {
    const provider = await this.connectors.getProvider();
    return provider.getBlockedIssues();
  }
  /**
   * Add labels to an issue
   */
  async addLabels(id, labels) {
    const provider = await this.connectors.getProvider();
    await provider.addLabels(id, labels);
  }
  /**
   * Remove labels from an issue
   */
  async removeLabels(id, labels) {
    const provider = await this.connectors.getProvider();
    await provider.removeLabels(id, labels);
  }
  /**
   * Get provider statistics
   */
  async getStats() {
    const provider = await this.connectors.getProvider();
    return provider.getStats();
  }
};
var ProjectAPI = class {
  /**
   * List sprints/iterations
   */
  async getSprints() {
    return [];
  }
  /**
   * Get current sprint
   */
  async getCurrentSprint() {
    return null;
  }
  /**
   * Get epics
   */
  async getEpics() {
    return [];
  }
};
var ReviewAPI = class {
  /**
   * Get PR review comments
   */
  async getPRComments(_prNumber) {
    return [];
  }
  /**
   * Get unresolved feedback on a PR
   */
  async getUnresolvedFeedback(_prNumber) {
    return [];
  }
  /**
   * Reply to a review comment
   */
  async replyToComment(_commentId, _body) {
  }
};

// src/handlers/connectors.ts
var _connectors = null;
function getConnectors(customConnectors) {
  if (customConnectors) return customConnectors;
  if (!_connectors) {
    _connectors = new TriageConnectors();
  }
  return _connectors;
}
function setConnectors(connectors) {
  _connectors = connectors;
}

// src/handlers/issue.ts
import { generateObject } from "ai";
async function handleTriageIssue(id, analysis, customConnectors) {
  try {
    const connectors = getConnectors(customConnectors);
    await connectors.issues.update(id, {
      title: analysis.title,
      priority: analysis.priority,
      type: analysis.type
    });
    if (analysis.labels.length > 0) {
      await connectors.issues.addLabels(id, analysis.labels);
    }
    return {
      success: true,
      message: `Issue ${id} triaged successfully`,
      analysis
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to triage issue ${id}: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
}
async function handleListIssues(filters, customConnectors) {
  try {
    const connectors = getConnectors(customConnectors);
    return await connectors.issues.list(filters);
  } catch (error) {
    console.error("Failed to list issues:", error);
    throw error;
  }
}
async function handleGetIssue(id, customConnectors) {
  try {
    const connectors = getConnectors(customConnectors);
    return await connectors.issues.get(id);
  } catch (error) {
    console.error(`Failed to get issue ${id}:`, error);
    throw error;
  }
}
async function analyzeIssue(issueBody, model) {
  if (!issueBody) {
    throw new Error("Issue body is required");
  }
  const result = await generateObject({
    model,
    schema: IssueTriageSchema,
    prompt: `Analyze the following issue and provide a summary, impact, and suggestions:

${issueBody}`
  });
  return result.object;
}

// src/handlers/pr.ts
async function handleAnalyzePR(prNumber, analysis) {
  try {
    return {
      success: true,
      message: `Analysis for PR #${prNumber} completed`,
      analysis
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to analyze PR #${prNumber}: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
}

// src/handlers/review.ts
async function handleSubmitReview(prNumber, review) {
  try {
    return {
      success: true,
      message: `Review for PR #${prNumber} submitted with status: ${review.status}`,
      review
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to submit review for PR #${prNumber}: ${error instanceof Error ? error.message : String(error)}`,
      error
    };
  }
}

// src/handlers/sage.ts
import { generateObject as generateObject2 } from "ai";
function classifyQuery(query) {
  const lower = query.toLowerCase();
  if (/\b(review|feedback|look at|check)\b/.test(lower)) return "review";
  if (/\b(blocked|stuck|help|unblock|can't|cannot)\b/.test(lower)) return "unblock";
  if (/\b(how|what|why|explain|where|when)\b/.test(lower)) return "question";
  if (/\b(fix|bug|error|broken|failing|crash)\b/.test(lower)) return "fix";
  if (/\b(implement|create|add|build|make|write)\b/.test(lower)) return "implement";
  if (/\b(refactor|cleanup|improve|optimize|reorganize)\b/.test(lower)) return "refactor";
  if (/\b(decompose|break down|plan|tasks|subtasks|steps)\b/.test(lower)) return "decompose";
  if (/\b(route|assign|delegate|who should)\b/.test(lower)) return "route";
  return "general";
}
function buildSystemPrompt(context) {
  let prompt = `You are the Ecosystem Sage - an intelligent advisor for software development.

Your role:
1. Answer technical questions accurately and concisely
2. Provide code review feedback when asked
3. Decompose complex tasks into actionable subtasks
4. Help unblock stuck developers and agents
5. Route work to the appropriate agent (Cursor, Jules, Claude, or Human)

Agent Capabilities:
- CURSOR: Best for quick fixes (<10 lines), single-file changes, debugging, CI failure resolution
- JULES: Best for multi-file refactors, documentation, complex feature architecture
- CLAUDE: Best for complex reasoning, implementation of new features, deep analysis
- OLLAMA: Best for quick answers, simple query classification, local task execution
- HUMAN: Required for product decisions, security reviews, architecture approval, human-in-the-loop validation

Guidelines:
- Be concise and actionable
- Reference specific files when relevant
- Never hallucinate - if unsure, say so
- Provide confidence levels honestly
- Format responses in Markdown
- Align with jbcom/control-center ecosystem workflows`;
  if (context?.repoStructure) {
    prompt += `

Repository Structure:
${context.repoStructure}`;
  }
  if (context?.keyFiles) {
    prompt += "\n\nKey Files:";
    for (const [file, content] of Object.entries(context.keyFiles)) {
      prompt += `

=== ${file} ===
${content.slice(0, 2e3)}`;
    }
  }
  if (context?.issueContext) {
    prompt += `

Issue/PR Context:
${context.issueContext}`;
  }
  if (context?.currentContext) {
    prompt += `

Current Context:
${context.currentContext}`;
  }
  return prompt;
}
async function answerQuestion(query, model, context) {
  if (!query?.trim()) {
    throw new Error("Query is required");
  }
  const queryType = classifyQuery(query);
  const result = await generateObject2({
    model,
    schema: SageResponseSchema,
    system: buildSystemPrompt(context),
    prompt: `Query Type: ${queryType}

Query:
${query}

Provide a helpful, accurate response. Include file references if relevant.
If the query suggests work that should be delegated, include an agent recommendation.`
  });
  return result.object;
}
async function decomposeTask(task, model, context) {
  if (!task?.trim()) {
    throw new Error("Task is required");
  }
  const result = await generateObject2({
    model,
    schema: TaskDecompositionSchema,
    system: buildSystemPrompt(context),
    prompt: `Decompose this task into specific, actionable subtasks.

Task:
${task}

For each subtask:
1. Assign a unique ID (task-001, task-002, etc.)
2. Write a clear, actionable title
3. Provide detailed description
4. Assign to the most appropriate agent (cursor/jules/ollama/human)
5. Set priority (1=highest, 10=lowest)
6. Estimate effort (small/medium/large)
7. Note dependencies on other subtasks

Order subtasks logically for execution.`
  });
  return result.object;
}
async function routeToAgent(task, model, context) {
  if (!task?.trim()) {
    throw new Error("Task is required");
  }
  const result = await generateObject2({
    model,
    schema: AgentRoutingSchema,
    system: buildSystemPrompt(context),
    prompt: `Determine which agent should handle this task.

Task:
${task}

Consider:
- Task complexity and scope
- Number of files likely affected
- Need for human judgment
- Security implications
- Time sensitivity

Provide clear reasoning and specific instructions for the chosen agent.`
  });
  return result.object;
}
async function unblock(situation, model, context) {
  if (!situation?.trim()) {
    throw new Error("Situation description is required");
  }
  const result = await generateObject2({
    model,
    schema: UnblockResponseSchema,
    system: buildSystemPrompt(context),
    prompt: `Analyze this blocked situation and provide suggestions to unblock.

Situation:
${situation}

Diagnose the root cause and provide:
1. Clear diagnosis of what's blocking
2. Root cause analysis
3. Ordered list of suggestions (most likely to work first)
4. The single most important immediate action
5. Whether human intervention is required`
  });
  return result.object;
}
async function sage(query, model, context) {
  const queryType = classifyQuery(query);
  switch (queryType) {
    case "decompose":
      return decomposeTask(query, model, context);
    case "route":
      return routeToAgent(query, model, context);
    case "unblock":
      return unblock(query, model, context);
    default:
      return answerQuestion(query, model, context);
  }
}

export {
  TriageConnectors,
  getConnectors,
  setConnectors,
  handleTriageIssue,
  handleListIssues,
  handleGetIssue,
  analyzeIssue,
  handleAnalyzePR,
  handleSubmitReview,
  classifyQuery,
  answerQuestion,
  decomposeTask,
  routeToAgent,
  unblock,
  sage
};
//# sourceMappingURL=chunk-N3WUYPZK.js.map