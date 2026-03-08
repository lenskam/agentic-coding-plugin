#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();
const sourceDir = path.join(__dirname, '..');

const dirsToCopy = [
  'memory', 
  'skills', 
  'tasks', 
  'rules', 
  'workflows', 
  'mcp', 
  'browser', 
  'artifacts', 
  '.opencode'
];

const filesToCopy = [
  'GEMINI.md'
];

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

console.log(`Installing agentic-coding-plugin into ${targetDir}`);

dirsToCopy.forEach(dir => {
  const src = path.join(sourceDir, dir);
  const dest = path.join(targetDir, dir);
  if (fs.existsSync(src)) {
    console.log(`Copying directory: ${dir}`);
    copyRecursiveSync(src, dest);
  }
});

filesToCopy.forEach(file => {
  const src = path.join(sourceDir, file);
  const dest = path.join(targetDir, file);
  if (fs.existsSync(src)) {
    console.log(`Copying file: ${file}`);
    fs.copyFileSync(src, dest);
  }
});

console.log("Installation complete. Your agentic environment is scaffolded.");
console.log("Run `opencode` to start using your autonomous agent with MiniMax M2.5 Free.");
