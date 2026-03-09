#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node write_file.js <file_path>");
  console.error("Content should be piped via STDIN.");
  process.exit(1);
}

const absolutePath = path.resolve(process.cwd(), filePath);
const dir = path.dirname(absolutePath);

let content = '';
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  while ((chunk = process.stdin.read()) !== null) {
    content += chunk;
  }
});

process.stdin.on('end', () => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Successfully wrote ${content.length} bytes to ${filePath}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error writing file: ${error.message}`);
    process.exit(1);
  }
});

process.stdin.on('error', (error) => {
  console.error(`Error reading from stdin: ${error.message}`);
  process.exit(1);
});
