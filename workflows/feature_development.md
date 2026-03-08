---
description: Standard workflow for developing a new feature
---
# Feature Development Workflow

When the user asks you to develop a new feature, follow these steps strictly:

1. **Understand & Plan**: Gather requirements and use the `plan_task` command (by calling `skills/commands/plan_task.js`) to generate a JSON array of tasks needed for this feature. Wait for explicit user approval.
2. **Check Status**: Use the `status` tool (by calling `skills/commands/status.js`) to see the current tasks.
3. **Execute**: For each task, use the `file-tools` (`read_file.js`, `write_file.js`) to implement the changes.
4. **Track Progress**: After completing a task, use `skills/memory/manage_tasks.js update <id> "done" "Implementation complete"`.
5. **Log Memory**: Use `skills/memory/memory_append.js` to log significant decisions.
6. **Verify & Commit**: Run local tests, then use `skills/git-tools/safe_commit.sh` and optionally `skills/github-tools/create_pr.js`.
