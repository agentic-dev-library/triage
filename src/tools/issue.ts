import { tool } from 'ai';
import { z } from 'zod';
import { createIssue, getIssue, updateIssue } from '../octokit.js';
import { issueSchema } from '../schemas/issue.js';

export const createIssueTool = tool({
    description: 'Create a new issue.',
    parameters: issueSchema,
    execute: async (issue: any) => {
        const { number } = await createIssue({
            title: issue.title,
            body: issue.body,
            labels: [...issue.labels, `type:${issue.type}`, `priority:${issue.priority}`],
        });
        return { id: number, ...issue };
    },
} as any);

export const getIssueTool = tool({
    description: 'Get an issue by its ID.',
    parameters: z.object({
        id: z.number().describe('The ID of the issue to retrieve.'),
    }),
    execute: async ({ id }: any) => {
        const issue = await getIssue(id);
        return {
            id: issue.number,
            title: issue.title,
            body: issue.body,
            state: issue.state,
            labels: issue.labels,
        };
    },
} as any);

export const updateIssueTool = tool({
    description: 'Update an existing issue.',
    parameters: z.object({
        id: z.number().describe('The ID of the issue to update.'),
        updates: issueSchema.partial().describe('The fields to update.'),
    }),
    execute: async ({ id, updates }: any) => {
        const labels = updates.labels ? [...updates.labels] : undefined;
        if (updates.type && labels) labels.push(`type:${updates.type}`);
        if (updates.priority && labels) labels.push(`priority:${updates.priority}`);

        await updateIssue(id, {
            title: updates.title,
            body: updates.body,
            labels,
        });
        return { id, ...updates, labels: labels || updates.labels };
    },
} as any);
