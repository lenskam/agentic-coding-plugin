#!/usr/bin/env node

const { execSync } = require('child_process');

const title = process.argv[2];
const body = process.argv[3] || "";

if (!title) {
  console.error("Usage: node create_pr.js <title> [body]");
  process.exit(1);
}

try {
  const safeTitle = title.replace(/"/g, '\\"');
  const safeBody = body.replace(/"/g, '\\"');
  const command = `gh pr create --title "${safeTitle}" --body "${safeBody}"`;
  
  console.log(`Executing: ${command}`);
  const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
  
  console.log("PR Created Successfully:");
  console.log(result);
} catch (error) {
  console.error("Error creating PR:");
  if (error.stdout) console.error(error.stdout.toString());
  if (error.stderr) console.error(error.stderr.toString());
  console.error(error.message);
  process.exit(1);
}
