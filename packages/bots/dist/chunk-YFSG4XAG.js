// src/guardian.ts
var GuardianBot = class {
  name = "guardian";
  triggers = ["@guardian", "/guardian", "/standards", "/lint-pr"];
  // Configurable settings
  allowedLicenses = ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC", "Unlicense"];
  forbiddenLicenses = ["GPL", "LGPL", "AGPL", "SSPL", "Commons-Clause"];
  requiredFiles = ["LICENSE", "README.md"];
  async handle(ctx) {
    const query = ctx.query.toLowerCase().trim();
    if (query === "help" || query === "") {
      return this.handleHelp();
    }
    const violations = await this.runChecks(ctx);
    return {
      body: this.formatReport(violations),
      handled: true,
      postComment: true
    };
  }
  async runChecks(_ctx) {
    const violations = [];
    violations.push({
      check: "sha-pinning",
      status: "skip",
      details: "Requires repository checkout"
    });
    violations.push({
      check: "conventional-commits",
      status: "skip",
      details: "Requires PR title access"
    });
    violations.push({
      check: "license",
      status: "skip",
      details: "Requires file access"
    });
    violations.push({
      check: "semver",
      status: "skip",
      details: "Requires package.json access"
    });
    violations.push({
      check: "changelog",
      status: "skip",
      details: "Requires file access"
    });
    return violations;
  }
  formatReport(violations) {
    const passCount = violations.filter((v) => v.status === "pass").length;
    const failCount = violations.filter((v) => v.status === "fail").length;
    const skipCount = violations.filter((v) => v.status === "skip").length;
    let body = `\u{1F6E1}\uFE0F **@guardian** Enterprise Standards Check

**Results**: ${passCount} passed, ${failCount} failed, ${skipCount} skipped

| Check | Status | Details |
|-------|--------|---------|`;
    for (const v of violations) {
      const statusEmoji = v.status === "pass" ? "\u2705" : v.status === "fail" ? "\u274C" : "\u23ED\uFE0F";
      body += `
| ${v.check} | ${statusEmoji} | ${v.details || "-"} |`;
    }
    if (failCount > 0) {
      body += "\n\n---\n\u26A0\uFE0F **Action Required**: Fix the failing checks before merge.";
    } else if (skipCount === violations.length) {
      body += `

---
_Run as a GitHub Action for full checks._`;
    }
    return body;
  }
  handleHelp() {
    return {
      body: `\u{1F6E1}\uFE0F **@guardian** - Enterprise Standards Enforcement

## Checks

| Check | Description |
|-------|-------------|
| \`sha-pinning\` | GitHub Actions pinned to exact SHAs |
| \`conventional-commits\` | PR titles follow conventional commit format |
| \`license\` | MIT license, no GPL/LGPL |
| \`semver\` | Valid semantic versioning |
| \`changelog\` | CHANGELOG.md exists and is updated |
| \`branch-naming\` | Branch follows naming convention |
| \`required-files\` | Required files exist (LICENSE, README) |

## Usage

- \`@guardian\` - Run all checks
- \`@guardian check sha-pinning\` - Run specific check
- \`@guardian help\` - Show this help

## Allowed Licenses

${this.allowedLicenses.map((l) => `\`${l}\``).join(", ")}

## Forbidden Licenses

${this.forbiddenLicenses.map((l) => `\`${l}\``).join(", ")}`,
      handled: true,
      postComment: true
    };
  }
};

export {
  GuardianBot
};
//# sourceMappingURL=chunk-YFSG4XAG.js.map