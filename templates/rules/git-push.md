---
name: require-approval-push
description: Triggers a manual confirmation request for git push operations.
condition: "git push"
action: approval
---

# Git Push Approval Rule

All push operations to the remote repository require human confirmation, especially when modifying mainline branches.

## Guidance
Pushing to the remote can affect CI/CD and your teammates' work. Always verify your changes work locally first.
