// src/harvester.ts
var HarvesterBot = class {
  name = "harvester";
  triggers = ["@harvester", "/harvester", "/merge-queue", "/mq"];
  async handle(ctx) {
    const query = ctx.query.toLowerCase().trim();
    if (query === "status" || query === "") {
      return this.handleStatus(ctx);
    }
    if (query === "add" || query.startsWith("add ")) {
      return this.handleAdd(ctx);
    }
    if (query === "remove" || query.startsWith("remove ")) {
      return this.handleRemove(ctx);
    }
    if (query === "help") {
      return this.handleHelp();
    }
    return {
      body: `\u{1F33E} **@harvester** - Unknown command: \`${query}\`

Use \`@harvester help\` for available commands.`,
      handled: true,
      postComment: true
    };
  }
  handleStatus(_ctx) {
    return {
      body: `\u{1F33E} **@harvester** Merge Queue Status

| Position | PR | Status | Priority |
|----------|-----|--------|----------|
| 1 | #123 | \u2705 Ready | High |
| 2 | #456 | \u{1F504} CI Running | Normal |
| 3 | #789 | \u23F3 Review Pending | Low |

---
Commands:
- \`@harvester add\` - Add this PR to queue
- \`@harvester remove\` - Remove from queue
- \`@harvester status\` - Show queue status`,
      handled: true,
      postComment: true
    };
  }
  handleAdd(ctx) {
    if (!ctx.isPR) {
      return {
        body: "\u{1F33E} **@harvester** can only add Pull Requests to the merge queue.",
        handled: true,
        postComment: true
      };
    }
    return {
      body: `\u{1F33E} **@harvester**

\u2705 Added PR #${ctx.number} to the merge queue.

I'll monitor CI status and merge when:
1. All checks pass
2. Reviews are approved
3. No merge conflicts

Use \`@harvester remove\` to remove from queue.`,
      handled: true,
      postComment: true,
      addLabels: ["merge-queue"]
    };
  }
  handleRemove(ctx) {
    if (!ctx.isPR) {
      return {
        body: "\u{1F33E} **@harvester** can only remove Pull Requests from the merge queue.",
        handled: true,
        postComment: true
      };
    }
    return {
      body: `\u{1F33E} **@harvester**

\u274C Removed PR #${ctx.number} from the merge queue.`,
      handled: true,
      postComment: true,
      addLabels: []
      // Would remove 'merge-queue' label
    };
  }
  handleHelp() {
    return {
      body: `\u{1F33E} **@harvester** - Merge Queue Management

## Commands

| Command | Description |
|---------|-------------|
| \`@harvester status\` | Show merge queue status |
| \`@harvester add\` | Add this PR to queue |
| \`@harvester remove\` | Remove from queue |
| \`@harvester help\` | Show this help |

## How It Works

1. Add PRs to the queue with \`@harvester add\`
2. Harvester monitors CI status automatically
3. When a PR passes all checks and is approved, it merges
4. Conflicts are auto-rebased when possible

## Priority

PRs are merged in order based on:
1. Priority labels (\`priority:critical\` > \`priority:high\` > default)
2. Time in queue (older first)
3. Approval status`,
      handled: true,
      postComment: true
    };
  }
};

export {
  HarvesterBot
};
//# sourceMappingURL=chunk-INOUCUM6.js.map