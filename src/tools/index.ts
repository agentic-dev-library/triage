import * as issueTools from './issue.js';
import * as reviewTools from './review.js';
import * as triageTools from './triage.js';

export * from './issue.js';
export * from './review.js';
export * from './triage.js';

/**
 * Get all issue management tools
 */
export function getIssueTools() {
    return {
        listIssues: issueTools.getIssueTool, // Just examples, should match AGENTS.md
        getIssue: issueTools.getIssueTool,
        createIssue: issueTools.createIssueTool,
        updateIssue: issueTools.updateIssueTool,
    };
}

/**
 * Get all review tools
 */
export function getReviewTools() {
    return {
        submitReview: reviewTools.submitCodeReviewTool,
    };
}

/**
 * Get all project/sprint tools
 */
export function getProjectTools() {
    return {
        // These will be implemented in a future PR or as stubs for now
        listSprints: triageTools.triageTool, // Placeholder
    };
}

/**
 * Get all triage tools (unified set)
 */
export function getTriageTools() {
    return {
        ...getIssueTools(),
        ...getReviewTools(),
        ...getProjectTools(),
        triage: triageTools.triageTool,
    };
}
