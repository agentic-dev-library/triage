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
    if (combined.includes("bug") || combined.includes("error") || combined.includes("crash") || combined.includes("broken") || combined.includes("fix") || combined.includes("issue") || combined.includes("problem") || combined.includes("fail")) {
      type = "bug";
      labels.push("bug");
      priority = "high";
      agent = "cursor";
    } else if (combined.includes("feature") || combined.includes("add") || combined.includes("implement") || combined.includes("create") || combined.includes("new") || combined.includes("enhance") || combined.includes("request")) {
      type = "feature";
      labels.push("enhancement");
      agent = "jules";
    } else if (combined.includes("question") || combined.includes("how") || combined.includes("what") || combined.includes("why") || combined.includes("help") || combined.includes("confused") || combined.includes("?")) {
      type = "question";
      labels.push("question");
      priority = "low";
      agent = "sage";
    } else if (combined.includes("doc") || combined.includes("readme") || combined.includes("typo") || combined.includes("spelling") || combined.includes("grammar")) {
      type = "docs";
      labels.push("documentation");
      priority = "low";
      agent = "jules";
    } else if (combined.includes("refactor") || combined.includes("clean") || combined.includes("organize") || combined.includes("improve") || combined.includes("performance") || combined.includes("optimize")) {
      type = "chore";
      labels.push("refactor");
      agent = "jules";
    }
    if (combined.includes("urgent") || combined.includes("critical") || combined.includes("blocker") || combined.includes("asap") || combined.includes("production") || combined.includes("breaking") || combined.includes("p0") || combined.includes("p1")) {
      priority = "critical";
      labels.push("priority:critical");
    } else if (combined.includes("security") || combined.includes("vulnerability") || combined.includes("cve") || combined.includes("exploit") || combined.includes("auth") || combined.includes("password")) {
      priority = "critical";
      labels.push("security");
    } else if (combined.includes("important") || combined.includes("high") || combined.includes("soon") || combined.includes("p2")) {
      priority = "high";
      labels.push("priority:high");
    } else if (combined.includes("low") || combined.includes("minor") || combined.includes("nice.to.have") || combined.includes("p3") || combined.includes("p4")) {
      priority = "low";
      labels.push("priority:low");
    }
    if (combined.includes("quick") || combined.includes("simple") || combined.includes("small") || combined.includes("minor") || combined.includes("trivial") || combined.includes("one.line") || combined.includes("typo")) {
      effort = "xs";
      labels.push("good first issue");
    } else if (combined.includes("complex") || combined.includes("large") || combined.includes("major") || combined.includes("overhaul") || combined.includes("rewrite") || combined.includes("epic")) {
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
//# sourceMappingURL=chunk-XNVM5NM3.js.map