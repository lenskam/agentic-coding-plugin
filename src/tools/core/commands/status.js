#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

try {
  const output = execSync(`"${process.execPath}" "${path.resolve(__dirname, '../memory/manage_tasks.js')}" list`, { encoding: 'utf8' });
  const tasks = JSON.parse(output);
  
  console.log("=== CURRENT TASK STATUS ===");
  if (tasks.length === 0) {
    console.log("No tasks in the current plan.");
  } else {
    tasks.forEach((t, i) => {
      console.log(`[${t.status === 'done' ? 'X' : t.status === 'in-progress' ? '~' : t.status === 'failed' ? '!' : ' '}] ${i+1}. ${t.title} (ID: ${t.id})`);
      if(t.description) console.log(`      ${t.description}`);
    });
  }
  console.log("===========================");
} catch (e) {
  console.error("Failed to retrieve status:", e.message);
  process.exit(1);
}
