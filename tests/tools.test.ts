import { describe, expect, it, vi } from 'vitest';
import { createIssueTool, getIssueTool, updateIssueTool } from '../src/tools/issue.js';
import { submitCodeReviewTool } from '../src/tools/review.js';
import { triageTool } from '../src/tools/triage.js';

// Mock octokit
vi.mock('../src/octokit.js', () => ({
    createIssue: vi.fn().mockResolvedValue({ number: 123 }),
    getIssue: vi.fn().mockResolvedValue({
        number: 123,
        title: 'Test Issue',
        body: 'Body',
        state: 'open',
        labels: ['label1'],
    }),
    updateIssue: vi.fn().mockResolvedValue({}),
    submitPRReview: vi.fn().mockResolvedValue({}),
    getPullRequest: vi.fn().mockResolvedValue({
        number: 456,
        title: 'Test PR',
        body: 'PR Body',
    }),
}));

describe('Issue Tools', () => {
    it('should have correct descriptions', () => {
        expect(createIssueTool.description).toBe('Create a new issue.');
        expect(getIssueTool.description).toBe('Get an issue by its ID.');
        expect(updateIssueTool.description).toBe('Update an existing issue.');
    });

    it('createIssueTool should execute correctly', async () => {
        const result = await (createIssueTool as any).execute({
            title: 'New Issue',
            body: 'New Body',
            type: 'bug',
            priority: 'high',
            labels: ['label1'],
        });

        expect(result.id).toBe(123);
        expect(result.title).toBe('New Issue');
    });

    it('getIssueTool should execute correctly', async () => {
        const result = await (getIssueTool as any).execute({ id: 123 });
        expect(result.id).toBe(123);
        expect(result.title).toBe('Test Issue');
    });

    it('updateIssueTool should execute correctly with minimal updates', async () => {
        const result = await (updateIssueTool as any).execute({
            id: 123,
            updates: { type: 'feature' },
        });
        expect(result.id).toBe(123);
        expect(result.type).toBe('feature');
    });

    it('updateIssueTool should handle labels in updates', async () => {
        const result = await (updateIssueTool as any).execute({
            id: 123,
            updates: { labels: ['new-label'], type: 'bug' },
        });
        expect(result.labels).toContain('new-label');
        expect(result.labels).toContain('type:bug');
    });
});

describe('Review Tools', () => {
    it('submitCodeReviewTool should execute correctly', async () => {
        const result = await (submitCodeReviewTool as any).execute({
            pullRequestId: 456,
            review: { summary: 'Good job' },
        });
        expect(result.success).toBe(true);
    });
});

describe('Triage Tools', () => {
    it('triageTool should triage an issue', async () => {
        const result = await (triageTool as any).execute({ id: 123, type: 'issue' });
        expect(result.id).toBe(123);
        expect(result.type).toBe('issue');
    });

    it('triageTool should triage a PR', async () => {
        const result = await (triageTool as any).execute({ id: 456, type: 'pull-request' });
        expect(result.id).toBe(456);
        expect(result.type).toBe('pull-request');
    });
});
