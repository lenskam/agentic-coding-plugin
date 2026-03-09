#!/usr/bin/env bash

# Usage: ./safe_push.sh [args...]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/../shell/safe_runner.sh" "git push $*"
