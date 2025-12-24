import { describe, expect, it } from 'vitest';
import { createIssueTool, getIssueTool, updateIssueTool } from '../src/tools/issue.js';

describe('Issue Tools', () => {
    it('should have correct descriptions', () => {
        expect(createIssueTool.description).toBe('Create a new issue.');
        expect(getIssueTool.description).toBe('Get an issue by its ID.');
        expect(updateIssueTool.description).toBe('Update an existing issue.');
    });
});
