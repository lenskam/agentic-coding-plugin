#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const filePath: string | undefined = process.argv[2];

if (!filePath) {
  console.error("Usage: ts-node read_file.ts <file_path>");
  process.exit(1);
}

const absolutePath: string = path.resolve(process.cwd(), filePath);

if (!fs.existsSync(absolutePath)) {
  console.error(`Error: File does not exist at path ${absolutePath}`);
  process.exit(1);
}

try {
  const content: string = fs.readFileSync(absolutePath, 'utf8');
  console.log(content);
} catch (error: any) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}
