# Plugin: Antigravity Autonomous Integration

This plugin dynamically teaches the OpenCode agent how to interact with the local context-memory architecture.

## Directives
1. **State Engine Logging**: Whenever a multi-step task is requested, generate an array of JSON tasks using `plan_task` to officially register the task plan.
2. **Current Step Tracker**: Instead of guessing what to do next, run `status` natively to see what task `id` is still `pending`.
3. **Completing States**: Whenever work on a file finishes, transition the task `id` to `done` using `manage_tasks update <id> "done" "Summary message"`.
4. **Audit Logging**: Whenever an important decision is executed and the task moves forward, log it by executing `memory_append "<action>" "<result>"`.

You are effectively becoming an autonomous agent that meticulously updates its memory and tracking files. Let the workflows in the `workflows/` directory guide your sequence!
