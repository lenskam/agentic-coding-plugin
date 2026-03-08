#!/usr/bin/env node

/**
 * Creates or updates an artifact in the artifacts/ directory.
 * Usage: node create_artifact.js <filename> "<content>"
 */

const fs = require('fs');
const path = require('path');

const filename = process.argv[2];
const content = process.argv[3];

if (!filename || !content) {
  console.error("Usage: node create_artifact.js <filename> \"<content>\"");
  process.exit(1);
}

const artifactsDir = path.join(__dirname, '..', '..', 'artifacts');
if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
}

const filepath = path.join(artifactsDir, filename.endsWith('.md') ? filename : `${filename}.md`);

try {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Successfully created/updated artifact: ${filepath}`);
} catch (error) {
  console.error(`Failed to write artifact: ${error.message}`);
  process.exit(1);
}
