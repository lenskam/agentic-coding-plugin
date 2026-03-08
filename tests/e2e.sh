#!/usr/bin/env bash

# End-to-End Validation Script for Agentic Environment
set -e

echo "--- STARTING E2E CONTEXT VALIDATION ---"

# 1. Plan a task
echo "1) Injecting E2E Task Plan..."
node skills/commands/plan_task.js '[{"id":"e2e-validate", "title":"E2E Environment Test", "description":"Ensure planning, memory, and state tracking integrates correctly.", "status":"pending", "dependencies":[]}]'

# 2. Check Status
echo -e "\n2) Verifying Task Status Output..."
node skills/commands/status.js

# 3. Complete Task
echo -e "\n3) Marking Task Complete..."
node skills/memory/manage_tasks.js update "e2e-validate" "done" "Verified E2E flow natively."

# 4. Check Final Status
echo -e "\n4) Verifying Final Resolution..."
node skills/commands/status.js

echo -e "\n--- E2E SUCCESS ---"
