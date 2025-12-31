import {
  triageItem
} from "./chunk-Z6RWHJPO.js";
import {
  addLabelsTool,
  analyzePRTool,
  closeIssueTool,
  createIssueTool,
  getIssueTool,
  getTriageTools,
  listIssuesTool,
  removeLabelsTool,
  sageTool,
  searchIssuesTool,
  submitReviewTool,
  triageIssueTool,
  triageTools,
  updateIssueTool,
  visualReviewTool
} from "./chunk-IUH563A4.js";
import {
  analyzeIssue,
  answerQuestion,
  classifyQuery,
  decomposeTask,
  getConnectors,
  handleAnalyzePR,
  handleGetIssue,
  handleListIssues,
  handleSubmitReview,
  handleTriageIssue,
  routeToAgent,
  sage,
  setConnectors,
  unblock
} from "./chunk-N3WUYPZK.js";
import {
  AgentRoutingSchema,
  AgentTypeSchema,
  CodeReviewCommentSchema,
  CodeReviewSchema,
  EffortSchema,
  IssuePrioritySchema,
  IssueStatusSchema,
  IssueTriageSchema,
  IssueTypeSchema,
  PRAnalysisSchema,
  ReviewImpactSchema,
  SageQueryTypeSchema,
  SageResponseSchema,
  SubtaskSchema,
  TaskDecompositionSchema,
  UnblockResponseSchema,
  triageAnalysisSchema
} from "./chunk-CCUCZVAV.js";

// src/scoring/agents.ts
var AgentRegistry = class {
  agents = /* @__PURE__ */ new Map();
  /**
   * Register an agent
   */
  register(agent) {
    this.agents.set(agent.id, agent);
    return this;
  }
  /**
   * Register multiple agents at once
   */
  registerAll(agents) {
    for (const agent of agents) {
      this.register(agent);
    }
    return this;
  }
  /**
   * Unregister an agent
   */
  unregister(id) {
    return this.agents.delete(id);
  }
  /**
   * Enable/disable an agent at runtime
   */
  setEnabled(id, enabled) {
    const agent = this.agents.get(id);
    if (agent) {
      agent.enabled = enabled;
    }
  }
  /**
   * Update an agent's priority (for dynamic rebalancing)
   */
  setPriority(id, priority) {
    const agent = this.agents.get(id);
    if (agent) {
      agent.priority = priority;
    }
  }
  /**
   * Update an agent's cost (for dynamic pricing)
   */
  setCost(id, cost) {
    const agent = this.agents.get(id);
    if (agent) {
      agent.cost = cost;
    }
  }
  /**
   * Get all registered agents
   */
  all() {
    return Array.from(this.agents.values());
  }
  /**
   * Get all enabled agents
   */
  enabled() {
    return this.all().filter((a) => a.enabled);
  }
  /**
   * Get agents that can handle a specific complexity tier
   * Sorted by priority (lowest first), then by cost
   */
  forTier(tier, includeDisabled = false) {
    return this.all().filter((a) => (includeDisabled || a.enabled) && a.capabilities.tiers.includes(tier)).sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.cost - b.cost;
    });
  }
  /**
   * Get the optimal (first choice) agent for a complexity tier
   */
  optimalFor(tier) {
    return this.forTier(tier)[0];
  }
  /**
   * Get agent by ID
   */
  get(id) {
    return this.agents.get(id);
  }
  /**
   * Check if an agent is registered
   */
  has(id) {
    return this.agents.has(id);
  }
  /**
   * Get count of registered agents
   */
  get size() {
    return this.agents.size;
  }
  /**
   * Clear all agents
   */
  clear() {
    this.agents.clear();
  }
  /**
   * Export registry configuration (for serialization)
   */
  export() {
    return this.all().map(({ execute, ...rest }) => rest);
  }
};

// src/scoring/weights.ts
var DEFAULT_WEIGHTS = {
  files_changed: 0.15,
  lines_changed: 0.1,
  dependency_depth: 0.15,
  test_coverage_need: 0.1,
  cross_module_impact: 0.15,
  semantic_complexity: 0.2,
  context_required: 0.1,
  risk_level: 0.05
};
var DEFAULT_THRESHOLDS = {
  trivial: 2.5,
  simple: 5,
  moderate: 7,
  complex: 8.5
};
function tierToAgent(tier, cursorEnabled = false) {
  switch (tier) {
    case "trivial":
    case "simple":
      return "ollama";
    case "moderate":
    case "complex":
      return "jules";
    case "expert":
      return cursorEnabled ? "cursor" : "jules";
  }
}
function scoreToTier(score, thresholds = DEFAULT_THRESHOLDS) {
  if (score <= thresholds.trivial) return "trivial";
  if (score <= thresholds.simple) return "simple";
  if (score <= thresholds.moderate) return "moderate";
  if (score <= thresholds.complex) return "complex";
  return "expert";
}
function calculateWeightedScore(raw, weights = DEFAULT_WEIGHTS) {
  let score = 0;
  for (const [key, weight] of Object.entries(weights)) {
    score += weight * (raw[key] ?? 0);
  }
  return Math.round(score * 100) / 100;
}

// src/scoring/evaluator.ts
function generateEvaluationPrompt(task, context, maxContext = 8e3) {
  return `You are a code complexity evaluator. Analyze this task and score each dimension 0-10.

TASK:
${task}

CONTEXT:
${context.slice(0, maxContext)}

Score each dimension (0=trivial, 10=extremely complex):

1. files_changed: How many files are affected?
   0=1 file, 3=2-5 files, 6=5-10 files, 10=10+ files

2. lines_changed: Volume of changes?
   0=<10 lines, 3=10-50, 6=50-200, 10=200+

3. dependency_depth: How deep are the import chains?
   0=no deps, 3=local deps, 6=cross-module, 10=cross-repo

4. test_coverage_need: How much testing is required?
   0=none, 3=unit tests, 6=integration tests, 10=e2e + manual

5. cross_module_impact: Does this affect other parts of the system?
   0=isolated, 3=same module, 6=multiple modules, 10=system-wide

6. semantic_complexity: How complex is the logic?
   0=formatting, 3=simple fix, 6=new feature, 10=algorithm design

7. context_required: How much codebase knowledge is needed?
   0=none, 3=file context, 6=module context, 10=full architecture

8. risk_level: Could this break things?
   0=no risk, 3=minor, 6=moderate, 10=critical path

Respond ONLY with valid JSON (no markdown, no explanation outside JSON):
{
  "files_changed": <0-10>,
  "lines_changed": <0-10>,
  "dependency_depth": <0-10>,
  "test_coverage_need": <0-10>,
  "cross_module_impact": <0-10>,
  "semantic_complexity": <0-10>,
  "context_required": <0-10>,
  "risk_level": <0-10>,
  "reasoning": "<one sentence explanation>"
}`;
}
function parseEvaluationResponse(response, weights = DEFAULT_WEIGHTS) {
  let json = response;
  const backtickIndex = response.indexOf("```");
  if (backtickIndex !== -1) {
    const afterFirst = response.slice(backtickIndex + 3);
    const nextBacktickIndex = afterFirst.indexOf("```");
    if (nextBacktickIndex !== -1) {
      let inner = afterFirst.slice(0, nextBacktickIndex);
      if (inner.trimStart().toLowerCase().startsWith("json")) {
        inner = inner.trimStart().slice(4);
      }
      json = inner;
    }
  }
  const parsed = JSON.parse(json.trim());
  const scores = {
    files_changed: 0,
    lines_changed: 0,
    dependency_depth: 0,
    test_coverage_need: 0,
    cross_module_impact: 0,
    semantic_complexity: 0,
    context_required: 0,
    risk_level: 0
  };
  for (const key of Object.keys(weights)) {
    const val = Number(parsed[key]) || 0;
    scores[key] = Math.max(0, Math.min(10, val));
  }
  return {
    scores,
    reasoning: parsed.reasoning || "No reasoning provided"
  };
}
function calculateComplexity(scores, config = {}) {
  const { weights = DEFAULT_WEIGHTS, thresholds = DEFAULT_THRESHOLDS } = config;
  const weighted = calculateWeightedScore(scores, weights);
  const tier = scoreToTier(weighted, thresholds);
  return {
    raw: scores,
    weighted,
    tier
  };
}
async function evaluateComplexity(llm, task, context, config = {}) {
  const prompt = generateEvaluationPrompt(task, context, config.maxContextLength);
  const response = await llm(prompt);
  const { scores, reasoning } = parseEvaluationResponse(response, config.weights);
  const result = calculateComplexity(scores, config);
  return {
    ...result,
    reasoning
  };
}
function estimateComplexityHeuristic(options, config = {}) {
  const {
    filesChanged = 1,
    linesChanged = 10,
    hasTests = true,
    isRefactor = false,
    hasDependencyChanges = false,
    isCriticalPath = false
  } = options;
  const scores = {
    files_changed: Math.min(10, filesChanged),
    lines_changed: Math.min(10, Math.log10(linesChanged + 1) * 3),
    dependency_depth: hasDependencyChanges ? 6 : isRefactor ? 4 : 2,
    test_coverage_need: hasTests ? 3 : 6,
    cross_module_impact: filesChanged > 5 ? 7 : filesChanged > 2 ? 4 : 1,
    semantic_complexity: isRefactor ? 6 : 3,
    context_required: filesChanged > 3 ? 6 : 3,
    risk_level: isCriticalPath ? 8 : isRefactor ? 5 : 2
  };
  const result = calculateComplexity(scores, config);
  return {
    ...result,
    reasoning: "Heuristic estimation (no LLM evaluation)"
  };
}

// src/scoring/router.ts
var TaskRouter = class {
  config;
  state;
  constructor(config) {
    this.config = {
      maxRetries: 2,
      dailyBudget: 0,
      ...config
    };
    this.state = {
      dailyCosts: 0,
      lastReset: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      tasksProcessed: 0
    };
  }
  /**
   * Route a task to the optimal agent
   */
  async route(task, complexity) {
    this.maybeResetDaily();
    const fullTask = {
      ...task,
      complexityScore: complexity.weighted,
      complexityTier: complexity.tier
    };
    const trail = [];
    let totalCost = 0;
    const tierOrder = ["trivial", "simple", "moderate", "complex", "expert"];
    const startIndex = tierOrder.indexOf(complexity.tier);
    for (let i = startIndex; i < tierOrder.length; i++) {
      const tier = tierOrder[i];
      const agents = this.config.registry.forTier(tier);
      for (const agent of agents) {
        if (!this.canUseAgent(agent, fullTask)) {
          continue;
        }
        const result = await this.tryAgent(agent, fullTask, trail);
        totalCost += result.totalCost;
        if (result.success && result.agentResult) {
          this.state.tasksProcessed++;
          return {
            success: true,
            agent: agent.id,
            result: result.agentResult,
            totalCost,
            attempts: trail.length,
            trail
          };
        }
        const nextAgent = agents[agents.indexOf(agent) + 1];
        if (nextAgent) {
          this.config.onEscalate?.(agent, nextAgent, "Agent failed");
        }
      }
    }
    this.state.tasksProcessed++;
    return {
      success: false,
      agent: "none",
      result: { success: false, error: "All agents exhausted", cost: 0 },
      totalCost,
      attempts: trail.length,
      trail
    };
  }
  /**
   * Check if an agent can be used for a task
   */
  canUseAgent(agent, task) {
    if (agent.requiresApproval && !this.hasApproval(task, agent)) {
      return false;
    }
    if (this.config.dailyBudget > 0 && this.state.dailyCosts + agent.cost > this.config.dailyBudget) {
      return false;
    }
    return true;
  }
  /**
   * Try an agent with retries
   */
  async tryAgent(agent, task, trail) {
    let totalCost = 0;
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      this.config.onAgentSelected?.(agent, task);
      try {
        const result = await agent.execute(task);
        totalCost += result.cost;
        this.state.dailyCosts += result.cost;
        this.config.onCostIncurred?.(agent, result.cost, task);
        trail.push({
          agent: agent.id,
          success: result.success,
          error: result.error
        });
        if (result.success) {
          return { success: true, totalCost, agentResult: result };
        }
        if (result.escalate || attempt >= this.config.maxRetries) {
          return { success: false, totalCost, agentResult: result };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        trail.push({ agent: agent.id, success: false, error: errorMessage });
        if (attempt >= this.config.maxRetries) {
          return { success: false, totalCost };
        }
      }
    }
    return { success: false, totalCost };
  }
  /**
   * Check if a task has approval for an agent that requires it
   */
  hasApproval(task, agent) {
    const approved = task.metadata?.approved;
    return approved?.includes(agent.id) ?? false;
  }
  /**
   * Reset daily state if it's a new day
   */
  maybeResetDaily() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    if (this.state.lastReset !== today) {
      this.state = {
        dailyCosts: 0,
        lastReset: today,
        tasksProcessed: 0
      };
    }
  }
  /**
   * Get current router state
   */
  getState() {
    return { ...this.state };
  }
  /**
   * Get remaining daily budget
   */
  getRemainingBudget() {
    if (this.config.dailyBudget === 0) return Number.POSITIVE_INFINITY;
    return Math.max(0, this.config.dailyBudget - this.state.dailyCosts);
  }
};
function createRouter(registry, options) {
  return new TaskRouter({ registry, ...options });
}

// src/storage/file.ts
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";
var FileStorage = class {
  constructor(filePath) {
    this.filePath = filePath;
  }
  async read() {
    try {
      const content = await readFile(this.filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      if (error.code === "ENOENT") {
        return this.createEmptyState();
      }
      throw error;
    }
  }
  async write(state) {
    await mkdir(dirname(this.filePath), { recursive: true });
    const updatedState = {
      ...state,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await writeFile(this.filePath, JSON.stringify(updatedState, null, 2), "utf-8");
  }
  async acquireLock(holder, ttlMs) {
    const state = await this.read();
    if (state.lock) {
      const expires = new Date(state.lock.expiresAt);
      if (expires > /* @__PURE__ */ new Date()) {
        return state.lock.holder === holder;
      }
    }
    state.lock = {
      holder,
      acquiredAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt: new Date(Date.now() + ttlMs).toISOString()
    };
    await this.write(state);
    return true;
  }
  async releaseLock(holder) {
    const state = await this.read();
    if (state.lock?.holder === holder) {
      state.lock = null;
      await this.write(state);
    }
  }
  async isLocked() {
    const state = await this.read();
    if (!state.lock) return false;
    return new Date(state.lock.expiresAt) > /* @__PURE__ */ new Date();
  }
  async getLock() {
    const state = await this.read();
    return state.lock;
  }
  createEmptyState() {
    return {
      version: 2,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lock: null,
      items: [],
      stats: {
        total: 0,
        byStatus: { pending: 0, processing: 0, completed: 0, failed: 0, cancelled: 0 },
        completed24h: 0,
        failed24h: 0,
        avgProcessingTime: 0
      }
    };
  }
};

// src/storage/github-issue.ts
var STATE_START = "<!-- QUEUE_STATE_START -->";
var STATE_END = "<!-- QUEUE_STATE_END -->";
var LOCK_COMMENT_PREFIX = "\u{1F512} QUEUE_LOCK:";
var GitHubIssueStorage = class {
  owner;
  repoName;
  issueNumber;
  issueTitle;
  token;
  octokit;
  actualIssueNumber = null;
  octokitPromise = null;
  constructor(options) {
    const [owner, repo] = options.repo.split("/");
    if (!owner || !repo) {
      throw new Error('Invalid repo format. Expected "owner/repo"');
    }
    this.owner = owner;
    this.repoName = repo;
    this.issueNumber = options.issueNumber;
    this.issueTitle = options.issueTitle || "Merge Queue State";
    this.token = options.token;
    this.octokit = options.octokit || null;
  }
  async read() {
    const issue = await this.getOrCreateIssue();
    const body = issue.body || "";
    const parsed = this.parseIssueBody(body);
    if (parsed) {
      return parsed;
    }
    return this.createEmptyState();
  }
  async write(state) {
    const issue = await this.getOrCreateIssue();
    const updatedState = {
      ...state,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const body = this.formatIssueBody(updatedState);
    const client = await this.getOctokit();
    await client.rest.issues.update({
      owner: this.owner,
      repo: this.repoName,
      issue_number: issue.number,
      body
    });
  }
  async acquireLock(holder, ttlMs) {
    const issue = await this.getOrCreateIssue();
    const client = await this.getOctokit();
    const comments = await client.rest.issues.listComments({
      owner: this.owner,
      repo: this.repoName,
      issue_number: issue.number,
      per_page: 100
    });
    const lockComments = comments.data.filter((c) => c.body?.startsWith(LOCK_COMMENT_PREFIX));
    for (const comment of lockComments) {
      const lock2 = this.parseLockComment(comment.body || "");
      if (lock2 && new Date(lock2.expiresAt) > /* @__PURE__ */ new Date()) {
        return lock2.holder === holder;
      }
      await client.rest.issues.deleteComment({
        owner: this.owner,
        repo: this.repoName,
        comment_id: comment.id
      });
    }
    const lock = {
      holder,
      acquiredAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt: new Date(Date.now() + ttlMs).toISOString()
    };
    await client.rest.issues.createComment({
      owner: this.owner,
      repo: this.repoName,
      issue_number: issue.number,
      body: `${LOCK_COMMENT_PREFIX} ${JSON.stringify(lock)}`
    });
    return true;
  }
  async releaseLock(holder) {
    const issue = await this.getOrCreateIssue();
    const client = await this.getOctokit();
    const comments = await client.rest.issues.listComments({
      owner: this.owner,
      repo: this.repoName,
      issue_number: issue.number,
      per_page: 100
    });
    for (const comment of comments.data) {
      if (comment.body?.startsWith(LOCK_COMMENT_PREFIX)) {
        const lock = this.parseLockComment(comment.body);
        if (lock?.holder === holder) {
          await client.rest.issues.deleteComment({
            owner: this.owner,
            repo: this.repoName,
            comment_id: comment.id
          });
        }
      }
    }
  }
  async isLocked() {
    const lock = await this.getLock();
    return lock !== null && new Date(lock.expiresAt) > /* @__PURE__ */ new Date();
  }
  async getLock() {
    const issue = await this.getOrCreateIssue();
    const client = await this.getOctokit();
    const comments = await client.rest.issues.listComments({
      owner: this.owner,
      repo: this.repoName,
      issue_number: issue.number,
      per_page: 100
    });
    for (const comment of comments.data) {
      if (comment.body?.startsWith(LOCK_COMMENT_PREFIX)) {
        const lock = this.parseLockComment(comment.body);
        if (lock && new Date(lock.expiresAt) > /* @__PURE__ */ new Date()) {
          return lock;
        }
      }
    }
    return null;
  }
  // ============================================================================
  // Private Helpers
  // ============================================================================
  async getOctokit() {
    if (this.octokit) {
      return this.octokit;
    }
    if (!this.octokitPromise) {
      this.octokitPromise = import("octokit").then(({ Octokit }) => {
        const client = new Octokit({ auth: this.token });
        this.octokit = client;
        return client;
      });
    }
    return this.octokitPromise;
  }
  async getOrCreateIssue() {
    if (this.actualIssueNumber !== null) {
      const client2 = await this.getOctokit();
      const { data: data2 } = await client2.rest.issues.get({
        owner: this.owner,
        repo: this.repoName,
        issue_number: this.actualIssueNumber
      });
      return data2;
    }
    if (this.issueNumber === "auto") {
      return this.createIssue();
    }
    const client = await this.getOctokit();
    const { data } = await client.rest.issues.get({
      owner: this.owner,
      repo: this.repoName,
      issue_number: this.issueNumber
    });
    this.actualIssueNumber = data.number;
    return data;
  }
  async createIssue() {
    const client = await this.getOctokit();
    const emptyState = this.createEmptyState();
    const body = this.formatIssueBody(emptyState);
    const { data } = await client.rest.issues.create({
      owner: this.owner,
      repo: this.repoName,
      title: this.issueTitle,
      body,
      labels: ["queue", "automation"]
    });
    this.actualIssueNumber = data.number;
    return { number: data.number, body };
  }
  parseIssueBody(body) {
    const startIdx = body.indexOf(STATE_START);
    const endIdx = body.indexOf(STATE_END);
    if (startIdx === -1 || endIdx === -1) {
      return null;
    }
    const jsonBlock = body.substring(startIdx + STATE_START.length, endIdx);
    const match = jsonBlock.match(/```json\s*([\s\S]*?)\s*```/);
    if (!match || !match[1]) {
      return null;
    }
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  }
  formatIssueBody(state) {
    const json = JSON.stringify(state, null, 2);
    const rows = state.items.map((item, idx) => this.formatTableRow(item, idx));
    const table = rows.length > 0 ? `| # | PR | Priority | Status |
|---|-----|----------|--------|
${rows.join("\n")}` : "_Queue is empty_";
    return `${STATE_START}
\`\`\`json
${json}
\`\`\`
${STATE_END}

## Queue Status

${table}

**Stats:**
- Total: ${state.stats.total}
- Pending: ${state.stats.byStatus.pending}
- Processing: ${state.stats.byStatus.processing}
- Failed: ${state.stats.byStatus.failed}

_Last updated: ${state.updatedAt}_
`;
  }
  formatTableRow(item, idx) {
    const prLink = item.id.includes("#") ? `[${item.id}](https://github.com/${item.id.replace("#", "/pull/")})` : item.id;
    const priorityEmoji = this.getPriorityEmoji(item.priority);
    const statusEmoji = this.getStatusEmoji(item.status);
    return `| ${idx + 1} | ${prLink} | ${priorityEmoji} ${item.priority} | ${statusEmoji} ${item.status} |`;
  }
  getPriorityEmoji(priority) {
    if (priority === 1) return "\u{1F534}";
    if (priority === 2) return "\u{1F7E1}";
    return "\u{1F7E2}";
  }
  getStatusEmoji(status) {
    switch (status) {
      case "pending":
        return "\u23F3";
      case "processing":
        return "\u{1F504}";
      case "completed":
        return "\u2705";
      case "failed":
        return "\u274C";
      default:
        return "\u23F8\uFE0F";
    }
  }
  parseLockComment(body) {
    if (!body.startsWith(LOCK_COMMENT_PREFIX)) {
      return null;
    }
    const jsonStr = body.substring(LOCK_COMMENT_PREFIX.length).trim();
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  }
  createEmptyState() {
    return {
      version: 2,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lock: null,
      items: [],
      stats: {
        total: 0,
        byStatus: { pending: 0, processing: 0, completed: 0, failed: 0, cancelled: 0 },
        completed24h: 0,
        failed24h: 0,
        avgProcessingTime: 0
      }
    };
  }
};

// src/storage/memory.ts
var MemoryStorage = class {
  state;
  constructor(initial) {
    this.state = {
      version: 2,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lock: null,
      items: [],
      stats: {
        total: 0,
        byStatus: { pending: 0, processing: 0, completed: 0, failed: 0, cancelled: 0 },
        completed24h: 0,
        failed24h: 0,
        avgProcessingTime: 0
      },
      ...initial
    };
  }
  async read() {
    return { ...this.state, items: [...this.state.items] };
  }
  async write(state) {
    this.state = { ...state, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
  }
  async acquireLock(holder, ttlMs) {
    if (this.state.lock) {
      const expires = new Date(this.state.lock.expiresAt);
      if (expires > /* @__PURE__ */ new Date()) {
        return this.state.lock.holder === holder;
      }
    }
    this.state.lock = {
      holder,
      acquiredAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt: new Date(Date.now() + ttlMs).toISOString()
    };
    return true;
  }
  async releaseLock(holder) {
    if (this.state.lock?.holder === holder) {
      this.state.lock = null;
    }
  }
  async isLocked() {
    if (!this.state.lock) return false;
    return new Date(this.state.lock.expiresAt) > /* @__PURE__ */ new Date();
  }
  async getLock() {
    return this.state.lock;
  }
};

// src/escalation/config.ts
var DEFAULT_ESCALATION_CONFIG = {
  maxOllamaAttempts: 2,
  maxJulesAttempts: 3,
  maxJulesBoostAttempts: 3,
  cloudAgentEnabled: false,
  cloudAgentApprovalRequired: true,
  costBudgetDaily: 0
};
function createEscalationConfig(partial) {
  return {
    ...DEFAULT_ESCALATION_CONFIG,
    ...partial
  };
}

// src/escalation/cost-tracker.ts
var CostTracker = class {
  entries = /* @__PURE__ */ new Map();
  dailyBudget;
  onBudgetWarning;
  constructor(dailyBudget, options) {
    this.dailyBudget = dailyBudget;
    this.onBudgetWarning = options?.onBudgetWarning;
  }
  /**
   * Record a cost entry
   */
  record(taskId, agent, amount, description = "Cloud agent operation") {
    const entry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      taskId,
      agent,
      amount,
      description
    };
    const today = this.getToday();
    const dailyEntries = this.entries.get(today) || [];
    dailyEntries.push(entry);
    this.entries.set(today, dailyEntries);
    const stats = this.getDailyStats(today);
    const remaining = this.dailyBudget - stats.total;
    if (remaining <= this.dailyBudget * 0.2 && remaining > 0 && this.onBudgetWarning) {
      this.onBudgetWarning(remaining, stats.total);
    }
    return entry;
  }
  /**
   * Check if operation is within budget
   */
  canAfford(amount, date) {
    if (this.dailyBudget === 0) return false;
    const today = date || this.getToday();
    const stats = this.getDailyStats(today);
    return stats.total + amount <= this.dailyBudget;
  }
  /**
   * Get remaining budget for today
   */
  getRemainingBudget(date) {
    const today = date || this.getToday();
    const stats = this.getDailyStats(today);
    return Math.max(0, this.dailyBudget - stats.total);
  }
  /**
   * Get daily statistics
   */
  getDailyStats(date) {
    const today = date || this.getToday();
    const entries = this.entries.get(today) || [];
    const byAgent = {};
    let total = 0;
    for (const entry of entries) {
      total += entry.amount;
      byAgent[entry.agent] = (byAgent[entry.agent] || 0) + entry.amount;
    }
    return {
      date: today,
      total,
      operations: entries.length,
      byAgent,
      entries: [...entries]
    };
  }
  /**
   * Get stats for a date range
   */
  getStatsInRange(startDate, endDate) {
    const stats = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split("T")[0];
      if (this.entries.has(dateStr)) {
        stats.push(this.getDailyStats(dateStr));
      }
    }
    return stats;
  }
  /**
   * Get all-time total cost
   */
  getTotalCost() {
    let total = 0;
    const values = Array.from(this.entries.values());
    for (const entries of values) {
      total += entries.reduce((sum, e) => sum + e.amount, 0);
    }
    return total;
  }
  /**
   * Clear old entries (keep last N days)
   */
  cleanup(keepDays = 30) {
    const cutoff = /* @__PURE__ */ new Date();
    cutoff.setDate(cutoff.getDate() - keepDays);
    const cutoffStr = cutoff.toISOString().split("T")[0];
    const dates = Array.from(this.entries.keys());
    for (const date of dates) {
      if (date < cutoffStr) {
        this.entries.delete(date);
      }
    }
  }
  /**
   * Export all data (for persistence)
   */
  export() {
    const exported = {};
    const entries = Array.from(this.entries.entries());
    for (const [date, entriesArray] of entries) {
      exported[date] = [...entriesArray];
    }
    return exported;
  }
  /**
   * Import data (from persistence)
   */
  import(data) {
    this.entries.clear();
    for (const [date, entries] of Object.entries(data)) {
      this.entries.set(date, [...entries]);
    }
  }
  /**
   * Reset all tracking data
   */
  reset() {
    this.entries.clear();
  }
  /**
   * Update daily budget
   */
  setDailyBudget(budget) {
    this.dailyBudget = budget;
  }
  /**
   * Get current daily budget
   */
  getDailyBudget() {
    return this.dailyBudget;
  }
  getToday() {
    return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  }
};

// src/escalation/state.ts
var EscalationStateManager = class {
  states = /* @__PURE__ */ new Map();
  /**
   * Create or get state for a task
   */
  getState(taskId) {
    if (!this.states.has(taskId)) {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      this.states.set(taskId, {
        taskId,
        level: 0,
        attempts: {},
        errors: [],
        resolved: false,
        cost: 0,
        createdAt: now,
        updatedAt: now,
        approved: false
      });
    }
    const state = this.states.get(taskId);
    if (!state) {
      throw new Error(`Failed to create state for task ${taskId}`);
    }
    return state;
  }
  /**
   * Update state for a task
   */
  updateState(taskId, update) {
    const state = this.getState(taskId);
    const updated = {
      ...state,
      ...update,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.states.set(taskId, updated);
    return updated;
  }
  /**
   * Record an attempt at a level
   */
  recordAttempt(taskId, level) {
    const state = this.getState(taskId);
    const levelKey = `level${level}`;
    const attempts = {
      ...state.attempts,
      [levelKey]: (state.attempts[levelKey] || 0) + 1
    };
    return this.updateState(taskId, { attempts });
  }
  /**
   * Record an error
   */
  recordError(taskId, error) {
    const state = this.getState(taskId);
    const errors = [...state.errors, error];
    return this.updateState(taskId, { errors });
  }
  /**
   * Escalate to next level
   */
  escalate(taskId) {
    const state = this.getState(taskId);
    const newLevel = Math.min(6, state.level + 1);
    return this.updateState(taskId, { level: newLevel });
  }
  /**
   * Mark task as resolved
   */
  resolve(taskId) {
    return this.updateState(taskId, { resolved: true });
  }
  /**
   * Add cost to task
   */
  addCost(taskId, cost) {
    const state = this.getState(taskId);
    return this.updateState(taskId, { cost: state.cost + cost });
  }
  /**
   * Set approval status
   */
  setApproval(taskId, approved) {
    return this.updateState(taskId, { approved });
  }
  /**
   * Reset state for a task
   */
  resetState(taskId) {
    this.states.delete(taskId);
  }
  /**
   * Get all states
   */
  getAllStates() {
    return Array.from(this.states.values());
  }
  /**
   * Get unresolved states
   */
  getUnresolved() {
    return this.getAllStates().filter((s) => !s.resolved);
  }
  /**
   * Clear all states
   */
  clear() {
    this.states.clear();
  }
  /**
   * Get total cost across all tasks
   */
  getTotalCost() {
    return this.getAllStates().reduce((sum, s) => sum + s.cost, 0);
  }
};

// src/escalation/ladder.ts
var EscalationLadder = class {
  config;
  stateManager;
  costTracker;
  handlers = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = createEscalationConfig(config);
    this.stateManager = new EscalationStateManager();
    this.costTracker = new CostTracker(this.config.costBudgetDaily);
  }
  /**
   * Register a handler for a specific level
   */
  registerHandler(level, handler) {
    this.handlers.set(level, handler);
    return this;
  }
  /**
   * Process a task through the escalation ladder
   */
  async process(task) {
    const trail = [];
    let totalCost = 0;
    if (this.hasCloudAgentApproval(task)) {
      this.stateManager.setApproval(task.id, true);
    }
    let state = this.stateManager.getState(task.id);
    let currentLevel = state.level;
    while (currentLevel <= 6) {
      state = this.stateManager.getState(task.id);
      if (this.shouldSkipLevel(currentLevel, state)) {
        currentLevel = currentLevel + 1;
        this.stateManager.updateState(task.id, { level: currentLevel });
        continue;
      }
      const handler = this.handlers.get(currentLevel);
      if (!handler) {
        trail.push({
          level: currentLevel,
          success: false,
          error: "No handler registered"
        });
        currentLevel = currentLevel + 1;
        this.stateManager.updateState(task.id, { level: currentLevel });
        continue;
      }
      if (this.hasExceededAttempts(currentLevel, state)) {
        trail.push({
          level: currentLevel,
          success: false,
          error: "Max attempts exceeded"
        });
        currentLevel = currentLevel + 1;
        this.stateManager.updateState(task.id, { level: currentLevel });
        continue;
      }
      this.stateManager.recordAttempt(task.id, currentLevel);
      state = this.stateManager.getState(task.id);
      try {
        const result = await handler(task, state);
        if (result.cost) {
          totalCost += result.cost;
          this.stateManager.addCost(task.id, result.cost);
          if (currentLevel === 6) {
            this.costTracker.record(task.id, "cloud-agent", result.cost, `Level ${currentLevel} execution`);
          }
        }
        trail.push({
          level: currentLevel,
          success: result.success,
          error: result.error
        });
        if (result.success) {
          this.stateManager.resolve(task.id);
          return {
            success: true,
            level: currentLevel,
            data: result.data,
            cost: totalCost,
            attempts: trail.length,
            trail
          };
        }
        if (result.error) {
          this.stateManager.recordError(task.id, result.error);
        }
        state = this.stateManager.getState(task.id);
        if (result.escalate || this.hasExceededAttempts(currentLevel, state)) {
          currentLevel = currentLevel + 1;
          this.stateManager.updateState(task.id, { level: currentLevel });
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        this.stateManager.recordError(task.id, errorMsg);
        trail.push({
          level: currentLevel,
          success: false,
          error: errorMsg
        });
        currentLevel = currentLevel + 1;
        this.stateManager.updateState(task.id, { level: currentLevel });
      }
    }
    return {
      success: false,
      level: 6,
      error: "All escalation levels exhausted",
      cost: totalCost,
      attempts: trail.length,
      trail
    };
  }
  /**
   * Get state for a task
   */
  getState(taskId) {
    return this.stateManager.getState(taskId);
  }
  /**
   * Reset state for a task
   */
  resetState(taskId) {
    this.stateManager.resetState(taskId);
  }
  /**
   * Get all states
   */
  getAllStates() {
    return this.stateManager.getAllStates();
  }
  /**
   * Get cost tracker
   */
  getCostTracker() {
    return this.costTracker;
  }
  /**
   * Get configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Update configuration
   */
  updateConfig(update) {
    this.config = { ...this.config, ...update };
    this.costTracker.setDailyBudget(this.config.costBudgetDaily);
  }
  /**
   * Check if level should be skipped
   */
  shouldSkipLevel(level, state) {
    if (level === 5) {
      return state.approved || !this.config.cloudAgentApprovalRequired;
    }
    if (level === 6) {
      if (!this.config.cloudAgentEnabled) return true;
      if (this.config.cloudAgentApprovalRequired && !state.approved) return true;
      const estimatedCost = 1e3;
      if (!this.costTracker.canAfford(estimatedCost)) return true;
    }
    return false;
  }
  /**
   * Check if level has exceeded max attempts
   */
  hasExceededAttempts(level, state) {
    const levelKey = `level${level}`;
    const attempts = state.attempts[levelKey] || 0;
    switch (level) {
      case 2:
        return attempts >= this.config.maxOllamaAttempts;
      case 3:
        return attempts >= this.config.maxJulesAttempts;
      case 4:
        return attempts >= this.config.maxJulesBoostAttempts;
      default:
        return attempts >= 1;
    }
  }
  /**
   * Check if task has cloud agent approval
   */
  hasCloudAgentApproval(task) {
    if (!task.metadata) return false;
    const labels = task.metadata.labels;
    if (labels?.includes("approved:cloud-agent")) return true;
    const approved = task.metadata.approved;
    if (typeof approved === "boolean") return approved;
    if (Array.isArray(approved)) return approved.includes("cloud-agent");
    return false;
  }
};

// src/queue/lock.ts
var LockManager = class {
  constructor(storage, defaultTimeout = 5 * 60 * 1e3) {
    this.storage = storage;
    this.defaultTimeout = defaultTimeout;
  }
  /**
   * Execute a function with a lock
   * Automatically acquires and releases the lock
   */
  async withLock(holder, fn, timeout) {
    const acquired = await this.storage.acquireLock(holder, timeout || this.defaultTimeout);
    if (!acquired) {
      throw new Error("Failed to acquire lock");
    }
    try {
      return await fn();
    } finally {
      await this.storage.releaseLock(holder);
    }
  }
  /**
   * Try to execute a function with a lock
   * Returns null if lock cannot be acquired
   */
  async tryWithLock(holder, fn, timeout) {
    const acquired = await this.storage.acquireLock(holder, timeout || this.defaultTimeout);
    if (!acquired) {
      return null;
    }
    try {
      return await fn();
    } finally {
      await this.storage.releaseLock(holder);
    }
  }
  /**
   * Check if currently locked
   */
  async isLocked() {
    return this.storage.isLocked();
  }
  /**
   * Get current lock holder
   */
  async getLockHolder() {
    const lock = await this.storage.getLock();
    return lock?.holder || null;
  }
  /**
   * Wait for lock to be released
   * Returns true if lock was released, false if timeout
   */
  async waitForRelease(maxWaitMs = 3e4, checkIntervalMs = 1e3) {
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      if (!await this.isLocked()) {
        return true;
      }
      await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
    }
    return false;
  }
};

// src/queue/manager.ts
var QueueManager = class {
  constructor(storage, config = {}) {
    this.storage = storage;
    this.config = {
      lockTimeout: config.lockTimeout ?? 5 * 60 * 1e3,
      maxRetries: config.maxRetries ?? 3,
      instanceId: config.instanceId ?? `manager-${Date.now()}`
    };
  }
  config;
  /**
   * Add an item to the queue
   */
  async add(item) {
    const state = await this.storage.read();
    if (state.items.some((i) => i.id === item.id)) {
      throw new Error(`Item ${item.id} already in queue`);
    }
    const newItem = {
      ...item,
      status: item.status ?? "pending",
      addedAt: item.addedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
      retries: item.retries ?? 0
    };
    state.items.push(newItem);
    this.sortQueue(state.items);
    this.updateStats(state);
    await this.storage.write(state);
    return newItem;
  }
  /**
   * Remove an item from the queue
   */
  async remove(id) {
    const state = await this.storage.read();
    const index = state.items.findIndex((i) => i.id === id);
    if (index === -1) return void 0;
    const [removed] = state.items.splice(index, 1);
    this.updateStats(state);
    await this.storage.write(state);
    return removed;
  }
  /**
   * Get the next item to process (highest priority, oldest first)
   */
  async next() {
    const state = await this.storage.read();
    return state.items.find((i) => i.status === "pending");
  }
  /**
   * Get an item by ID
   */
  async get(id) {
    const state = await this.storage.read();
    return state.items.find((i) => i.id === id);
  }
  /**
   * Update an item's properties
   */
  async update(id, updates) {
    const state = await this.storage.read();
    const item = state.items.find((i) => i.id === id);
    if (!item) return void 0;
    Object.assign(item, updates);
    this.sortQueue(state.items);
    this.updateStats(state);
    await this.storage.write(state);
    return item;
  }
  /**
   * Mark an item as processing
   */
  async startProcessing(id) {
    return this.update(id, {
      status: "processing",
      startedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  /**
   * Mark an item as completed and remove from queue
   */
  async complete(id) {
    const item = await this.get(id);
    if (!item) return void 0;
    const state = await this.storage.read();
    state.items = state.items.filter((i) => i.id !== id);
    state.stats.completed24h++;
    this.updateStats(state);
    await this.storage.write(state);
    return {
      ...item,
      status: "completed",
      completedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Mark an item as failed
   * If under max retries, requeue as pending
   */
  async fail(id, error) {
    const state = await this.storage.read();
    const item = state.items.find((i) => i.id === id);
    if (!item) return void 0;
    item.retries++;
    item.lastError = error;
    if (item.retries >= this.config.maxRetries) {
      item.status = "failed";
      state.stats.failed24h++;
    } else {
      item.status = "pending";
      item.startedAt = void 0;
    }
    this.sortQueue(state.items);
    this.updateStats(state);
    await this.storage.write(state);
    return item;
  }
  /**
   * Cancel an item
   */
  async cancel(id) {
    return this.update(id, { status: "cancelled" });
  }
  /**
   * List all items (optionally filtered by status)
   */
  async list(status) {
    const state = await this.storage.read();
    if (status) {
      return state.items.filter((i) => i.status === status);
    }
    return [...state.items];
  }
  /**
   * Get queue statistics
   */
  async stats() {
    const state = await this.storage.read();
    return { ...state.stats };
  }
  /**
   * Get current queue length
   */
  async length() {
    const state = await this.storage.read();
    return state.items.length;
  }
  /**
   * Clear all items (dangerous!)
   */
  async clear() {
    const state = await this.storage.read();
    state.items = [];
    this.updateStats(state);
    await this.storage.write(state);
  }
  /**
   * Acquire a lock for processing
   */
  async lock() {
    return this.storage.acquireLock(this.config.instanceId, this.config.lockTimeout);
  }
  /**
   * Release the lock
   */
  async unlock() {
    return this.storage.releaseLock(this.config.instanceId);
  }
  /**
   * Check if queue is locked
   */
  async isLocked() {
    return this.storage.isLocked();
  }
  /**
   * Process the next item with a handler
   * Automatically handles locking, status updates, and error handling
   */
  async processNext(handler) {
    if (!await this.lock()) {
      return null;
    }
    try {
      const item = await this.next();
      if (!item) {
        return null;
      }
      await this.startProcessing(item.id);
      try {
        const result = await handler(item);
        await this.complete(item.id);
        return { item, result };
      } catch (error) {
        await this.fail(item.id, error instanceof Error ? error.message : String(error));
        throw error;
      }
    } finally {
      await this.unlock();
    }
  }
  // ============================================================================
  // Private Helpers
  // ============================================================================
  /**
   * Sort queue by priority (ascending) then by addedAt (ascending)
   */
  sortQueue(items) {
    items.sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === "pending") return -1;
        if (b.status === "pending") return 1;
      }
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
    });
  }
  /**
   * Update queue statistics
   */
  updateStats(state) {
    const byStatus = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      cancelled: 0
    };
    for (const item of state.items) {
      byStatus[item.status]++;
    }
    state.stats.total = state.items.length;
    state.stats.byStatus = byStatus;
  }
};

// src/queue/priority.ts
var AGE_BOOST_THRESHOLD_DAYS = 7;
var REVIEW_COUNT_BOOST_THRESHOLD = 2;
var PriorityScorer = class _PriorityScorer {
  /**
   * Calculate priority score from PR metadata
   * Returns 1 (critical), 2 (normal), or 3 (low)
   */
  score(pr) {
    let score = 2;
    if (pr.type) {
      const typeScore = _PriorityScorer.fromType(pr.type);
      score = Math.min(score, typeScore);
    }
    if (pr.labels && pr.labels.length > 0) {
      const labelScore = _PriorityScorer.fromLabels(pr.labels);
      score = Math.min(score, labelScore);
    }
    if (pr.isDraft) {
      score = Math.max(score, 3);
    }
    if (pr.hasConflicts) {
      score = Math.max(score, 3);
    }
    if (pr.age !== void 0 && pr.age > AGE_BOOST_THRESHOLD_DAYS) {
      score = Math.max(1, score - 1);
    }
    if (pr.reviewCount !== void 0 && pr.reviewCount > REVIEW_COUNT_BOOST_THRESHOLD) {
      score = Math.max(1, score - 1);
    }
    return score;
  }
  /**
   * Calculate priority from labels
   * Looks for priority/critical, priority/high, priority/low labels
   */
  static fromLabels(labels) {
    const lowerLabels = labels.map((l) => l.toLowerCase());
    if (lowerLabels.some(
      (l) => l.includes("critical") || l.includes("urgent") || l.includes("hotfix") || l === "priority/critical" || l === "priority: critical" || l === "p0"
    )) {
      return 1;
    }
    if (lowerLabels.some(
      (l) => l.includes("high") || l.includes("important") || l === "priority/high" || l === "priority: high" || l === "p1"
    )) {
      return 2;
    }
    if (lowerLabels.some(
      (l) => l.includes("low") || l.includes("nice-to-have") || l === "priority/low" || l === "priority: low" || l === "p3"
    )) {
      return 3;
    }
    if (lowerLabels.some((l) => l.includes("security") || l.includes("vulnerability"))) {
      return 1;
    }
    if (lowerLabels.some((l) => l.includes("bug") || l.includes("fix"))) {
      return 2;
    }
    return 2;
  }
  /**
   * Calculate priority from PR type
   */
  static fromType(type) {
    switch (type) {
      case "security":
      case "ci-fix":
        return 1;
      // Critical
      case "bugfix":
      case "feature":
        return 2;
      // Normal
      case "docs":
      case "chore":
        return 3;
      // Low
      default:
        return 2;
    }
  }
};

// src/test-results.ts
function parseTestReport(json) {
  const data = JSON.parse(json);
  if (data.version !== "1.0") {
    throw new Error(`Unsupported report version: ${data.version}`);
  }
  return data;
}
function getFailedTests(report) {
  return report.files.flatMap((f) => f.tests.filter((t) => t.status === "failed"));
}
function getTestsByFile(report, filePath) {
  const file = report.files.find((f) => f.path === filePath || f.path.endsWith(filePath));
  return file?.tests ?? [];
}
function getLowCoverageFiles(report, threshold = 80) {
  if (!report.coverage) return [];
  return report.coverage.files.filter((f) => f.lines.percentage < threshold);
}
function getUncoveredFunctions(report) {
  if (!report.coverage) return [];
  return report.coverage.files.filter((f) => f.uncoveredFunctions.length > 0).map((f) => ({ file: f.path, functions: f.uncoveredFunctions }));
}
function formatForAI(report) {
  const lines = [];
  lines.push(`# Test Report (${report.runner} - ${report.type})`);
  lines.push(`Generated: ${report.timestamp}`);
  lines.push("");
  lines.push("## Summary");
  lines.push(`- Total: ${report.summary.total}`);
  lines.push(`- Passed: ${report.summary.passed} \u2705`);
  lines.push(`- Failed: ${report.summary.failed} \u274C`);
  lines.push(`- Skipped: ${report.summary.skipped} \u23ED\uFE0F`);
  lines.push(`- Duration: ${(report.summary.duration / 1e3).toFixed(2)}s`);
  lines.push("");
  if (report.git) {
    formatGitContext(lines, report.git);
  }
  const failed = getFailedTests(report);
  if (failed.length > 0) {
    formatFailedTests(lines, failed);
  }
  if (report.coverage) {
    formatCoverage(lines, report);
  }
  return lines.join("\n");
}
function formatGitContext(lines, git) {
  lines.push("## Git Context");
  lines.push(`- Branch: ${git.branch}`);
  lines.push(`- Commit: ${git.commit}`);
  if (git.message) lines.push(`- Message: ${git.message}`);
  lines.push("");
}
function formatFailedTests(lines, failed) {
  lines.push("## Failed Tests");
  for (const test of failed) {
    lines.push(`### ${test.fullName}`);
    lines.push(`- File: ${test.file}${test.line ? `:${test.line}` : ""}`);
    lines.push(`- Duration: ${test.duration}ms`);
    if (test.error) {
      formatTestError(lines, test.error);
    }
    lines.push("");
  }
}
function formatTestError(lines, error) {
  lines.push("");
  lines.push("**Error:**");
  lines.push("```");
  lines.push(error.message);
  if (error.codeFrame) {
    lines.push("");
    lines.push(error.codeFrame);
  }
  lines.push("```");
  if (error.diff) {
    lines.push("");
    lines.push("**Diff:**");
    lines.push("```diff");
    lines.push(error.diff);
    lines.push("```");
  }
}
function formatCoverage(lines, report) {
  const coverage = report.coverage;
  if (!coverage) return;
  lines.push("## Coverage");
  lines.push(`- Lines: ${coverage.lines.percentage.toFixed(1)}%`);
  lines.push(`- Functions: ${coverage.functions.percentage.toFixed(1)}%`);
  lines.push(`- Branches: ${coverage.branches.percentage.toFixed(1)}%`);
  lines.push("");
  const lowCoverage = getLowCoverageFiles(report, 80);
  if (lowCoverage.length > 0) {
    lines.push("### Low Coverage Files (<80%)");
    for (const file of lowCoverage.slice(0, 10)) {
      lines.push(`- ${file.path}: ${file.lines.percentage.toFixed(1)}%`);
    }
    lines.push("");
  }
}

// src/playwright.ts
import { experimental_createMCPClient as createMCPClient } from "@ai-sdk/mcp";
import { Experimental_StdioMCPTransport as StdioMCPTransport } from "@ai-sdk/mcp/mcp-stdio";
async function createPlaywrightClient(options = {}) {
  const {
    headless = true,
    browser = "chromium",
    outputDir = "./test-output",
    saveTrace = false,
    testingCapabilities = true
  } = options;
  const args = ["@playwright/mcp@latest"];
  if (headless) args.push("--headless");
  args.push("--browser", browser);
  args.push("--output-dir", outputDir);
  if (saveTrace) args.push("--save-trace");
  if (testingCapabilities) args.push("--caps=testing");
  const transport = new StdioMCPTransport({
    command: "npx",
    args
  });
  const client = await createMCPClient({
    transport
  });
  return client;
}
async function getPlaywrightTools(client) {
  return client.tools();
}
var PLAYWRIGHT_TOOLS = {
  // Core automation
  NAVIGATE: "browser_navigate",
  CLICK: "browser_click",
  TYPE: "browser_type",
  SNAPSHOT: "browser_snapshot",
  SCREENSHOT: "browser_take_screenshot",
  CLOSE: "browser_close",
  WAIT: "browser_wait_for",
  EVALUATE: "browser_evaluate",
  // Testing assertions (requires --caps=testing)
  VERIFY_ELEMENT_VISIBLE: "browser_verify_element_visible",
  VERIFY_TEXT_VISIBLE: "browser_verify_text_visible",
  VERIFY_VALUE: "browser_verify_value",
  GENERATE_LOCATOR: "browser_generate_locator"
};
export {
  AgentRegistry,
  AgentRoutingSchema,
  AgentTypeSchema,
  CodeReviewCommentSchema,
  CodeReviewSchema,
  CostTracker,
  DEFAULT_ESCALATION_CONFIG,
  DEFAULT_THRESHOLDS,
  DEFAULT_WEIGHTS,
  EffortSchema,
  EscalationLadder,
  EscalationStateManager,
  FileStorage,
  GitHubIssueStorage,
  IssuePrioritySchema,
  IssueStatusSchema,
  IssueTriageSchema,
  IssueTypeSchema,
  LockManager,
  MemoryStorage,
  PLAYWRIGHT_TOOLS,
  PRAnalysisSchema,
  PriorityScorer,
  QueueManager,
  ReviewImpactSchema,
  SageQueryTypeSchema,
  SageResponseSchema,
  SubtaskSchema,
  TaskDecompositionSchema,
  TaskRouter,
  UnblockResponseSchema,
  addLabelsTool,
  analyzeIssue,
  analyzePRTool,
  answerQuestion,
  calculateComplexity,
  calculateWeightedScore,
  classifyQuery,
  closeIssueTool,
  createEscalationConfig,
  createIssueTool,
  createPlaywrightClient,
  createRouter,
  decomposeTask,
  estimateComplexityHeuristic,
  evaluateComplexity,
  formatForAI,
  generateEvaluationPrompt,
  getConnectors,
  getFailedTests,
  getIssueTool,
  getLowCoverageFiles,
  getPlaywrightTools,
  getTestsByFile,
  getTriageTools,
  getUncoveredFunctions,
  handleAnalyzePR,
  handleGetIssue,
  handleListIssues,
  handleSubmitReview,
  handleTriageIssue,
  listIssuesTool,
  parseEvaluationResponse,
  parseTestReport,
  removeLabelsTool,
  routeToAgent,
  sage,
  sageTool,
  scoreToTier,
  searchIssuesTool,
  setConnectors,
  submitReviewTool,
  tierToAgent,
  triageAnalysisSchema,
  triageIssueTool,
  triageItem,
  triageTools,
  unblock,
  updateIssueTool,
  visualReviewTool
};
//# sourceMappingURL=index.js.map