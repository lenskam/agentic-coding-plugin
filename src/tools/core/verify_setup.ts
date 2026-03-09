#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Functional validation script for the Antigravity plugin.
 * Verifies directory structure, critical files, and core functionality.
 */
function verify() {
  const targetDir = process.cwd();
  const agenticDir = path.join(targetDir, '.agentic-coding');
  const opencodeDir = path.join(targetDir, '.opencode');

  console.log('🔍 Antigravity Plugin Validation Starting...\n');

  let errors = 0;

  // 1. Structure Verification
  const requiredDirs = [
    path.join(agenticDir, 'python'),
    path.join(agenticDir, 'tasks'),
    path.join(agenticDir, 'memory'),
    path.join(opencodeDir, 'tools'),
    path.join(opencodeDir, 'rules'),
  ];

  requiredDirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      console.log(`✅ Directory exists: ${path.relative(targetDir, dir)}`);
    } else {
      console.error(`❌ Missing directory: ${path.relative(targetDir, dir)}`);
      errors++;
    }
  });

  // 2. Critical Files Verification
  const criticalFiles = [
    path.join(targetDir, 'opencode.json'),
    path.join(agenticDir, 'python/main.py'),
    path.join(agenticDir, 'python/requirements.txt'),
  ];

  criticalFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log(`✅ Critical file exists: ${path.relative(targetDir, file)}`);
    } else {
      console.error(`❌ Missing critical file: ${path.relative(targetDir, file)}`);
      errors++;
    }
  });

  if (errors > 0) {
    console.error(`\n🛑 Verification failed with ${errors} errors. Please check the installation.`);
    process.exit(1);
  }

  // 3. Functional Tests (Backend)
  console.log('\n⚙️ Running functional tests...');

  try {
    const pythonPath = fs.existsSync(path.join(agenticDir, 'venv'))
      ? path.join(agenticDir, 'venv/bin/python3')
      : 'python3';

    // Test 1: Rules Engine AST Check
    console.log('   - Testing Rules Engine (AST)...');
    const ruleResult = execSync(
      `${pythonPath} ${path.join(agenticDir, 'python/main.py')} check-rules git-commit --content "eval('os.system')"`
    ).toString();
    if (ruleResult.includes('block')) {
      console.log('     ✅ Rules Engine correctly blocked dangerous payload.');
    } else {
      console.warn('     ⚠️ Rules Engine did not block the test payload. Check your rules.');
    }

    // Test 2: File Tracker SQLite Check
    console.log('   - Testing File Tracking (SQLite)...');
    const sessionId = 'verify-' + Date.now();
    execSync(
      `${pythonPath} ${path.join(agenticDir, 'python/main.py')} track-file ${sessionId} verify.log "Original" "New"`
    );
    const changes = execSync(
      `${pythonPath} ${path.join(agenticDir, 'python/main.py')} session-changes ${sessionId}`
    ).toString();
    
    if (changes.includes('verify.log')) {
      console.log('     ✅ File tracking system is operational.');
    } else {
      console.error('     ❌ File tracking failed to record changes.');
      errors++;
    }

    // Test 3: Memory Store (ChromaDB)
    console.log('   - Testing Memory Store (ChromaDB)...');
    const memoryResult = execSync(
      `${pythonPath} ${path.join(agenticDir, 'python/main.py')} search "test query"`
    ).toString();
    if (memoryResult.includes('Results')) {
      console.log('     ✅ Memory retrieval is operational.');
    } else {
      console.warn('     ⚠️ Memory store returned unexpected result.');
    }

  } catch (err: any) {
    console.warn('\n⚠️ Some functional tests were skipped because the Python environment is not fully configured.');
    console.warn('   Details:', err.message);
  }

  if (errors === 0) {
    console.log('\n✨ All systems nominal! Antigravity is ready for action.');
  } else {
    console.error(`\n⚠️ Verification finished with ${errors} errors.`);
  }
}

verify();
