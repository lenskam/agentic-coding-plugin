# agentic-coding-plugin – GEMINI.md (Compressed)

## 0. Table of Contents

_Full reference: [TECH_DEFS.md](@file:docs/dev/TECH_DEFS.md)_

- [agentic-coding-plugin – GEMINI.md (Compressed)](#agentic-coding-plugin--geminimd-compressed)
  - [0. Table of Contents](#0-table-of-contents)
  - [1. 📋 Project Overview](#1--project-overview)
  - [2. 🛠 Technology Stack](#2--technology-stack)
  - [3. 🏗 Architecture \& Design Patterns](#3--architecture--design-patterns)
  - [4. 🌿 Git Workflow](#4--git-workflow)
  - [5. 🚀 Deployment \& CI/CD](#5--deployment--cicd)
  - [6. 📚 Documentation Guidelines](#6--documentation-guidelines)
  - [7. 📐 Coding Standards](#7--coding-standards)
  - [8. 🧪 Testing Strategy](#8--testing-strategy)
  - [9. 🔧 Environment Setup](#9--environment-setup)
  - [10. 🎯 AI Productivity Configuration](#10--ai-productivity-configuration)
  - [11. 🤖 AI-Specific Instructions](#11--ai-specific-instructions)
  - [12. ⚙️ Custom Commands](#12-️-custom-commands)
    - [In-Conversation Commands](#in-conversation-commands)
    - [Standalone CLI Wrappers](#standalone-cli-wrappers)
  - [13. 🔌 MCP Integration](#13--mcp-integration)
  - [14. 📜 Rules](#14--rules)
    - [Rule Format](#rule-format)
    - [Rule Actions](#rule-actions)
    - [Default Rules](#default-rules)
    - [Required Checks](#required-checks)
  - [15. 📦 NPM Installation \& Distribution](#15--npm-installation--distribution)
    - [Installation](#installation)
    - [What Gets Installed](#what-gets-installed)
    - [First-Run Setup](#first-run-setup)
    - [Default LLM Configuration](#default-llm-configuration)
  - [16. 📝 Revision History](#16--revision-history)

---

## 1. 📋 Project Overview

**Purpose**: OpenCode plugin providing Antigravity-like autonomous coding assistance with planning, task management, memory, and human approval.

**Key Features**:

- Planning & task decomposition with dependency graphs
- Full task state machine (pending→completed→failed→retrying)
- Markdown-based rules engine with YAML frontmatter
- ChromaDB vector memory for long-term recall
- Per-session file tracking with undo capability
- Session-identified artifact storage
- Automatic MCP server configuration (filesystem, GitHub, Playwright)
- Human-in-the-loop via OpenCode permission system
- 7-phase modular implementation

**User Roles**: Developer (requests/approves) / AI Agent (executes)

---

## 2. 🛠 Technology Stack

| Component              | Technology                                                                             |
| :--------------------- | :------------------------------------------------------------------------------------- |
| **Core Languages**     | Python (logic), TypeScript (tools), YAML/Markdown/JSON (config)                        |
| **Runtime**            | Node.js 18+, Python 3.9+                                                               |
| **Agent Framework**    | OpenCode (plugin architecture)                                                         |
| **Browser Automation** | Playwright (MCP server)                                                                |
| **LLM Backend**        | Kimi (primary), Groq (default API), Gemini Flash (edge cases) – reuses OpenCode config |
| **Vector Database**    | ChromaDB (local, file-based)                                                           |
| **MCP Servers**        | filesystem, tavily (search), github, playwright                                        |
| **Version Control**    | Git + GitHub MCP server                                                                |
| **Persistence**        | ChromaDB (memory), SQLite (file tracking), JSON (tasks), filesystem (artifacts)        |

---

## 3. 🏗 Architecture & Design Patterns

**Core Architecture**: OpenCode agent loop with modular Python components exposed via TypeScript custom tools.

```
OpenCode Agent Loop
├── Planning Module (planner.py) – LLM-based task decomposition
├── Task Manager (task_manager.py) – State machine + dependency resolution
├── Rules Engine (rules_engine.py) – Evaluates Markdown rules
├── Memory Store (memory.py) – ChromaDB vector search
├── File Tracker (file_tracker.py) – SQLite diff storage
├── Artifact System (artifacts.py) – Session-prefixed file storage
├── Browser Tools – Playwright MCP integration
├── GitHub Tools – GitHub MCP integration
└── Human Approval – OpenCode permission system + request_approval tool
```

**Project Structure** (post-installation):

```
project/
├── .opencode/                      # OpenCode configuration
│   ├── plugins/                     # Plugin symlink
│   ├── tools/                        # Custom tool symlinks
│   ├── skills/                        # User-defined skills
│   ├── rules/                          # Markdown rule files
│   ├── prompts/                        # System prompts
│   └── opencode.json                    # Main config
└── .agentic-coding/                   # Plugin private data
    ├── venv/                            # Python virtual environment
    ├── chroma/                            # ChromaDB vector store
    ├── file_tracker.db                     # SQLite database
    ├── artifacts/                           # Session artifacts
    └── tasks/                                # Task state
        └── current.json
```

**State Management**:

- Tasks: JSON with states (pending/running/completed/failed/blocked/retrying)
- Memory: ChromaDB vectors with session metadata
- File Changes: SQLite diffs tagged by session
- Artifacts: Filesystem with session ID prefix

---

## 4. 🌿 Git Workflow

**Branching**: `main` (production), `develop` (integration), `feature/*`, `bugfix/*`, `release/*`

**Commits**: Conventional Commits format

```
feat: add user authentication
fix: handle null pointer
docs: update README
test: add unit tests
refactor: simplify logic
chore: update dependencies
```

**PR Process**: One reviewer, CI passes, issue linked, template completed

---

## 5. 🚀 Deployment & CI/CD

**Plugin Publishing**:

```bash
npm run build
npm publish --access public
```

**Versioning**: Semantic versioning with CHANGELOG.md and git tags

---

## 6. 📚 Documentation Guidelines

**Code Docs**:

- TypeScript: JSDoc with param/return descriptions
- Python: Google-style docstrings
- Focus on "why" not "what"

**Project Docs**:

- `README.md` – Setup, quick start
- `API.md` – Tool reference
- `WORKFLOWS.md` – Example workflows
- `RULES.md` – Creating custom rules
- `ARCHITECTURE.md` – Design overview

---

## 7. 📐 Coding Standards

| Language   | Conventions                    | Linting                |
| :--------- | :----------------------------- | :--------------------- |
| TypeScript | camelCase, PascalCase, 2-space | ESLint + Prettier      |
| Python     | snake_case, PEP8, 4-space      | Black + Flake8 + isort |
| YAML/JSON  | 2-space indent                 | -                      |

**Quality Gates**:

- ✅ Lint passes
- ✅ TypeScript compiles
- ✅ Tools tested with sample input
- ✅ Documentation updated
- ✅ No debug logs
- ✅ Skills executable (`chmod +x`)

---

## 8. 🧪 Testing Strategy

**Unit Tests**: Jest (TypeScript), pytest (Python)

**Integration Tests**: Tool-MCP interactions with mocked servers

**E2E Tests**: Full user request simulation with approval flows

**Commands**:

```bash
npm test          # all tests
npm test -- core  # specific suite
npm run test:coverage
```

---

## 9. 🔧 Environment Setup

**Prerequisites**:

```bash
node -v  # 18+
python3 --version  # 3.9+
npm install -g opencode
```

**Installation**:

```bash
opencode add @your-org/agentic-coding
export GITHUB_TOKEN="your-token"
export BRAVE_API_KEY="your-key"  # optional
opencode tool verify-setup
```

**Post-Install Structure** (auto-created):

- `.opencode/` – Configuration, rules, prompts
- `.agentic-coding/` – Python venv, ChromaDB, SQLite, artifacts, tasks

---

## 10. 🎯 AI Productivity Configuration

**Two-Level System**:

- User-level: `~/.gemini/GEMINI.md` (global preferences)
- Project-level: This file (project-specific rules)

**Living Document**: Update when AI repeats mistakes

**✅ Good / ❌ Bad Examples**:

| Category        | ❌ Bad                     | ✅ Good                       |
| :-------------- | :------------------------- | :---------------------------- |
| Tool Creation   | New `read_json.py`         | Extend `read_file.js`         |
| Error Handling  | `catch(e){console.log(e)}` | Log + throw ToolError         |
| Memory Usage    | No logging                 | `memory_search` + log results |
| Rule Compliance | Ignore violations          | Check rules before actions    |

---

## 11. 🤖 AI-Specific Instructions

**Core Behaviors**:

1. **Explain reasoning** – Show thought process for decisions
2. **Suggest tests** – Propose test cases for new functionality
3. **Flag issues** – Performance, security, edge cases
4. **Plan before code** – >5 steps → generate plan + get approval
5. **Consult memory** – Search past sessions before starting

**Planning Protocol**:

```
request → plan_task → present task graph → wait approval → execute in order → update_status
```

**File Change Protocol**:

- Changes auto-tracked by `file_tracker`
- `undo_last_changes` shows diff preview before reverting
- Reverts only current session changes

**Artifact Protocol**:

- `save_artifact` → auto-prefixes with session ID
- `list_artifacts` → shows session outputs
- `get_artifact` → retrieves by name (with/without session ID)

---

## 12. ⚙️ Custom Commands

### In-Conversation Commands

| Command                   | Purpose                | Implementation            |
| :------------------------ | :--------------------- | :------------------------ |
| `/plan <request>`         | Generate task plan     | `plan_task` tool          |
| `/status`                 | Show current tasks     | Read `tasks/current.json` |
| `/artifacts list`         | List session artifacts | `list_artifacts` tool     |
| `/artifacts view <name>`  | View artifact          | `get_artifact` tool       |
| `/changes show`           | Show session diffs     | `file_tracker.diff()`     |
| `/undo preview`           | Preview revert         | Shows diff of undo        |
| `/undo confirm`           | Execute undo           | `undo_last_changes`       |
| `/browser start`          | Start browser session  | Playwright MCP            |
| `/browser navigate <url>` | Navigate               | Playwright MCP            |
| `/memory search <query>`  | Search past sessions   | `memory_search` tool      |
| `/approve`                | Approve pending action | Permission system         |

### Standalone CLI Wrappers

```bash
opencode-artifact list
opencode-changes show
opencode-browser start
opencode-undo preview
```

---

## 13. 🔌 MCP Integration

**Auto-Configured Servers** (in `opencode.json`):

```json
{
  "mcp": {
    "servers": [
      {
        "name": "filesystem",
        "command": "npx -y @modelcontextprotocol/server-filesystem",
        "args": ["."]
      },
      {
        "name": "tavily",
        "command": "npx -y @modelcontextprotocol/server-tavily",
        "env": { "TAVILY_API_KEY": "${TAVILY_API_KEY}" }
      },
      {
        "name": "github",
        "command": "npx -y @modelcontextprotocol/server-github",
        "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
      },
      { "name": "playwright", "command": "npx -y @playwright/mcp" }
    ]
  }
}
```

**Tool Integration**:

- Filesystem: `file_tracker` uses for diff storage
- GitHub: `github_create_pr`, `github_list_prs`, `github_merge_pr`
- Playwright: `browser_navigate`, `browser_click`, `browser_extract`
- Tavily: Web search for research tasks

**Workflow**:

```
Request → /plan → execute skills → call MCP tools → approvals → report/PR
```

---

## 14. 📜 Rules

### Rule Format

Each rule is a `.md` file in `.opencode/rules/` with YAML frontmatter:

```yaml
---
name: no-secret-commit
description: Prevent committing secrets
condition: "git commit and file contains 'api[_-]?key|secret|password'"
action: block
---
Explanation text...
```

### Rule Actions

- `block` – Prevents action with error
- `warn` – Logs warning, proceeds
- `approval` – Triggers permission system

### Default Rules

| File                  | Purpose                       |
| :-------------------- | :---------------------------- |
| `security.md`         | Block secret commits          |
| `coding-standards.md` | Warn on missing tests         |
| `git-protection.md`   | Require approval for git push |

### Required Checks

1. **Default Baseline**: Always consider `GEMINI.md` contents
2. **Skill Validation**: Verify skills are relevant to request
3. **SaaS Guidelines**: For SaaS projects, enforce TDD + decoupled architecture
4. **Sensitive Actions**: Always require approval for commit/push/rm/deploy

**Enforcement**:

```python
result = rules_engine.evaluate(action, context)
if result.action == "block": abort()
if result.action == "approval": request_approval()
```

---

## 15. 📦 NPM Installation & Distribution

### Installation

```bash
# Global installation (adds CLI wrappers)
npm install -g @your-org/agentic-coding

# Or project installation
npm install --save-dev @your-org/agentic-coding
opencode add @your-org/agentic-coding
```

### What Gets Installed

1. **Plugin files** → `.opencode/plugins/@your-org-agentic-coding/`
2. **Tool symlinks** → `.opencode/tools/` (pointing to plugin)
3. **Templates** → Default rules/prompts/skills copied to `.opencode/`
4. **Python environment** → Created in `.agentic-coding/venv/`
5. **MCP servers** → Auto-added to `opencode.json`
6. **CLI wrappers** → Added to PATH

### First-Run Setup

- Verifies Python environment
- Installs Python dependencies
- Initializes ChromaDB
- Creates SQLite database
- Copies example files
- Runs `verify-setup`

### Default LLM Configuration

```json
{
  "llm": {
    "provider": "openrouter",
    "model": "kimi/kimi-v1",  # Primary
    "apiKey": "${LLM_API_KEY}"
  }
}
```

_Groq and Gemini Flash available for specific task types_

---

## 16. 📝 Revision History

| Date       | Change                              | Reason                     |
| :--------- | :---------------------------------- | :------------------------- |
| 2026-03-08 | Initial creation                    |                            |
| 2026-03-09 | Moved rules/prompts to `.opencode/` | Cleaner project root       |
| 2026-03-09 | Added CLI wrapper commands          | Direct feature access      |
| 2026-03-09 | Enhanced artifact system            | Session-based traceability |
| 2026-03-09 | Added file tracking + undo          | Mistake recovery           |
| 2026-03-09 | ChromaDB vector memory              | Long-term learning         |
| 2026-03-09 | Markdown rule format                | User-editable rules        |
| 2026-03-09 | Automatic MCP configuration         | Zero-touch setup           |
| 2026-03-09 | Browser automation commands         | Web research               |
| 2026-03-09 | NPM distribution                    | Portable deployment        |

---

**End of Compressed GEMINI.md**
