#!/usr/bin/env node

/**
 * Executes a hybrid search across the codebase and sessions.
 * Usage: node search.ts <query>
 */

import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

const query: string | undefined = process.argv[2];

if (!query) {
  console.error("Usage: ts-node search.ts <query>");
  process.exit(1);
}

const pythonBin: string =
  process.platform === "win32"
    ? path.resolve(
        process.cwd(),
        ".agentic-coding",
        "venv",
        "Scripts",
        "python.exe",
      )
    : path.resolve(process.cwd(), ".agentic-coding", "venv", "bin", "python");

const finalPython = fs.existsSync(pythonBin) ? pythonBin : "python3";
const mainPy = path.resolve(process.cwd(), ".agentic-coding/python/main.py");

try {
  // Call python main.py search "<query>"
  const cmd = `PYTHONPATH=. ${finalPython} "${mainPy}" search "${query.replace(/"/g, '\\"')}"`;
  const result = execSync(cmd, { encoding: "utf8" });
  console.log(result);
} catch (e: any) {
  console.error(`Search failed: ${e.message}`);
  process.exit(1);
}
