# Antigravity Agentic Coding Plugin 🚀

The **Antigravity Agentic Coding Plugin** is a powerful, autonomous coding assistant framework designed specifically for **OpenCode**. It transforms your development environment into an agentic powerhouse with structured task management, semantic memory, AST-level safety rules, and session-based undo capabilities.

## 🌟 Key Features

- **🧠 Autonomous Planning**: Decomposes complex requests into a structured task graph with dependencies.
- **💾 Semantic Memory**: Utilizes ChromaDB to remember past sessions, findings, and decisions.
- **🛡 AST-Level Safety**: A rules engine that analyzes Python Abstract Syntax Trees to prevent dangerous operations.
- **🔍 Hybrid Search**: Combines blazingly fast `grep` keyword search with semantic memory retrieval.
- **⏪ Advanced Session Revert**: Full-session rollback capability. Revert multiple file changes and even deletions in one go.
- **📂 Artifact Management**: Organized session-prefixed storage for generated files, logs, and research.
- **⚙️ OpenCode Native**: Deep integration with OpenCode's tool and rule system.

---

## 🚀 Installation

Install the plugin into your project with a single command:

```bash
npx @lens.kamdem/agentic-coding-plugin
```

### What happens during installation?

1.  **Core Logic**: All complex backend logic is placed in a hidden `.agentic-coding/` directory.
2.  **Configuration**: An `.opencode/` folder is created at your project root, pre-configured to hook into the Antigravity framework.

---

## 🛠 Setup

1.  **Environment Variables**: Create a `.env` file (inspired by `.env.example`) and add your LLM API keys.
2.  **Python Environment**:
    ```bash
    python3 -m venv .agentic-coding/venv
    ./.agentic-coding/venv/bin/pip install -r .agentic-coding/python/requirements.txt
    ```
3.  **Run OpenCode**:
    ```bash
    opencode
    ```

---

## 📖 How to Use

### Antigravity Features in OpenCode

The plugin exposes several custom tools and commands that you can use directly within your OpenCode sessions:

#### 1. Task Planning (`/plan`)

Ask the agent to plan a complex task. It will return a task graph.

- **Command**: `/plan <request>`
- **Example**: `/plan "Refactor the authentication module to use JWT and add unit tests"`

#### 2. Status Tracking (`/status`)

Check the progress of your current tasks.

- **Command**: `/status`

#### 3. Unified Search (`/search`)

Perform a hybrid search across code and session memory.

- **Command**: `/search <query>`
- **Example**: `/search "How did we handle CORS in the last session?"`

#### 4. Safety Audit (`/checkRules`)

Manually trigger a rule check for a specific action.

- **Command**: `/checkRules <action> --content <optional_code>`

#### 5. Change Management & Undo

Review your work and rollback if something goes wrong.

- **`/changes show`**: View all diffs recorded in the current session.
- **`/undo preview`**: See a summary of what will be reverted.
- **`/undo confirm`**: Execute the rollback (restores files and deletes newly created ones).

---

## 🧩 Advanced: Customizing Rules

Rules are defined as Markdown files with YAML frontmatter in `.opencode/rules/`.

Example rule (`.opencode/rules/no-eval.md`):

```yaml
---
name: forbid-eval
description: Block usage of eval()
condition: "AST contains 'Call(eval)'"
action: block
---
The use of `eval()` is strictly forbidden for security reasons.
```

---

## 📁 Project Structure

```
your-project/
├── .opencode/                  # OpenCode integration hooks
│   ├── tools/                  # Compiled JS tools
│   ├── rules/                  # Safety rules
│   └── opencode.json           # Main plugin config
└── .agentic-coding/            # Antigravity Core (Hidden)
    ├── venv/                   # Python Virtual Environment
    ├── python/                 # Backend logic (planning, memory, rules)
    ├── chroma/                 # Semantic memory database (ChromaDB)
    ├── file_tracker.db         # SQLite change tracking
    └── artifacts/              # Session-prefixed artifacts
```

---

## 📜 License

MIT © [Lenskam](https://github.com/lenskam)
