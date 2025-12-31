// src/sage.ts
import { sage, decomposeTask, routeToAgent, unblock } from "@agentic/triage-core";
var SageBot = class {
  name = "sage";
  triggers = ["@sage", "/sage"];
  async handle(ctx) {
    if (!ctx.query) {
      return {
        body: `\u{1F52E} **@sage** - How can I help?

Usage:
- \`@sage <question>\` - Ask a question
- \`@sage decompose <task>\` - Break down a task
- \`@sage route <task>\` - Get agent recommendation
- \`@sage unblock <blocker>\` - Get help with a blocker`,
        handled: true,
        postComment: true
      };
    }
    const query = ctx.query.toLowerCase();
    try {
      let result;
      let responseBody;
      if (query.startsWith("decompose ")) {
        const task = ctx.query.replace(/^decompose\s+/i, "");
        if (ctx.model) {
          result = await decomposeTask(task, ctx.model);
          responseBody = this.formatDecomposition(result);
        } else {
          responseBody = "\u274C No AI model configured for decomposition";
        }
      } else if (query.startsWith("route ")) {
        const task = ctx.query.replace(/^route\s+/i, "");
        if (ctx.model) {
          result = await routeToAgent(task, ctx.model);
          responseBody = this.formatRouting(result);
        } else {
          responseBody = "\u274C No AI model configured for routing";
        }
      } else if (query.startsWith("unblock ")) {
        const blocker = ctx.query.replace(/^unblock\s+/i, "");
        if (ctx.model) {
          result = await unblock(blocker, ctx.model);
          responseBody = this.formatUnblock(result);
        } else {
          responseBody = "\u274C No AI model configured for unblock";
        }
      } else {
        if (ctx.model) {
          result = await sage(ctx.query, ctx.model);
          responseBody = this.formatAnswer(result);
        } else {
          responseBody = this.patternBasedResponse(ctx.query);
        }
      }
      return {
        body: responseBody,
        handled: true,
        postComment: true
      };
    } catch (error) {
      return {
        body: `\u274C **@sage** error: ${error instanceof Error ? error.message : "Unknown error"}`,
        handled: true,
        postComment: true,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  formatAnswer(result) {
    let body = `\u{1F52E} **@sage**

${result.answer || result}`;
    if (result.agentRecommendation) {
      body += `

\u{1F4CC} **Recommended**: \`@${result.agentRecommendation.agent}\``;
      body += `
_${result.agentRecommendation.reason}_`;
    }
    if (result.confidence) {
      body += `

_(Confidence: ${Math.round(result.confidence * 100)}%)_`;
    }
    return body;
  }
  formatDecomposition(result) {
    let body = "\u{1F4CB} **@sage** Task Decomposition\n\n";
    if (result.subtasks) {
      for (const task of result.subtasks) {
        body += `### ${task.id}: ${task.title}
`;
        body += `- **Agent**: \`@${task.agent}\`
`;
        body += `- **Priority**: ${task.priority}
`;
        body += `- **Effort**: ${task.effort}
`;
        body += `- ${task.description}

`;
      }
    }
    return body;
  }
  formatRouting(result) {
    let body = "\u{1F3AF} **@sage** Agent Routing\n\n";
    body += `**Recommended Agent**: \`@${result.agent}\`

`;
    body += `**Reason**: ${result.reason}

`;
    body += `**Instructions**: ${result.instructions}

`;
    body += `_(Confidence: ${Math.round(result.confidence * 100)}%)_`;
    return body;
  }
  formatUnblock(result) {
    let body = "\u{1F513} **@sage** Unblock Analysis\n\n";
    body += `**Diagnosis**: ${result.diagnosis}

`;
    body += `**Root Cause**: ${result.rootCause}

`;
    body += `\u26A1 **Immediate Action**: ${result.immediateAction}

`;
    if (result.needsHuman) {
      body += `\u26A0\uFE0F **Human intervention required**: ${result.escalationReason}
`;
    }
    return body;
  }
  patternBasedResponse(query) {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes("how") && lowerQuery.includes("test")) {
      return `\u{1F52E} **@sage**

To run tests, typically use:
- \`npm test\` or \`pnpm test\` for Node.js
- \`pytest\` for Python
- \`go test ./...\` for Go

Check the project's README or package.json for specific test commands.`;
    }
    if (lowerQuery.includes("deploy") || lowerQuery.includes("release")) {
      return `\u{1F52E} **@sage**

For deployments:
1. Ensure all tests pass
2. Update version using conventional commits
3. Create a release PR
4. Merge and let CI handle the release

Check \`.github/workflows/\` for specific deployment workflows.`;
    }
    return `\u{1F52E} **@sage**

I can help with:
- \`@sage <question>\` - Ask me anything
- \`@sage decompose <task>\` - Break down into subtasks
- \`@sage route <task>\` - Get the best agent for the job
- \`@sage unblock <issue>\` - Get help with blockers

_(AI-powered responses require model configuration)_`;
  }
};

export {
  SageBot
};
//# sourceMappingURL=chunk-WGGFDYDD.js.map