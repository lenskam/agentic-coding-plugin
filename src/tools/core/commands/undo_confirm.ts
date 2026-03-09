#!/usr/bin/env node

/**
 * Executes the session revert by restoring original file contents.
 * Usage: node undo_confirm.js
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const sessionId = process.env.SESSION_ID || 'default-session';
const pythonPath = process.platform === 'win32' ? '.agentic-coding/venv/Scripts/python.exe' : '.agentic-coding/venv/bin/python3';

try {
  const output = execSync(`${pythonPath} python/main.py revert-session "${sessionId}"`, { encoding: 'utf8' });
  const reverts = JSON.parse(output);

  if (!Array.isArray(reverts) || reverts.length === 0) {
    console.log("Nothing to revert.");
  } else {
    console.log(`Executing revert for ${reverts.length} changes in session ${sessionId}...`);
    
    reverts.forEach((r: any) => {
      const absolutePath = path.resolve(process.cwd(), r.file);
      try {
        if (r.original === '') {
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log(`- Deleted (created in session): ${r.file}`);
            }
        } else {
            fs.writeFileSync(absolutePath, r.original, 'utf8');
            console.log(`- Restored: ${r.file}`);
        }
      } catch (e: any) {
        console.error(`  Failed to revert ${r.file}: ${e.message}`);
      }
    });
    
    console.log("\nRevert complete.");
  }
} catch (error: any) {
  console.error(`Error during undo confirmation: ${error.message}`);
  process.exit(1);
}
