import {
  triageAnalysisSchema
} from "./chunk-CCUCZVAV.js";

// src/handlers/triage.ts
import { generateObject } from "ai";
async function triageItem(content, model) {
  if (!content) {
    throw new Error("Content is required");
  }
  const result = await generateObject({
    model,
    schema: triageAnalysisSchema,
    prompt: `Perform a triage analysis of the following item (issue or pull request). Provide issue analysis, code review (if applicable), and an overall triage assessment:

${content}`
  });
  return result.object;
}

export {
  triageItem
};
//# sourceMappingURL=chunk-Z6RWHJPO.js.map