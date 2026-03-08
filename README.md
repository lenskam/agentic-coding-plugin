# OpenCode Antigravity-Like Agentic Setup

This repository provides an autonomous coding assistant framework, configuring OpenCode to operate with structured task management, custom MCP servers, constrained execution, and memory persistence.

## Installation

You can install this plugin into any OpenCode project to instantly grant it autonomous capabilities:

```bash
npx agentic-coding-plugin install
```

This will copy all the core logic (`skills/`, `workflows/`, `tasks/`, `rules/`, `memory/`, `artifacts/`, and `.opencode/`) directly into your current workspace.

## Setup
1. Once installed, adjust `.env.example` to `.env` and fill in necessary API keys if utilizing the specific MCP servers.
2. Run the `opencode` CLI in that directory. 

The `.opencode/config.yaml` natively boots the `MiniMax M2.5 Free` model, loads the required plugin instructions, syncs the persistence loop via the `artifacts/` folder tools, and applies strict user-approval shell execution rules.
