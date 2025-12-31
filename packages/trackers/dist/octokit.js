import {
  createGitHubClient,
  createGraphQLClient
} from "./chunk-TGUOX2N5.js";
import "./chunk-5WRI5ZAA.js";

// src/octokit.ts
import { execSync } from "child_process";
var _githubClient = null;
var _clientPromise = null;
var _graphqlClient = null;
var _graphqlPromise = null;
async function getGitHubMCPClient() {
  if (_githubClient) return _githubClient;
  if (!_clientPromise) {
    _clientPromise = createGitHubClient().then((client) => {
      _githubClient = client;
      return client;
    });
  }
  return _clientPromise;
}
async function closeGitHubClient() {
  if (_githubClient) {
    await _githubClient.close();
    _githubClient = null;
    _clientPromise = null;
  }
}
async function getGraphQLMCPClient() {
  if (_graphqlClient) return _graphqlClient;
  if (!_graphqlPromise) {
    _graphqlPromise = createGraphQLClient().then((client) => {
      _graphqlClient = client;
      return client;
    });
  }
  return _graphqlPromise;
}
async function closeGraphQLClient() {
  if (_graphqlClient) {
    await _graphqlClient.close();
    _graphqlClient = null;
    _graphqlPromise = null;
  }
}
async function closeAllClients() {
  await Promise.all([closeGitHubClient(), closeGraphQLClient()]);
}
async function executeGraphQL(query, variables) {
  const client = await getGraphQLMCPClient();
  const tools = await client.tools();
  const tool = tools["query-graphql"] || tools.graphql || tools.execute || tools.query;
  if (!tool) {
    throw new Error(`GraphQL MCP tool not found. Available tools: ${Object.keys(tools).join(", ")}`);
  }
  if (typeof tool.execute !== "function") {
    throw new Error("GraphQL MCP tool is not executable");
  }
  const args = { query };
  if (variables && Object.keys(variables).length > 0) {
    args.variables = JSON.stringify(variables);
  }
  const result = await tool.execute(args);
  const data = parseGraphQLResponse(result);
  if (data.errors && data.errors.length > 0) {
    throw new Error(`GraphQL error: ${data.errors.map((e) => e.message).join(", ")}`);
  }
  return data.data || data;
}
function parseGraphQLResponse(result) {
  if (result.content && Array.isArray(result.content)) {
    const textContent = result.content.find((c) => c.type === "text");
    if (textContent?.text) {
      return JSON.parse(textContent.text);
    }
  }
  return result;
}
async function callGitHubTool(toolName, args) {
  const client = await getGitHubMCPClient();
  const tools = await client.tools();
  const tool = tools[toolName];
  if (!tool) {
    throw new Error(`GitHub MCP tool '${toolName}' not found`);
  }
  if (typeof tool.execute === "function") {
    return tool.execute(args);
  }
  throw new Error(`GitHub MCP tool '${toolName}' is not executable`);
}
function getRepoContext() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (repository) {
    const [owner, repo] = repository.split("/");
    return { owner, repo };
  }
  try {
    const remote = execSync("git remote get-url origin", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    }).trim();
    const httpsMatch = remote.match(/github\.com\/([^/]+)\/([^/.]+)/);
    const sshMatch = remote.match(/github\.com:([^/]+)\/([^/.]+)/);
    const match = httpsMatch || sshMatch;
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  } catch {
  }
  throw new Error(
    "Could not determine repository context. Set GITHUB_REPOSITORY or ensure git remote is configured."
  );
}
function getOctokit() {
  throw new Error(
    "Octokit is deprecated. Use GitHub MCP functions instead:\n- getGitHubMCPClient() for direct MCP access\n- callGitHubTool() for tool invocation\n- Or use runAgenticTask() from mcp.ts for AI-driven operations"
  );
}
async function getIssue(issueNumber, repoContext) {
  const { owner, repo } = repoContext || getRepoContext();
  const result = await callGitHubTool("get_issue", {
    owner,
    repo,
    issue_number: issueNumber
  });
  return {
    number: result.number,
    title: result.title,
    body: result.body || "",
    state: result.state,
    labels: result.labels?.map((l) => l.name) || []
  };
}
async function addIssueComment(issueNumber, body) {
  const { owner, repo } = getRepoContext();
  await callGitHubTool("add_issue_comment", {
    owner,
    repo,
    issue_number: issueNumber,
    body
  });
}
async function createIssueComment(issueNumber, body) {
  return addIssueComment(issueNumber, body);
}
async function createIssue(issue, repoContext) {
  const { owner, repo } = repoContext || getRepoContext();
  const result = await callGitHubTool("create_issue", {
    owner,
    repo,
    ...issue
  });
  return { number: result.number };
}
async function updateIssue(issueNumber, updates, repoContext) {
  const { owner, repo } = repoContext || getRepoContext();
  await callGitHubTool("update_issue", {
    owner,
    repo,
    issue_number: issueNumber,
    ...updates
  });
}
async function addIssueLabels(issueNumber, labels) {
  if (labels.length === 0) return;
  const issue = await getIssue(issueNumber);
  const merged = Array.from(/* @__PURE__ */ new Set([...issue.labels, ...labels]));
  await updateIssue(issueNumber, { labels: merged });
}
async function commentOnPR(prNumber, body) {
  return addIssueComment(prNumber, body);
}
async function searchIssues(query, repoContext) {
  try {
    return await searchIssuesGraphQL(query, {}, repoContext);
  } catch (error) {
    console.warn("GraphQL search failed, falling back to REST API. Error:", error);
  }
  const { owner, repo } = repoContext || getRepoContext();
  const fullQuery = `repo:${owner}/${repo} ${query}`;
  const result = await callGitHubTool("search_issues", {
    query: fullQuery
  });
  return (result.items || []).map((item) => ({
    number: item.number,
    title: item.title,
    state: item.state,
    labels: item.labels?.map((l) => l.name) || []
  }));
}
async function searchIssuesGraphQL(query, options = {}, repoContext) {
  const { owner, repo } = repoContext || getRepoContext();
  const { first = 100, includeBody = false } = options;
  const isOpen = query.includes("is:open") || query.includes("state:open");
  const isClosed = query.includes("is:closed") || query.includes("state:closed");
  const states = isClosed ? "CLOSED" : isOpen ? "OPEN" : null;
  const gqlQuery = `
        query GetIssues($owner: String!, $repo: String!, $first: Int!, $states: [IssueState!], $includeBody: Boolean!) {
            repository(owner: $owner, name: $repo) {
                issues(first: $first, orderBy: {field: UPDATED_AT, direction: DESC}, states: $states) {
                    nodes {
                        number
                        title
                        state
                        body @include(if: $includeBody)
                        labels(first: 10) {
                            nodes {
                                name
                            }
                        }
                    }
                }
            }
        }
    `;
  const variables = { owner, repo, first, includeBody };
  if (states) {
    variables.states = [states];
  }
  const result = await executeGraphQL(gqlQuery, variables);
  return result.repository.issues.nodes.map((issue) => ({
    number: issue.number,
    title: issue.title,
    state: issue.state.toLowerCase(),
    labels: issue.labels.nodes.map((l) => l.name),
    ...includeBody && { body: issue.body }
  }));
}
async function getPullRequest(prNumber) {
  const { owner, repo } = getRepoContext();
  const result = await callGitHubTool("get_pull_request", {
    owner,
    repo,
    pull_number: prNumber
  });
  return result;
}
async function listCommits(branch, options = {}) {
  const { owner, repo } = getRepoContext();
  const result = await callGitHubTool("list_commits", {
    owner,
    repo,
    sha: branch,
    per_page: options.per_page || 30
  });
  return result.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.author?.login || "unknown"
  }));
}
async function getFileContents(path, options = {}) {
  const { owner, repo } = getRepoContext();
  const result = await callGitHubTool("get_file_contents", {
    owner,
    repo,
    path,
    ref: options.ref
  });
  if (result.content && result.encoding === "base64") {
    return Buffer.from(result.content, "base64").toString("utf-8");
  }
  return result.content || "";
}
async function getPRNodeId(prNumber) {
  const { owner, repo } = getRepoContext();
  const query = `
        query GetPRNodeId($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
                pullRequest(number: $number) {
                    id
                }
            }
        }
    `;
  const result = await executeGraphQL(query, { owner, repo, number: prNumber });
  return result.repository.pullRequest.id;
}
async function convertPRToDraft(prNumber) {
  const pullRequestId = await getPRNodeId(prNumber);
  const mutation = `
        mutation ConvertToDraft($pullRequestId: ID!) {
            convertPullRequestToDraft(input: { pullRequestId: $pullRequestId }) {
                pullRequest {
                    isDraft
                }
            }
        }
    `;
  await executeGraphQL(mutation, { pullRequestId });
}
async function enableAutoMerge(prNumber, mergeMethod = "SQUASH") {
  const pullRequestId = await getPRNodeId(prNumber);
  const mutation = `
        mutation EnableAutoMerge($pullRequestId: ID!, $mergeMethod: PullRequestMergeMethod!) {
            enablePullRequestAutoMerge(input: { pullRequestId: $pullRequestId, mergeMethod: $mergeMethod }) {
                pullRequest {
                    autoMergeRequest {
                        enabledAt
                    }
                }
            }
        }
    `;
  await executeGraphQL(mutation, { pullRequestId, mergeMethod });
}
async function disableAutoMerge(prNumber) {
  const pullRequestId = await getPRNodeId(prNumber);
  const mutation = `
        mutation DisableAutoMerge($pullRequestId: ID!) {
            disablePullRequestAutoMerge(input: { pullRequestId: $pullRequestId }) {
                pullRequest {
                    autoMergeRequest {
                        enabledAt
                    }
                }
            }
        }
    `;
  await executeGraphQL(mutation, { pullRequestId });
}
async function getPRReviewComments(prNumber) {
  const { owner, repo } = getRepoContext();
  const query = `
        query GetReviewComments($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
                pullRequest(number: $number) {
                    reviewThreads(first: 100) {
                        nodes {
                            path
                            line
                            comments(first: 50) {
                                nodes {
                                    id
                                    databaseId
                                    body
                                    author {
                                        login
                                    }
                                    createdAt
                                    state
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
  const result = await executeGraphQL(query, { owner, repo, number: prNumber });
  const comments = [];
  for (const thread of result.repository.pullRequest.reviewThreads.nodes) {
    for (const c of thread.comments.nodes) {
      comments.push({
        id: c.databaseId,
        nodeId: c.id,
        body: c.body,
        path: thread.path,
        line: thread.line ?? void 0,
        user: c.author?.login || "unknown",
        createdAt: c.createdAt,
        state: c.state
      });
    }
  }
  return comments;
}
async function getPRReviews(prNumber) {
  const { owner, repo } = getRepoContext();
  const query = `
        query GetReviews($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
                pullRequest(number: $number) {
                    reviews(first: 100) {
                        nodes {
                            databaseId
                            author {
                                login
                            }
                            state
                            body
                            submittedAt
                        }
                    }
                }
            }
        }
    `;
  const result = await executeGraphQL(query, { owner, repo, number: prNumber });
  return result.repository.pullRequest.reviews.nodes.map((r) => ({
    id: r.databaseId,
    user: r.author?.login || "unknown",
    state: r.state,
    body: r.body || "",
    submittedAt: r.submittedAt
  }));
}
async function replyToReviewComment(prNumber, commentNodeId, body) {
  const pullRequestId = await getPRNodeId(prNumber);
  const mutation = `
        mutation ReplyToComment($pullRequestId: ID!, $body: String!, $inReplyTo: ID!) {
            addPullRequestReviewComment(input: {
                pullRequestId: $pullRequestId,
                body: $body,
                inReplyTo: $inReplyTo
            }) {
                comment {
                    id
                }
            }
        }
    `;
  await executeGraphQL(mutation, {
    pullRequestId,
    body,
    inReplyTo: commentNodeId
  });
}
async function submitPRReview(prNumber, event, body) {
  const pullRequestId = await getPRNodeId(prNumber);
  const mutation = `
        mutation SubmitReview($pullRequestId: ID!, $event: PullRequestReviewEvent!, $body: String!) {
            addPullRequestReview(input: {
                pullRequestId: $pullRequestId,
                event: $event,
                body: $body
            }) {
                pullRequestReview {
                    id
                    state
                }
            }
        }
    `;
  await executeGraphQL(mutation, { pullRequestId, event, body });
}
async function getCheckRuns(ref) {
  const { owner, repo } = getRepoContext();
  const query = `
        query GetCheckRuns($owner: String!, $repo: String!, $ref: String!) {
            repository(owner: $owner, name: $repo) {
                object(expression: $ref) {
                    ... on Commit {
                        checkSuites(first: 20) {
                            nodes {
                                checkRuns(first: 50) {
                                    nodes {
                                        databaseId
                                        name
                                        status
                                        conclusion
                                        startedAt
                                        completedAt
                                        detailsUrl
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
  const result = await executeGraphQL(query, { owner, repo, ref });
  const checkRuns = [];
  for (const suite of result.repository.object?.checkSuites?.nodes || []) {
    for (const run of suite.checkRuns.nodes) {
      checkRuns.push({
        id: run.databaseId,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        url: run.detailsUrl
      });
    }
  }
  return checkRuns;
}
async function areAllChecksPassing(ref) {
  const checks = await getCheckRuns(ref);
  const pending = checks.filter((c) => c.status !== "COMPLETED").length;
  const failed = checks.filter((c) => c.conclusion === "FAILURE" || c.conclusion === "TIMED_OUT" || c.conclusion === "CANCELLED").map((c) => c.name);
  const passing = failed.length === 0 && pending === 0;
  return { passing, pending, failed };
}
async function createCheckRun(_name, _headSha, _options) {
  throw new Error("createCheckRun not yet available via MCP. Use runAgenticTask.");
}
async function getCodeScanningAlerts(_state) {
  throw new Error("getCodeScanningAlerts not yet available via MCP. Use runAgenticTask.");
}
async function getPRCodeScanningAlerts(_prNumber) {
  throw new Error("getPRCodeScanningAlerts not yet available via MCP. Use runAgenticTask.");
}
async function getDependabotAlerts(_state) {
  throw new Error("getDependabotAlerts not yet available via MCP. Use runAgenticTask.");
}
async function waitForChecks(ref, options) {
  const timeout = options?.timeout || 3e5;
  const pollInterval = options?.pollInterval || 1e4;
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const status = await areAllChecksPassing(ref);
    if (status.pending === 0) {
      return { passing: status.passing, failed: status.failed };
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }
  const finalStatus = await areAllChecksPassing(ref);
  return { passing: false, failed: [...finalStatus.failed, "TIMEOUT"] };
}
function formatAlertsForAI(codeScanning, dependabot) {
  const lines = [];
  if (codeScanning.length > 0) {
    lines.push("## Code Scanning Alerts");
    for (const alert of codeScanning) {
      lines.push(`- **${alert.rule.id}** (${alert.rule.severity}): ${alert.rule.description}`);
      if (alert.location) {
        lines.push(`  - Location: ${alert.location.path}:${alert.location.startLine}`);
      }
    }
    lines.push("");
  }
  if (dependabot.length > 0) {
    lines.push("## Dependabot Alerts");
    for (const alert of dependabot) {
      lines.push(`- **${alert.dependency.package}** (${alert.securityVulnerability.severity})`);
      lines.push(`  - ${alert.securityAdvisory.summary}`);
      if (alert.securityVulnerability.firstPatchedVersion) {
        lines.push(`  - Fix: Upgrade to ${alert.securityVulnerability.firstPatchedVersion}`);
      }
    }
    lines.push("");
  }
  return lines.join("\n");
}
async function getPRReviewThreads(prNumber) {
  const { owner, repo } = getRepoContext();
  const query = `
        query GetReviewThreads($owner: String!, $repo: String!, $number: Int!) {
            repository(owner: $owner, name: $repo) {
                pullRequest(number: $number) {
                    reviewThreads(first: 100) {
                        nodes {
                            id
                            isResolved
                            isOutdated
                            path
                            line
                            comments(first: 50) {
                                nodes {
                                    id
                                    body
                                    author {
                                        login
                                    }
                                    createdAt
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
  const result = await executeGraphQL(query, { owner, repo, number: prNumber });
  return result.repository.pullRequest.reviewThreads.nodes.map((thread) => ({
    id: thread.id,
    isResolved: thread.isResolved,
    isOutdated: thread.isOutdated,
    path: thread.path,
    line: thread.line,
    comments: thread.comments.nodes.map((c) => ({
      id: c.id,
      body: c.body,
      author: c.author?.login || "unknown",
      createdAt: c.createdAt
    }))
  }));
}
async function resolveReviewThread(threadId) {
  const mutation = `
        mutation ResolveThread($threadId: ID!) {
            resolveReviewThread(input: { threadId: $threadId }) {
                thread {
                    isResolved
                }
            }
        }
    `;
  const result = await executeGraphQL(mutation, { threadId });
  return result.resolveReviewThread.thread.isResolved;
}
async function markPRReadyForReview(prNumber) {
  const pullRequestId = await getPRNodeId(prNumber);
  const mutation = `
        mutation MarkReadyForReview($pullRequestId: ID!) {
            markPullRequestReadyForReview(input: { pullRequestId: $pullRequestId }) {
                pullRequest {
                    isDraft
                }
            }
        }
    `;
  const result = await executeGraphQL(mutation, { pullRequestId });
  return !result.markPullRequestReadyForReview.pullRequest.isDraft;
}
export {
  addIssueComment,
  addIssueLabels,
  areAllChecksPassing,
  closeAllClients,
  closeGitHubClient,
  closeGraphQLClient,
  commentOnPR,
  convertPRToDraft,
  createCheckRun,
  createIssue,
  createIssueComment,
  disableAutoMerge,
  enableAutoMerge,
  executeGraphQL,
  formatAlertsForAI,
  getCheckRuns,
  getCodeScanningAlerts,
  getDependabotAlerts,
  getFileContents,
  getGitHubMCPClient,
  getGraphQLMCPClient,
  getIssue,
  getOctokit,
  getPRCodeScanningAlerts,
  getPRReviewComments,
  getPRReviewThreads,
  getPRReviews,
  getPullRequest,
  getRepoContext,
  listCommits,
  markPRReadyForReview,
  replyToReviewComment,
  resolveReviewThread,
  searchIssues,
  searchIssuesGraphQL,
  submitPRReview,
  updateIssue,
  waitForChecks
};
//# sourceMappingURL=octokit.js.map