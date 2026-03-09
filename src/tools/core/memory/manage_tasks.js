#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TASK_FILE = path.resolve(__dirname, '../../tasks/current.json');

function readTasks() {
  if (!fs.existsSync(TASK_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(TASK_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeTasks(tasks) {
  // Simple atomic-like write: write to temp file then rename
  const tempFile = `${TASK_FILE}.tmp.${crypto.randomBytes(4).toString('hex')}`;
  fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2), 'utf8');
  fs.renameSync(tempFile, TASK_FILE);
}

const command = process.argv[2];

if (!command) {
  console.error("Usage: node manage_tasks.js <get-next|add|update|list> [args]");
  process.exit(1);
}

let tasks = readTasks();

switch (command) {
  case 'get-next':
    const nextTask = tasks.find(t => t.status === 'pending');
    if (nextTask) {
      console.log(JSON.stringify(nextTask, null, 2));
    } else {
      console.log("No pending tasks found.");
    }
    break;

  case 'add':
    const title = process.argv[3];
    const description = process.argv[4] || "";
    if (!title) {
      console.error("Usage: node manage_tasks.js add <title> [description]");
      process.exit(1);
    }
    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "pending",
      dependencies: []
    };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log(`Added task ${newTask.id}: ${title}`);
    break;

  case 'update':
    const id = process.argv[3];
    const status = process.argv[4];
    const result = process.argv[5];
    if (!id || !status) {
      console.error("Usage: node manage_tasks.js update <id> <status> [result]");
      process.exit(1);
    }
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      console.error(`Task with ID ${id} not found.`);
      process.exit(1);
    }
    tasks[taskIndex].status = status;
    if (result) tasks[taskIndex].result = result;
    writeTasks(tasks);
    console.log(`Updated task ${id} to status ${status}`);
    break;

  case 'list':
    console.log(JSON.stringify(tasks, null, 2));
    break;

  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
