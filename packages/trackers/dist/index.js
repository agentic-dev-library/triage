import {
  BeadsProvider
} from "./chunk-UNL6HHZU.js";
import {
  GitHubProvider
} from "./chunk-GYHKK2BD.js";
import {
  JiraProvider
} from "./chunk-7SUA5ZH4.js";
import {
  LinearProvider
} from "./chunk-B5B2L7EP.js";
import {
  normalizePriority,
  normalizeStatus,
  normalizeType,
  priorityToNumber
} from "./chunk-25D5IUS2.js";
import "./chunk-5WRI5ZAA.js";

// src/gh-cli.ts
import { spawnSync } from "child_process";
function getGitHubEnv() {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  return token ? { ...process.env, GH_TOKEN: token } : { ...process.env };
}
function ghWithInput(args, input) {
  const result = spawnSync("gh", args, {
    input,
    encoding: "utf-8",
    env: getGitHubEnv(),
    maxBuffer: 10 * 1024 * 1024
  });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(result.stderr || `gh command failed with status ${result.status}`);
  }
  return result.stdout.trim();
}
function commentOnIssue(issueNumber, body) {
  ghWithInput(["issue", "comment", String(issueNumber), "--body-file", "-"], body);
}
function commentOnPR(prNumber, body) {
  ghWithInput(["pr", "comment", String(prNumber), "--body-file", "-"], body);
}

// src/index.ts
function createProvider(config) {
  const type = config.type || config.provider;
  switch (type) {
    case "github":
      return new GitHubProvider(config.github || config);
    case "jira":
      return new JiraProvider(config.jira || config);
    case "linear":
      return new LinearProvider(config.linear || config);
    case "beads":
      return new BeadsProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
async function createBestProvider(options = {}) {
  const workingDir = options.workingDir || process.cwd();
  if (options.repo) {
    return new GitHubProvider({ type: "github", repo: options.repo });
  }
  const repo = process.env.GITHUB_REPOSITORY;
  if (repo) {
    return new GitHubProvider({ type: "github", repo });
  }
  try {
    const { execFileSync } = await import("child_process");
    const remote = execFileSync("git", ["remote", "get-url", "origin"], {
      cwd: workingDir,
      encoding: "utf-8"
    }).trim();
    const match = remote.match(/github\.com[/:]([^/]+\/[^/.]+)/);
    if (match) {
      const detectedRepo = match[1].replace(/\.git$/, "");
      return new GitHubProvider({ type: "github", repo: detectedRepo });
    }
  } catch {
  }
  throw new Error("Could not auto-detect provider. Please provide configuration.");
}
var providerRegistry = /* @__PURE__ */ new Map();
function registerProvider(name, provider) {
  providerRegistry.set(name, provider);
}
function getProvider(name) {
  return providerRegistry.get(name);
}
function getAllProviders() {
  return Array.from(providerRegistry.values());
}
function clearProviders() {
  providerRegistry.clear();
}
async function syncAllProviders() {
  const promises = [];
  for (const provider of providerRegistry.values()) {
    if ("sync" in provider && typeof provider.sync === "function") {
      promises.push(provider.sync());
    }
  }
  await Promise.all(promises);
}
async function getCombinedStats() {
  const providers = {};
  const total = {
    total: 0,
    open: 0,
    inProgress: 0,
    blocked: 0,
    closed: 0,
    byPriority: { critical: 0, high: 0, medium: 0, low: 0, backlog: 0 },
    byType: { bug: 0, feature: 0, task: 0, epic: 0, chore: 0, docs: 0 }
  };
  for (const [name, provider] of providerRegistry) {
    try {
      const stats = await provider.getStats();
      providers[name] = stats;
      total.total += stats.total;
      total.open += stats.open;
      total.inProgress += stats.inProgress;
      total.blocked += stats.blocked;
      total.closed += stats.closed;
      for (const p of Object.keys(stats.byPriority)) {
        total.byPriority[p] += stats.byPriority[p];
      }
      for (const t of Object.keys(stats.byType)) {
        total.byType[t] += stats.byType[t];
      }
    } catch (err) {
      console.warn(`Failed to get stats from ${name}:`, err);
    }
  }
  return { providers, total };
}
export {
  BeadsProvider,
  GitHubProvider,
  JiraProvider,
  LinearProvider,
  clearProviders,
  commentOnIssue,
  commentOnPR,
  createBestProvider,
  createProvider,
  getAllProviders,
  getCombinedStats,
  getProvider,
  normalizePriority,
  normalizeStatus,
  normalizeType,
  priorityToNumber,
  registerProvider,
  syncAllProviders
};
//# sourceMappingURL=index.js.map