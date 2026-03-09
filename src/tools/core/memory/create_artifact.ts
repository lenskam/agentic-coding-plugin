#!/usr/bin/env node

/**
 * Creates or updates an artifact in the artifacts/ directory.
 */

import * as fs from 'fs';
import * as path from 'path';

const filename: string | undefined = process.argv[2];
const content: string | undefined = process.argv[3];

if (!filename || !content) {
  console.error("Usage: ts-node create_artifact.ts <filename> \"<content>\"");
  process.exit(1);
}

// Artifacts are now stored in .agentic-coding/artifacts/ relative to project root
// In dev, we might still have a root artifacts/ or use the templates one?
// For now, mirroring the package structure.
const artifactsDir: string = path.join(process.cwd(), '.agentic-coding', 'artifacts');
if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
}

const safeFilename: string = filename.endsWith('.md') ? filename : `${filename}.md`;
const filepath: string = path.join(artifactsDir, safeFilename);

try {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`Successfully created/updated artifact: ${filepath}`);
} catch (error: any) {
  console.error(`Failed to write artifact: ${error.message}`);
  process.exit(1);
}
