import type { TriageIssue, TriageProvider } from './base.js';

export class BeadsProvider implements TriageProvider {
    private root?: string;

    constructor(config: { root?: string } = {}) {
        this.root = config.root;
    }

    async listIssues(_filters?: any): Promise<TriageIssue[]> {
        return [];
    }

    async getIssue(_id: string): Promise<TriageIssue> {
        throw new Error('Beads provider not implemented');
    }

    async createIssue(_issue: any): Promise<TriageIssue> {
        throw new Error('Beads provider not implemented');
    }

    async updateIssue(_id: string, _updates: any): Promise<TriageIssue> {
        throw new Error('Beads provider not implemented');
    }

    async searchIssues(_query: string): Promise<TriageIssue[]> {
        return [];
    }
}
