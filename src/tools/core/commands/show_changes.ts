#!/usr/bin/env node

/**
 * Shows all file changes recorded in the current session.
 * Usage: node show_changes.js
 */

import { execSync } from 'child_process';
import * as path from 'path';

const sessionId = process.env.SESSION_ID || 'default-session';
const pythonPath = process.platform === 'win32' ? '.agentic-coding/venv/Scripts/python.exe' : '.agentic-coding/venv/bin/python3';

try {
  const output = execSync(`${pythonPath} python/main.py session-changes "${sessionId}"`, { encoding: 'utf8' });
  const changes = JSON.parse(output);

  if (!Array.isArray(changes) || changes.length === 0) {
    console.log("No changes recorded for this session.");
  } else {
    console.log(`Changes for session ${sessionId}:`);
    changes.forEach((c: any, i: number) => {
      console.log(`\n--- ${i + 1}. ${c.file} ---`);
      console.log(c.diff);
    });
  }
} catch (error: any) {
  console.error(`Error retrieving session changes: ${error.message}`);
  process.exit(1);
}
