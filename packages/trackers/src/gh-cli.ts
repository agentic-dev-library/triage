import { spawnSync } from 'node:child_process';

/**
 * Get environment with GitHub token
 */
function getGitHubEnv(): NodeJS.ProcessEnv {
    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    return token ? { ...process.env, GH_TOKEN: token } : { ...process.env };
}

/**
 * Run gh CLI command with stdin input
 */
function ghWithInput(args: string[], input: string): string {
    const result = spawnSync('gh', args, {
        input,
        encoding: 'utf-8',
        env: getGitHubEnv(),
        maxBuffer: 10 * 1024 * 1024,
    });

    if (result.error) {
        throw result.error;
    }
    if (result.status !== 0) {
        throw new Error(result.stderr || `gh command failed with status ${result.status}`);
    }
    return result.stdout.trim();
}

export function commentOnIssue(issueNumber: number, body: string): void {
    ghWithInput(['issue', 'comment', String(issueNumber), '--body-file', '-'], body);
}

export function commentOnPR(prNumber: number, body: string): void {
    ghWithInput(['pr', 'comment', String(prNumber), '--body-file', '-'], body);
}
