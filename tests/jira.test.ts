import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JiraProvider } from '../src/providers/jira.js';

describe('JiraProvider', () => {
    const config = {
        host: 'https://test.atlassian.net',
        projectKey: 'PROJ',
        email: 'test@example.com',
        apiToken: 'token123',
    };

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    it('should initialize correctly', () => {
        const provider = new JiraProvider(config);
        expect(provider.name).toBe('jira');
        expect(provider.displayName).toBe('Jira');
    });

    it('should handle host with trailing slash', () => {
        const provider = new JiraProvider({ ...config, host: 'https://test.atlassian.net/' });
        // @ts-expect-error - accessing private property for test
        expect(provider.host).toBe('https://test.atlassian.net');
    });

    it('isReady should return true on success', async () => {
        const provider = new JiraProvider(config);
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ key: 'PROJ' }),
        } as Response);

        const ready = await provider.isReady();
        expect(ready).toBe(true);
        expect(fetch).toHaveBeenCalledWith('https://test.atlassian.net/rest/api/3/project/PROJ', expect.any(Object));
    });

    it('isReady should return false on failure', async () => {
        const provider = new JiraProvider(config);
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

        const ready = await provider.isReady();
        expect(ready).toBe(false);
    });

    it('getIssue should fetch and map a Jira issue', async () => {
        const provider = new JiraProvider(config);
        const jiraIssue = {
            key: 'PROJ-1',
            fields: {
                summary: 'Test Issue',
                description: {
                    type: 'doc',
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Test description' }] }],
                },
                status: { name: 'To Do' },
                priority: { name: 'High' },
                issuetype: { name: 'Bug' },
                labels: ['label1'],
                assignee: { displayName: 'User' },
                created: '2023-01-01T00:00:00Z',
                updated: '2023-01-01T01:00:00Z',
            },
        };

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => jiraIssue,
        } as Response);

        const issue = await provider.getIssue('PROJ-1');
        expect(issue).not.toBeNull();
        expect(issue?.id).toBe('PROJ-1');
        expect(issue?.title).toBe('Test Issue');
        expect(issue?.description).toBe('Test description');
        expect(issue?.status).toBe('open');
        expect(issue?.priority).toBe('high');
        expect(issue?.type).toBe('bug');
        expect(issue?.labels).toContain('label1');
        expect(issue?.assignee).toBe('User');
    });

    it('createIssue should post to Jira and return the issue', async () => {
        const provider = new JiraProvider(config);
        const createdIssue = { key: 'PROJ-2' };
        const jiraIssue = {
            key: 'PROJ-2',
            fields: {
                summary: 'New Issue',
                status: { name: 'To Do' },
                issuetype: { name: 'Task' },
                created: '2023-01-01T00:00:00Z',
                updated: '2023-01-01T00:00:00Z',
            },
        };

        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => createdIssue,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => jiraIssue,
            } as Response);

        const issue = await provider.createIssue({
            title: 'New Issue',
            type: 'task',
        });

        expect(issue.id).toBe('PROJ-2');
        expect(issue.title).toBe('New Issue');
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('listIssues should construct correct JQL', async () => {
        const provider = new JiraProvider(config);
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ issues: [] }),
        } as Response);

        await provider.listIssues({
            status: 'open',
            priority: 'critical',
            type: 'bug',
            labels: ['urgent'],
        });

        const lastCall = vi.mocked(fetch).mock.calls[0];
        const body = JSON.parse(lastCall[1]?.body as string);
        expect(body.jql).toContain('project = "PROJ"');
        expect(body.jql).toContain('status IN ("To Do")');
        expect(body.jql).toContain('priority IN ("Highest")');
        expect(body.jql).toContain('issuetype IN ("Bug")');
        expect(body.jql).toContain('labels IN ("urgent")');
    });

    it('updateIssue should put to Jira and return the issue', async () => {
        const provider = new JiraProvider(config);
        const jiraIssue = {
            key: 'PROJ-1',
            fields: {
                summary: 'Updated Issue',
                status: { name: 'In Progress' },
                issuetype: { name: 'Task' },
                created: '2023-01-01T00:00:00Z',
                updated: '2023-01-01T02:00:00Z',
            },
        };

        vi.mocked(fetch)
            .mockResolvedValueOnce({ ok: true, status: 204 } as Response) // update fields
            .mockResolvedValueOnce({ ok: true, json: async () => jiraIssue } as Response); // get issue

        const issue = await provider.updateIssue('PROJ-1', {
            title: 'Updated Issue',
        });

        expect(issue.title).toBe('Updated Issue');
        expect(fetch).toHaveBeenCalledWith(
            'https://test.atlassian.net/rest/api/3/issue/PROJ-1',
            expect.objectContaining({ method: 'PUT' })
        );
    });

    it('getStats should fetch issues and calculate stats', async () => {
        const provider = new JiraProvider(config);
        const issues = [
            {
                key: 'PROJ-1',
                fields: {
                    status: { name: 'To Do' },
                    priority: { name: 'High' },
                    issuetype: { name: 'Bug' },
                },
            },
            {
                key: 'PROJ-2',
                fields: {
                    status: { name: 'In Progress' },
                    priority: { name: 'Medium' },
                    issuetype: { name: 'Story' },
                },
            },
        ];

        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ issues }),
        } as Response);

        const stats = await provider.getStats();
        expect(stats.total).toBe(2);
        expect(stats.open).toBe(1);
        expect(stats.inProgress).toBe(1);
        expect(stats.byPriority.high).toBe(1);
        expect(stats.byType.bug).toBe(1);
    });

    it('getIssue should return null on failure', async () => {
        const provider = new JiraProvider(config);
        vi.mocked(fetch).mockRejectedValueOnce(new Error('Failed'));
        const issue = await provider.getIssue('PROJ-1');
        expect(issue).toBeNull();
    });

    it('closeIssue and reopenIssue should work', async () => {
        const provider = new JiraProvider(config);
        vi.mocked(fetch)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ transitions: [{ id: '1', name: 'Done', to: { name: 'Done' } }] }),
            } as Response) // get transitions
            .mockResolvedValueOnce({ ok: true, status: 204 } as Response) // transition
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    key: 'PROJ-1',
                    fields: { summary: 'T', status: { name: 'Done' }, issuetype: { name: 'Task' } },
                }),
            } as Response); // get issue

        await provider.closeIssue('PROJ-1');
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/transitions'), expect.any(Object));
    });

    it('addLabels and removeLabels should work', async () => {
        const provider = new JiraProvider(config);
        vi.mocked(fetch).mockResolvedValue({ ok: true, status: 204 } as Response);

        await provider.addLabels('PROJ-1', ['l1']);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/issue/PROJ-1'),
            expect.objectContaining({ method: 'PUT' })
        );

        await provider.removeLabels('PROJ-1', ['l1']);
        expect(fetch).toHaveBeenCalledTimes(2);
    });

    it('getReadyWork should return sorted issues', async () => {
        const provider = new JiraProvider(config);
        const issues = [
            {
                key: 'P1',
                fields: {
                    summary: 'S1',
                    status: { name: 'To Do' },
                    priority: { name: 'Low' },
                    issuetype: { name: 'Task' },
                },
            },
            {
                key: 'P2',
                fields: {
                    summary: 'S2',
                    status: { name: 'To Do' },
                    priority: { name: 'Highest' },
                    issuetype: { name: 'Task' },
                },
            },
        ];
        vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({ issues }) } as Response);

        const ready = await provider.getReadyWork();
        expect(ready[0].issue.id).toBe('P2'); // Highest priority first
    });

    it('mapPriorityToJira should handle all priorities', () => {
        const provider = new JiraProvider(config);
        // @ts-expect-error
        expect(provider.mapPriorityToJira('critical')).toBe('Highest');
        // @ts-expect-error
        expect(provider.mapPriorityToJira('low')).toBe('Low');
        // @ts-expect-error
        expect(provider.mapPriorityToJira('backlog')).toBe('Lowest');
        // @ts-expect-error
        expect(provider.mapPriorityToJira('unknown' as any)).toBe('Medium');
    });

    it('mapStatusToJira should handle all statuses', () => {
        const provider = new JiraProvider(config);
        // @ts-expect-error
        expect(provider.mapStatusToJira('in_progress')).toBe('In Progress');
        // @ts-expect-error
        expect(provider.mapStatusToJira('blocked')).toBe('Blocked');
        // @ts-expect-error
        expect(provider.mapStatusToJira('closed')).toBe('Done');
        // @ts-expect-error
        expect(provider.mapStatusToJira('unknown' as any)).toBe('To Do');
    });

    it('mapTypeToJira should handle all types', () => {
        const provider = new JiraProvider(config);
        // @ts-expect-error
        expect(provider.mapTypeToJira('bug')).toBe('Bug');
        // @ts-expect-error
        expect(provider.mapTypeToJira('feature')).toBe('Story');
        // @ts-expect-error
        expect(provider.mapTypeToJira('epic')).toBe('Epic');
        // @ts-expect-error
        expect(provider.mapTypeToJira('chore')).toBe('Task');
    });

    it('adfToString should handle complex ADF', () => {
        const provider = new JiraProvider(config);
        const adf = {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Line 1' }],
                },
                {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Line 2' }],
                },
            ],
        };
        // @ts-expect-error
        const text = provider.adfToString(adf);
        expect(text).toBe('Line 1\nLine 2');
    });

    it('adfToString should handle null/empty ADF', () => {
        const provider = new JiraProvider(config);
        // @ts-expect-error
        expect(provider.adfToString(null)).toBeUndefined();
        // @ts-expect-error
        expect(provider.adfToString({})).toBeUndefined();
    });
});
