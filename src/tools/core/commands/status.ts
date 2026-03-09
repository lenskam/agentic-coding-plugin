#!/usr/bin/env node

/**
 * Shows the current task status from the tasks/current.json file.
 * Usage: node status.js
 */

import * as fs from 'fs';
import * as path from 'path';

const TASK_FILE = path.resolve(process.cwd(), '.agentic-coding', 'tasks', 'current.json');

if (!fs.existsSync(TASK_FILE)) {
  console.log("No active tasks found. Run plan_task to get started.");
  process.exit(0);
}

try {
  const content = fs.readFileSync(TASK_FILE, 'utf8');
  if (!content) {
    console.log("Task file is empty.");
    process.exit(0);
  }
  
  const tasks = JSON.parse(content);
  
  if (!Array.isArray(tasks) || tasks.length === 0) {
    console.log("Empty task list.");
  } else {
    console.log("Current Task Status:");
    tasks.forEach((t: any, i: number) => {
      const statusIcon = t.status === 'completed' ? '✅' : t.status === 'running' ? '⏳' : '⭕';
      console.log(`${i+1}. [${statusIcon}] ${t.title} (${t.status})`);
    });
  }
} catch (e: any) {
  console.error(`Error reading tasks: ${e.message}`);
  process.exit(1);
}
