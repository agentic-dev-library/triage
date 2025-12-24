import { ollama } from 'ai-sdk-ollama';
import { analyzeIssue } from './handlers/index.js';

async function run() {
    try {
        const issueBody = process.env.INPUT_ISSUE_BODY || '';
        if (!issueBody) {
            console.warn('No issue body found. Set INPUT_ISSUE_BODY environment variable.');
            return;
        }

        // Use default model or from env
        const modelId = process.env.OLLAMA_MODEL || 'llama3';
        const result = await analyzeIssue(issueBody, ollama(modelId));

        console.log('Analysis started successfully.');
        // In a real action, we might wait for the stream to finish and output to GITHUB_OUTPUT
    } catch (error) {
        console.error('Action failed:', error);
        process.exit(1);
    }
}

run().catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
});
