/**
 * Unit tests for core schemas
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Example schemas - these would be imported from the package
const IssueSchema = z.object({
    id: z.string(),
    title: z.string(),
    body: z.string().optional(),
    priority: z.enum(['critical', 'high', 'medium', 'low', 'backlog']),
    type: z.enum(['bug', 'feature', 'task', 'epic', 'chore', 'docs']),
    labels: z.array(z.string()),
});

const TriageResultSchema = z.object({
    priority: z.enum(['critical', 'high', 'medium', 'low', 'backlog']),
    type: z.enum(['bug', 'feature', 'task', 'epic', 'chore', 'docs']),
    labels: z.array(z.string()),
    agent: z.enum(['sage', 'cursor', 'jules', 'claude', 'ollama']).optional(),
    effort: z.enum(['xs', 's', 'm', 'l', 'xl']).optional(),
});

describe('Core Schemas', () => {
    describe('IssueSchema', () => {
        it('should validate a valid issue', () => {
            const issue = {
                id: '123',
                title: 'Fix login bug',
                body: 'Users cannot log in',
                priority: 'high',
                type: 'bug',
                labels: ['bug', 'auth'],
            };

            const result = IssueSchema.safeParse(issue);
            expect(result.success).toBe(true);
        });

        it('should reject invalid priority', () => {
            const issue = {
                id: '123',
                title: 'Test',
                priority: 'urgent', // invalid
                type: 'bug',
                labels: [],
            };

            const result = IssueSchema.safeParse(issue);
            expect(result.success).toBe(false);
        });

        it('should allow optional body', () => {
            const issue = {
                id: '123',
                title: 'Quick fix',
                priority: 'low',
                type: 'chore',
                labels: [],
            };

            const result = IssueSchema.safeParse(issue);
            expect(result.success).toBe(true);
        });
    });

    describe('TriageResultSchema', () => {
        it('should validate a complete triage result', () => {
            const result = {
                priority: 'high',
                type: 'bug',
                labels: ['bug', 'priority:high'],
                agent: 'cursor',
                effort: 'm',
            };

            const parsed = TriageResultSchema.safeParse(result);
            expect(parsed.success).toBe(true);
        });

        it('should allow minimal triage result', () => {
            const result = {
                priority: 'medium',
                type: 'feature',
                labels: [],
            };

            const parsed = TriageResultSchema.safeParse(result);
            expect(parsed.success).toBe(true);
        });
    });
});
