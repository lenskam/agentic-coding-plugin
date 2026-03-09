#!/usr/bin/env bash

# Safe runner wrapper evaluating bash commands against rules/agent-rules.yaml
# Usage: ./safe_runner.sh [command]

CMD="$*"

# Simple evaluation against destructives
if echo "$CMD" | grep -qE "(git push|git commit|rm|deploy)"; then
    echo "[Approval Required] The command '$CMD' matches a restricted rule."
    echo "Do you approve execution? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        echo "Command aborted by user."
        exit 1
    fi
fi

if echo "$CMD" | grep -qE "git commit"; then
   # Secret check
   if grep -rEI '(api[-_]?key|secret|password)' . > /dev/null 2>&1; then
        echo "[Blocked] Hardcoded secrets detected! Commit aborted."
        exit 1
   fi
fi

# Execute Command
eval "$CMD"
