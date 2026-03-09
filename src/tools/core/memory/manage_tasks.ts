#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'blocked' | 'retrying';
  dependencies: string[];
  result?: string;
}

// In installed plugin, this will be .agentic-coding/tasks/current.json relative to project root.
const TASK_FILE: string = path.resolve(process.cwd(), '.agentic-coding', 'tasks', 'current.json');

function readTasks(): Task[] {
  if (!fs.existsSync(TASK_FILE)) {
    // Ensure dir exists
    const dir = path.dirname(TASK_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return [];
  }
  try {
    const data = fs.readFileSync(TASK_FILE, 'utf8');
    return JSON.parse(data) as Task[];
  } catch (e) {
    return [];
  }
}

function writeTasks(tasks: Task[]): void {
  // Simple atomic-like write: write to temp file then rename
  const tempFile: string = `${TASK_FILE}.tmp.${crypto.randomBytes(4).toString('hex')}`;
  fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2), 'utf8');
  fs.renameSync(tempFile, TASK_FILE);
}

const command: string | undefined = process.argv[2];

if (!command) {
  console.error("Usage: ts-node manage_tasks.ts <get-next|add|update|list> [args]");
  process.exit(1);
}

let tasks: Task[] = readTasks();

switch (command) {
  case 'get-next': {
    const nextTask = tasks.find(t => t.status === 'pending');
    if (nextTask) {
      console.log(JSON.stringify(nextTask, null, 2));
    } else {
      console.log("No pending tasks found.");
    }
    break;
  }

  case 'add': {
    const title = process.argv[3];
    const description = process.argv[4] || "";
    if (!title) {
      console.error("Usage: ts-node manage_tasks.ts add <title> [description]");
      process.exit(1);
    }
    const newTask: Task = {
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
  }

  case 'update': {
    const id = process.argv[3];
    const status = process.argv[4] as Task['status'];
    const result = process.argv[5];
    if (!id || !status) {
      console.error("Usage: ts-node manage_tasks.ts update <id> <status> [result]");
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
  }

  case 'list': {
    console.log(JSON.stringify(tasks, null, 2));
    break;
  }

  default: {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}
