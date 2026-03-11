#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const filePath: string | undefined = process.argv[2];

if (!filePath) {
  console.error("Usage: ts-node write_file.ts <file_path>");
  console.error("Content should be piped via STDIN.");
  process.exit(1);
}

const absolutePath: string = path.resolve(process.cwd(), filePath);
const dir: string = path.dirname(absolutePath);

let content: string = "";
process.stdin.setEncoding("utf8");

process.stdin.on("readable", () => {
  let chunk: any;
  while ((chunk = process.stdin.read()) !== null) {
    content += chunk;
  }
});

process.stdin.on("end", () => {
  try {
    // Capture original content for tracking
    let originalContent = "";
    if (fs.existsSync(absolutePath)) {
      originalContent = fs.readFileSync(absolutePath, "utf8");
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(absolutePath, content, "utf8");

    // Track the change
    try {
      const sessionId = process.env.SESSION_ID || "default-session";
      const pythonPath =
        process.platform === "win32"
          ? ".agentic-coding/venv/Scripts/python.exe"
          : ".agentic-coding/venv/bin/python3";

      // Use execSync to call python/main.py track-file
      // Escape content for shell
      const escapedOriginal = JSON.stringify(originalContent);
      const escapedNew = JSON.stringify(content);

      execSync(
        `${pythonPath} .agentic-coding/python/main.py track-file "${sessionId}" "${filePath}" ${escapedOriginal} ${escapedNew}`,
        {
          stdio: "ignore",
        },
      );
    } catch (trackError) {
      // Silently fail tracking if it fails, don't block the write
      console.warn(`Warning: Failed to track file change: ${trackError}`);
    }

    console.log(`Successfully wrote ${content.length} bytes to ${filePath}`);
    process.exit(0);
  } catch (error: any) {
    console.error(`Error writing file: ${error.message}`);
    process.exit(1);
  }
});

process.stdin.on("error", (error: any) => {
  console.error(`Error reading from stdin: ${error.message}`);
  process.exit(1);
});
