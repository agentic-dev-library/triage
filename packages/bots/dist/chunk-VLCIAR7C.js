// src/router.ts
var BotRouter = class {
  bots = /* @__PURE__ */ new Map();
  /**
   * Register a bot
   */
  register(bot) {
    this.bots.set(bot.name, bot);
  }
  /**
   * Find the bot that should handle this comment
   */
  findBot(body) {
    const lowerBody = body.toLowerCase();
    for (const bot of this.bots.values()) {
      for (const trigger of bot.triggers) {
        if (lowerBody.includes(trigger.toLowerCase())) {
          return bot;
        }
      }
    }
    return void 0;
  }
  /**
   * Extract the query from a comment body
   */
  extractQuery(body, bot) {
    let query = body;
    for (const trigger of bot.triggers) {
      const regex = new RegExp(trigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      query = query.replace(regex, "");
    }
    return query.trim();
  }
  /**
   * Route a comment to the appropriate bot
   */
  async route(ctx) {
    const bot = this.findBot(ctx.body);
    if (!bot) {
      return {
        body: "",
        handled: false
      };
    }
    const query = this.extractQuery(ctx.body, bot);
    try {
      return await bot.handle({ ...ctx, query });
    } catch (error) {
      return {
        body: `\u274C **@${bot.name}** encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`,
        handled: true,
        postComment: true,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
  /**
   * Get all registered bots
   */
  getBots() {
    return Array.from(this.bots.values());
  }
  /**
   * Get help text for all bots
   */
  getHelp() {
    const lines = ["## \u{1F916} Available Bots\n"];
    for (const bot of this.bots.values()) {
      lines.push(`### @${bot.name}`);
      lines.push(`Triggers: ${bot.triggers.map((t) => `\`${t}\``).join(", ")}
`);
    }
    return lines.join("\n");
  }
};
async function createBotRouter() {
  const router = new BotRouter();
  const { SageBot } = await import("./sage.js");
  const { CuratorBot } = await import("./curator.js");
  const { FixerBot } = await import("./fixer.js");
  const { HarvesterBot } = await import("./harvester.js");
  const { GuardianBot } = await import("./guardian.js");
  router.register(new SageBot());
  router.register(new CuratorBot());
  router.register(new FixerBot());
  router.register(new HarvesterBot());
  router.register(new GuardianBot());
  return router;
}

export {
  BotRouter,
  createBotRouter
};
//# sourceMappingURL=chunk-VLCIAR7C.js.map