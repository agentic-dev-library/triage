/**
 * @agentic/triage - Escalation Module
 *
 * 7-level escalation ladder that exhausts all free options
 * before resorting to expensive cloud agents.
 *
 * Levels:
 * - 0: Static Analysis (lint/tsc) - Free, instant
 * - 1: Complexity Evaluation (Ollama) - Free, routes to 2 or 3
 * - 2: Ollama Fix - Free, simple fixes
 * - 3: Jules Session - Free tier, complex work
 * - 4: Jules + Boosted Context - Free tier, more context
 * - 5: Human Review Queue - Free, awaits approval
 * - 6: Cloud Agent (Cursor) - Expensive, requires approval
 *
 * @packageDocumentation
 * @module @agentic/triage/escalation
 */

// Configuration
export {
	type EscalationConfig,
	DEFAULT_ESCALATION_CONFIG,
	createEscalationConfig,
} from './config.js';

// State Management
export {
	type EscalationLevel,
	type EscalationState,
	EscalationStateManager,
} from './state.js';

// Cost Tracking
export {
	type CostEntry,
	type DailyCostStats,
	CostTracker,
} from './cost-tracker.js';

// Escalation Ladder
export {
	type Task,
	type ProcessResult,
	type LevelHandler,
	EscalationLadder,
} from './ladder.js';
