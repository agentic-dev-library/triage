import { MCPClient } from './mcp.js';
import '@ai-sdk/mcp';
import '@agentic/triage-ai';

/**
 * GitHub Operations via MCP
 *
 * All GitHub operations using GitHub MCP - no HTTP/fetch from this process.
 * The MCP server handles HTTP to GitHub API via subprocess communication.
 *
 * This module provides:
 * - Singleton GitHub MCP client management
 * - Convenience wrappers around MCP tool calls
 * - Repository context from git/environment
 */

/**
 * Get or create the singleton GitHub MCP client
 */
declare function getGitHubMCPClient(): Promise<MCPClient>;
/**
 * Close the GitHub MCP client (call on shutdown)
 */
declare function closeGitHubClient(): Promise<void>;
/**
 * Get or create the singleton GraphQL MCP client
 */
declare function getGraphQLMCPClient(): Promise<MCPClient>;
/**
 * Close the GraphQL MCP client (call on shutdown)
 */
declare function closeGraphQLClient(): Promise<void>;
/**
 * Close all MCP clients (call on shutdown)
 */
declare function closeAllClients(): Promise<void>;
/**
 * Execute a GraphQL query/mutation via MCP
 *
 * @param query - The GraphQL query or mutation string
 * @param variables - Variables for the query
 * @returns The query result data
 */
declare function executeGraphQL<T = unknown>(query: string, variables?: Record<string, unknown>): Promise<T>;
/**
 * Get repository context from environment or git
 * This does NOT require MCP - uses local git commands
 */
declare function getRepoContext(): {
    owner: string;
    repo: string;
};
declare function getOctokit(): never;
/**
 * Get issue details via MCP
 */
declare function getIssue(issueNumber: number, repoContext?: {
    owner: string;
    repo: string;
}): Promise<{
    number: number;
    title: string;
    body: string;
    state: string;
    labels: string[];
}>;
/**
 * Create a comment on an issue or PR via MCP.
 *
 * Notes:
 * - GitHub treats PR comments as "issue comments" on the PR's issue thread.
 */
declare function addIssueComment(issueNumber: number, body: string): Promise<void>;
/**
 * @deprecated Use addIssueComment()
 */
declare function createIssueComment(issueNumber: number, body: string): Promise<void>;
/**
 * Create an issue via MCP
 */
declare function createIssue(issue: {
    title: string;
    body: string;
    labels?: string[];
    assignees?: string[];
}, repoContext?: {
    owner: string;
    repo: string;
}): Promise<{
    number: number;
}>;
/**
 * Update an issue via MCP
 */
declare function updateIssue(issueNumber: number, updates: {
    title?: string;
    body?: string;
    state?: 'open' | 'closed';
    labels?: string[];
    assignees?: string[];
}, repoContext?: {
    owner: string;
    repo: string;
}): Promise<void>;
/**
 * Add labels to an issue without clobbering existing labels.
 */
declare function addIssueLabels(issueNumber: number, labels: string[]): Promise<void>;
/**
 * Comment on a PR (issue comment thread).
 */
declare function commentOnPR(prNumber: number, body: string): Promise<void>;
/**
 * Search issues via MCP (REST API)
 *
 * Note: This may not work with GitHub App tokens that have limited scopes.
 * Prefer searchIssuesGraphQL for better compatibility.
 */
declare function searchIssues(query: string, repoContext?: {
    owner: string;
    repo: string;
}): Promise<Array<{
    number: number;
    title: string;
    state: string;
    labels: string[];
}>>;
/**
 * Search issues via GraphQL (preferred method)
 *
 * Works reliably with GitHub App tokens that may have limited REST API access.
 */
declare function searchIssuesGraphQL(query: string, options?: {
    first?: number;
    includeBody?: boolean;
}, repoContext?: {
    owner: string;
    repo: string;
}): Promise<Array<{
    number: number;
    title: string;
    state: string;
    labels: string[];
    body?: string;
}>>;
/**
 * Get pull request details via MCP
 */
declare function getPullRequest(prNumber: number): Promise<{
    number: number;
    title: string;
    body: string;
    state: string;
    head: {
        ref: string;
        sha: string;
    };
    base: {
        ref: string;
    };
    draft: boolean;
    mergeable: boolean | null;
}>;
/**
 * List commits on a branch via MCP
 */
declare function listCommits(branch: string, options?: {
    per_page?: number;
}): Promise<Array<{
    sha: string;
    message: string;
    author: string;
}>>;
/**
 * Get file contents via MCP
 */
declare function getFileContents(path: string, options?: {
    ref?: string;
}): Promise<string>;
interface ReviewComment {
    id: number;
    nodeId: string;
    body: string;
    path: string;
    line?: number;
    user: string;
    createdAt: string;
    state?: string;
}
interface CheckRun {
    id: number;
    name: string;
    status: string;
    conclusion: string | null;
    startedAt: string;
    completedAt: string | null;
    url: string;
}
interface CodeScanningAlert {
    number: number;
    rule: {
        id: string;
        name?: string;
        severity: string;
        description: string;
    };
    state: string;
    tool: string;
    createdAt: string;
    url: string;
    location?: {
        path: string;
        startLine: number;
        endLine: number;
    };
}
interface DependabotAlert {
    number: number;
    state: string;
    dependency: {
        package: string;
        ecosystem: string;
        manifestPath: string;
    };
    securityAdvisory: {
        ghsaId: string;
        severity: string;
        summary: string;
    };
    securityVulnerability: {
        severity: string;
        vulnerableVersionRange: string;
        firstPatchedVersion?: string;
    };
    createdAt: string;
    url: string;
}
interface ReviewThread {
    id: string;
    isResolved: boolean;
    isOutdated: boolean;
    path: string;
    line: number | null;
    comments: Array<{
        id: string;
        body: string;
        author: string;
        createdAt: string;
    }>;
}
/**
 * Convert a PR to draft status
 */
declare function convertPRToDraft(prNumber: number): Promise<void>;
/**
 * Enable auto-merge on a PR
 */
declare function enableAutoMerge(prNumber: number, mergeMethod?: 'MERGE' | 'SQUASH' | 'REBASE'): Promise<void>;
/**
 * Disable auto-merge on a PR
 */
declare function disableAutoMerge(prNumber: number): Promise<void>;
/**
 * Get review comments on a PR
 */
declare function getPRReviewComments(prNumber: number): Promise<ReviewComment[]>;
/**
 * Get reviews on a PR
 */
declare function getPRReviews(prNumber: number): Promise<Array<{
    id: number;
    user: string;
    state: string;
    body: string;
    submittedAt: string;
}>>;
/**
 * Reply to a review comment
 *
 * @param prNumber - The PR number
 * @param commentNodeId - The GraphQL node ID of the comment to reply to (from ReviewComment.nodeId)
 * @param body - The reply body
 */
declare function replyToReviewComment(prNumber: number, commentNodeId: string, body: string): Promise<void>;
/**
 * Submit a PR review
 */
declare function submitPRReview(prNumber: number, event: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT', body: string): Promise<void>;
/**
 * Get check runs for a ref
 */
declare function getCheckRuns(ref: string): Promise<CheckRun[]>;
/**
 * Check if all checks are passing for a ref
 */
declare function areAllChecksPassing(ref: string): Promise<{
    passing: boolean;
    pending: number;
    failed: string[];
}>;
declare function createCheckRun(_name: string, _headSha: string, _options?: {
    status?: 'queued' | 'in_progress' | 'completed';
    conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required';
    title?: string;
    summary?: string;
    text?: string;
}): Promise<number>;
declare function getCodeScanningAlerts(_state?: 'open' | 'dismissed' | 'fixed'): Promise<CodeScanningAlert[]>;
declare function getPRCodeScanningAlerts(_prNumber: number): Promise<CodeScanningAlert[]>;
declare function getDependabotAlerts(_state?: 'open' | 'dismissed' | 'fixed'): Promise<DependabotAlert[]>;
/**
 * Wait for checks to complete and return status
 */
declare function waitForChecks(ref: string, options?: {
    timeout?: number;
    pollInterval?: number;
}): Promise<{
    passing: boolean;
    failed: string[];
}>;
declare function formatAlertsForAI(codeScanning: CodeScanningAlert[], dependabot: DependabotAlert[]): string;
/**
 * Get review threads on a PR
 */
declare function getPRReviewThreads(prNumber: number): Promise<ReviewThread[]>;
/**
 * Resolve a review thread
 */
declare function resolveReviewThread(threadId: string): Promise<boolean>;
/**
 * Mark a draft PR as ready for review
 */
declare function markPRReadyForReview(prNumber: number): Promise<boolean>;

export { type CheckRun, type CodeScanningAlert, type DependabotAlert, type ReviewComment, type ReviewThread, addIssueComment, addIssueLabels, areAllChecksPassing, closeAllClients, closeGitHubClient, closeGraphQLClient, commentOnPR, convertPRToDraft, createCheckRun, createIssue, createIssueComment, disableAutoMerge, enableAutoMerge, executeGraphQL, formatAlertsForAI, getCheckRuns, getCodeScanningAlerts, getDependabotAlerts, getFileContents, getGitHubMCPClient, getGraphQLMCPClient, getIssue, getOctokit, getPRCodeScanningAlerts, getPRReviewComments, getPRReviewThreads, getPRReviews, getPullRequest, getRepoContext, listCommits, markPRReadyForReview, replyToReviewComment, resolveReviewThread, searchIssues, searchIssuesGraphQL, submitPRReview, updateIssue, waitForChecks };
