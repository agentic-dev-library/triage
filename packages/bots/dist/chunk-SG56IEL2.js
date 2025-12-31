// src/curator.ts
var CuratorBot = class {
  name = "curator";
  triggers = ["@curator", "/curator", "/triage"];
  async handle(ctx) {
    const analysis = this.analyzeContent(ctx.body, ctx.query);
    const body = this.formatAnalysis(analysis);
    return {
      body,
      handled: true,
      postComment: true,
      addLabels: analysis.labels
    };
  }
  analyzeContent(body, query) {
    const combined = `${body} ${query}`.toLowerCase();
    let type = "chore";
    let priority = "medium";
    let effort = "m";
    let agent = "ollama";
    const labels = [];
    if (combined.match(/bug|error|crash|broken|fix|issue|problem|fail/)) {
      type = "bug";
      labels.push("bug");
      priority = "high";
      agent = "cursor";
    } else if (combined.match(/feature|add|implement|create|new|enhance|request/)) {
      type = "feature";
      labels.push("enhancement");
      agent = "jules";
    } else if (combined.match(/question|how|what|why|help|confused|\?/)) {
      type = "question";
      labels.push("question");
      priority = "low";
      agent = "sage";
    } else if (combined.match(/doc|readme|typo|spelling|grammar/)) {
      type = "docs";
      labels.push("documentation");
      priority = "low";
      agent = "jules";
    } else if (combined.match(/refactor|clean|organize|improve|performance|optimize/)) {
      type = "chore";
      labels.push("refactor");
      agent = "jules";
    }
    if (combined.match(/urgent|critical|blocker|asap|production|breaking|p0|p1/)) {
      priority = "critical";
      labels.push("priority:critical");
    } else if (combined.match(/security|vulnerability|cve|exploit|auth|password/)) {
      priority = "critical";
      labels.push("security");
    } else if (combined.match(/important|high|soon|p2/)) {
      priority = "high";
      labels.push("priority:high");
    } else if (combined.match(/low|minor|nice.to.have|p3|p4/)) {
      priority = "low";
      labels.push("priority:low");
    }
    if (combined.match(/quick|simple|small|minor|trivial|one.line|typo/)) {
      effort = "xs";
      labels.push("good first issue");
    } else if (combined.match(/complex|large|major|overhaul|rewrite|epic/)) {
      effort = "xl";
      agent = "cursor";
    }
    return { type, priority, effort, agent, labels };
  }
  formatAnalysis(analysis) {
    const priorityEmoji = {
      critical: "\u{1F534}",
      high: "\u{1F7E0}",
      medium: "\u{1F7E1}",
      low: "\u26AA"
    };
    const typeEmoji = {
      bug: "\u{1F41B}",
      feature: "\u2728",
      question: "\u2753",
      docs: "\u{1F4DA}",
      chore: "\u{1F527}"
    };
    return `\u{1F4CB} **@curator** Triage

| Field | Value |
|-------|-------|
| Type | ${typeEmoji[analysis.type] || ""} \`${analysis.type}\` |
| Priority | ${priorityEmoji[analysis.priority] || ""} \`${analysis.priority}\` |
| Effort | \`${analysis.effort}\` |
| Agent | \`@${analysis.agent}\` |

---
_Use \`@${analysis.agent}\` to start work on this issue._`;
  }
};

export {
  CuratorBot
};
//# sourceMappingURL=chunk-SG56IEL2.js.map