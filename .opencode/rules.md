# OpenCode Agentic-Coding-Plugin Rules

These are the strict rules the agent must permanently adhere to in this repository:

1. **Never commit secrets**: Automatically enforced via `skills/shell/safe_runner.sh`. If you attempt to commit hardcoded `api_key` or `password`, it will fail. Do not try to bypass it.
2. **Human Approval for Commits/Pushes**: Whenever performing Git tasks modifying the repository upstream, expect the `safe_runner.sh` script to prompt the user for validation.
3. **No destructive commands automatically**: Destructive file operations (`rm`, `deploy`) require explicit Human confirmation inside the `safe_runner.sh`.
4. **Use Custom Memory APIs**: You are constrained by JSON trackers. Update `tasks/current.json` using the specific tools provided whenever task status shifts, to ensure your CLI counterpart output is synced!
