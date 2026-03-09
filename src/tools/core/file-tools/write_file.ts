#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const filePath: string | undefined = process.argv[2];

if (!filePath) {
  console.error("Usage: ts-node write_file.ts <file_path>");
  console.error("Content should be piped via STDIN.");
  process.exit(1);
}

const absolutePath: string = path.resolve(process.cwd(), filePath);
const dir: string = path.dirname(absolutePath);

let content: string = '';
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk: any;
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
  } catch (error: any) {
    console.error(`Error writing file: ${error.message}`);
    process.exit(1);
  }
});

process.stdin.on('error', (error: any) => {
  console.error(`Error reading from stdin: ${error.message}`);
  process.exit(1);
});
