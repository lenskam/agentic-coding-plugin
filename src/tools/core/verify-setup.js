const fs = require('fs');
const path = require('path');

// Logic for detecting environment: plugin development vs. installed project
const isPluginDev = fs.existsSync(path.join(__dirname, '../../../package.json')) && 
                    require(path.join(__dirname, '../../../package.json')).name === '@lens.kamdem/agentic-coding-plugin';

let opencodeDir, targetDir, agenticDir;

if (isPluginDev) {
  targetDir = path.join(__dirname, '../../../');
  opencodeDir = path.join(targetDir, 'templates'); // In dev, we check the templates
  agenticDir = path.join(targetDir); // In dev, python/ and tasks/ are at root
} else {
  opencodeDir = path.join(__dirname, '..');
  targetDir = path.join(opencodeDir, '..');
  agenticDir = path.join(targetDir, '.agentic-coding');
}

const requiredOpencodeDirs = isPluginDev ? 
  ['rules', 'workflows', 'skills', 'prompts'] : // Note 'tools' is moved from src/ to .opencode during install
  ['rules', 'workflows', 'skills', 'prompts', 'tools'];

const requiredAgenticDirs = isPluginDev ? 
  ['python', 'templates/tasks'] : 
  ['python', 'tasks', 'memory', 'artifacts', 'logs'];

let allExist = true;

console.log(`Verifying setup for agentic-coding-plugin (${isPluginDev ? 'Development' : 'Production'})...`);

// Check .opencode (templates in dev)
for (const dir of requiredOpencodeDirs) {
  const dirPath = path.join(opencodeDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.warn(`[Missing] Optional directory: ${isPluginDev ? 'templates/' : '.opencode/'}${dir}`);
  }
}

// Check core backend directories
for (const dir of requiredAgenticDirs) {
  const dirPath = path.join(agenticDir, dir);
  if (!fs.existsSync(dirPath)) {
    console.error(`[Error] Missing core directory: ${isPluginDev ? '' : '.agentic-coding/'}${dir}`);
    allExist = false;
  }
}

// Check critical files
const criticalFiles = isPluginDev ? [
  path.join(targetDir, 'templates/opencode.json'),
  path.join(targetDir, 'python/planner.py'),
  path.join(targetDir, 'python/requirements.txt')
] : [
  path.join(targetDir, 'opencode.json'),
  path.join(agenticDir, 'python/planner.py'),
  path.join(agenticDir, 'python/requirements.txt')
];

for (const file of criticalFiles) {
  if (!fs.existsSync(file)) {
    console.error(`[Error] Missing critical file: ${path.relative(targetDir, file)}`);
    allExist = false;
  }
}

if (!allExist) {
  console.error("\nVerification failed. Please review the missing components.");
  process.exit(1);
}

console.log("\nSetup verified successfully! Core structure is valid.");
process.exit(0);
