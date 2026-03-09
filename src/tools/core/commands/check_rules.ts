#!/usr/bin/env node

/**
 * Checks safety rules for a proposed action.
 * Usage: node check_rules.js "<action>" ["<content>"]
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const action: string | undefined = process.argv[2];
const content: string | undefined = process.argv[3];

if (!action) {
  console.error("Usage: ts-node check_rules.ts \"<action>\" [\"<file_content_to_check>\"]");
  process.exit(1);
}

const pythonBin: string = process.platform === 'win32' 
  ? path.resolve(process.cwd(), '.agentic-coding', 'venv', 'Scripts', 'python.exe')
  : path.resolve(process.cwd(), '.agentic-coding', 'venv', 'bin', 'python');

const finalPython = fs.existsSync(pythonBin) ? pythonBin : 'python3';
const mainPy = path.resolve(__dirname, '../../../../python/main.py');

try {
  // Call python main.py check-rules "<action>" --content "<content>"
  let cmd = `PYTHONPATH=. ${finalPython} "${mainPy}" check-rules "${action.replace(/"/g, '\\"')}"`;
  if (content) {
    cmd += ` --content "${content.replace(/"/g, '\\"')}"`;
  }
  
  const result = execSync(cmd, { encoding: 'utf8' });
  console.log(result);
} catch (e: any) {
  console.error(`Rule evaluation failed: ${e.message}`);
  process.exit(1);
}
