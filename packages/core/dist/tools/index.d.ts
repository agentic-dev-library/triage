import * as ai from 'ai';
import * as _agentic_triage_trackers from '@agentic/triage-trackers';

declare const listIssuesTool: ai.Tool<{
    status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
    priority?: "critical" | "high" | "medium" | "low" | "backlog" | undefined;
    type?: "bug" | "feature" | "task" | "epic" | "chore" | "docs" | undefined;
    labels?: string[] | undefined;
    limit?: number | undefined;
    assignee?: string | undefined;
}, _agentic_triage_trackers.TriageIssue[]>;
declare const getIssueTool: ai.Tool<{
    id: string;
}, _agentic_triage_trackers.TriageIssue | null>;
declare const createIssueTool: ai.Tool<{
    title: string;
    type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
    priority: "critical" | "high" | "medium" | "low" | "backlog";
    description?: string | undefined;
    labels?: string[] | undefined;
    assignee?: string | undefined;
}, _agentic_triage_trackers.TriageIssue>;
declare const updateIssueTool: ai.Tool<{
    id: string;
    updates: {
        title?: string | undefined;
        description?: string | undefined;
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        priority?: "critical" | "high" | "medium" | "low" | "backlog" | undefined;
        type?: "bug" | "feature" | "task" | "epic" | "chore" | "docs" | undefined;
        assignee?: string | undefined;
    };
}, _agentic_triage_trackers.TriageIssue>;
declare const triageIssueTool: ai.Tool<{
    id: string;
    analysis: {
        title: string;
        summary: string;
        type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
        priority: "critical" | "high" | "medium" | "low" | "backlog";
        labels: string[];
        actionItems: string[];
        estimate?: number | undefined;
    };
}, {
    success: boolean;
    message: string;
    analysis: {
        title: string;
        summary: string;
        type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
        priority: "critical" | "high" | "medium" | "low" | "backlog";
        labels: string[];
        actionItems: string[];
        estimate?: number | undefined;
    };
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    analysis?: undefined;
}>;
declare const closeIssueTool: ai.Tool<{
    id: string;
    reason?: string | undefined;
}, _agentic_triage_trackers.TriageIssue>;
declare const searchIssuesTool: ai.Tool<{
    query: string;
}, _agentic_triage_trackers.TriageIssue[]>;
declare const addLabelsTool: ai.Tool<{
    id: string;
    labels: string[];
}, {
    id: string;
    labelsAdded: string[];
}>;
declare const removeLabelsTool: ai.Tool<{
    id: string;
    labels: string[];
}, {
    id: string;
    labelsRemoved: string[];
}>;

declare const analyzePRTool: ai.Tool<{
    prNumber: number;
    analysis: {
        title: string;
        summary: string;
        scope: "minor" | "major" | "patch" | "breaking";
        riskLevel: "high" | "medium" | "low";
        testingCoverage: "none" | "partial" | "full";
        breakingChanges: string[];
        relatedIssues: string[];
    };
}, {
    success: boolean;
    message: string;
    analysis: {
        title: string;
        summary: string;
        scope: "minor" | "major" | "patch" | "breaking";
        riskLevel: "high" | "medium" | "low";
        testingCoverage: "none" | "partial" | "full";
        breakingChanges: string[];
        relatedIssues: string[];
    };
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    analysis?: undefined;
}>;

declare const submitReviewTool: ai.Tool<{
    prNumber: number;
    review: {
        summary: string;
        status: "approve" | "request_changes" | "comment";
        comments: {
            file: string;
            content: string;
            type: "suggestion" | "issue" | "question" | "praise";
            line?: number | undefined;
            severity?: "high" | "medium" | "low" | undefined;
        }[];
        impact: "critical" | "high" | "medium" | "low";
        suggestedLabels: string[];
    };
}, {
    success: boolean;
    message: string;
    review: {
        summary: string;
        status: "approve" | "request_changes" | "comment";
        comments: {
            file: string;
            content: string;
            type: "suggestion" | "issue" | "question" | "praise";
            line?: number | undefined;
            severity?: "high" | "medium" | "low" | undefined;
        }[];
        impact: "critical" | "high" | "medium" | "low";
        suggestedLabels: string[];
    };
    error?: undefined;
} | {
    success: boolean;
    message: string;
    error: unknown;
    review?: undefined;
}>;

declare const sageTool: any;

declare const visualReviewTool: any;

declare const triageTools: {
    listIssues: ai.Tool<{
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        priority?: "critical" | "high" | "medium" | "low" | "backlog" | undefined;
        type?: "bug" | "feature" | "task" | "epic" | "chore" | "docs" | undefined;
        labels?: string[] | undefined;
        limit?: number | undefined;
        assignee?: string | undefined;
    }, _agentic_triage_trackers.TriageIssue[]>;
    getIssue: ai.Tool<{
        id: string;
    }, _agentic_triage_trackers.TriageIssue | null>;
    createIssue: ai.Tool<{
        title: string;
        type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
        priority: "critical" | "high" | "medium" | "low" | "backlog";
        description?: string | undefined;
        labels?: string[] | undefined;
        assignee?: string | undefined;
    }, _agentic_triage_trackers.TriageIssue>;
    updateIssue: ai.Tool<{
        id: string;
        updates: {
            title?: string | undefined;
            description?: string | undefined;
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            priority?: "critical" | "high" | "medium" | "low" | "backlog" | undefined;
            type?: "bug" | "feature" | "task" | "epic" | "chore" | "docs" | undefined;
            assignee?: string | undefined;
        };
    }, _agentic_triage_trackers.TriageIssue>;
    closeIssue: ai.Tool<{
        id: string;
        reason?: string | undefined;
    }, _agentic_triage_trackers.TriageIssue>;
    searchIssues: ai.Tool<{
        query: string;
    }, _agentic_triage_trackers.TriageIssue[]>;
    addLabels: ai.Tool<{
        id: string;
        labels: string[];
    }, {
        id: string;
        labelsAdded: string[];
    }>;
    removeLabels: ai.Tool<{
        id: string;
        labels: string[];
    }, {
        id: string;
        labelsRemoved: string[];
    }>;
    triageIssue: ai.Tool<{
        id: string;
        analysis: {
            title: string;
            summary: string;
            type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
            priority: "critical" | "high" | "medium" | "low" | "backlog";
            labels: string[];
            actionItems: string[];
            estimate?: number | undefined;
        };
    }, {
        success: boolean;
        message: string;
        analysis: {
            title: string;
            summary: string;
            type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
            priority: "critical" | "high" | "medium" | "low" | "backlog";
            labels: string[];
            actionItems: string[];
            estimate?: number | undefined;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: unknown;
        analysis?: undefined;
    }>;
    submitReview: ai.Tool<{
        prNumber: number;
        review: {
            summary: string;
            status: "approve" | "request_changes" | "comment";
            comments: {
                file: string;
                content: string;
                type: "suggestion" | "issue" | "question" | "praise";
                line?: number | undefined;
                severity?: "high" | "medium" | "low" | undefined;
            }[];
            impact: "critical" | "high" | "medium" | "low";
            suggestedLabels: string[];
        };
    }, {
        success: boolean;
        message: string;
        review: {
            summary: string;
            status: "approve" | "request_changes" | "comment";
            comments: {
                file: string;
                content: string;
                type: "suggestion" | "issue" | "question" | "praise";
                line?: number | undefined;
                severity?: "high" | "medium" | "low" | undefined;
            }[];
            impact: "critical" | "high" | "medium" | "low";
            suggestedLabels: string[];
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: unknown;
        review?: undefined;
    }>;
    analyzePR: ai.Tool<{
        prNumber: number;
        analysis: {
            title: string;
            summary: string;
            scope: "minor" | "major" | "patch" | "breaking";
            riskLevel: "high" | "medium" | "low";
            testingCoverage: "none" | "partial" | "full";
            breakingChanges: string[];
            relatedIssues: string[];
        };
    }, {
        success: boolean;
        message: string;
        analysis: {
            title: string;
            summary: string;
            scope: "minor" | "major" | "patch" | "breaking";
            riskLevel: "high" | "medium" | "low";
            testingCoverage: "none" | "partial" | "full";
            breakingChanges: string[];
            relatedIssues: string[];
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: unknown;
        analysis?: undefined;
    }>;
    sage: any;
    visualReview: any;
};
declare function getTriageTools(): {
    listIssues: ai.Tool<{
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        priority?: "critical" | "high" | "medium" | "low" | "backlog" | undefined;
        type?: "bug" | "feature" | "task" | "epic" | "chore" | "docs" | undefined;
        labels?: string[] | undefined;
        limit?: number | undefined;
        assignee?: string | undefined;
    }, _agentic_triage_trackers.TriageIssue[]>;
    getIssue: ai.Tool<{
        id: string;
    }, _agentic_triage_trackers.TriageIssue | null>;
    createIssue: ai.Tool<{
        title: string;
        type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
        priority: "critical" | "high" | "medium" | "low" | "backlog";
        description?: string | undefined;
        labels?: string[] | undefined;
        assignee?: string | undefined;
    }, _agentic_triage_trackers.TriageIssue>;
    updateIssue: ai.Tool<{
        id: string;
        updates: {
            title?: string | undefined;
            description?: string | undefined;
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            priority?: "critical" | "high" | "medium" | "low" | "backlog" | undefined;
            type?: "bug" | "feature" | "task" | "epic" | "chore" | "docs" | undefined;
            assignee?: string | undefined;
        };
    }, _agentic_triage_trackers.TriageIssue>;
    closeIssue: ai.Tool<{
        id: string;
        reason?: string | undefined;
    }, _agentic_triage_trackers.TriageIssue>;
    searchIssues: ai.Tool<{
        query: string;
    }, _agentic_triage_trackers.TriageIssue[]>;
    addLabels: ai.Tool<{
        id: string;
        labels: string[];
    }, {
        id: string;
        labelsAdded: string[];
    }>;
    removeLabels: ai.Tool<{
        id: string;
        labels: string[];
    }, {
        id: string;
        labelsRemoved: string[];
    }>;
    triageIssue: ai.Tool<{
        id: string;
        analysis: {
            title: string;
            summary: string;
            type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
            priority: "critical" | "high" | "medium" | "low" | "backlog";
            labels: string[];
            actionItems: string[];
            estimate?: number | undefined;
        };
    }, {
        success: boolean;
        message: string;
        analysis: {
            title: string;
            summary: string;
            type: "bug" | "feature" | "task" | "epic" | "chore" | "docs";
            priority: "critical" | "high" | "medium" | "low" | "backlog";
            labels: string[];
            actionItems: string[];
            estimate?: number | undefined;
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: unknown;
        analysis?: undefined;
    }>;
    submitReview: ai.Tool<{
        prNumber: number;
        review: {
            summary: string;
            status: "approve" | "request_changes" | "comment";
            comments: {
                file: string;
                content: string;
                type: "suggestion" | "issue" | "question" | "praise";
                line?: number | undefined;
                severity?: "high" | "medium" | "low" | undefined;
            }[];
            impact: "critical" | "high" | "medium" | "low";
            suggestedLabels: string[];
        };
    }, {
        success: boolean;
        message: string;
        review: {
            summary: string;
            status: "approve" | "request_changes" | "comment";
            comments: {
                file: string;
                content: string;
                type: "suggestion" | "issue" | "question" | "praise";
                line?: number | undefined;
                severity?: "high" | "medium" | "low" | undefined;
            }[];
            impact: "critical" | "high" | "medium" | "low";
            suggestedLabels: string[];
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: unknown;
        review?: undefined;
    }>;
    analyzePR: ai.Tool<{
        prNumber: number;
        analysis: {
            title: string;
            summary: string;
            scope: "minor" | "major" | "patch" | "breaking";
            riskLevel: "high" | "medium" | "low";
            testingCoverage: "none" | "partial" | "full";
            breakingChanges: string[];
            relatedIssues: string[];
        };
    }, {
        success: boolean;
        message: string;
        analysis: {
            title: string;
            summary: string;
            scope: "minor" | "major" | "patch" | "breaking";
            riskLevel: "high" | "medium" | "low";
            testingCoverage: "none" | "partial" | "full";
            breakingChanges: string[];
            relatedIssues: string[];
        };
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: unknown;
        analysis?: undefined;
    }>;
    sage: any;
    visualReview: any;
};

export { addLabelsTool, analyzePRTool, closeIssueTool, createIssueTool, getIssueTool, getTriageTools, listIssuesTool, removeLabelsTool, sageTool, searchIssuesTool, submitReviewTool, triageIssueTool, triageTools, updateIssueTool, visualReviewTool };
