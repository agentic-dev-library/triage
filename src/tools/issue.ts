import { tool } from 'ai';
import { z } from 'zod';
import { getTriageConnectors } from '../providers/index.js';
import { issueSchema } from '../schemas/issue.js';

export const createIssueTool = tool({
    description: 'Create a new issue.',
    parameters: issueSchema,
    execute: async (issue: any) => {
        const connectors = getTriageConnectors();
        const result = await connectors.createIssue({
            title: issue.title,
            body: issue.body,
            type: issue.type,
            priority: issue.priority,
            labels: issue.labels,
        });
        return result;
    },
});

export const getIssueTool = tool({
    description: 'Get an issue by its ID.',
    parameters: z.object({
        id: z.union([z.number(), z.string()]).describe('The ID of the issue to retrieve.'),
    }),
    execute: async ({ id }: any) => {
        const connectors = getTriageConnectors();
        const issue = await connectors.getIssue(String(id));
        return issue;
    },
});

export const updateIssueTool = tool({
    description: 'Update an existing issue.',
    parameters: z.object({
        id: z.union([z.number(), z.string()]).describe('The ID of the issue to update.'),
        updates: issueSchema.partial().describe('The fields to update.'),
    }),
    execute: async ({ id, updates }: any) => {
        const connectors = getTriageConnectors();
        const result = await connectors.updateIssue(String(id), updates);
        return result;
    },
});

export const listIssuesTool = tool({
    description: 'List issues with filters (status, priority, type, labels).',
    parameters: z.object({
        status: z.enum(['open', 'in_progress', 'blocked', 'closed']).optional(),
        priority: z.enum(['critical', 'high', 'medium', 'low', 'backlog']).optional(),
        type: z.enum(['bug', 'feature', 'task', 'chore', 'docs']).optional(),
        labels: z.array(z.string()).optional(),
        limit: z.number().optional().default(50),
        assignee: z.string().optional(),
    }),
    execute: async (filters: any) => {
        const connectors = getTriageConnectors();
        const issues = await connectors.listIssues(filters);
        return { issues };
    },
});

export const searchIssuesTool = tool({
    description: 'Full-text search across issues.',
    parameters: z.object({
        query: z.string().describe('The search query.'),
    }),
    execute: async ({ query }: any) => {
        const connectors = getTriageConnectors();
        const issues = await connectors.searchIssues(query);
        return { issues };
    },
});
