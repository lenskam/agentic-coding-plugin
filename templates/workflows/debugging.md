---
description: Standard workflow for debugging an issue
---
# Debugging Workflow

When the user reports a bug or asks you to debug an issue:

1. **Reproduce & Understand**: Read the error logs or use `skills/browser-tools/navigate_and_extract.js` to parse failing pages or CI logs.
2. **Trace Code**: Use `skills/file-tools/read_file.js` to investigate the relevant files. DO NOT guess the code structure.
3. **Plan Fix**: If the fix requires multiple steps, use `skills/commands/plan_task.js` to outline them.
4. **Fix & Verify**: Use `skills/file-tools/write_file.js` to implement the fix, then run local tests to verify.
5. **Update Context**: Update task status and use `skills/memory/memory_append.js` to record the root cause and the fix applied.
6. **Commit**: Use `skills/git-tools/safe_commit.sh` with a message starting with "fix:".
