export { r as AgentRouting, q as AgentRoutingSchema, j as AgentType, A as AgentTypeSchema, g as CodeReview, h as CodeReviewComment, C as CodeReviewCommentSchema, f as CodeReviewSchema, k as Effort, E as EffortSchema, a as IssuePrioritySchema, I as IssueStatusSchema, d as IssueTriage, c as IssueTriageSchema, b as IssueTypeSchema, e as PRAnalysis, P as PRAnalysisSchema, R as ReviewImpactSchema, i as SageQueryType, S as SageQueryTypeSchema, m as SageResponse, l as SageResponseSchema, o as Subtask, n as SubtaskSchema, p as TaskDecomposition, T as TaskDecompositionSchema, s as UnblockResponse, U as UnblockResponseSchema } from './sage-bwR_8Nd9.js';
export { triageAnalysisSchema } from './schemas/index.js';
export { addLabelsTool, analyzePRTool, closeIssueTool, createIssueTool, getIssueTool, getTriageTools, listIssuesTool, removeLabelsTool, sageTool, searchIssuesTool, submitReviewTool, triageIssueTool, triageTools, updateIssueTool, visualReviewTool } from './tools/index.js';
export { SageContext, analyzeIssue, answerQuestion, classifyQuery, decomposeTask, getConnectors, handleAnalyzePR, handleGetIssue, handleListIssues, handleSubmitReview, handleTriageIssue, routeToAgent, sage, setConnectors, triageItem, unblock } from './handlers/index.js';
import { experimental_createMCPClient } from '@ai-sdk/mcp';
import 'zod';
import 'ai';
import '@agentic/triage-trackers';

/**
 * Default weights for complexity scoring dimensions
 * These can be calibrated over time based on outcome data
 */
interface ComplexityWeights {
    files_changed: number;
    lines_changed: number;
    dependency_depth: number;
    test_coverage_need: number;
    cross_module_impact: number;
    semantic_complexity: number;
    context_required: number;
    risk_level: number;
}
declare const DEFAULT_WEIGHTS: ComplexityWeights;
/**
 * Tier thresholds for routing decisions
 */
interface TierThresholds {
    trivial: number;
    simple: number;
    moderate: number;
    complex: number;
}
declare const DEFAULT_THRESHOLDS: TierThresholds;
type ComplexityTier = 'trivial' | 'simple' | 'moderate' | 'complex' | 'expert';
type AgentTier = 'ollama' | 'jules' | 'cursor';
/**
 * Map complexity tier to recommended agent
 */
declare function tierToAgent(tier: ComplexityTier, cursorEnabled?: boolean): AgentTier;
/**
 * Determine tier from weighted score
 */
declare function scoreToTier(score: number, thresholds?: TierThresholds): ComplexityTier;
/**
 * Calculate weighted score from raw dimension scores
 */
declare function calculateWeightedScore(raw: Record<string, number>, weights?: ComplexityWeights): number;

/**
 * Provider-Agnostic Agent Interfaces
 *
 * This module defines ONLY the interfaces and registry.
 * Actual provider implementations (Ollama, Jules, Cursor, etc.)
 * belong in @agentic/control where users configure their stack.
 *
 * The key insight: developers can use ANY LLM/agent provider
 * by implementing the AgentExecutor interface and registering
 * it with their desired priority and cost weights.
 */

/**
 * What an agent is capable of doing
 */
interface AgentCapabilities {
    /** Complexity tiers this agent can handle */
    tiers: ComplexityTier[];
    /** Maximum context length (tokens/chars) */
    maxContext?: number;
    /** Can this agent create PRs? */
    canCreatePR?: boolean;
    /** Can this agent run commands? */
    canExecute?: boolean;
    /** Is this agent async (returns job ID to poll)? */
    async?: boolean;
    /** Custom capability flags */
    [key: string]: unknown;
}
/**
 * A task to be processed by an agent
 */
interface AgentTask {
    /** Unique task identifier */
    id: string;
    /** Task description/prompt */
    description: string;
    /** Code/diff context */
    context: string;
    /** Pre-computed complexity score (0-10) */
    complexityScore: number;
    /** Pre-computed complexity tier */
    complexityTier: ComplexityTier;
    /** Repository reference (optional) */
    repo?: string;
    /** Additional metadata for provider-specific needs */
    metadata?: Record<string, unknown>;
}
/**
 * Result from an agent execution
 */
interface AgentResult<T = unknown> {
    /** Whether the task was completed successfully */
    success: boolean;
    /** Result data (provider-specific) */
    data?: T;
    /** Error message if failed */
    error?: string;
    /** Should router escalate to next agent? */
    escalate?: boolean;
    /** Actual cost incurred (in your cost units) */
    cost: number;
    /** For async agents: job ID to poll for completion */
    jobId?: string;
}
/**
 * Function signature for agent execution
 * Implement this interface to add any LLM/agent provider
 */
type AgentExecutor<T = unknown> = (task: AgentTask) => Promise<AgentResult<T>>;
/**
 * Complete agent definition
 */
interface AgentDefinition<T = unknown> {
    /** Unique identifier (e.g., 'ollama-qwen', 'jules', 'openai-gpt4') */
    id: string;
    /** Human-readable name */
    name: string;
    /**
     * Cost per invocation in your chosen units
     * Could be cents, tokens, or relative units (0=free, 100=expensive)
     */
    cost: number;
    /**
     * Priority when multiple agents can handle same tier
     * Lower = preferred (will be tried first)
     */
    priority: number;
    /** What this agent can do */
    capabilities: AgentCapabilities;
    /** Whether this agent is currently enabled */
    enabled: boolean;
    /**
     * Require explicit approval before using?
     * Useful for expensive agents - task.metadata.approved must include this agent's ID
     */
    requiresApproval?: boolean;
    /** The executor function - implement this for your provider */
    execute: AgentExecutor<T>;
}
/**
 * Registry for managing available agents
 *
 * @example
 * ```typescript
 * const registry = new AgentRegistry();
 *
 * // Register your agents (implementations from @agentic/control or custom)
 * registry.register(myOllamaAgent);
 * registry.register(myJulesAgent);
 * registry.register(myCustomAgent);
 *
 * // Get best agent for a complexity tier
 * const agent = registry.optimalFor('moderate');
 * ```
 */
declare class AgentRegistry {
    private agents;
    /**
     * Register an agent
     */
    register<T>(agent: AgentDefinition<T>): this;
    /**
     * Register multiple agents at once
     */
    registerAll(agents: AgentDefinition[]): this;
    /**
     * Unregister an agent
     */
    unregister(id: string): boolean;
    /**
     * Enable/disable an agent at runtime
     */
    setEnabled(id: string, enabled: boolean): void;
    /**
     * Update an agent's priority (for dynamic rebalancing)
     */
    setPriority(id: string, priority: number): void;
    /**
     * Update an agent's cost (for dynamic pricing)
     */
    setCost(id: string, cost: number): void;
    /**
     * Get all registered agents
     */
    all(): AgentDefinition[];
    /**
     * Get all enabled agents
     */
    enabled(): AgentDefinition[];
    /**
     * Get agents that can handle a specific complexity tier
     * Sorted by priority (lowest first), then by cost
     */
    forTier(tier: ComplexityTier, includeDisabled?: boolean): AgentDefinition[];
    /**
     * Get the optimal (first choice) agent for a complexity tier
     */
    optimalFor(tier: ComplexityTier): AgentDefinition | undefined;
    /**
     * Get agent by ID
     */
    get(id: string): AgentDefinition | undefined;
    /**
     * Check if an agent is registered
     */
    has(id: string): boolean;
    /**
     * Get count of registered agents
     */
    get size(): number;
    /**
     * Clear all agents
     */
    clear(): void;
    /**
     * Export registry configuration (for serialization)
     */
    export(): Array<Omit<AgentDefinition, 'execute'>>;
}
/**
 * Configuration for creating an agent (without the executor)
 * Used by @agentic/control to create provider-specific agents
 */
type AgentConfig = Omit<AgentDefinition, 'execute'>;
/**
 * Factory function type for creating agents
 * Providers implement this to create configured agents
 */
type AgentFactory<TConfig, TResult = unknown> = (id: string, config: TConfig, options?: Partial<AgentConfig>) => AgentDefinition<TResult>;

/**
 * Sigma-Weighted Complexity Evaluator
 *
 * This module provides the core complexity scoring algorithm.
 * The actual LLM call is abstracted - users provide an evaluator function.
 *
 * The sigma-weighted system allows AI to assess task complexity
 * across multiple dimensions, producing a weighted score that
 * determines optimal agent routing.
 */

/**
 * Raw dimension scores from evaluation (0-10 each)
 */
interface DimensionScores {
    files_changed: number;
    lines_changed: number;
    dependency_depth: number;
    test_coverage_need: number;
    cross_module_impact: number;
    semantic_complexity: number;
    context_required: number;
    risk_level: number;
    [key: string]: number;
}
/**
 * Complete complexity score result
 */
interface ComplexityScore {
    /** Raw scores for each dimension (0-10) */
    raw: DimensionScores;
    /** Weighted composite score (0-10) */
    weighted: number;
    /** Complexity tier based on thresholds */
    tier: ComplexityTier;
    /** AI's reasoning for the scores */
    reasoning: string;
}
/**
 * Function that performs the actual LLM evaluation
 * Implement this for your LLM provider (Ollama, OpenAI, etc.)
 */
type LLMEvaluator = (prompt: string) => Promise<string>;
/**
 * Configuration for complexity evaluation
 */
interface EvaluatorConfig {
    /** Custom weights (defaults to DEFAULT_WEIGHTS) */
    weights?: ComplexityWeights;
    /** Custom tier thresholds (defaults to DEFAULT_THRESHOLDS) */
    thresholds?: TierThresholds;
    /** Maximum context length to send to LLM */
    maxContextLength?: number;
}
/**
 * Generate the evaluation prompt for an LLM
 * This prompt is provider-agnostic - works with any LLM
 */
declare function generateEvaluationPrompt(task: string, context: string, maxContext?: number): string;
/**
 * Parse and validate LLM response into dimension scores
 */
declare function parseEvaluationResponse(response: string, weights?: ComplexityWeights): {
    scores: DimensionScores;
    reasoning: string;
};
/**
 * Calculate complexity score from parsed dimension scores
 */
declare function calculateComplexity(scores: DimensionScores, config?: EvaluatorConfig): Omit<ComplexityScore, 'reasoning'>;
/**
 * Full evaluation using an LLM
 *
 * @example
 * ```typescript
 * // With Ollama
 * const evaluate = async (prompt: string) => {
 *   const res = await fetch('http://localhost:11434/api/generate', {
 *     method: 'POST',
 *     body: JSON.stringify({ model: 'qwen2.5-coder', prompt, stream: false })
 *   });
 *   return (await res.json()).response;
 * };
 *
 * const score = await evaluateComplexity(evaluate, 'Fix the bug', codeDiff);
 * console.log(score.tier); // 'simple'
 * console.log(score.weighted); // 3.5
 * ```
 */
declare function evaluateComplexity(llm: LLMEvaluator, task: string, context: string, config?: EvaluatorConfig): Promise<ComplexityScore>;
/**
 * Quick complexity estimation without AI (heuristic-based)
 * Useful when LLM is unavailable or for fast pre-filtering
 */
declare function estimateComplexityHeuristic(options: {
    filesChanged?: number;
    linesChanged?: number;
    hasTests?: boolean;
    isRefactor?: boolean;
    hasDependencyChanges?: boolean;
    isCriticalPath?: boolean;
}, config?: EvaluatorConfig): ComplexityScore;

/**
 * Intelligent Task Router
 *
 * Routes tasks to optimal agents based on:
 * 1. Sigma-weighted complexity scores
 * 2. Agent capabilities and availability
 * 3. Cost optimization (prefer cheaper agents)
 * 4. Escalation on failure
 */

interface RouterConfig {
    /** Agent registry with available agents */
    registry: AgentRegistry;
    /** Maximum retries per agent before escalating */
    maxRetries?: number;
    /** Daily cost budget (0 = unlimited) */
    dailyBudget?: number;
    /** Callback when an agent is selected */
    onAgentSelected?: (agent: AgentDefinition, task: AgentTask) => void;
    /** Callback when escalating */
    onEscalate?: (fromAgent: AgentDefinition, toAgent: AgentDefinition, reason: string) => void;
    /** Callback for cost tracking */
    onCostIncurred?: (agent: AgentDefinition, cost: number, task: AgentTask) => void;
}
interface RoutingResult<T = unknown> {
    /** Whether the task was successfully completed */
    success: boolean;
    /** Which agent handled the task */
    agent: string;
    /** The result from the agent */
    result: AgentResult<T>;
    /** Total cost incurred */
    totalCost: number;
    /** Number of attempts made */
    attempts: number;
    /** Trail of agents tried */
    trail: Array<{
        agent: string;
        success: boolean;
        error?: string;
    }>;
}
interface RouterState {
    /** Costs incurred today */
    dailyCosts: number;
    /** Last reset timestamp */
    lastReset: string;
    /** Tasks processed today */
    tasksProcessed: number;
}
/**
 * Task Router - intelligently routes tasks to agents
 */
declare class TaskRouter {
    private config;
    private state;
    constructor(config: RouterConfig);
    /**
     * Route a task to the optimal agent
     */
    route(task: Omit<AgentTask, 'complexityScore' | 'complexityTier'>, complexity: ComplexityScore): Promise<RoutingResult>;
    /**
     * Check if an agent can be used for a task
     */
    private canUseAgent;
    /**
     * Try an agent with retries
     */
    private tryAgent;
    /**
     * Check if a task has approval for an agent that requires it
     */
    private hasApproval;
    /**
     * Reset daily state if it's a new day
     */
    private maybeResetDaily;
    /**
     * Get current router state
     */
    getState(): RouterState;
    /**
     * Get remaining daily budget
     */
    getRemainingBudget(): number;
}
/**
 * Create a simple router with default configuration
 */
declare function createRouter(registry: AgentRegistry, options?: Partial<RouterConfig>): TaskRouter;

/**
 * Queue Management Types
 *
 * Provider-agnostic types for managing task/merge queues.
 * Storage implementations (GitHub Issue, Redis, File, etc.)
 * are provided by @agentic/control or users.
 */
/**
 * Status of an item in the queue
 */
type QueueItemStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
/**
 * Priority levels (lower = higher priority)
 */
type Priority = 1 | 2 | 3;
/**
 * Base queue item interface
 */
interface QueueItem {
    /** Unique identifier (e.g., "org/repo#123") */
    id: string;
    /** Priority level */
    priority: Priority;
    /** Current status */
    status: QueueItemStatus;
    /** When the item was added */
    addedAt: string;
    /** When processing started (if applicable) */
    startedAt?: string;
    /** When processing completed (if applicable) */
    completedAt?: string;
    /** Number of retry attempts */
    retries: number;
    /** Last error message (if failed) */
    lastError?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Queue statistics
 */
interface QueueStats {
    /** Total items currently in queue */
    total: number;
    /** Items by status */
    byStatus: Record<QueueItemStatus, number>;
    /** Items completed in last 24h */
    completed24h: number;
    /** Items failed in last 24h */
    failed24h: number;
    /** Average processing time in minutes */
    avgProcessingTime: number;
}
/**
 * Queue state for serialization
 */
interface QueueState<T extends QueueItem = QueueItem> {
    /** Schema version for migrations */
    version: number;
    /** Last update timestamp */
    updatedAt: string;
    /** Current lock holder (if any) */
    lock: QueueLock | null;
    /** The queue items */
    items: T[];
    /** Statistics */
    stats: QueueStats;
}
/**
 * Distributed lock for queue operations
 */
interface QueueLock {
    /** Who holds the lock */
    holder: string;
    /** When the lock was acquired */
    acquiredAt: string;
    /** Lock expiry time */
    expiresAt: string;
}
/**
 * Activity log entry
 */
interface QueueActivity {
    /** Timestamp */
    timestamp: string;
    /** Activity type */
    type: 'added' | 'started' | 'completed' | 'failed' | 'cancelled' | 'retried';
    /** Item ID */
    itemId: string;
    /** Additional details */
    message?: string;
}

/**
 * Queue Storage Interface
 *
 * Abstract interface for queue persistence.
 * Implementations can use GitHub Issues, Redis, Files, etc.
 */

/**
 * Storage backend interface
 * Implement this for your preferred storage (GitHub Issue, Redis, etc.)
 */
interface QueueStorage<T extends QueueItem = QueueItem> {
    /**
     * Read the current queue state
     */
    read(): Promise<QueueState<T>>;
    /**
     * Write the queue state
     */
    write(state: QueueState<T>): Promise<void>;
    /**
     * Acquire a distributed lock
     * @param holder - Identifier for the lock holder
     * @param ttlMs - Time-to-live in milliseconds
     * @returns true if lock acquired, false if already locked
     */
    acquireLock(holder: string, ttlMs: number): Promise<boolean>;
    /**
     * Release a distributed lock
     * @param holder - Must match the holder that acquired the lock
     */
    releaseLock(holder: string): Promise<void>;
    /**
     * Check if a lock is currently held
     */
    isLocked(): Promise<boolean>;
    /**
     * Get the current lock info
     */
    getLock(): Promise<QueueLock | null>;
}

/**
 * File Storage
 *
 * Persists queue state to a JSON file on disk.
 * Useful for local testing and single-machine deployments.
 */

/**
 * File-based storage implementation
 */
declare class FileStorage<T extends QueueItem = QueueItem> implements QueueStorage<T> {
    private readonly filePath;
    constructor(filePath: string);
    read(): Promise<QueueState<T>>;
    write(state: QueueState<T>): Promise<void>;
    acquireLock(holder: string, ttlMs: number): Promise<boolean>;
    releaseLock(holder: string): Promise<void>;
    isLocked(): Promise<boolean>;
    getLock(): Promise<QueueLock | null>;
    private createEmptyState;
}

/**
 * GitHub Issue Storage
 *
 * Stores queue state in a GitHub Issue body with:
 * - JSON state in code block between markers
 * - Human-readable status table
 * - Distributed locking via issue comments
 */

interface GitHubIssueStorageOptions {
    /** Repository in format "owner/repo" */
    repo: string;
    /** Issue number, or 'auto' to create if doesn't exist */
    issueNumber: number | 'auto';
    /** Issue title when auto-creating */
    issueTitle?: string;
    /** GitHub token for authentication */
    token: string;
    /** Optional Octokit instance (for testing) */
    octokit?: GitHubIssueStorageOctokit;
}
/**
 * Minimal Octokit interface for GitHub operations
 * Allows dependency injection for testing
 */
interface GitHubIssueStorageOctokit {
    rest: {
        issues: {
            get(params: {
                owner: string;
                repo: string;
                issue_number: number;
            }): Promise<{
                data: {
                    body: string | null;
                    number: number;
                };
            }>;
            create(params: {
                owner: string;
                repo: string;
                title: string;
                body: string;
                labels?: string[];
            }): Promise<{
                data: {
                    number: number;
                };
            }>;
            update(params: {
                owner: string;
                repo: string;
                issue_number: number;
                body: string;
            }): Promise<unknown>;
            listComments(params: {
                owner: string;
                repo: string;
                issue_number: number;
                per_page?: number;
            }): Promise<{
                data: Array<{
                    id: number;
                    body?: string;
                    created_at: string;
                }>;
            }>;
            createComment(params: {
                owner: string;
                repo: string;
                issue_number: number;
                body: string;
            }): Promise<{
                data: {
                    id: number;
                };
            }>;
            deleteComment(params: {
                owner: string;
                repo: string;
                comment_id: number;
            }): Promise<unknown>;
        };
    };
}
/**
 * GitHub Issue storage implementation
 */
declare class GitHubIssueStorage<T extends QueueItem = QueueItem> implements QueueStorage<T> {
    private owner;
    private repoName;
    private issueNumber;
    private issueTitle;
    private token;
    private octokit;
    private actualIssueNumber;
    private octokitPromise;
    constructor(options: GitHubIssueStorageOptions);
    read(): Promise<QueueState<T>>;
    write(state: QueueState<T>): Promise<void>;
    acquireLock(holder: string, ttlMs: number): Promise<boolean>;
    releaseLock(holder: string): Promise<void>;
    isLocked(): Promise<boolean>;
    getLock(): Promise<QueueLock | null>;
    private getOctokit;
    private getOrCreateIssue;
    private createIssue;
    private parseIssueBody;
    private formatIssueBody;
    private formatTableRow;
    private getPriorityEmoji;
    private getStatusEmoji;
    private parseLockComment;
    private createEmptyState;
}

/**
 * In-Memory Storage
 *
 * Simple in-memory storage implementation for testing.
 * State is lost when the process exits.
 */

/**
 * In-memory storage for testing
 */
declare class MemoryStorage<T extends QueueItem = QueueItem> implements QueueStorage<T> {
    private state;
    constructor(initial?: Partial<QueueState<T>>);
    read(): Promise<QueueState<T>>;
    write(state: QueueState<T>): Promise<void>;
    acquireLock(holder: string, ttlMs: number): Promise<boolean>;
    releaseLock(holder: string): Promise<void>;
    isLocked(): Promise<boolean>;
    getLock(): Promise<QueueLock | null>;
}

/**
 * Escalation Configuration
 *
 * Defines configuration options for the 7-level escalation ladder.
 * Controls retry attempts, cloud agent behavior, and cost budgets.
 */
/**
 * Configuration for the escalation ladder
 */
interface EscalationConfig {
    /** Maximum number of Ollama fix attempts before escalating (Default: 2) */
    maxOllamaAttempts: number;
    /** Maximum number of initial Jules attempts before escalating (Default: 3) */
    maxJulesAttempts: number;
    /** Maximum number of Jules attempts with boosted context (Default: 3) */
    maxJulesBoostAttempts: number;
    /** Whether cloud agents (e.g., Cursor) are enabled (Default: false) */
    cloudAgentEnabled: boolean;
    /** Whether cloud agents require explicit approval via label (Default: true) */
    cloudAgentApprovalRequired: boolean;
    /** Daily cost budget for cloud agents in cents (Default: 0 = no cloud) */
    costBudgetDaily: number;
}
/**
 * Default escalation configuration - prioritizes free options
 */
declare const DEFAULT_ESCALATION_CONFIG: EscalationConfig;
/**
 * Create escalation config with defaults
 */
declare function createEscalationConfig(partial?: Partial<EscalationConfig>): EscalationConfig;

/**
 * Cost Tracker for Cloud Agents
 *
 * Tracks and enforces daily budget limits for expensive cloud agents.
 * Provides reporting and alerting when approaching budget limits.
 */
/**
 * Cost entry for tracking individual operations
 */
interface CostEntry {
    /** Timestamp of the operation */
    timestamp: string;
    /** Task ID associated with the cost */
    taskId: string;
    /** Agent that incurred the cost */
    agent: string;
    /** Cost in cents */
    amount: number;
    /** Operation description */
    description: string;
}
/**
 * Daily cost statistics
 */
interface DailyCostStats {
    /** Date (YYYY-MM-DD) */
    date: string;
    /** Total cost in cents */
    total: number;
    /** Number of operations */
    operations: number;
    /** Cost by agent */
    byAgent: Record<string, number>;
    /** Cost entries */
    entries: CostEntry[];
}
/**
 * Cost tracker for managing cloud agent budgets
 */
declare class CostTracker {
    private entries;
    private dailyBudget;
    private onBudgetWarning?;
    constructor(dailyBudget: number, options?: {
        onBudgetWarning?: (remaining: number, total: number) => void;
    });
    /**
     * Record a cost entry
     */
    record(taskId: string, agent: string, amount: number, description?: string): CostEntry;
    /**
     * Check if operation is within budget
     */
    canAfford(amount: number, date?: string): boolean;
    /**
     * Get remaining budget for today
     */
    getRemainingBudget(date?: string): number;
    /**
     * Get daily statistics
     */
    getDailyStats(date?: string): DailyCostStats;
    /**
     * Get stats for a date range
     */
    getStatsInRange(startDate: string, endDate: string): DailyCostStats[];
    /**
     * Get all-time total cost
     */
    getTotalCost(): number;
    /**
     * Clear old entries (keep last N days)
     */
    cleanup(keepDays?: number): void;
    /**
     * Export all data (for persistence)
     */
    export(): Record<string, CostEntry[]>;
    /**
     * Import data (from persistence)
     */
    import(data: Record<string, CostEntry[]>): void;
    /**
     * Reset all tracking data
     */
    reset(): void;
    /**
     * Update daily budget
     */
    setDailyBudget(budget: number): void;
    /**
     * Get current daily budget
     */
    getDailyBudget(): number;
    private getToday;
}

/**
 * Escalation State Management
 *
 * Tracks the progression of tasks through the 7-level escalation ladder.
 * Maintains attempt counts, errors, resolution status, and cost tracking.
 */
/**
 * The 7 escalation levels
 * - 0: Static Analysis (lint/tsc) - Free, instant
 * - 1: Complexity Evaluation (Ollama) - Free, routes to 2 or 3
 * - 2: Ollama Fix - Free, simple fixes
 * - 3: Jules Session - Free tier, complex work
 * - 4: Jules + Boosted Context - Free tier, more context
 * - 5: Human Review Queue - Free, awaits approval
 * - 6: Cloud Agent (Cursor) - Expensive, requires approval
 */
type EscalationLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/**
 * State for a single task progressing through escalation levels
 */
interface EscalationState {
    /** Unique task identifier */
    taskId: string;
    /** Current escalation level (0-6) */
    level: EscalationLevel;
    /** Attempt counts per level */
    attempts: Record<string, number>;
    /** Error messages encountered */
    errors: string[];
    /** Whether the task has been resolved */
    resolved: boolean;
    /** Total cost incurred (in cents) */
    cost: number;
    /** Timestamp when state was created */
    createdAt: string;
    /** Timestamp of last update */
    updatedAt: string;
    /** Whether human approval has been granted for cloud agents */
    approved: boolean;
}
/**
 * Manager for escalation states across multiple tasks
 */
declare class EscalationStateManager {
    private states;
    /**
     * Create or get state for a task
     */
    getState(taskId: string): EscalationState;
    /**
     * Update state for a task
     */
    updateState(taskId: string, update: Partial<Omit<EscalationState, 'taskId' | 'createdAt'>>): EscalationState;
    /**
     * Record an attempt at a level
     */
    recordAttempt(taskId: string, level: EscalationLevel): EscalationState;
    /**
     * Record an error
     */
    recordError(taskId: string, error: string): EscalationState;
    /**
     * Escalate to next level
     */
    escalate(taskId: string): EscalationState;
    /**
     * Mark task as resolved
     */
    resolve(taskId: string): EscalationState;
    /**
     * Add cost to task
     */
    addCost(taskId: string, cost: number): EscalationState;
    /**
     * Set approval status
     */
    setApproval(taskId: string, approved: boolean): EscalationState;
    /**
     * Reset state for a task
     */
    resetState(taskId: string): void;
    /**
     * Get all states
     */
    getAllStates(): EscalationState[];
    /**
     * Get unresolved states
     */
    getUnresolved(): EscalationState[];
    /**
     * Clear all states
     */
    clear(): void;
    /**
     * Get total cost across all tasks
     */
    getTotalCost(): number;
}

/**
 * Escalation Ladder
 *
 * Implements a 7-level escalation strategy that exhausts all free options
 * before resorting to expensive cloud agents.
 *
 * Levels:
 * - 0: Static Analysis (lint/tsc) - Free, instant
 * - 1: Complexity Evaluation (Ollama) - Free, routes to 2 or 3
 * - 2: Ollama Fix - Free, simple fixes
 * - 3: Jules Session - Free tier, complex work
 * - 4: Jules + Boosted Context - Free tier, more context
 * - 5: Human Review Queue - Free, awaits approval
 * - 6: Cloud Agent (Cursor) - Expensive, requires approval
 */

/**
 * Task to be processed by the escalation ladder
 */
interface Task {
    /** Unique task identifier */
    id: string;
    /** Task description */
    description: string;
    /** Code/context for the task */
    context: string;
    /** Task metadata (e.g., labels, approvals) */
    metadata?: Record<string, unknown>;
}
/**
 * Result from processing a task
 */
interface ProcessResult {
    /** Whether the task was resolved */
    success: boolean;
    /** Final escalation level reached */
    level: EscalationLevel;
    /** Result data (agent-specific) */
    data?: unknown;
    /** Error message if failed */
    error?: string;
    /** Total cost incurred (in cents) */
    cost: number;
    /** Number of attempts made */
    attempts: number;
    /** Trail of levels attempted */
    trail: Array<{
        level: EscalationLevel;
        success: boolean;
        error?: string;
    }>;
}
/**
 * Handler function for a specific escalation level
 */
type LevelHandler = (task: Task, state: EscalationState) => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
    escalate: boolean;
    cost?: number;
}>;
/**
 * Escalation Ladder - intelligently routes tasks through 7 levels
 */
declare class EscalationLadder {
    private config;
    private stateManager;
    private costTracker;
    private handlers;
    constructor(config?: Partial<EscalationConfig>);
    /**
     * Register a handler for a specific level
     */
    registerHandler(level: EscalationLevel, handler: LevelHandler): this;
    /**
     * Process a task through the escalation ladder
     */
    process(task: Task): Promise<ProcessResult>;
    /**
     * Get state for a task
     */
    getState(taskId: string): EscalationState;
    /**
     * Reset state for a task
     */
    resetState(taskId: string): void;
    /**
     * Get all states
     */
    getAllStates(): EscalationState[];
    /**
     * Get cost tracker
     */
    getCostTracker(): CostTracker;
    /**
     * Get configuration
     */
    getConfig(): EscalationConfig;
    /**
     * Update configuration
     */
    updateConfig(update: Partial<EscalationConfig>): void;
    /**
     * Check if level should be skipped
     */
    private shouldSkipLevel;
    /**
     * Check if level has exceeded max attempts
     */
    private hasExceededAttempts;
    /**
     * Check if task has cloud agent approval
     */
    private hasCloudAgentApproval;
}

/**
 * Lock Manager Utilities
 *
 * Higher-level utilities for managing distributed locks.
 */

/**
 * Lock manager for distributed coordination
 */
declare class LockManager<T extends QueueItem = QueueItem> {
    private storage;
    private defaultTimeout;
    constructor(storage: QueueStorage<T>, defaultTimeout?: number);
    /**
     * Execute a function with a lock
     * Automatically acquires and releases the lock
     */
    withLock<R>(holder: string, fn: () => Promise<R>, timeout?: number): Promise<R>;
    /**
     * Try to execute a function with a lock
     * Returns null if lock cannot be acquired
     */
    tryWithLock<R>(holder: string, fn: () => Promise<R>, timeout?: number): Promise<R | null>;
    /**
     * Check if currently locked
     */
    isLocked(): Promise<boolean>;
    /**
     * Get current lock holder
     */
    getLockHolder(): Promise<string | null>;
    /**
     * Wait for lock to be released
     * Returns true if lock was released, false if timeout
     */
    waitForRelease(maxWaitMs?: number, checkIntervalMs?: number): Promise<boolean>;
}

/**
 * Queue Manager
 *
 * Core queue management logic that works with any storage backend.
 * Handles priority ordering, locking, and state management.
 */

/**
 * Configuration for the queue manager
 */
interface QueueManagerConfig {
    /** Lock timeout in milliseconds (default: 5 minutes) */
    lockTimeout?: number;
    /** Maximum retries before marking as failed (default: 3) */
    maxRetries?: number;
    /** Unique identifier for this manager instance */
    instanceId?: string;
}
/**
 * Queue Manager - handles all queue operations
 */
declare class QueueManager<T extends QueueItem = QueueItem> {
    private storage;
    private config;
    constructor(storage: QueueStorage<T>, config?: QueueManagerConfig);
    /**
     * Add an item to the queue
     */
    add(item: Omit<T, 'status' | 'addedAt' | 'retries'> & Partial<Pick<T, 'status' | 'addedAt' | 'retries'>>): Promise<T>;
    /**
     * Remove an item from the queue
     */
    remove(id: string): Promise<T | undefined>;
    /**
     * Get the next item to process (highest priority, oldest first)
     */
    next(): Promise<T | undefined>;
    /**
     * Get an item by ID
     */
    get(id: string): Promise<T | undefined>;
    /**
     * Update an item's properties
     */
    update(id: string, updates: Partial<Omit<T, 'id'>>): Promise<T | undefined>;
    /**
     * Mark an item as processing
     */
    startProcessing(id: string): Promise<T | undefined>;
    /**
     * Mark an item as completed and remove from queue
     */
    complete(id: string): Promise<T | undefined>;
    /**
     * Mark an item as failed
     * If under max retries, requeue as pending
     */
    fail(id: string, error: string): Promise<T | undefined>;
    /**
     * Cancel an item
     */
    cancel(id: string): Promise<T | undefined>;
    /**
     * List all items (optionally filtered by status)
     */
    list(status?: QueueItemStatus): Promise<T[]>;
    /**
     * Get queue statistics
     */
    stats(): Promise<QueueStats>;
    /**
     * Get current queue length
     */
    length(): Promise<number>;
    /**
     * Clear all items (dangerous!)
     */
    clear(): Promise<void>;
    /**
     * Acquire a lock for processing
     */
    lock(): Promise<boolean>;
    /**
     * Release the lock
     */
    unlock(): Promise<void>;
    /**
     * Check if queue is locked
     */
    isLocked(): Promise<boolean>;
    /**
     * Process the next item with a handler
     * Automatically handles locking, status updates, and error handling
     */
    processNext<R>(handler: (item: T) => Promise<R>): Promise<{
        item: T;
        result: R;
    } | null>;
    /**
     * Sort queue by priority (ascending) then by addedAt (ascending)
     */
    private sortQueue;
    /**
     * Update queue statistics
     */
    private updateStats;
}

/**
 * Priority Scorer
 *
 * Calculates priority scores for PRs based on labels and metadata.
 */

interface PRMetadata {
    labels?: string[];
    type?: 'ci-fix' | 'security' | 'feature' | 'docs' | 'bugfix' | 'chore';
    isDraft?: boolean;
    hasConflicts?: boolean;
    age?: number;
    reviewCount?: number;
}
/**
 * Priority scorer for queue items
 */
declare class PriorityScorer {
    /**
     * Calculate priority score from PR metadata
     * Returns 1 (critical), 2 (normal), or 3 (low)
     */
    score(pr: PRMetadata): Priority;
    /**
     * Calculate priority from labels
     * Looks for priority/critical, priority/high, priority/low labels
     */
    static fromLabels(labels: string[]): Priority;
    /**
     * Calculate priority from PR type
     */
    static fromType(type: 'ci-fix' | 'security' | 'feature' | 'docs' | 'bugfix' | 'chore'): Priority;
}

/**
 * Strata Test Results Format
 *
 * Custom test result format designed for AI-powered triage and diagnosis.
 * Used by both Vitest and Playwright reporters.
 */
interface TestResult {
    /** Unique test identifier */
    id: string;
    /** Test name/title */
    name: string;
    /** Full test path (describe blocks) */
    fullName: string;
    /** Source file containing the test */
    file: string;
    /** Line number in source file */
    line?: number;
    /** Test status */
    status: 'passed' | 'failed' | 'skipped' | 'todo';
    /** Duration in milliseconds */
    duration: number;
    /** Error details if failed */
    error?: TestError;
    /** Retry attempt number */
    retry?: number;
    /** Tags/annotations */
    tags?: string[];
}
interface TestError {
    /** Error message */
    message: string;
    /** Stack trace */
    stack?: string;
    /** Expected value (for assertion errors) */
    expected?: unknown;
    /** Actual value (for assertion errors) */
    actual?: unknown;
    /** Diff between expected and actual */
    diff?: string;
    /** Code snippet around the failure */
    codeFrame?: string;
}
interface TestFile {
    /** File path */
    path: string;
    /** Tests in this file */
    tests: TestResult[];
    /** Setup/teardown errors */
    setupError?: TestError;
    /** File-level duration */
    duration: number;
}
interface CoverageData {
    /** Total lines */
    lines: {
        total: number;
        covered: number;
        percentage: number;
    };
    /** Total functions */
    functions: {
        total: number;
        covered: number;
        percentage: number;
    };
    /** Total branches */
    branches: {
        total: number;
        covered: number;
        percentage: number;
    };
    /** Total statements */
    statements: {
        total: number;
        covered: number;
        percentage: number;
    };
    /** Per-file coverage */
    files: FileCoverage[];
}
interface FileCoverage {
    /** File path */
    path: string;
    /** Line coverage */
    lines: {
        total: number;
        covered: number;
        percentage: number;
    };
    /** Uncovered line numbers */
    uncoveredLines: number[];
    /** Function coverage */
    functions: {
        total: number;
        covered: number;
        percentage: number;
    };
    /** Uncovered function names */
    uncoveredFunctions: string[];
}
interface TestReport {
    /** Report format version */
    version: '1.0';
    /** Report generation timestamp */
    timestamp: string;
    /** Test runner (vitest, playwright, etc.) */
    runner: string;
    /** Test type */
    type: 'unit' | 'integration' | 'e2e';
    /** Summary statistics */
    summary: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        duration: number;
    };
    /** Test files */
    files: TestFile[];
    /** Coverage data (if available) */
    coverage?: CoverageData;
    /** Git context */
    git?: {
        branch: string;
        commit: string;
        author?: string;
        message?: string;
    };
    /** CI context */
    ci?: {
        provider: string;
        runId: string;
        runUrl?: string;
        prNumber?: number;
        issueNumbers?: number[];
    };
}
/**
 * Parse test report from JSON file
 */
declare function parseTestReport(json: string): TestReport;
/**
 * Get failed tests from report
 */
declare function getFailedTests(report: TestReport): TestResult[];
/**
 * Get tests by file
 */
declare function getTestsByFile(report: TestReport, filePath: string): TestResult[];
/**
 * Get low coverage files
 */
declare function getLowCoverageFiles(report: TestReport, threshold?: number): FileCoverage[];
/**
 * Get uncovered functions
 */
declare function getUncoveredFunctions(report: TestReport): {
    file: string;
    functions: string[];
}[];
/**
 * Format test results for AI analysis
 */
declare function formatForAI(report: TestReport): string;

/**
 * Playwright MCP Client
 *
 * Connects to @playwright/mcp for browser automation and E2E test generation.
 * Used for:
 * - Running E2E tests
 * - Generating test code from user flows
 * - Verifying changes in the browser
 */

type MCPClient = Awaited<ReturnType<typeof experimental_createMCPClient>>;
interface PlaywrightOptions {
    headless?: boolean;
    browser?: 'chromium' | 'firefox' | 'webkit';
    viewport?: {
        width: number;
        height: number;
    };
    outputDir?: string;
    saveTrace?: boolean;
    testingCapabilities?: boolean;
}
/**
 * Create a Playwright MCP client
 */
declare function createPlaywrightClient(options?: PlaywrightOptions): Promise<MCPClient>;
/**
 * Get Playwright tools from the MCP client
 */
declare function getPlaywrightTools(client: MCPClient): Promise<Awaited<ReturnType<MCPClient['tools']>>>;
/**
 * Available Playwright MCP tools (for reference)
 */
declare const PLAYWRIGHT_TOOLS: {
    readonly NAVIGATE: "browser_navigate";
    readonly CLICK: "browser_click";
    readonly TYPE: "browser_type";
    readonly SNAPSHOT: "browser_snapshot";
    readonly SCREENSHOT: "browser_take_screenshot";
    readonly CLOSE: "browser_close";
    readonly WAIT: "browser_wait_for";
    readonly EVALUATE: "browser_evaluate";
    readonly VERIFY_ELEMENT_VISIBLE: "browser_verify_element_visible";
    readonly VERIFY_TEXT_VISIBLE: "browser_verify_text_visible";
    readonly VERIFY_VALUE: "browser_verify_value";
    readonly GENERATE_LOCATOR: "browser_generate_locator";
};

export { type AgentCapabilities, type AgentConfig, type AgentDefinition, type AgentExecutor, type AgentFactory, AgentRegistry, type AgentResult, type AgentTask, type ComplexityScore, type ComplexityTier, type ComplexityWeights, type CostEntry, CostTracker, type CoverageData, DEFAULT_ESCALATION_CONFIG, DEFAULT_THRESHOLDS, DEFAULT_WEIGHTS, type DailyCostStats, type DimensionScores, type EscalationConfig, EscalationLadder, type EscalationLevel, type EscalationState, EscalationStateManager, type EvaluatorConfig, type FileCoverage, FileStorage, GitHubIssueStorage, type GitHubIssueStorageOctokit, type GitHubIssueStorageOptions, type LLMEvaluator, type LevelHandler, LockManager, type MCPClient, MemoryStorage, PLAYWRIGHT_TOOLS, type PRMetadata, type PlaywrightOptions, type Priority, PriorityScorer, type ProcessResult, type QueueActivity, type QueueItem, type QueueItemStatus, type QueueLock, QueueManager, type QueueManagerConfig, type QueueState, type QueueStats, type QueueStorage, type RouterConfig, type RouterState, type RoutingResult, type Task, TaskRouter, type TestError, type TestFile, type TestReport, type TestResult, type TierThresholds, calculateComplexity, calculateWeightedScore, createEscalationConfig, createPlaywrightClient, createRouter, estimateComplexityHeuristic, evaluateComplexity, formatForAI, generateEvaluationPrompt, getFailedTests, getLowCoverageFiles, getPlaywrightTools, getTestsByFile, getUncoveredFunctions, parseEvaluationResponse, parseTestReport, scoreToTier, tierToAgent };
