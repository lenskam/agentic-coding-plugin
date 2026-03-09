---
name: agent-orchestration
description: Manage the execution of complex coding tasks through planning, status tracking, and dependency resolution.
tags: [planning, tasks, orchestration]
---

# Agent Orchestration Skill

Use this skill when handling multifaceted developer requests that require multiple steps, backtracking, or stateful task management.

## Capabilities
- **Plan Task Graph**: Decompose a high-level request into a structured graph of actionable subtasks.
- **Track Status**: Monitor the progress of tasks (pending, running, completed, etc.).
- **Dependency Resolution**: Ensure subtasks are executed in the correct order based on their dependencies.
- **Human Approval**: Request permission for sensitive operations or when plan changes occur.

## Workflow
1. Analyze the request.
2. Generate a task plan with `plan_task`.
3. Present the plan to the user.
4. Upon approval, execute subtasks.
5. Provide periodic status updates.
6. Verify completion once all tasks are finished.
