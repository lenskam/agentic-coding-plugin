---
name: require-approval-commit
description: Triggers a manual confirmation request for git commits.
condition: "git commit"
action: approval
---

# Git Commit Approval Rule

All git commits require explicit human confirmation to maintain a high-quality audit log and prevent accidental changes.

## Guidance
Please review your changes and the commit message one last time before approving.
