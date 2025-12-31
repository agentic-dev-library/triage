import { P as ProviderConfig, T as TriageProvider, a as ProviderStats } from './types-B9b_346N.js';
export { B as BeadsProviderConfig, C as CreateIssueOptions, D as DependencyType, G as GitHubProviderConfig, e as IssueDependency, I as IssuePriority, b as IssueStatus, c as IssueType, J as JiraProviderConfig, f as LinearProviderConfig, L as ListIssuesOptions, R as ReadyWork, d as TriageIssue, U as UpdateIssueOptions, n as normalizePriority, g as normalizeStatus, h as normalizeType, p as priorityToNumber } from './types-B9b_346N.js';
export { BeadsProvider } from './beads.js';
export { GitHubProvider } from './github.js';
export { JiraProvider } from './jira.js';
export { LinearConfig, LinearProvider } from './linear.js';

declare function commentOnIssue(issueNumber: number, body: string): void;
declare function commentOnPR(prNumber: number, body: string): void;

/**
 * Create a triage provider from configuration
 */
declare function createProvider(config: ProviderConfig | any): TriageProvider;
/**
 * Detect and create the best provider based on environment
 */
declare function createBestProvider(options?: {
    repo?: string;
    workingDir?: string;
    preferBeads?: boolean;
}): Promise<TriageProvider>;
/**
 * Register a provider instance
 */
declare function registerProvider(name: string, provider: TriageProvider): void;
/**
 * Get a registered provider
 */
declare function getProvider(name: string): TriageProvider | undefined;
/**
 * Get all registered providers
 */
declare function getAllProviders(): TriageProvider[];
/**
 * Clear all registered providers
 */
declare function clearProviders(): void;
/**
 * Sync all registered providers (for distributed providers like Beads)
 */
declare function syncAllProviders(): Promise<void>;
/**
 * Get combined statistics from all registered providers
 */
declare function getCombinedStats(): Promise<{
    providers: Record<string, ProviderStats>;
    total: ProviderStats;
}>;

export { ProviderConfig, ProviderStats, TriageProvider, clearProviders, commentOnIssue, commentOnPR, createBestProvider, createProvider, getAllProviders, getCombinedStats, getProvider, registerProvider, syncAllProviders };
