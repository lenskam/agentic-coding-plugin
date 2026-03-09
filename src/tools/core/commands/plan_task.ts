#!/usr/bin/env node

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const request: string | undefined = process.argv[2];

if (!request) {
  console.error("Usage: ts-node plan_task.ts \"<request>\"");
  process.exit(1);
}

// In the installed environment, python is in .agentic-coding/venv/
const pythonBin: string = process.platform === 'win32' 
  ? path.resolve(process.cwd(), '.agentic-coding', 'venv', 'Scripts', 'python.exe')
  : path.resolve(process.cwd(), '.agentic-coding', 'venv', 'bin', 'python');

// Fallback to python3 if not found locally (e.g. initial setup)
const finalPython = fs.existsSync(pythonBin) ? pythonBin : 'python3';
const mainPy = path.resolve(__dirname, '../../../../python/main.py');

try {
  // Call python main.py plan "<request>"
  const cmd = `PYTHONPATH=. ${finalPython} "${mainPy}" plan "${request.replace(/"/g, '\\"')}"`;
  const planJson = execSync(cmd, { encoding: 'utf8' });
  
  // Directly write the plan to tasks/current.json
  const TASK_FILE: string = path.resolve(process.cwd(), '.agentic-coding', 'tasks', 'current.json');
  const dir = path.dirname(TASK_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(TASK_FILE, planJson, 'utf8');
  console.log("Task plan successfully generated and saved to .agentic-coding/tasks/current.json.");
  console.log(planJson);
} catch (e: any) {
  console.error(`Planning failed: ${e.message}`);
  process.exit(1);
}
