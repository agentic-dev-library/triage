// src/fixer.ts
var FixerBot = class {
  name = "fixer";
  triggers = ["@fixer", "/fixer", "/fix"];
  async handle(ctx) {
    if (!ctx.isPR) {
      return {
        body: `\u{1F527} **@fixer** works best on Pull Requests with CI failures.

Use on a PR to analyze failing checks.`,
        handled: true,
        postComment: true
      };
    }
    const analysis = this.analyzeErrors(ctx.body, ctx.query);
    return {
      body: this.formatAnalysis(analysis),
      handled: true,
      postComment: true
    };
  }
  analyzeErrors(body, query) {
    const combined = `${body} ${query}`.toLowerCase();
    if (combined.includes("typescript") || combined.includes("type error") || /ts\d{4}/.test(combined) || combined.includes("cannot find name")) {
      return {
        diagnosis: "TypeScript type errors detected",
        fix: "Fix type annotations and imports",
        severity: "high",
        canAutoFix: true,
        commands: ["pnpm typecheck", "pnpm lint:fix"]
      };
    }
    if (combined.includes("eslint") || combined.includes("lint") || combined.includes("biome") || combined.includes("prettier") || combined.includes("formatting")) {
      return {
        diagnosis: "Linting/formatting errors detected",
        fix: "Run the linter with auto-fix",
        severity: "medium",
        canAutoFix: true,
        commands: ["pnpm lint:fix", "pnpm format"]
      };
    }
    if (combined.includes("test fail") || combined.includes("expect") || combined.includes("assert") || combined.includes("vitest") || combined.includes("jest") || combined.includes("pytest")) {
      return {
        diagnosis: "Test failures detected",
        fix: "Review and fix failing tests",
        severity: "high",
        canAutoFix: false,
        commands: ["pnpm test", "pnpm test:coverage"]
      };
    }
    if (combined.includes("build fail") || combined.includes("compile") || combined.includes("bundle") || combined.includes("webpack") || combined.includes("vite") || combined.includes("tsup")) {
      return {
        diagnosis: "Build errors detected",
        fix: "Fix compilation issues",
        severity: "high",
        canAutoFix: false,
        commands: ["pnpm build"]
      };
    }
    if (combined.includes("cannot find module") || combined.includes("module not found") || combined.includes("import error")) {
      return {
        diagnosis: "Missing dependencies or imports",
        fix: "Install dependencies and check import paths",
        severity: "high",
        canAutoFix: true,
        commands: ["pnpm install", "pnpm build"]
      };
    }
    if (combined.includes("permission denied") || combined.includes("eacces") || combined.includes("eperm")) {
      return {
        diagnosis: "Permission issues",
        fix: "Check file permissions or CI configuration",
        severity: "medium",
        canAutoFix: false,
        commands: []
      };
    }
    if (combined.includes("timeout") || combined.includes("timed out") || combined.includes("deadline exceeded")) {
      return {
        diagnosis: "Timeout error",
        fix: "Optimize slow operations or increase timeout",
        severity: "medium",
        canAutoFix: false,
        commands: []
      };
    }
    if (combined.includes("out of memory") || combined.includes("heap") || combined.includes("oom") || combined.includes("memory limit")) {
      return {
        diagnosis: "Memory limit exceeded",
        fix: "Optimize memory usage or increase limits",
        severity: "high",
        canAutoFix: false,
        commands: []
      };
    }
    return {
      diagnosis: "CI failure - requires investigation",
      fix: "Review the full logs for details",
      severity: "medium",
      canAutoFix: false,
      commands: ["gh run view --log-failed"]
    };
  }
  formatAnalysis(analysis) {
    const severityEmoji = {
      critical: "\u{1F534}",
      high: "\u{1F7E0}",
      medium: "\u{1F7E1}",
      low: "\u26AA"
    };
    let body = `\u{1F527} **@fixer** CI Analysis

${severityEmoji[analysis.severity] || "\u26AA"} **Diagnosis**: ${analysis.diagnosis}

\u{1F4A1} **Suggested Fix**: ${analysis.fix}`;
    if (analysis.commands.length > 0) {
      body += "\n\n**Try these commands**:\n```bash\n";
      body += analysis.commands.join("\n");
      body += "\n```";
    }
    if (analysis.canAutoFix) {
      body += "\n\n\u2705 This can likely be auto-fixed. Use `@cascade fix` to attempt.";
    }
    return body;
  }
};

export {
  FixerBot
};
//# sourceMappingURL=chunk-FPKTGJSN.js.map