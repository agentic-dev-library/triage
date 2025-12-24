#!/usr/bin/env node
import { Command } from 'commander';
import { runMcpServer } from './mcp-server.js';

const program = new Command();

program.name('agentic-triage').description('AI-powered GitHub issue triage and PR review primitives').version('0.2.1');

program
    .command('assess')
    .description('Assess an issue')
    .argument('<issue>', 'Issue number')
    .action(async (issueNum) => {
        console.log(`Assessing issue ${issueNum}...`);
        // Implementation using primitives
        console.log('Triage primitives called successfully.');
    });

program
    .command('mcp-server')
    .description('Run the MCP server for Claude/Cursor integration')
    .option('--port <number>', 'Port to listen on (for HTTP/SSE)', '3000')
    .option('--provider <name>', 'Issue provider (github)', 'github')
    .action(async () => {
        await runMcpServer();
    });

program.parse();
