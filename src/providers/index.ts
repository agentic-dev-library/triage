import type { TriageProvider } from './base.js';
import { BeadsProvider } from './beads.js';
import { GitHubProvider } from './github.js';
import { type LinearConfig, LinearProvider } from './linear.js';

export * from './base.js';
export * from './beads.js';
export * from './github.js';
export * from './linear.js';

export interface TriageConnectorsConfig {
    provider: 'github' | 'linear' | 'beads';
    github?: {
        owner?: string;
        repo?: string;
    };
    linear?: LinearConfig;
    beads?: {
        root?: string;
    };
}

export class TriageConnectors {
    private provider: TriageProvider;

    constructor(config: TriageConnectorsConfig) {
        switch (config.provider) {
            case 'linear':
                if (!config.linear) {
                    throw new Error('Linear configuration is required for linear provider');
                }
                this.provider = new LinearProvider(config.linear);
                break;
            case 'github':
                this.provider = new GitHubProvider(config.github || {});
                break;
            case 'beads':
                this.provider = new BeadsProvider(config.beads || {});
                break;
            default:
                throw new Error(`Unsupported provider: ${config.provider}`);
        }
    }

    getProvider(): TriageProvider {
        return this.provider;
    }

    // Proxy methods for convenience
    async listIssues(filters?: any) {
        return this.provider.listIssues(filters);
    }

    async getIssue(id: string) {
        return this.provider.getIssue(id);
    }

    async createIssue(issue: any) {
        return this.provider.createIssue(issue);
    }

    async updateIssue(id: string, updates: any) {
        return this.provider.updateIssue(id, updates);
    }

    async searchIssues(query: string) {
        return this.provider.searchIssues(query);
    }
}

let _connectors: TriageConnectors | null = null;

export function setTriageConnectors(connectors: TriageConnectors) {
    _connectors = connectors;
}

export function getTriageConnectors(): TriageConnectors {
    if (!_connectors) {
        // Default to GitHub if not set, for backward compatibility
        _connectors = new TriageConnectors({ provider: 'github' });
    }
    return _connectors;
}
