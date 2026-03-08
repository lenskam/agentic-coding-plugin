#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MEMORY_FILE = path.resolve(__dirname, '../../memory/session.json');

function readMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeMemory(memories) {
  const tempFile = `${MEMORY_FILE}.tmp.${crypto.randomBytes(4).toString('hex')}`;
  fs.writeFileSync(tempFile, JSON.stringify(memories, null, 2), 'utf8');
  fs.renameSync(tempFile, MEMORY_FILE);
}

const action = process.argv[2];
const result = process.argv[3] || "";

if (!action) {
  console.error("Usage: node memory_append.js <action> [result]");
  console.error("Example: node memory_append.js 'git_commit' 'Successfully committed files.'");
  process.exit(1);
}

const memory = readMemory();

const entry = {
  timestamp: new Date().toISOString(),
  action,
  result
};

memory.push(entry);
writeMemory(memory);

console.log("Memory appended successfully.");
