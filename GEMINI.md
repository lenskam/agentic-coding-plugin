# agentic-coding-plugin – GEMINI.md (Compressed)

## 0. Table of Contents
View file @file:docs/dev/TECH_DEFS.md

1. [📋 Project Overview](#1--project-overview)
2. [🛠 Technology Stack](#2--technology-stack)
3. [🏗 Architecture & Design Patterns](#3--architecture--design-patterns)
4. [🌿 Git Workflow](#4--git-workflow)
5. [🚀 Deployment & CI/CD](#5--deployment--cicd)
6. [📚 Documentation Guidelines](#6--documentation-guidelines)
7. [📐 Coding Standards](#7--coding-standards)
8. [🧪 Testing Strategy](#8--testing-strategy)
9. [🔧 Environment Setup](#9--environment-setup)
10. [🎯 AI Productivity Configuration](#10--ai-productivity-configuration)
11. [🤖 AI-Specific Instructions](#11--ai-specific-instructions)
12. [⚙️ Custom Commands](#12--custom-commands)
13. [🔌 MCP Integration](#13--mcp-integration)
14. [📜 Rules](#14--rules)
15. [📝 Revision History](#15--revision-history)

---

## 1. 📋 Project Overview
**Purpose**: Local autonomous coding assistant (Antigravity-like) on OpenCode.  
**Key Features**: Planning, task execution, skills (file/shell/git/browser/GitHub), human approval, MCP servers, persistent memory, workflows.  
**User Roles**: Developer (gives requests, approves actions) / AI Agent (executes).

---

## 2. 🛠 Technology Stack
- **Languages**: Python, JavaScript, YAML, Markdown, JSON  
- **Runtime**: Node.js 18+, Python 3.9+  
- **Agent Framework**: OpenCode (configurable)  
- **Browser Automation**: Playwright (MCP)  
- **LLM**: Local (Ollama) or free API (DeepSeek/Kimi via OpenRouter)  
- **MCP Servers**: filesystem, brave-search, github, playwright  
- **Git**: Git + GitHub CLI (`gh`)  
- **Persistence**: JSON files (`memory/session.json`, `tasks/current.json`); optional vector search (ChromaDB)

---

## 3. 🏗 Architecture & Design Patterns
**Overall Architecture**: OpenCode agent loop with modular components: Planning, Task Manager, Skills, MCP, Rules, Memory, Browser, Workflow Runner.  
**Structure**:



rules/ workflows/ skills/ tasks/ memory/ mcp/ browser/ prompts/ config/ logs/

**State Management**: Task state in `tasks/current.json`, memory in `memory/session.json`.

---

## 4. 🌿 Git Workflow
**Branching**: `main`, `develop`, `feature/*`, `bugfix/*`, `release/*`  
**Commits**: Conventional Commits (`feat:`, `fix:`, etc.)  
**PR Process**: 1 reviewer, CI passes, link to issue, use PR template.

---

## 5. 🚀 Deployment & CI/CD
*For projects built by the agent, not the plugin itself.*  
Plugin updates via git.

---

## 6. 📚 Documentation Guidelines
- **Code**: JSDoc/Python docstrings for skills; explain *why* not *what*.  
- **Project**: README (setup), ARCHITECTURE.md (design), CHANGELOG.md.

---

## 7. 📐 Coding Standards
- **JS**: camelCase, PascalCase, ESLint + Prettier.  
- **Python**: snake_case, PEP8, Black + Flake8.  
- **YAML/JSON**: 2-space indent.  
- **Quality Gates**: lint, executable, test, docs, no debug logs.

---

## 8. 🧪 Testing Strategy
- **Unit**: Jest (JS) / pytest (Python).  
- **Integration**: Test skill–MCP interaction.  
- **E2E**: Simulate full user request.  
- **Commands**: `npm test`, `npm run test:coverage`.

---

## 9. 🔧 Environment Setup
**Prerequisites**: Node 18+, Python 3.9+, Playwright, `gh`, OpenCode, MCP servers.  
**Setup**: clone repo, copy `.env`, `npm install`, create dirs, `chmod +x skills/**/*`.  
**Verification**: run `node config/verify-setup.js`.

---

## 10. 🎯 AI Productivity Configuration
- **User-level** global `GEMINI.md` (personal preferences) vs **project-level** (this file).  
- **Living Document**: Update when AI repeats mistakes.  
- **✅/❌ Examples**: Skill reuse, error handling, memory logging.

---

## 11. 🤖 AI-Specific Instructions
- Explain reasoning, suggest tests, flag issues.  
- **Plan Before Code**: For >5 steps, generate plan and get approval.  
- **Parallel Execution**: Use separate terminals/clones.  
- **Human Approval**: Always call `request_approval` before sensitive actions (commit, push, rm, deploy).

---

## 12. ⚙️ Custom Commands
| Command     | Purpose                      | Implementation                     |
|-------------|------------------------------|-------------------------------------|
| `/plan`     | Decompose request → tasks    | Call `plan_task` tool               |
| `/status`   | Show current task list       | Read `tasks/current.json`           |
| `/browse`   | Navigate URL, extract text   | `browser_navigate` skill            |
| `/github-pr`| Create pull request          | `github_create_pr` skill            |
| `/lint`     | Run linters and fix          | `npm run lint:fix`                   |
| `/test`     | Run test suite               | `npm test`                           |
| `/memory`   | Search past sessions         | (optional) `memory_search` skill    |

*Each command follows a simple SOP (e.g., `/plan`: call `plan_task`, save tasks, ask approval).*

---

## 13. 🔌 MCP Integration
**Servers** (in `mcp/servers.json`):
- filesystem, brave-search (needs API key), github (needs token), playwright.  
**Automated Workflow**: Request → `/plan` → execute skills → approvals → report/PR.

---

## 14. 📜 Rules
From `rules/agent-rules.yaml` & `.opencode/rules.md`:
- **Default Baseline**: The default rule file is `GEMINI.md`. Consider its contents on every single request.
- **Skill Validation**: By understanding the user request/prompt, validate whether available skills are related and/or necessary to aid in successfully answering the request.
- **SaaS Architecture Guidelines**: When working on SaaS projects, adhere strictly to scalable best practices (TDD, decoupled components).
- **Block**: commit secrets (grep check).  
- **Warn**: missing tests for new features.  
- **Approval**: before `git commit`, `git push`, `rm`, deploy.

Agent must check rules before any action; if blocked, abort; if approval, call `request_approval` natively.

---

## 15. 📦 NPM Installation & Distribution
This framework can be dynamically installed via NPM: `npx agentic-coding-plugin`.
1. **Core Scaffolding**: It copies `memory/`, `skills/`, `tasks/`, `rules/`, `workflows/`, `mcp/`, `browser/`, `artifacts/`, and `.opencode/` logic into the root user directory dynamically.
2. **Execution**: The `.opencode/config.yaml` points native workflows at the new path locations seamlessly for the user.
3. **Artifact Integration**: Antigravity-like markdown artifacts are persisted into the `artifacts/` folder utilizing the custom `skills/memory/create_artifact.js` tool.
4. **Default LLM**: Configured immediately out-of-the-box to use `MiniMax M2.5 Free`.

---

## 16. 📝 Revision History
| Date       | Change                               | Reason                     |
|------------|--------------------------------------|----------------------------|
| 2026-03-08 | Initial creation                     |                            |
|            | Added browser timeouts               | Slow page loads            |
|            | Approval for git push                | Prevent accidental pushes  |
|            | Skill reuse examples                 | Redundant skills           |
|            | NPM distribution update              | Portable npx deployment    |