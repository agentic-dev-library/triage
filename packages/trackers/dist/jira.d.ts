import { T as TriageProvider, J as JiraProviderConfig, C as CreateIssueOptions, d as TriageIssue, U as UpdateIssueOptions, L as ListIssuesOptions, I as IssuePriority, R as ReadyWork, a as ProviderStats } from './types-B9b_346N.js';

/**
 * Jira Issues Provider
 *
 * Implements TriageProvider for Jira.
 */

declare class JiraProvider implements TriageProvider {
    readonly name = "jira";
    readonly displayName = "Jira";
    private host;
    private projectKey;
    private auth;
    constructor(config: JiraProviderConfig);
    isReady(): Promise<boolean>;
    createIssue(options: CreateIssueOptions): Promise<TriageIssue>;
    getIssue(id: string): Promise<TriageIssue | null>;
    updateIssue(id: string, options: UpdateIssueOptions): Promise<TriageIssue>;
    closeIssue(id: string, _reason?: string): Promise<TriageIssue>;
    reopenIssue(id: string, _reason?: string): Promise<TriageIssue>;
    listIssues(options?: ListIssuesOptions): Promise<TriageIssue[]>;
    getReadyWork(options?: {
        limit?: number;
        priority?: IssuePriority;
    }): Promise<ReadyWork[]>;
    getBlockedIssues(): Promise<TriageIssue[]>;
    searchIssues(query: string, options?: ListIssuesOptions): Promise<TriageIssue[]>;
    addLabels(id: string, labels: string[]): Promise<void>;
    removeLabels(id: string, labels: string[]): Promise<void>;
    getStats(): Promise<ProviderStats>;
    private request;
    private transitionIssue;
    private mapJiraIssue;
    private mapPriorityToJira;
    private mapStatusToJira;
    private mapTypeToJira;
    private stringToADF;
    private adfToString;
}

export { JiraProvider };
