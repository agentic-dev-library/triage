// src/types.ts
function normalizePriority(value) {
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "critical" || lower === "highest" || lower === "p0") return "critical";
    if (lower === "high" || lower === "p1") return "high";
    if (lower === "medium" || lower === "medium" || lower === "p2") return "medium";
    if (lower === "low" || lower === "p3") return "low";
    if (lower === "lowest" || lower === "backlog" || lower === "p4") return "backlog";
    return "medium";
  }
  if (value === 0) return "critical";
  if (value === 1) return "high";
  if (value === 2) return "medium";
  if (value === 3) return "low";
  return "backlog";
}
function priorityToNumber(priority) {
  switch (priority) {
    case "critical":
      return 0;
    case "high":
      return 1;
    case "medium":
      return 2;
    case "low":
      return 3;
    case "backlog":
      return 4;
  }
}
function normalizeStatus(value) {
  const lower = value.toLowerCase().replace(/[_-]/g, "");
  if (lower === "open" || lower === "new" || lower === "todo") return "open";
  if (lower === "inprogress" || lower === "active" || lower === "doing") return "in_progress";
  if (lower === "blocked" || lower === "waiting") return "blocked";
  if (lower === "closed" || lower === "done" || lower === "resolved") return "closed";
  return "open";
}
function normalizeType(value) {
  const lower = value.toLowerCase();
  if (lower === "bug" || lower === "defect") return "bug";
  if (lower === "feature" || lower === "enhancement" || lower === "story") return "feature";
  if (lower === "task" || lower === "subtask") return "task";
  if (lower === "epic" || lower === "initiative") return "epic";
  if (lower === "chore" || lower === "maintenance") return "chore";
  if (lower === "docs" || lower === "documentation") return "docs";
  return "task";
}

export {
  normalizePriority,
  priorityToNumber,
  normalizeStatus,
  normalizeType
};
//# sourceMappingURL=chunk-V2ADT2NF.js.map