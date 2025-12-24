import { createIssue, getIssue, searchIssues, updateIssue } from '../octokit.js';
import type { IssuePriority, IssueStatus, IssueType, TriageIssue, TriageProvider } from './base.js';

export class GitHubProvider implements TriageProvider {
    private owner?: string;
    private repo?: string;

    constructor(config: { owner?: string; repo?: string }) {
        this.owner = config.owner;
        this.repo = config.repo;
    }

    async listIssues(filters?: {
        status?: IssueStatus;
        priority?: IssuePriority;
        type?: IssueType;
        labels?: string[];
        limit?: number;
        assignee?: string;
    }): Promise<TriageIssue[]> {
        // Simple search query for GitHub
        let query = '';
        if (filters?.status) query += `is:${filters.status === 'closed' ? 'closed' : 'open'} `;
        if (filters?.assignee) query += `assignee:${filters.assignee} `;
        if (filters?.labels) {
            for (const l of filters.labels) {
                query += `label:"${l}" `;
            }
        }

        const issues = await searchIssues(query);
        return issues.map((issue) => ({
            id: String(issue.number),
            title: issue.title,
            body: '', // searchIssues doesn't return body by default in octokit.js
            status: issue.state,
            labels: issue.labels,
        }));
    }

    async getIssue(id: string): Promise<TriageIssue> {
        const issue = await getIssue(Number(id));
        return {
            id: String(issue.number),
            title: issue.title,
            body: issue.body,
            status: issue.state,
            labels: issue.labels,
        };
    }

    async createIssue(issue: {
        title: string;
        body?: string;
        type?: IssueType;
        priority?: IssuePriority;
        labels?: string[];
        assignee?: string;
    }): Promise<TriageIssue> {
        const labels = [...(issue.labels || [])];
        if (issue.type) labels.push(`type:${issue.type}`);
        if (issue.priority) labels.push(`priority:${issue.priority}`);

        const result = await createIssue({
            title: issue.title,
            body: issue.body || '',
            labels,
            assignees: issue.assignee ? [issue.assignee] : undefined,
        });

        return this.getIssue(String(result.number));
    }

    async updateIssue(id: string, updates: Partial<TriageIssue>): Promise<TriageIssue> {
        await updateIssue(Number(id), {
            title: updates.title,
            body: updates.body,
            state: updates.status === 'closed' ? 'closed' : updates.status === 'open' ? 'open' : undefined,
            labels: updates.labels,
        });
        return this.getIssue(id);
    }

    async searchIssues(query: string): Promise<TriageIssue[]> {
        const issues = await searchIssues(query);
        return issues.map((issue) => ({
            id: String(issue.number),
            title: issue.title,
            body: '',
            status: issue.state,
            labels: issue.labels,
        }));
    }
}
