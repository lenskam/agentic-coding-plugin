#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

interface MemoryEntry {
  timestamp: string;
  action: string;
  result: string;
}

// In installed plugin, this will be .agentic-coding/memory/session.json relative to project root.
const MEMORY_FILE: string = path.resolve(process.cwd(), '.agentic-coding', 'memory', 'session.json');

function readMemory(): MemoryEntry[] {
  if (!fs.existsSync(MEMORY_FILE)) {
    // Ensure dir exists
    const dir = path.dirname(MEMORY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return [];
  }
  try {
    const data = fs.readFileSync(MEMORY_FILE, 'utf8');
    return JSON.parse(data) as MemoryEntry[];
  } catch (e) {
    return [];
  }
}

function writeMemory(memories: MemoryEntry[]): void {
  const tempFile: string = `${MEMORY_FILE}.tmp.${crypto.randomBytes(4).toString('hex')}`;
  fs.writeFileSync(tempFile, JSON.stringify(memories, null, 2), 'utf8');
  fs.renameSync(tempFile, MEMORY_FILE);
}

const action: string | undefined = process.argv[2];
const result: string = process.argv[3] || "";

if (!action) {
  console.error("Usage: ts-node memory_append.ts <action> [result]");
  console.error("Example: ts-node memory_append.js 'git_commit' 'Successfully committed files.'");
  process.exit(1);
}

const memory: MemoryEntry[] = readMemory();

const entry: MemoryEntry = {
  timestamp: new Date().toISOString(),
  action,
  result
};

memory.push(entry);
writeMemory(memory);

console.log("Memory appended successfully.");
