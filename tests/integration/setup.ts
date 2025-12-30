/**
 * Integration test setup
 * 
 * Sets up mocks and fixtures for cross-package testing
 */

import { beforeAll, afterAll, vi } from 'vitest';

// Mock environment for tests
beforeAll(() => {
    // Clear any existing API keys to ensure clean test state
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.OLLAMA_API_KEY;
});

afterAll(() => {
    vi.restoreAllMocks();
});
