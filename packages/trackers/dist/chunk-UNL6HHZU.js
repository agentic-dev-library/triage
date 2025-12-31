// src/beads.ts
var BeadsProvider = class {
  constructor(config = { type: "beads" }) {
    this.config = config;
  }
  name = "beads";
  displayName = "Beads";
  async isReady() {
    return false;
  }
  async createIssue(_options) {
    throw new Error("Beads provider not implemented");
  }
  async getIssue(_id) {
    throw new Error("Beads provider not implemented");
  }
  async updateIssue(_id, _options) {
    throw new Error("Beads provider not implemented");
  }
  async closeIssue(_id, _reason) {
    throw new Error("Beads provider not implemented");
  }
  async reopenIssue(_id, _reason) {
    throw new Error("Beads provider not implemented");
  }
  async listIssues(_options) {
    return [];
  }
  async getReadyWork(_options) {
    return [];
  }
  async getBlockedIssues() {
    return [];
  }
  async searchIssues(_query, _options) {
    return [];
  }
  async addLabels(_id, _labels) {
    throw new Error("Beads provider not implemented");
  }
  async removeLabels(_id, _labels) {
    throw new Error("Beads provider not implemented");
  }
  async getStats() {
    return {
      total: 0,
      open: 0,
      inProgress: 0,
      blocked: 0,
      closed: 0,
      byPriority: { critical: 0, high: 0, medium: 0, low: 0, backlog: 0 },
      byType: { bug: 0, feature: 0, task: 0, epic: 0, chore: 0, docs: 0 }
    };
  }
};

export {
  BeadsProvider
};
//# sourceMappingURL=chunk-UNL6HHZU.js.map