#!/usr/bin/env node
#!/usr/bin/env node
import {
  runMcpServer
} from "./chunk-ZD4XPAUX.js";

// src/cli.ts
import { Command } from "commander";
import { resolveModel } from "@agentic/triage-ai";
import {
  decomposeTask,
  routeToAgent,
  sage,
  unblock
} from "@agentic/triage-core";
var program = new Command();
program.name("agentic-triage").description("AI-powered GitHub issue triage and PR review primitives").version("0.2.1");
program.command("assess").description("Assess an issue").argument("<issue>", "Issue number").action(async (issueNum) => {
  console.log(`Assessing issue ${issueNum}...`);
  await resolveModel();
  console.log("Triage primitives called successfully.");
});
function printSageResult(result, json) {
  if (json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if ("answer" in result) {
    console.log("\n\u{1F52E} Sage Response:\n");
    console.log(result.answer);
    if (result.agentRecommendation) {
      console.log(`
\u{1F4CC} Recommended: ${result.agentRecommendation.agent.toUpperCase()}`);
      console.log(`   Reason: ${result.agentRecommendation.reason}`);
    }
    console.log(`
(Confidence: ${Math.round(result.confidence * 100)}%)`);
  } else if ("subtasks" in result) {
    console.log("\n\u{1F4CB} Task Decomposition:\n");
    for (const task of result.subtasks) {
      console.log(`${task.id}: ${task.title}`);
      console.log(`   Agent: ${task.agent} | Priority: ${task.priority} | Effort: ${task.effort}`);
      console.log(`   ${task.description}
`);
    }
  } else if ("agent" in result && "instructions" in result) {
    console.log("\n\u{1F3AF} Agent Routing:\n");
    console.log(`Agent: ${result.agent.toUpperCase()}`);
    console.log(`Reason: ${result.reason}`);
    console.log(`Instructions: ${result.instructions}`);
    console.log(`(Confidence: ${Math.round(result.confidence * 100)}%)`);
  } else if ("diagnosis" in result) {
    console.log("\n\u{1F513} Unblock Analysis:\n");
    console.log(`Diagnosis: ${result.diagnosis}`);
    console.log(`Root Cause: ${result.rootCause}`);
    console.log(`
\u26A1 Immediate Action: ${result.immediateAction}`);
    if (result.needsHuman) {
      console.log(`
\u26A0\uFE0F Human intervention required: ${result.escalationReason}`);
    }
  }
}
program.command("sage").description("Ask Sage a question or get guidance").argument("<query>", "Your question or request").option("--decompose", "Decompose into subtasks").option("--route", "Get agent routing recommendation").option("--unblock", "Get help unblocking").option("--json", "Output as JSON").action(async (query, options) => {
  const resolved = await resolveModel();
  const model = resolved.model;
  let result;
  if (options.decompose) {
    console.log("Decomposing task...");
    result = await decomposeTask(query, model);
  } else if (options.route) {
    console.log("Routing to agent...");
    result = await routeToAgent(query, model);
  } else if (options.unblock) {
    console.log("Analyzing blocker...");
    result = await unblock(query, model);
  } else {
    result = await sage(query, model);
  }
  printSageResult(result, options.json);
});
program.command("mcp-server").description("Run the MCP server for Claude/Cursor integration").action(async () => {
  await runMcpServer();
});
program.parse();
//# sourceMappingURL=cli.js.map