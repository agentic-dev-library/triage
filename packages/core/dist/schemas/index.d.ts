export { r as AgentRouting, q as AgentRoutingSchema, j as AgentType, A as AgentTypeSchema, g as CodeReview, h as CodeReviewComment, C as CodeReviewCommentSchema, f as CodeReviewSchema, k as Effort, E as EffortSchema, a as IssuePrioritySchema, I as IssueStatusSchema, d as IssueTriage, c as IssueTriageSchema, b as IssueTypeSchema, e as PRAnalysis, P as PRAnalysisSchema, R as ReviewImpactSchema, i as SageQueryType, S as SageQueryTypeSchema, m as SageResponse, l as SageResponseSchema, o as Subtask, n as SubtaskSchema, p as TaskDecomposition, T as TaskDecompositionSchema, s as UnblockResponse, U as UnblockResponseSchema } from '../sage-bwR_8Nd9.js';
import { z } from 'zod';

declare const triageAnalysisSchema: z.ZodObject<{
    issueAnalysis: z.ZodOptional<z.ZodObject<{
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
    }, z.core.$strip>>;
    codeReview: z.ZodOptional<z.ZodObject<{
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
    }, z.core.$strip>>;
    triage: z.ZodString;
}, z.core.$strip>;

export { triageAnalysisSchema };
