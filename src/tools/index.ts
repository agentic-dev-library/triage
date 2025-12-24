export * from './issue.js';
export * from './pr.js';
export * from './review.js';

import { getIssueTool, listIssuesTool, triageIssueTool } from './issue.js';
import { analyzePRTool } from './pr.js';
import { submitReviewTool } from './review.js';

export const triageTools = {
    listIssues: listIssuesTool,
    getIssue: getIssueTool,
    triageIssue: triageIssueTool,
    submitReview: submitReviewTool,
    analyzePR: analyzePRTool,
};

export function getTriageTools() {
    return triageTools;
}
