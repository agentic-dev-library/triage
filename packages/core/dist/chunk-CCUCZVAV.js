// src/schemas/issue.ts
import { z } from "zod";
var IssueStatusSchema = z.enum(["open", "in_progress", "blocked", "closed"]);
var IssuePrioritySchema = z.enum(["critical", "high", "medium", "low", "backlog"]);
var IssueTypeSchema = z.enum(["bug", "feature", "task", "epic", "chore", "docs"]);
var IssueTriageSchema = z.object({
  title: z.string().describe("The cleaned up or optimized title for the issue"),
  summary: z.string().describe("A concise summary of the issue"),
  type: IssueTypeSchema.describe("The categorized type of the issue"),
  priority: IssuePrioritySchema.describe("The determined priority based on impact and urgency"),
  labels: z.array(z.string()).describe("Recommended labels for the issue"),
  estimate: z.number().optional().describe("Optional story point estimate"),
  actionItems: z.array(z.string()).describe("Concrete next steps or requirements discovered from the issue description")
});

// src/schemas/pr.ts
import { z as z2 } from "zod";
var PRAnalysisSchema = z2.object({
  title: z2.string().describe("Suggested optimized title for the PR"),
  summary: z2.string().describe("Executive summary of the changes"),
  scope: z2.enum(["minor", "major", "patch", "breaking"]).describe("The scope/impact of the changes"),
  riskLevel: z2.enum(["low", "medium", "high"]).describe("Risk level of merging these changes"),
  testingCoverage: z2.enum(["none", "partial", "full"]).describe("Assessment of testing included"),
  breakingChanges: z2.array(z2.string()).describe("List of breaking changes identified"),
  relatedIssues: z2.array(z2.string()).describe("Identified related issue IDs or URLs")
});

// src/schemas/review.ts
import { z as z3 } from "zod";
var ReviewImpactSchema = z3.enum(["low", "medium", "high", "critical"]);
var CodeReviewCommentSchema = z3.object({
  file: z3.string().describe("The path to the file being commented on"),
  line: z3.number().optional().describe("The line number (optional)"),
  content: z3.string().describe("The review comment or feedback"),
  type: z3.enum(["suggestion", "issue", "question", "praise"]).describe("The type of comment"),
  severity: z3.enum(["low", "medium", "high"]).optional().describe("How critical this feedback is")
});
var CodeReviewSchema = z3.object({
  summary: z3.string().describe("Overall summary of the review"),
  status: z3.enum(["approve", "request_changes", "comment"]).describe("The review decision"),
  comments: z3.array(CodeReviewCommentSchema).describe("Individual review comments"),
  impact: ReviewImpactSchema.describe("Estimated impact of the changes"),
  suggestedLabels: z3.array(z3.string()).describe("Labels suggested based on the code changes")
});

// src/schemas/sage.ts
import { z as z4 } from "zod";
var SageQueryTypeSchema = z4.enum([
  "question",
  "review",
  "fix",
  "implement",
  "refactor",
  "decompose",
  "unblock",
  "route",
  "general"
]);
var AgentTypeSchema = z4.enum(["cursor", "jules", "ollama", "claude", "human"]);
var EffortSchema = z4.enum(["trivial", "small", "medium", "large", "epic"]);
var SageResponseSchema = z4.object({
  answer: z4.string().describe("The answer to the question or query"),
  queryType: SageQueryTypeSchema.describe("The classified type of the query"),
  confidence: z4.number().min(0).max(1).describe("Confidence level in the response (0-1)"),
  references: z4.array(z4.string()).optional().describe("File paths or documentation referenced in the answer"),
  followUp: z4.string().optional().describe("Suggested follow-up action or question"),
  agentRecommendation: z4.object({
    agent: AgentTypeSchema.describe("Recommended agent to handle follow-up work"),
    reason: z4.string().describe("Why this agent is recommended"),
    instructions: z4.string().optional().describe("Specific instructions for the agent")
  }).optional().describe("If the query requires action, which agent should handle it")
});
var SubtaskSchema = z4.object({
  id: z4.string().describe("Unique identifier for the subtask (e.g., task-001)"),
  title: z4.string().describe("Clear, actionable title for the subtask"),
  description: z4.string().describe("Detailed description of what needs to be done"),
  agent: AgentTypeSchema.describe("Which agent should handle this subtask"),
  priority: z4.number().min(1).max(10).describe("Priority from 1 (highest) to 10 (lowest)"),
  effort: EffortSchema.describe("Estimated effort level"),
  dependencies: z4.array(z4.string()).optional().describe("IDs of subtasks this depends on")
});
var TaskDecompositionSchema = z4.object({
  originalTask: z4.string().describe("The original task that was decomposed"),
  subtasks: z4.array(SubtaskSchema).describe("List of subtasks to complete"),
  executionOrder: z4.array(z4.string()).optional().describe("Recommended order to execute subtasks by ID"),
  estimatedTotalEffort: EffortSchema.describe("Total estimated effort for all subtasks"),
  notes: z4.string().optional().describe("Additional notes or considerations")
});
var AgentRoutingSchema = z4.object({
  agent: AgentTypeSchema.describe("The recommended agent to handle the task"),
  reason: z4.string().describe("Why this agent was chosen"),
  instructions: z4.string().describe("Specific instructions for the agent"),
  confidence: z4.number().min(0).max(1).describe("Confidence in the routing decision"),
  alternatives: z4.array(
    z4.object({
      agent: AgentTypeSchema,
      reason: z4.string()
    })
  ).optional().describe("Alternative agents that could handle the task")
});
var UnblockResponseSchema = z4.object({
  diagnosis: z4.string().describe("Analysis of what is blocking progress"),
  rootCause: z4.string().describe("The underlying root cause of the blockage"),
  suggestions: z4.array(
    z4.object({
      action: z4.string().describe("Specific action to take"),
      effort: EffortSchema,
      likelihood: z4.number().min(0).max(1).describe("Likelihood this will unblock")
    })
  ).describe("Ordered list of suggestions to unblock"),
  immediateAction: z4.string().describe("The single most important thing to do right now"),
  needsHuman: z4.boolean().describe("Whether human intervention is required"),
  escalationReason: z4.string().optional().describe("If needs human, why escalation is needed")
});

// src/schemas/triage.ts
import { z as z5 } from "zod";
var triageAnalysisSchema = z5.object({
  issueAnalysis: IssueTriageSchema.optional().describe("Analysis of the issue."),
  codeReview: CodeReviewSchema.optional().describe("Code review of the pull request."),
  triage: z5.string().describe("The overall triage assessment.")
});

export {
  IssueStatusSchema,
  IssuePrioritySchema,
  IssueTypeSchema,
  IssueTriageSchema,
  PRAnalysisSchema,
  ReviewImpactSchema,
  CodeReviewCommentSchema,
  CodeReviewSchema,
  SageQueryTypeSchema,
  AgentTypeSchema,
  EffortSchema,
  SageResponseSchema,
  SubtaskSchema,
  TaskDecompositionSchema,
  AgentRoutingSchema,
  UnblockResponseSchema,
  triageAnalysisSchema
};
//# sourceMappingURL=chunk-CCUCZVAV.js.map