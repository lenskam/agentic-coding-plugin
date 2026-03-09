---
name: security-checks
description: Block commits that appear to contain hardcoded secrets.
condition: "git commit and file contains 'api[_-]?key|secret|password'"
action: block
---

# Security Checks Rule

This rule prevents the leaking of sensitive information like API keys, secrets, or passwords into the project's version control.

## Guidance
If your commit is blocked, ensure you have moved your sensitive data into an environment variable or a `.env` file that is ignored by Git.
