import { GitHubProvider } from '../src/providers/github.js';
import {
    createBestProvider,
    createProvider,
    normalizePriority,
    normalizeStatus,
    normalizeType,
} from '../src/providers/index.js';
import { JiraProvider } from '../src/providers/jira.js';

describe('Provider Factory', () => {
    it('createProvider should create GitHubProvider', () => {
        const provider = createProvider({ type: 'github', repo: 'owner/repo' });
        expect(provider).toBeInstanceOf(GitHubProvider);
    });

    it('createProvider should create JiraProvider', () => {
        const provider = createProvider({
            type: 'jira',
            host: 'https://test.atlassian.net',
            projectKey: 'PROJ',
            email: 'test@example.com',
            apiToken: 'token',
        });
        expect(provider).toBeInstanceOf(JiraProvider);
    });

    it('createProvider should throw for unknown type', () => {
        expect(() => createProvider({ type: 'unknown' } as any)).toThrow('Unknown provider type: unknown');
    });

    describe('createBestProvider', () => {
        const originalEnv = process.env;

        beforeEach(() => {
            process.env = { ...originalEnv };
        });

        it('should use repo from options if provided', async () => {
            const provider = await createBestProvider({ repo: 'owner/repo' });
            expect(provider).toBeInstanceOf(GitHubProvider);
            expect((provider as GitHubProvider)['repo']).toBe('owner/repo');
        });

        it('should use GITHUB_REPOSITORY if provided', async () => {
            process.env.GITHUB_REPOSITORY = 'env/repo';
            const provider = await createBestProvider();
            expect(provider).toBeInstanceOf(GitHubProvider);
            expect((provider as GitHubProvider)['repo']).toBe('env/repo');
        });

        it('should throw if no repo found', async () => {
            delete process.env.GITHUB_REPOSITORY;
            await expect(createBestProvider()).rejects.toThrow('Could not auto-detect provider');
        });
    });

    describe('Utility Functions', () => {
        it('normalizePriority should handle all cases', () => {
            expect(normalizePriority('highest')).toBe('critical');
            expect(normalizePriority('p1')).toBe('high');
            expect(normalizePriority('p2')).toBe('medium');
            expect(normalizePriority('p3')).toBe('low');
            expect(normalizePriority('p4')).toBe('backlog');
        });

        it('normalizeStatus should handle all cases', () => {
            expect(normalizeStatus('in-progress')).toBe('in_progress');
            expect(normalizeStatus('doing')).toBe('in_progress');
            expect(normalizeStatus('waiting')).toBe('blocked');
            expect(normalizeStatus('resolved')).toBe('closed');
        });

        it('normalizeType should handle all cases', () => {
            expect(normalizeType('defect')).toBe('bug');
            expect(normalizeType('enhancement')).toBe('feature');
            expect(normalizeType('subtask')).toBe('task');
            expect(normalizeType('initiative')).toBe('epic');
            expect(normalizeType('maintenance')).toBe('chore');
        });
    });
});
