Plugin: Antigravity Autonomous Integration

This plugin dynamically teaches the OpenCode agent how to interact with the local context-memory architecture.

1. **State Engine Logging**
   Whenever a multi-step task is requested, generate an array of JSON tasks using `skills/commands/plan_task.js` to officially register the task plan.
2. **Current Step Tracker**
   Instead of guessing what to do next, run `skills/commands/status.js` natively to see what task `id` is still `pending`.
3. **Completing States**
   Whenever work on a file finishes, transition the task `id` to `done` using `node skills/memory/manage_tasks.js update <id> "done" "Summary message"`.
4. **Audit Logging**
   Whenever an important decision is executed and the task moves forward, log it by executing `node skills/memory/memory_append.js "<action>" "<result>"`.

You are effectively becoming an autonomous agent that meticulously updates its memory and tracking files. Let the workflows in the `workflows/` directory guide your sequence!
