# @agentic-dev-library/triage

**AI-powered GitHub bots that just work.** Set your API key, drop a workflow file, get intelligent automation.

[![npm](https://img.shields.io/npm/v/@agentic-dev-library/triage)](https://www.npmjs.com/package/@agentic-dev-library/triage)
[![CI](https://github.com/agentic-dev-library/triage/actions/workflows/ci.yml/badge.svg)](https://github.com/agentic-dev-library/triage/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/agentic-dev-library/triage/badge.svg?branch=main)](https://coveralls.io/github/agentic-dev-library/triage?branch=main)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🤖 The Bots

| Bot | Trigger | What It Does |
|-----|---------|--------------|
| **@sage** | `@sage <question>` | Q&A, task decomposition, agent routing |
| **@curator** | `@curator` or auto on new issues | Triage, labeling, assignment |
| **@fixer** | `@fixer` on PRs | CI failure analysis, fix suggestions |
| **@harvester** | `@harvester` | Merge queue management |
| **@guardian** | `@guardian` or auto on PRs | Enterprise standards enforcement |

## ⚡ Quick Start

### 1. Add the Workflow

Create `.github/workflows/triage-bots.yml`:

```yaml
name: Triage Bots

on:
  issue_comment:
    types: [created]
  issues:
    types: [opened]
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  sage:
    if: contains(github.event.comment.body, '@sage')
    runs-on: ubuntu-latest
    steps:
      - uses: agentic-dev-library/triage@v1
        with:
          bot: sage
          query: ${{ github.event.comment.body }}
          issue_number: ${{ github.event.issue.number }}
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}

  curator:
    if: github.event_name == 'issues'
    runs-on: ubuntu-latest
    steps:
      - uses: agentic-dev-library/triage@v1
        with:
          bot: curator
          issue_number: ${{ github.event.issue.number }}
```

### 2. Set Your API Key

Add **any one** of these secrets to your repo (Settings → Secrets → Actions):

- `ANTHROPIC_API_KEY` → Uses Claude
- `OPENAI_API_KEY` → Uses GPT-4
- `GOOGLE_API_KEY` → Uses Gemini
- `GROQ_API_KEY` → Uses Groq
- `MISTRAL_API_KEY` → Uses Mistral
- `OLLAMA_API_KEY` → Uses Ollama Cloud

**That's it!** The bots auto-detect which provider to use.

## 🔧 No Server Required

Triage runs entirely in GitHub Actions. You don't host anything.

- ✅ Zero infrastructure
- ✅ Free for public repos
- ✅ Your secrets stay in your repo
- ✅ Works with any AI provider

## 📦 As a Package

```bash
npm install @agentic-dev-library/triage
```

```typescript
import { generate, detectProvider } from '@agentic-dev-library/triage/ai';

// Auto-detects provider from environment
const provider = await detectProvider();
console.log(`Using ${provider.name} with ${provider.modelId}`);

// Generate text
const response = await generate('Explain this code...', {
  system: 'You are a helpful code reviewer.',
});
```

## 🎯 Individual Bot Actions

For more control, use the individual bot actions:

```yaml
# @sage - Q&A
- uses: agentic-dev-library/triage/actions/sage@v1
  with:
    query: 'How do I fix this test?'
    mode: answer  # answer, decompose, route, unblock

# @curator - Triage
- uses: agentic-dev-library/triage/actions/curator@v1
  with:
    issue_number: ${{ github.event.issue.number }}
    apply_labels: 'true'

# @fixer - CI Analysis
- uses: agentic-dev-library/triage/actions/fixer@v1
  with:
    pr_number: ${{ github.event.pull_request.number }}

# @harvester - Merge Queue
- uses: agentic-dev-library/triage/actions/harvester@v1
  with:
    command: status  # status, add, remove

# @guardian - Standards
- uses: agentic-dev-library/triage/actions/guardian@v1
  with:
    pr_number: ${{ github.event.pull_request.number }}
    checks: 'sha-pinning,conventional-commits,license'
```

## 🛡️ Guardian Checks

| Check | Description |
|-------|-------------|
| `sha-pinning` | GitHub Actions pinned to exact SHAs |
| `conventional-commits` | PR titles follow conventional format |
| `license` | MIT license, no GPL/LGPL |
| `semver` | Valid semantic versioning |
| `changelog` | CHANGELOG.md exists |
| `branch-naming` | Branch follows naming convention |
| `required-files` | Required files exist |

## 🔌 Supported Providers

Auto-detected based on API key:

| Provider | API Key Variable | Default Model |
|----------|-----------------|---------------|
| Anthropic | `ANTHROPIC_API_KEY` | claude-sonnet-4-20250514 |
| OpenAI | `OPENAI_API_KEY` | gpt-4o |
| Google | `GOOGLE_API_KEY` | gemini-2.0-flash |
| Groq | `GROQ_API_KEY` | llama-3.3-70b-versatile |
| Mistral | `MISTRAL_API_KEY` | mistral-large-latest |
| DeepSeek | `DEEPSEEK_API_KEY` | deepseek-chat |
| xAI | `XAI_API_KEY` | grok-2 |
| Together.ai | `TOGETHER_API_KEY` | meta-llama/Llama-3.3-70B-Instruct-Turbo |
| Azure | `AZURE_OPENAI_API_KEY` | gpt-4o |
| AWS Bedrock | `AWS_ACCESS_KEY_ID` | claude-3-5-sonnet |
| Ollama | `OLLAMA_API_KEY` | llama3.3 |

## 🖥️ CLI Usage

```bash
# Install globally
npm install -g @agentic-dev-library/triage

# Ask a question
triage sage "How do I implement authentication?"

# Decompose a task
triage sage "Build a user dashboard" --decompose

# Route to best agent
triage sage "Fix this performance issue" --route

# Run MCP server for Claude/Cursor
triage mcp-server
```

## 📚 Documentation

- [Full Bot Workflow Example](./examples/install-bots.yml)
- [API Documentation](./docs/)
- [Contributing](./CONTRIBUTING.md)

## License

MIT © [Jon Bogaty](https://jonbogaty.com)
