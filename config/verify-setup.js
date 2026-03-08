const fs = require('fs');
const path = require('path');

const requiredDirs = [
  'rules', 'workflows', 'skills', 'tasks',
  'memory', 'mcp', 'browser', 'prompts', 'config', 'logs'
];

const requiredFiles = [
  'package.json',
  'mcp/servers.json',
  'rules/agent-rules.yaml',
  'tasks/schema.json',
  'tasks/current.json',
  'memory/session.json',
  'skills/shell/safe_runner.sh'
];

let allExist = true;

console.log("Verifying setup for agentic-coding-plugin...");

for (const dir of requiredDirs) {
  if (!fs.existsSync(path.join(__dirname, '..', dir))) {
    console.error(`[Error] Missing directory: ${dir}`);
    allExist = false;
  }
}

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    console.error(`[Error] Missing file: ${file}`);
    allExist = false;
  }
}

if (!allExist) {
  console.error("\nVerification failed. Please review missing components.");
  process.exit(1);
}

console.log("\nSetup verified successfully! All critical paths exist.");
process.exit(0);
