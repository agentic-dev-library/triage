import {
  TriageConnectors,
  handleAnalyzePR,
  handleGetIssue,
  handleListIssues,
  handleSubmitReview,
  handleTriageIssue,
  sage
} from "./chunk-N3WUYPZK.js";
import {
  CodeReviewSchema,
  IssueTriageSchema,
  PRAnalysisSchema
} from "./chunk-CCUCZVAV.js";

// src/tools/issue.ts
import { tool } from "ai";
import { z } from "zod";
var listIssuesTool = tool({
  description: "List issues from the issue tracker with optional filters.",
  inputSchema: z.object({
    status: z.enum(["open", "in_progress", "blocked", "closed"]).optional(),
    priority: z.enum(["critical", "high", "medium", "low", "backlog"]).optional(),
    type: z.enum(["bug", "feature", "task", "epic", "chore", "docs"]).optional(),
    labels: z.array(z.string()).optional(),
    limit: z.number().optional(),
    assignee: z.string().optional()
  }),
  execute: async (args) => handleListIssues(args)
});
var getIssueTool = tool({
  description: "Get detailed issue by ID.",
  inputSchema: z.object({
    id: z.string().describe("The issue ID")
  }),
  execute: async ({ id }) => handleGetIssue(id)
});
var createIssueTool = tool({
  description: "Create a new issue in the issue tracker.",
  inputSchema: z.object({
    title: z.string().describe("Issue title"),
    description: z.string().optional().describe("Issue description/body"),
    type: z.enum(["bug", "feature", "task", "epic", "chore", "docs"]).optional().default("task"),
    priority: z.enum(["critical", "high", "medium", "low", "backlog"]).optional().default("medium"),
    labels: z.array(z.string()).optional(),
    assignee: z.string().optional()
  }),
  execute: async (options) => {
    const connectors = new TriageConnectors();
    return connectors.issues.create(options);
  }
});
var updateIssueTool = tool({
  description: "Update issue fields.",
  inputSchema: z.object({
    id: z.string().describe("The issue ID to update"),
    updates: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["open", "in_progress", "blocked", "closed"]).optional(),
      priority: z.enum(["critical", "high", "medium", "low", "backlog"]).optional(),
      type: z.enum(["bug", "feature", "task", "epic", "chore", "docs"]).optional(),
      assignee: z.string().optional()
    })
  }),
  execute: async ({ id, updates }) => {
    const connectors = new TriageConnectors();
    return connectors.issues.update(id, updates);
  }
});
var triageIssueTool = tool({
  description: "Apply structured triage analysis to an issue (title, priority, type, labels, etc.)",
  inputSchema: z.object({
    id: z.string().describe("The issue ID to triage"),
    analysis: IssueTriageSchema
  }),
  execute: async ({ id, analysis }) => handleTriageIssue(id, analysis)
});
var closeIssueTool = tool({
  description: "Close issue with reason.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the issue to close."),
    reason: z.string().optional().describe("Optional reason for closing.")
  }),
  execute: async ({ id, reason }) => {
    const connectors = new TriageConnectors();
    return connectors.issues.close(id, reason);
  }
});
var searchIssuesTool = tool({
  description: "Full-text search across issues.",
  inputSchema: z.object({
    query: z.string().describe("The search query.")
  }),
  execute: async ({ query }) => {
    const connectors = new TriageConnectors();
    return connectors.issues.search(query);
  }
});
var addLabelsTool = tool({
  description: "Add labels to an issue.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the issue."),
    labels: z.array(z.string()).describe("The labels to add.")
  }),
  execute: async ({ id, labels }) => {
    const connectors = new TriageConnectors();
    await connectors.issues.addLabels(id, labels);
    return { id, labelsAdded: labels };
  }
});
var removeLabelsTool = tool({
  description: "Remove labels from an issue.",
  inputSchema: z.object({
    id: z.string().describe("The ID of the issue."),
    labels: z.array(z.string()).describe("The labels to remove.")
  }),
  execute: async ({ id, labels }) => {
    const connectors = new TriageConnectors();
    await connectors.issues.removeLabels(id, labels);
    return { id, labelsRemoved: labels };
  }
});

// src/tools/pr.ts
import { tool as tool2 } from "ai";
import { z as z2 } from "zod";
var analyzePRTool = tool2({
  description: "Submit a structured analysis of a pull request",
  inputSchema: z2.object({
    prNumber: z2.number().describe("The pull request number"),
    analysis: PRAnalysisSchema
  }),
  execute: async ({ prNumber, analysis }) => handleAnalyzePR(prNumber, analysis)
});

// src/tools/review.ts
import { tool as tool3 } from "ai";
import { z as z3 } from "zod";
var submitReviewTool = tool3({
  description: "Submit a structured code review for a pull request",
  inputSchema: z3.object({
    prNumber: z3.number().describe("The pull request number"),
    review: CodeReviewSchema
  }),
  execute: async ({ prNumber, review }) => handleSubmitReview(prNumber, review)
});

// src/tools/sage.ts
import { z as z4 } from "zod";
import { createTool, resolveModel } from "@agentic/triage-ai";
var sageTool = createTool({
  description: "Ask Sage for technical advice, task decomposition, or agent routing based on repository context.",
  inputSchema: z4.object({
    query: z4.string().describe("The question or request for Sage"),
    context: z4.object({
      repoStructure: z4.string().optional().describe("Repository file structure"),
      keyFiles: z4.record(z4.string(), z4.string()).optional().describe("Contents of key files"),
      issueContext: z4.string().optional().describe("Context from a GitHub issue or PR"),
      currentContext: z4.string().optional().describe("Current working context")
    }).optional()
  }),
  execute: async ({ query, context }) => {
    const { model } = await resolveModel({});
    return await sage(query, model, context);
  }
});

// src/tools/visual.ts
import { chromium } from "@playwright/test";
import { z as z5 } from "zod";
import { createTool as createTool2 } from "@agentic/triage-ai";
var visualReviewTool = createTool2({
  description: "Perform a visual review of a web page using Playwright and AI analysis.",
  inputSchema: z5.object({
    url: z5.string().describe("The URL of the page to review"),
    scenario: z5.string().optional().describe("Description of the scenario to test"),
    viewport: z5.object({
      width: z5.number().default(1280),
      height: z5.number().default(720)
    }).optional()
  }),
  execute: async ({ url, scenario, viewport }) => {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: viewport || { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    try {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: "networkidle" });
      if (scenario) {
        console.log(`Executing scenario: ${scenario}`);
      }
      await page.screenshot({ fullPage: true });
      return {
        url,
        status: "success",
        screenshotTaken: true,
        analysis: "Visual review capability established. Ready for AI image analysis integration."
      };
    } catch (error) {
      return {
        url,
        status: "error",
        message: error.message
      };
    } finally {
      await browser.close();
    }
  }
});

// src/tools/index.ts
var triageTools = {
  listIssues: listIssuesTool,
  getIssue: getIssueTool,
  createIssue: createIssueTool,
  updateIssue: updateIssueTool,
  closeIssue: closeIssueTool,
  searchIssues: searchIssuesTool,
  addLabels: addLabelsTool,
  removeLabels: removeLabelsTool,
  triageIssue: triageIssueTool,
  submitReview: submitReviewTool,
  analyzePR: analyzePRTool,
  sage: sageTool,
  visualReview: visualReviewTool
};
function getTriageTools() {
  return triageTools;
}

export {
  listIssuesTool,
  getIssueTool,
  createIssueTool,
  updateIssueTool,
  triageIssueTool,
  closeIssueTool,
  searchIssuesTool,
  addLabelsTool,
  removeLabelsTool,
  analyzePRTool,
  submitReviewTool,
  sageTool,
  visualReviewTool,
  triageTools,
  getTriageTools
};
//# sourceMappingURL=chunk-IUH563A4.js.map