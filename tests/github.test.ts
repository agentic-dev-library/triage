import { execFileSync } from 'node:child_process';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GitHubProvider } from '../src/providers/github.js';

vi.mock('node:child_process', () => ({
    execFileSync: vi.fn(),
}));

describe('GitHubProvider', () => {
    const config = {
        type: 'github' as const,
        repo: 'owner/repo',
        token: 'token123',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize correctly', () => {
        const provider = new GitHubProvider(config);
        expect(provider.name).toBe('github');
        expect(provider.displayName).toBe('GitHub Issues');
    });

    it('isReady should return true if gh command succeeds', async () => {
        const provider = new GitHubProvider(config);
        vi.mocked(execFileSync).mockReturnValue('{"name": "repo"}' as any);

        const ready = await provider.isReady();
        expect(ready).toBe(true);
        expect(execFileSync).toHaveBeenCalledWith('gh', expect.arrayContaining(['repo', 'view']), expect.any(Object));
    });

    it('getIssue should fetch and map a GitHub issue', async () => {
        const provider = new GitHubProvider(config);
        const githubIssue = {
            number: 1,
            title: 'Test Issue',
            body: 'Test description',
            state: 'open',
            labels: [{ name: 'priority:high' }, { name: 'type:bug' }, { name: 'label1' }],
            assignees: [{ login: 'user1' }],
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T01:00:00Z',
            url: 'https://github.com/owner/repo/issues/1',
        };

        vi.mocked(execFileSync).mockReturnValue(JSON.stringify(githubIssue) as any);

        const issue = await provider.getIssue('1');
        expect(issue).not.toBeNull();
        expect(issue?.id).toBe('1');
        expect(issue?.priority).toBe('high');
        expect(issue?.type).toBe('bug');
        expect(issue?.labels).toContain('label1');
        expect(issue?.labels).not.toContain('priority:high');
    });

    it('createIssue should call gh issue create', async () => {
        const provider = new GitHubProvider(config);
        vi.mocked(execFileSync)
            .mockReturnValueOnce('https://github.com/owner/repo/issues/123' as any)
            .mockReturnValueOnce('{"number": 123, "title": "New", "state": "open"}' as any);

        const issue = await provider.createIssue({ title: 'New' });
        expect(issue.id).toBe('123');
        expect(execFileSync).toHaveBeenCalledWith(
            'gh',
            expect.arrayContaining(['issue', 'create']),
            expect.any(Object)
        );
    });

    it('updateIssue should call gh issue edit', async () => {
        const provider = new GitHubProvider(config);
        vi.mocked(execFileSync)
            .mockReturnValueOnce('' as any)
            .mockReturnValueOnce('{"number": 1, "title": "Updated", "state": "open"}' as any);

        await provider.updateIssue('1', { title: 'Updated' });
        expect(execFileSync).toHaveBeenCalledWith('gh', expect.arrayContaining(['issue', 'edit']), expect.any(Object));
    });

    it('closeIssue should call gh issue close', async () => {
        const provider = new GitHubProvider(config);
        vi.mocked(execFileSync)
            .mockReturnValueOnce('' as any)
            .mockReturnValueOnce('{"number": 1, "state": "closed"}' as any);

        await provider.closeIssue('1', 'done');
        expect(execFileSync).toHaveBeenCalledWith(
            'gh',
            expect.arrayContaining(['issue', 'close', '1', '--comment', 'done']),
            expect.any(Object)
        );
    });

    it('getStats should work', async () => {
        const provider = new GitHubProvider(config);
        const issues = [
            { number: 1, state: 'open', labels: ['priority:high', 'type:bug'] },
            { number: 2, state: 'closed', labels: ['priority:low', 'type:task'] },
        ];
        vi.mocked(execFileSync).mockReturnValue(JSON.stringify(issues) as any);

        const stats = await provider.getStats();
        expect(stats.total).toBe(2);
        expect(stats.open).toBe(1);
        expect(stats.closed).toBe(1);
    });

    it('listIssues should pass correct arguments to gh', async () => {
        const provider = new GitHubProvider(config);
        vi.mocked(execFileSync).mockReturnValue('[]' as any);

        await provider.listIssues({
            status: ['open', 'closed'],
            limit: 10,
            assignee: 'user1',
        });

        expect(execFileSync).toHaveBeenCalledWith(
            'gh',
            expect.arrayContaining(['issue', 'list', '--state', 'all', '--limit', '10', '--assignee', 'user1']),
            expect.any(Object)
        );
    });

    it('listIssues with only open status should use --state open', async () => {
        const provider = new GitHubProvider(config);
        vi.mocked(execFileSync).mockReturnValue('[]' as any);

        await provider.listIssues({
            status: 'open',
        });

        expect(execFileSync).toHaveBeenCalledWith(
            'gh',
            expect.arrayContaining(['issue', 'list', '--state', 'open']),
            expect.any(Object)
        );
    });
});
