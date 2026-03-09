#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node read_file.js <file_path>");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(absolutePath)) {
  console.error(`Error: File does not exist at path ${absolutePath}`);
  process.exit(1);
}

try {
  const content = fs.readFileSync(absolutePath, 'utf8');
  console.log(content);
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}
