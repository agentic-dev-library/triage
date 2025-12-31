import { z } from 'zod';

declare const IssueStatusSchema: z.ZodEnum<{
    open: "open";
    in_progress: "in_progress";
    blocked: "blocked";
    closed: "closed";
}>;
declare const IssuePrioritySchema: z.ZodEnum<{
    critical: "critical";
    high: "high";
    medium: "medium";
    low: "low";
    backlog: "backlog";
}>;
declare const IssueTypeSchema: z.ZodEnum<{
    bug: "bug";
    feature: "feature";
    task: "task";
    epic: "epic";
    chore: "chore";
    docs: "docs";
}>;
declare const IssueTriageSchema: z.ZodObject<{
    title: z.ZodString;
    summary: z.ZodString;
    type: z.ZodEnum<{
        bug: "bug";
        feature: "feature";
        task: "task";
        epic: "epic";
        chore: "chore";
        docs: "docs";
    }>;
    priority: z.ZodEnum<{
        critical: "critical";
        high: "high";
        medium: "medium";
        low: "low";
        backlog: "backlog";
    }>;
    labels: z.ZodArray<z.ZodString>;
    estimate: z.ZodOptional<z.ZodNumber>;
    actionItems: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
type IssueTriage = z.infer<typeof IssueTriageSchema>;

declare const PRAnalysisSchema: z.ZodObject<{
    title: z.ZodString;
    summary: z.ZodString;
    scope: z.ZodEnum<{
        minor: "minor";
        major: "major";
        patch: "patch";
        breaking: "breaking";
    }>;
    riskLevel: z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
    }>;
    testingCoverage: z.ZodEnum<{
        none: "none";
        partial: "partial";
        full: "full";
    }>;
    breakingChanges: z.ZodArray<z.ZodString>;
    relatedIssues: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
type PRAnalysis = z.infer<typeof PRAnalysisSchema>;

declare const ReviewImpactSchema: z.ZodEnum<{
    critical: "critical";
    high: "high";
    medium: "medium";
    low: "low";
}>;
declare const CodeReviewCommentSchema: z.ZodObject<{
    file: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    content: z.ZodString;
    type: z.ZodEnum<{
        suggestion: "suggestion";
        issue: "issue";
        question: "question";
        praise: "praise";
    }>;
    severity: z.ZodOptional<z.ZodEnum<{
        high: "high";
        medium: "medium";
        low: "low";
    }>>;
}, z.core.$strip>;
declare const CodeReviewSchema: z.ZodObject<{
    summary: z.ZodString;
    status: z.ZodEnum<{
        approve: "approve";
        request_changes: "request_changes";
        comment: "comment";
    }>;
    comments: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        content: z.ZodString;
        type: z.ZodEnum<{
            suggestion: "suggestion";
            issue: "issue";
            question: "question";
            praise: "praise";
        }>;
        severity: z.ZodOptional<z.ZodEnum<{
            high: "high";
            medium: "medium";
            low: "low";
        }>>;
    }, z.core.$strip>>;
    impact: z.ZodEnum<{
        critical: "critical";
        high: "high";
        medium: "medium";
        low: "low";
    }>;
    suggestedLabels: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
type CodeReview = z.infer<typeof CodeReviewSchema>;
type CodeReviewComment = z.infer<typeof CodeReviewCommentSchema>;

/**
 * Query types that Sage can handle
 */
declare const SageQueryTypeSchema: z.ZodEnum<{
    question: "question";
    review: "review";
    fix: "fix";
    implement: "implement";
    refactor: "refactor";
    decompose: "decompose";
    unblock: "unblock";
    route: "route";
    general: "general";
}>;
type SageQueryType = z.infer<typeof SageQueryTypeSchema>;
/**
 * Agent types for task routing
 */
declare const AgentTypeSchema: z.ZodEnum<{
    cursor: "cursor";
    jules: "jules";
    ollama: "ollama";
    claude: "claude";
    human: "human";
}>;
type AgentType = z.infer<typeof AgentTypeSchema>;
/**
 * Common effort levels for tasks and suggestions
 */
declare const EffortSchema: z.ZodEnum<{
    medium: "medium";
    epic: "epic";
    trivial: "trivial";
    small: "small";
    large: "large";
}>;
type Effort = z.infer<typeof EffortSchema>;
/**
 * Schema for Sage Q&A responses
 */
declare const SageResponseSchema: z.ZodObject<{
    answer: z.ZodString;
    queryType: z.ZodEnum<{
        question: "question";
        review: "review";
        fix: "fix";
        implement: "implement";
        refactor: "refactor";
        decompose: "decompose";
        unblock: "unblock";
        route: "route";
        general: "general";
    }>;
    confidence: z.ZodNumber;
    references: z.ZodOptional<z.ZodArray<z.ZodString>>;
    followUp: z.ZodOptional<z.ZodString>;
    agentRecommendation: z.ZodOptional<z.ZodObject<{
        agent: z.ZodEnum<{
            cursor: "cursor";
            jules: "jules";
            ollama: "ollama";
            claude: "claude";
            human: "human";
        }>;
        reason: z.ZodString;
        instructions: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type SageResponse = z.infer<typeof SageResponseSchema>;
/**
 * Schema for task decomposition
 */
declare const SubtaskSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    agent: z.ZodEnum<{
        cursor: "cursor";
        jules: "jules";
        ollama: "ollama";
        claude: "claude";
        human: "human";
    }>;
    priority: z.ZodNumber;
    effort: z.ZodEnum<{
        medium: "medium";
        epic: "epic";
        trivial: "trivial";
        small: "small";
        large: "large";
    }>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type Subtask = z.infer<typeof SubtaskSchema>;
declare const TaskDecompositionSchema: z.ZodObject<{
    originalTask: z.ZodString;
    subtasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        agent: z.ZodEnum<{
            cursor: "cursor";
            jules: "jules";
            ollama: "ollama";
            claude: "claude";
            human: "human";
        }>;
        priority: z.ZodNumber;
        effort: z.ZodEnum<{
            medium: "medium";
            epic: "epic";
            trivial: "trivial";
            small: "small";
            large: "large";
        }>;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    executionOrder: z.ZodOptional<z.ZodArray<z.ZodString>>;
    estimatedTotalEffort: z.ZodEnum<{
        medium: "medium";
        epic: "epic";
        trivial: "trivial";
        small: "small";
        large: "large";
    }>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type TaskDecomposition = z.infer<typeof TaskDecompositionSchema>;
/**
 * Schema for agent routing decisions
 */
declare const AgentRoutingSchema: z.ZodObject<{
    agent: z.ZodEnum<{
        cursor: "cursor";
        jules: "jules";
        ollama: "ollama";
        claude: "claude";
        human: "human";
    }>;
    reason: z.ZodString;
    instructions: z.ZodString;
    confidence: z.ZodNumber;
    alternatives: z.ZodOptional<z.ZodArray<z.ZodObject<{
        agent: z.ZodEnum<{
            cursor: "cursor";
            jules: "jules";
            ollama: "ollama";
            claude: "claude";
            human: "human";
        }>;
        reason: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
type AgentRouting = z.infer<typeof AgentRoutingSchema>;
/**
 * Schema for unblocking stuck work
 */
declare const UnblockResponseSchema: z.ZodObject<{
    diagnosis: z.ZodString;
    rootCause: z.ZodString;
    suggestions: z.ZodArray<z.ZodObject<{
        action: z.ZodString;
        effort: z.ZodEnum<{
            medium: "medium";
            epic: "epic";
            trivial: "trivial";
            small: "small";
            large: "large";
        }>;
        likelihood: z.ZodNumber;
    }, z.core.$strip>>;
    immediateAction: z.ZodString;
    needsHuman: z.ZodBoolean;
    escalationReason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type UnblockResponse = z.infer<typeof UnblockResponseSchema>;

export { AgentTypeSchema as A, CodeReviewCommentSchema as C, EffortSchema as E, IssueStatusSchema as I, PRAnalysisSchema as P, ReviewImpactSchema as R, SageQueryTypeSchema as S, TaskDecompositionSchema as T, UnblockResponseSchema as U, IssuePrioritySchema as a, IssueTypeSchema as b, IssueTriageSchema as c, type IssueTriage as d, type PRAnalysis as e, CodeReviewSchema as f, type CodeReview as g, type CodeReviewComment as h, type SageQueryType as i, type AgentType as j, type Effort as k, SageResponseSchema as l, type SageResponse as m, SubtaskSchema as n, type Subtask as o, type TaskDecomposition as p, AgentRoutingSchema as q, type AgentRouting as r, type UnblockResponse as s };
