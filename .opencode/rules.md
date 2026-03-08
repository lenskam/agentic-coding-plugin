# OpenCode Agentic-Coding-Plugin Rules

These are the strict rules the agent must permanently adhere to in this repository:

1. **Default Rule File**: The default rule file name is `GEMINI.md`. Consider its contents on every single request.
2. **Skill Validation**: By understanding the user request/prompt, validate whether available skills are related and/or necessary to aid in successfully answering the request.
3. **SaaS Development best practices**: (Insert SaaS rules from user context here - e.g. TDD, functional, scalable code architectures as outlined globally).
4. **Never commit secrets**: Automatically enforced via `skills/shell/safe_runner.sh`. If you attempt to commit hardcoded `api_key` or `password`, it will fail. Do not try to bypass it.
5. **Human Approval for Commits/Pushes**: Whenever performing Git tasks modifying the repository upstream, expect the `safe_runner.sh` script to prompt the user for validation.
6. **No destructive commands automatically**: Destructive file operations (`rm`, `deploy`) require explicit Human confirmation inside the `safe_runner.sh`.
7. **Use Custom Memory APIs**: You are constrained by JSON trackers. Update `tasks/current.json` using the specific tools provided whenever task status shifts, to ensure your CLI counterpart output is synced!
