import type { IssueTriage } from '../schemas/issue.js';
import { TriageConnectors } from '../triage/connectors.js';

let _connectors: TriageConnectors | null = null;

function getConnectors() {
    if (!_connectors) {
        _connectors = new TriageConnectors();
    }
    return _connectors;
}

/**
 * Handler for triaging an issue
 */
export async function handleTriageIssue(id: string, analysis: IssueTriage) {
    const connectors = getConnectors();

    // Update the issue with the analysis
    await connectors.issues.update(id, {
        title: analysis.title,
        priority: analysis.priority,
        type: analysis.type,
    });

    // Add labels
    if (analysis.labels.length > 0) {
        await connectors.issues.addLabels(id, analysis.labels);
    }

    return {
        success: true,
        message: `Issue ${id} triaged successfully`,
        analysis,
    };
}

/**
 * Handler for listing issues (from existing tools)
 */
export async function handleListIssues(filters: any) {
    const connectors = getConnectors();
    return connectors.issues.list(filters);
}

/**
 * Handler for getting an issue (from existing tools)
 */
export async function handleGetIssue(id: string) {
    const connectors = getConnectors();
    return connectors.issues.get(id);
}
