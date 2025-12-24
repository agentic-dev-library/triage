import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as providers from '../src/providers/index.js';
import { getTriageConnectors, setTriageConnectors, TriageConnectors } from '../src/triage/connectors.js';

// Mock providers
vi.mock('../src/providers/index.js', () => {
    const mockProvider = {
        name: 'mock',
        isReady: vi.fn().mockResolvedValue(true),
        createIssue: vi.fn(),
        getIssue: vi.fn(),
        updateIssue: vi.fn(),
        listIssues: vi.fn(),
        getStats: vi.fn(),
    };
    return {
        createProvider: vi.fn().mockReturnValue(mockProvider),
        createBestProvider: vi.fn().mockResolvedValue(mockProvider),
    };
});

describe('TriageConnectors', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default config', () => {
        const connectors = new TriageConnectors();
        expect(connectors.issues).toBeDefined();
    });

    it('should use Jira provider if configured', async () => {
        const connectors = new TriageConnectors({
            provider: 'jira',
            jira: {
                host: 'https://test.atlassian.net',
                email: 'test@example.com',
                apiToken: 'token',
                projectKey: 'PROJ',
            },
        });

        await connectors.getProvider();
        expect(providers.createProvider).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'jira',
                projectKey: 'PROJ',
            })
        );
    });

    it('should use GitHub provider if configured', async () => {
        const connectors = new TriageConnectors({
            provider: 'github',
            github: {
                repo: 'owner/repo',
                token: 'token',
            },
        });

        await connectors.getProvider();
        expect(providers.createProvider).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'github',
                repo: 'owner/repo',
            })
        );
    });

    it('getTriageConnectors should return a singleton', () => {
        const c1 = getTriageConnectors();
        const c2 = getTriageConnectors();
        expect(c1).toBe(c2);
    });

    it('setTriageConnectors should override singleton', () => {
        const connectors = new TriageConnectors();
        setTriageConnectors(connectors);
        expect(getTriageConnectors()).toBe(connectors);
    });

    describe('IssueAPI', () => {
        it('create should call provider.createIssue', async () => {
            const connectors = new TriageConnectors();
            const provider = await connectors.getProvider();
            await connectors.issues.create({ title: 'New' });
            expect(provider.createIssue).toHaveBeenCalledWith({ title: 'New' });
        });

        it('list should call provider.listIssues', async () => {
            const connectors = new TriageConnectors();
            const provider = await connectors.getProvider();
            await connectors.issues.list({ status: 'open' });
            expect(provider.listIssues).toHaveBeenCalledWith({ status: 'open' });
        });
    });
});
