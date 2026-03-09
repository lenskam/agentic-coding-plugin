# Tool Reference (API) 🛠️

The Antigravity plugin exposes several tools to the OpenCode environment. These are categorized into **Core Commands**, **File Tools**, and **Search/Memory**.

## Core Commands

### `plan`
Decomposes a complex request into a structured task graph.
- **Arguments**:
  - `request` (string): The high-level task to plan.
- **Output**: A list of tasks with descriptions and dependencies.

### `status`
Displays the current state of tasks in the active session.
- **Output**: JSON or Markdown summary of task statuses.

### `undo_preview`
Shows a summary of all file changes that will be rolled back.
- **Output**: List of files to be restored or deleted.

### `undo_confirm`
Executes the session-level rollback.
- **Result**: Restores original file content and unlinks newly created files.

### `show_changes`
Displays detailed diffs of all modifications made in the current session.
- **Output**: Git-style diff representation.

---

## File Tools

### `write_file`
Writes content to a file while automatically tracking the change.
- **Arguments**:
  - `path` (string): Destination file path.
  - `content` (string): The content to write.
- **Behavior**: Calls the Python backend to record the original state before writing.

---

## Search & Memory

### `search`
Performs a hybrid search (keyword + semantic memory).
- **Arguments**:
  - `query` (string): Search term or question.
- **Behavior**: 
  - Searches local files using `grep`.
  - Searches ChromaDB for related session memory.

### `memory_search` (Backend Only)
Direct semantic search against the ChromaDB vector store.

---

## Safety & Rules

### `checkRules`
Evaluates a proposed action against the rules engine.
- **Arguments**:
  - `action`: The action name (e.g., `git-commit`, `write_file`).
  - `content` (optional): The code or data being processed.
- **Output**: `allowed`, `warn`, or `block` with an explanation.
