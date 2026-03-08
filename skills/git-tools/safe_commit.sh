#!/usr/bin/env bash

# Usage: ./safe_commit.sh <commit_message>

if [ -z "$1" ]; then
  echo "Usage: ./safe_commit.sh <commit_message>"
  exit 1
fi

MSG="$1"
# Route the commit command through the safe runner wrapper
CMD="git commit -m \"$MSG\""
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

"$SCRIPT_DIR/../shell/safe_runner.sh" "$CMD"
