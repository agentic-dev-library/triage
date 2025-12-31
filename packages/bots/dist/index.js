import {
  CuratorBot
} from "./chunk-SG56IEL2.js";
import {
  FixerBot
} from "./chunk-XYQJGMFS.js";
import {
  GuardianBot
} from "./chunk-72TBY2DI.js";
import {
  HarvesterBot
} from "./chunk-INOUCUM6.js";
import {
  BotRouter,
  createBotRouter
} from "./chunk-VLCIAR7C.js";
import {
  SageBot
} from "./chunk-WGGFDYDD.js";
import {
  __require
} from "./chunk-DGUM43GV.js";

// src/webhook.ts
import { commentOnIssue, commentOnPR } from "@agentic/triage-trackers";
var WebhookHandler = class {
  options;
  constructor(options = {}) {
    this.options = options;
  }
  /**
   * Handle an incoming webhook event
   */
  async handle(event) {
    if (event.action !== "created" || !event.comment) {
      return null;
    }
    const body = event.comment.body;
    const router = await createBotRouter();
    const bot = router.findBot(body);
    if (!bot) {
      return null;
    }
    const isPR = !!event.issue?.pull_request || !!event.pull_request;
    const number = event.issue?.number || event.pull_request?.number || 0;
    const ctx = {
      body,
      number,
      isPR,
      owner: event.repository.owner.login,
      repo: event.repository.name,
      author: event.sender.login,
      model: this.options.model,
      token: this.options.token
    };
    const response = await router.route(ctx);
    if (response.handled && response.postComment && response.body && !this.options.dryRun) {
      try {
        if (isPR) {
          commentOnPR(number, response.body);
        } else {
          commentOnIssue(number, response.body);
        }
      } catch (error) {
        console.error("Failed to post comment:", error);
      }
    }
    return response;
  }
  /**
   * Verify webhook signature (for production use)
   */
  static verifySignature(payload, signature, secret) {
    const crypto = __require("crypto");
    const expected = `sha256=${crypto.createHmac("sha256", secret).update(payload).digest("hex")}`;
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }
};
async function createWebhookServer(port, options = {}) {
  const http = __require("http");
  const handler = new WebhookHandler(options);
  const server = http.createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/webhook") {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const event = JSON.parse(body);
        const response = await handler.handle(event);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ handled: response?.handled ?? false }));
      } catch (error) {
        console.error("Webhook error:", error);
        res.writeHead(500);
        res.end("Internal Server Error");
      }
    });
  });
  server.listen(port, () => {
    console.log(`\u{1F916} Triage Bots webhook server running on port ${port}`);
    console.log(`   POST http://localhost:${port}/webhook`);
  });
}
export {
  BotRouter,
  CuratorBot,
  FixerBot,
  GuardianBot,
  HarvesterBot,
  SageBot,
  WebhookHandler,
  createBotRouter,
  createWebhookServer
};
//# sourceMappingURL=index.js.map