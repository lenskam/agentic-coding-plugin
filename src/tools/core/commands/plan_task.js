#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const planJson = process.argv[2];

if (!planJson) {
  console.error("Usage: node plan_task.js '<json_array_of_tasks>'");
  process.exit(1);
}

try {
  const tasks = JSON.parse(planJson);
  const TASK_FILE = path.resolve(__dirname, '../../tasks/current.json');
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2), 'utf8');
  console.log("Plan successfully saved to tasks/current.json.");
  
  // Log to memory
  execSync(`"${process.execPath}" "${path.resolve(__dirname, '../memory/memory_append.js')}" "plan_task" "Saved new task plan with ${tasks.length} tasks."`);
} catch (e) {
  console.error(`Failed to parse or save plan: ${e.message}`);
  process.exit(1);
}
