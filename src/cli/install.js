#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const targetDir = process.cwd();
const sourceDir = path.join(__dirname, "..", "..");

const agenticDirName = ".agentic-coding";
const agenticDir = path.join(targetDir, agenticDirName);

/**
 * Mapping of plugin source paths to target project paths.
 */
const installationMap = [
  // Core implementation
  { src: "python", dest: path.join(agenticDirName, "python") },
  { src: "src/tools/core", dest: ".opencode/tools" },

  // Templates/Project files
  { src: "templates/rules", dest: ".opencode/rules" },
  { src: "templates/workflows", dest: ".opencode/workflows" },
  { src: "templates/skills", dest: ".opencode/skills" },
  { src: "templates/prompts", dest: ".opencode/prompts" },
  { src: "templates/mcp-servers.json", dest: ".opencode/mcp-servers.json" },
  { src: "templates/tasks", dest: path.join(agenticDirName, "tasks") },
  { src: "templates/opencode.json", dest: "opencode.json" },

  // Root files
  { src: "GEMINI.md", dest: "GEMINI.md" },
];

/**
 * Directories that should be stay in .opencode to be found by OpenCode natively.
 */
const opencodeDirs = [
  ".opencode/rules",
  ".opencode/workflows",
  ".opencode/skills",
  ".opencode/prompts",
  ".opencode/tools",
];

/**
 * Transforms string references in config/markdown files
 * to point to the correct locations.
 */
function transformContent(content, destPath) {
  let newContent = content;

  // Replace logic: Ensure paths in opencode.json or scripts point to .agentic-coding/ or .opencode/ correctly
  const folderMappings = {
    python: `${agenticDirName}/python`,
    tasks: `${agenticDirName}/tasks`,
    memory: `${agenticDirName}/memory`,
    artifacts: `${agenticDirName}/artifacts`,
    rules: ".opencode/rules",
    workflows: ".opencode/workflows",
    skills: ".opencode/skills",
    prompts: ".opencode/prompts",
  };

  Object.entries(folderMappings).forEach(([oldDir, newDir]) => {
    const regex = new RegExp(`\\b${oldDir}\\/`, "g");
    newContent = newContent.replace(regex, (match, offset, fullString) => {
      const charBefore = fullString[offset - 1];
      if (
        charBefore === "/" ||
        fullString.substring(offset - agenticDirName.length - 1, offset) ===
          `${agenticDirName}/`
      ) {
        return match;
      }
      return `${newDir}/`;
    });
  });

  return newContent;
}

function copyRecursiveSync(src, dest, transform = false) {
  const absoluteSrc = path.isAbsolute(src) ? src : path.join(sourceDir, src);
  const absoluteDest = path.isAbsolute(dest)
    ? dest
    : path.join(targetDir, dest);

  if (!fs.existsSync(absoluteSrc)) return;

  const stats = fs.statSync(absoluteSrc);
  if (stats.isDirectory()) {
    if (!fs.existsSync(absoluteDest)) {
      fs.mkdirSync(absoluteDest, { recursive: true });
    }
    fs.readdirSync(absoluteSrc).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
        transform,
      );
    });
  } else {
    const parentDir = path.dirname(absoluteDest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    if (
      transform &&
      (absoluteDest.endsWith(".yaml") ||
        absoluteDest.endsWith(".md") ||
        absoluteDest.endsWith(".json") ||
        absoluteDest.endsWith(".js") ||
        absoluteDest.endsWith(".sh"))
    ) {
      let content = fs.readFileSync(absoluteSrc, "utf8");
      content = transformContent(content, absoluteDest);
      fs.writeFileSync(absoluteDest, content, "utf8");
    } else {
      fs.copyFileSync(absoluteSrc, absoluteDest);
    }
  }
}

console.log(`\n🚀 Installing agentic-coding-plugin into ${targetDir}`);

// 1. Execute the installation map
installationMap.forEach((item) => {
  console.log(`   - Installing ${item.src} -> ${item.dest}`);
  copyRecursiveSync(item.src, item.dest, true);
});

// 2. Initialize required runtime directories if missing
const runtimeDirs = [
  path.join(agenticDir, "memory"),
  path.join(agenticDir, "artifacts"),
  path.join(agenticDir, "logs"),
];

runtimeDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log("\n--- Installation complete ---");
console.log(`-> Core logic and state: ./${agenticDirName}/`);
console.log("-> OpenCode integration: ./.opencode/");
console.log("-> Root rules: ./GEMINI.md");
console.log("\nNext steps:");
console.log("1. Ensure Python 3.9+ is installed.");
console.log(`2. Initialize venv: python3 -m venv ./${agenticDirName}/venv`);
console.log(
  `3. Install deps: ./${agenticDirName}/venv/bin/pip install -r ./${agenticDirName}/python/requirements.txt`,
);
console.log("\nRun `opencode` to start.");
