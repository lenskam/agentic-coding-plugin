#!/usr/bin/env node

/**
 * Previews the session revert by showing all recorded diffs.
 * Usage: node undo_preview.js
 */

import { execSync } from "child_process";

const sessionId = process.env.SESSION_ID || "default-session";
const pythonPath =
  process.platform === "win32"
    ? ".agentic-coding/venv/Scripts/python.exe"
    : ".agentic-coding/venv/bin/python3";

try {
  const output = execSync(
    `${pythonPath} .agentic-coding/python/main.py session-changes "${sessionId}"`,
    { encoding: "utf8" },
  );
  const changes = JSON.parse(output);

  if (!Array.isArray(changes) || changes.length === 0) {
    console.log("Nothing to undo.");
  } else {
    console.log(
      `PREVIEW: Reverting the following changes for session ${sessionId}:`,
    );
    changes.forEach((c: any, i: number) => {
      console.log(`\n[REVERT] ${c.file}`);
      console.log(c.diff);
    });
    console.log("\nRun 'undo_confirm' to execute the revert.");
  }
} catch (error: any) {
  console.error(`Error during undo preview: ${error.message}`);
  process.exit(1);
}
