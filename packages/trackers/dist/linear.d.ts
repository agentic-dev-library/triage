import { T as TriageProvider, L as ListIssuesOptions, d as TriageIssue, C as CreateIssueOptions, U as UpdateIssueOptions, I as IssuePriority, R as ReadyWork, a as ProviderStats } from './types-B9b_346N.js';

interface LinearConfig {
    apiKey: string;
    teamId: string;
}
declare class LinearProvider implements TriageProvider {
    readonly name = "linear";
    readonly displayName = "Linear";
    private client;
    private teamId;
    constructor(config: LinearConfig);
    isReady(): Promise<boolean>;
    private mapIssue;
    private mapPriorityFromLinear;
    private mapPriorityToLinear;
    private mapStatusToLinear;
    listIssues(options?: ListIssuesOptions): Promise<TriageIssue[]>;
    getIssue(id: string): Promise<TriageIssue | null>;
    createIssue(options: CreateIssueOptions): Promise<TriageIssue>;
    updateIssue(id: string, options: UpdateIssueOptions): Promise<TriageIssue>;
    closeIssue(id: string, reason?: string): Promise<TriageIssue>;
    reopenIssue(id: string, reason?: string): Promise<TriageIssue>;
    searchIssues(query: string, options?: ListIssuesOptions): Promise<TriageIssue[]>;
    getReadyWork(options?: {
        limit?: number;
        priority?: IssuePriority;
    }): Promise<ReadyWork[]>;
    getBlockedIssues(): Promise<TriageIssue[]>;
    addLabels(_id: string, _labels: string[]): Promise<void>;
    removeLabels(_id: string, _labels: string[]): Promise<void>;
    getStats(): Promise<ProviderStats>;
}

export { type LinearConfig, LinearProvider };
