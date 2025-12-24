import { type LanguageModel, streamText, tool } from 'ai';
import { issueAnalysisSchema } from '../schemas/index.js';

/**
 * Analyze an issue using the provided language model.
 *
 * @param issueBody - The content of the issue to analyze
 * @param model - The Vercel AI SDK model to use
 * @returns A stream result from streamText
 */
export async function analyzeIssue(issueBody: string, model: LanguageModel): Promise<any> {
    try {
        if (!issueBody) {
            throw new Error('Issue body is required');
        }

        const result = await streamText({
            model,
            prompt: `Analyze the following issue and provide a summary, impact, and suggestions:\n\n${issueBody}`,
            tools: {
                analyze: tool({
                    description: 'Analyze the issue.',
                    parameters: issueAnalysisSchema,
                    execute: async (input: any) => input,
                } as any),
            },
        });

        return result;
    } catch (error) {
        console.error('Error in analyzeIssue:', error);
        throw error;
    }
}
