import * as _agentic_triage_trackers from '@agentic/triage-trackers';
import { CreateIssueOptions, TriageIssue, UpdateIssueOptions, ListIssuesOptions, ReadyWork, ProviderStats, ProviderConfig, TriageProvider } from '@agentic/triage-trackers';
import { LanguageModel } from 'ai';
import { d as IssueTriage, e as PRAnalysis, g as CodeReview, i as SageQueryType, m as SageResponse, p as TaskDecomposition, r as AgentRouting, s as UnblockResponse } from '../sage-bwR_8Nd9.js';
import 'zod';

/**
 * TriageConnectors - Unified API for Issue/Project/Review Management
 *
 * Following the vendor-connectors pattern from the jbcom ecosystem,
 * this class provides cached access to all triage connectors with:
 *
 * 1. Direct TypeScript API - Use connectors directly in your code
 * 2. Vercel AI SDK Tools - Standard tools for AI agents (see tools.ts)
 *
 * Similar to how VendorConnectors provides `get_*_client()` getters,
 * TriageConnectors provides namespaced APIs for issues, projects, and reviews.
 *
 * @example
 * ```typescript
 * import { TriageConnectors } from '@strata/triage';
 *
 * // Initialize once - reads credentials from environment
 * const triage = new TriageConnectors();
 *
 * // Issue operations
 * const issues = await triage.issues.list({ status: 'open' });
 * const issue = await triage.issues.create({ title: 'Fix bug', type: 'bug' });
 * await triage.issues.update('123', { priority: 'high' });
 * await triage.issues.close('123', 'Fixed in PR #456');
 *
 * // Get ready work (no blockers)
 * const ready = await triage.issues.getReadyWork({ limit: 5 });
 *
 * // Statistics
 * const stats = await triage.issues.getStats();
 * ```
 */

interface TriageConnectorsConfig {
    /**
     * Provider configuration. If not provided, will auto-detect.
     * Can be a single config or multiple for different providers.
     */
    provider?: ProviderConfig;
    /**
     * Working directory for local providers (Beads)
     */
    workingDir?: string;
    /**
     * Repository for GitHub provider (owner/repo format)
     */
    repo?: string;
    /**
     * Prefer Beads over GitHub when both are available
     * @default true
     */
    preferBeads?: boolean;
}
/**
 * Unified triage connector providing issue, project, and review APIs.
 *
 * This is the main entry point for programmatic triage operations.
 * For AI agent tools, see `getTriageTools()` in tools.ts.
 */
declare class TriageConnectors {
    private config;
    private _provider;
    private _initPromise;
    /**
     * Issue operations API
     */
    readonly issues: IssueAPI;
    /**
     * Project operations API (boards, sprints, epics)
     * @remarks Coming soon - currently returns stubs
     */
    readonly projects: ProjectAPI;
    /**
     * Review operations API (PR feedback, comments)
     * @remarks Coming soon - currently returns stubs
     */
    readonly reviews: ReviewAPI;
    constructor(config?: TriageConnectorsConfig);
    /**
     * Get or initialize the underlying provider
     */
    getProvider(): Promise<TriageProvider>;
    /**
     * Reconfigure the connectors with a new configuration.
     * This will reset the underlying provider.
     */
    reconfigure(config: TriageConnectorsConfig): Promise<void>;
    private initializeProvider;
    /**
     * Get the provider name
     */
    getProviderName(): Promise<string>;
    /**
     * Check if the connector is ready
     */
    isReady(): Promise<boolean>;
    /**
     * Sync with remote (for providers that support it)
     */
    sync(): Promise<void>;
}
/**
 * Issue operations API - CRUD and query operations for issues
 */
declare class IssueAPI {
    private connectors;
    constructor(connectors: TriageConnectors);
    /**
     * Create a new issue
     */
    create(options: CreateIssueOptions): Promise<TriageIssue>;
    /**
     * Get an issue by ID
     */
    get(id: string): Promise<TriageIssue | null>;
    /**
     * Update an existing issue
     */
    update(id: string, options: UpdateIssueOptions): Promise<TriageIssue>;
    /**
     * Close an issue
     */
    close(id: string, reason?: string): Promise<TriageIssue>;
    /**
     * Reopen an issue
     */
    reopen(id: string, reason?: string): Promise<TriageIssue>;
    /**
     * Delete an issue (if supported by provider)
     */
    delete(id: string): Promise<void>;
    /**
     * List issues with optional filters
     */
    list(options?: ListIssuesOptions): Promise<TriageIssue[]>;
    /**
     * Search issues by text query
     */
    search(query: string, options?: ListIssuesOptions): Promise<TriageIssue[]>;
    /**
     * Get issues ready to work on (no blockers)
     */
    getReadyWork(options?: {
        limit?: number;
    }): Promise<ReadyWork[]>;
    /**
     * Get blocked issues
     */
    getBlocked(): Promise<TriageIssue[]>;
    /**
     * Add labels to an issue
     */
    addLabels(id: string, labels: string[]): Promise<void>;
    /**
     * Remove labels from an issue
     */
    removeLabels(id: string, labels: string[]): Promise<void>;
    /**
     * Get provider statistics
     */
    getStats(): Promise<ProviderStats>;
}
/**
 * Project operations API - boards, sprints, epics
 *
 * @remarks This API is under development. Currently returns stubs.
 */
declare class ProjectAPI {
    /**
     * List sprints/iterations
     */
    getSprints(): Promise<{
        id: string;
        name: string;
        status: string;
    }[]>;
    /**
     * Get current sprint
     */
    getCurrentSprint(): Promise<{
        id: string;
        name: string;
        status: string;
    } | null>;
    /**
     * Get epics
     */
    getEpics(): Promise<{
        id: string;
        title: string;
        progress: number;
    }[]>;
}
/**
 * Review operations API - PR feedback, comments, approvals
 *
 * @remarks This API is under development. Currently returns stubs.
 */
declare class ReviewAPI {
    /**
     * Get PR review comments
     */
    getPRComments(_prNumber: number): Promise<{
        id: string;
        body: string;
        author: string;
        path?: string;
        line?: number;
    }[]>;
    /**
     * Get unresolved feedback on a PR
     */
    getUnresolvedFeedback(_prNumber: number): Promise<{
        id: string;
        body: string;
        author: string;
        type: 'comment' | 'change_request';
    }[]>;
    /**
     * Reply to a review comment
     */
    replyToComment(_commentId: string, _body: string): Promise<void>;
}

/**
 * Get the global TriageConnectors instance
 * @param customConnectors Optional custom connectors to use
 * @returns The TriageConnectors instance
 */
declare function getConnectors(customConnectors?: TriageConnectors): TriageConnectors;
/**
 * Set the global TriageConnectors instance
 * @param connectors The connectors instance to set
 */
declare function setConnectors(connectors: TriageConnectors | null): void;

/**
 * Handler for triaging an issue
 */
declare function handleTriageIssue(id: string, analysis: IssueTriage, customConnectors?: TriageConnectors): Promise<{
    success: boolean;
    message: string;
    analysis: {
        title: string;
        summary: string;
        type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
        priority: "critical" | "high" | "medium" | "low" | "backlog";
        labels: string[];
        actionItems: string[];
        estimate?: number | undefined;
    };
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    analysis?: undefined;
}>;
/**
 * Handler for listing issues
 */
declare function handleListIssues(filters: ListIssuesOptions, customConnectors?: TriageConnectors): Promise<_agentic_triage_trackers.TriageIssue[]>;
/**
 * Handler for getting an issue
 */
declare function handleGetIssue(id: string, customConnectors?: TriageConnectors): Promise<_agentic_triage_trackers.TriageIssue | null>;
/**
 * Analyze an issue using the provided language model.
 *
 * @param issueBody - The content of the issue to analyze
 * @param model - The Vercel AI SDK model to use
 * @returns The structured analysis result
 */
declare function analyzeIssue(issueBody: string, model: LanguageModel): Promise<{
    title: string;
    summary: string;
    type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
    priority: "critical" | "high" | "medium" | "low" | "backlog";
    labels: string[];
    actionItems: string[];
    estimate?: number | undefined;
}>;

/**
 * Handler for analyzing a PR
 */
declare function handleAnalyzePR(prNumber: number, analysis: PRAnalysis): Promise<{
    success: boolean;
    message: string;
    analysis: {
        title: string;
        summary: string;
        scope: "minor" | "major" | "patch" | "breaking";
        riskLevel: "high" | "medium" | "low";
        testingCoverage: "none" | "partial" | "full";
        breakingChanges: string[];
        relatedIssues: string[];
    };
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    analysis?: undefined;
}>;

/**
 * Handler for submitting a code review
 */
declare function handleSubmitReview(prNumber: number, review: CodeReview): Promise<{
    success: boolean;
    message: string;
    review: {
        summary: string;
        status: "approve" | "request_changes" | "comment";
        comments: {
            file: string;
            content: string;
            type: "suggestion" | "issue" | "question" | "praise";
            line?: number | undefined;
            severity?: "high" | "medium" | "low" | undefined;
        }[];
        impact: "critical" | "high" | "medium" | "low";
        suggestedLabels: string[];
    };
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    review?: undefined;
}>;

/**
 * Context that can be provided to Sage for better responses
 */
interface SageContext {
    /** Repository structure (file list) */
    repoStructure?: string;
    /** Content from key files (README, CLAUDE.md, etc.) */
    keyFiles?: Record<string, string>;
    /** Issue or PR context if available */
    issueContext?: string;
    /** Current working directory or file context */
    currentContext?: string;
}
/**
 * Classify a query into a SageQueryType
 */
declare function classifyQuery(query: string): SageQueryType;
/**
 * Answer a question or provide guidance using Sage
 *
 * @param query - The question or request
 * @param model - The Vercel AI SDK model to use
 * @param context - Optional context for better responses
 * @returns Structured Sage response
 */
declare function answerQuestion(query: string, model: LanguageModel, context?: SageContext): Promise<SageResponse>;
/**
 * Decompose a complex task into subtasks with agent assignments
 *
 * @param task - The task to decompose
 * @param model - The Vercel AI SDK model to use
 * @param context - Optional context for better decomposition
 * @returns Structured task decomposition
 */
declare function decomposeTask(task: string, model: LanguageModel, context?: SageContext): Promise<TaskDecomposition>;
/**
 * Determine which agent should handle a task
 *
 * @param task - The task description
 * @param model - The Vercel AI SDK model to use
 * @param context - Optional context for better routing
 * @returns Agent routing decision
 */
declare function routeToAgent(task: string, model: LanguageModel, context?: SageContext): Promise<AgentRouting>;
/**
 * Help unblock stuck work
 *
 * @param situation - Description of the blocked situation
 * @param model - The Vercel AI SDK model to use
 * @param context - Optional context for better diagnosis
 * @returns Unblock suggestions
 */
declare function unblock(situation: string, model: LanguageModel, context?: SageContext): Promise<UnblockResponse>;
/**
 * High-level Sage function that auto-routes to the appropriate handler
 *
 * @param query - The question, task, or situation
 * @param model - The Vercel AI SDK model to use
 * @param context - Optional context
 * @returns Response appropriate to the query type
 */
declare function sage(query: string, model: LanguageModel, context?: SageContext): Promise<SageResponse | TaskDecomposition | AgentRouting | UnblockResponse>;

/**
 * Triage an issue or pull request using the provided language model.
 *
 * @param content - The content of the issue or PR (including metadata)
 * @param model - The Vercel AI SDK model to use
 * @returns The structured triage result
 */
declare function triageItem(content: string, model: LanguageModel): Promise<{
    triage: string;
    issueAnalysis?: {
        title: string;
        summary: string;
        type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
        priority: "critical" | "high" | "medium" | "low" | "backlog";
        labels: string[];
        actionItems: string[];
        estimate?: number | undefined;
    } | undefined;
    codeReview?: {
        summary: string;
        status: "approve" | "request_changes" | "comment";
        comments: {
            file: string;
            content: string;
            type: "suggestion" | "issue" | "question" | "praise";
            line?: number | undefined;
            severity?: "high" | "medium" | "low" | undefined;
        }[];
        impact: "critical" | "high" | "medium" | "low";
        suggestedLabels: string[];
    } | undefined;
}>;

export { AgentRouting, type SageContext, SageQueryType, SageResponse, TaskDecomposition, UnblockResponse, analyzeIssue, answerQuestion, classifyQuery, decomposeTask, getConnectors, handleAnalyzePR, handleGetIssue, handleListIssues, handleSubmitReview, handleTriageIssue, routeToAgent, sage, setConnectors, triageItem, unblock };
