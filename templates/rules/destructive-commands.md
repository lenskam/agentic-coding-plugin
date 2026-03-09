---
name: destructive-command-check
description: Triggers a manual confirmation request for destructive operations like rm and deploy.
condition: "rm or deploy"
action: approval
---

# Destructive Operations Rule

Certain actions like file removal and production deployment can have profound and irreversible effects. To prevent accidents, these operations must be explicitly confirmed.

## Guidance
Please verify you are in the correct directory and environment before clicking the approve button.
