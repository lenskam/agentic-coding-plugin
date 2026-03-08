#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const targetDir = process.cwd();
const sourceDir = path.join(__dirname, '..');

const agenticDirName = '.agentic-coding';
const agenticDir = path.join(targetDir, agenticDirName);

/**
 * These directories contain the core engine logic and state.
 * They will be moved into .agentic-coding/ for a clean project root.
 */
const dirsToAgentic = [
  'memory', 
  'skills', 
  'tasks', 
  'rules', 
  'workflows', 
  'mcp', 
  'browser', 
  'artifacts'
];

/**
 * These directories/files must stay at the project root for OpenCode to find them nativey.
 */
const dirsToRoot = [
  '.opencode'
];

/**
 * GEMINI.md is the default rule file and should be at the root.
 */
const filesToRoot = [
  'GEMINI.md'
];

/**
 * Transforms string references in config/markdown files 
 * to point to the new hidden .agentic-coding/ directory.
 * 
 * We only replace the "root" part of a path (e.g. skills/ in skills/memory/js).
 * We identify a root path by ensuring it isn't already preceded by a slash or another agentic prefix.
 */
function transformContent(content, destPath) {
  let newContent = content;
  
  // 1. Specific YAML config keys for OpenCode
  if (destPath.endsWith('config.yaml')) {
    newContent = newContent.replace(/skills_path:\s*skills/, `skills_path: ${agenticDirName}/skills`);
    newContent = newContent.replace(/workflows_path:\s*workflows/, `workflows_path: ${agenticDirName}/workflows`);
    newContent = newContent.replace(/artifacts_path:\s*artifacts/, `artifacts_path: ${agenticDirName}/artifacts`);
  }

  // 2. Global path replacements for Markdown/JS/JSON/YAML
  const folders = [
    'skills', 'tasks', 'workflows', 'artifacts', 'memory', 'mcp', 'browser', 'rules'
  ];

  // Regex logic:
  // \b -> word boundary
  // (folder1|folder2) -> any of our core folders
  // \/ -> followed by a slash
  // But we want to ensure it's NOT preceded by a slash (to only catch the root of a path)
  // and NOT already preceded by our prefix .agentic-coding/
  
  const foldersRegex = new RegExp(`\\b(${folders.join('|')})\\/`, 'g');
  
  newContent = newContent.replace(foldersRegex, (match, folderName, offset, fullString) => {
    const charBefore = fullString[offset - 1];
    
    // If it's preceded by a slash (like in skills/memory/), don't replace
    if (charBefore === '/') {
      return match;
    }

    // If it's preceded by the prefix already (though lookbehind/slash check should handle it), don't replace
    const prefix = `${agenticDirName}/`;
    if (offset >= prefix.length) {
      const checkString = fullString.substring(offset - prefix.length, offset);
      if (checkString === prefix) {
        return match;
      }
    }

    return `${prefix}${match}`;
  });

  return newContent;
}

function copyRecursiveSync(src, dest, transform = false) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName), transform);
    });
  } else if (exists) {
    if (transform && (
      dest.endsWith('.yaml') || 
      dest.endsWith('.md') || 
      dest.endsWith('.json') || 
      dest.endsWith('.js') || 
      dest.endsWith('.sh')
    )) {
      let content = fs.readFileSync(src, 'utf8');
      content = transformContent(content, dest);
      fs.writeFileSync(dest, content, 'utf8');
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

console.log(`Installing agentic-coding-plugin into ${targetDir}`);

// Create the hidden logic container if it doesn't exist
if (!fs.existsSync(agenticDir)) {
  fs.mkdirSync(agenticDir, { recursive: true });
}

// 1. Copy core logic into .agentic-coding/
dirsToAgentic.forEach(dir => {
  const src = path.join(sourceDir, dir);
  const dest = path.join(agenticDir, dir);
  if (fs.existsSync(src)) {
    console.log(`Scaffolding logic directory: ./${agenticDirName}/${dir}`);
    copyRecursiveSync(src, dest, true); 
  }
});

// 2. Copy OpenCode configurations and Root Rule files, transforming logic references
dirsToRoot.forEach(dir => {
  const src = path.join(sourceDir, dir);
  const dest = path.join(targetDir, dir);
  if (fs.existsSync(src)) {
    console.log(`Installing OpenCode configuration: ./${dir}`);
    copyRecursiveSync(src, dest, true);
  }
});

filesToRoot.forEach(file => {
  const src = path.join(sourceDir, file);
  const dest = path.join(targetDir, file);
  if (fs.existsSync(src)) {
    console.log(`Installing root rules file: ./${file}`);
    let content = fs.readFileSync(src, 'utf8');
    content = transformContent(content, dest);
    fs.writeFileSync(dest, content, 'utf8');
  }
});

console.log("\n--- Installation complete ---");
console.log("-> Project root kept clean using .agentic-coding/ sub-directory.");
console.log("-> GEMINI.md and .opencode/ installed at root for native CLI hooks.");
console.log("-> Logic paths dynamically relocated in configuration files.");
console.log("\nRun `opencode` to start using your autonomous agent.");
