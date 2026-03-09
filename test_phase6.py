import os
import sys
from python.file_tracker import FileTracker

# Manual test for Phase 6 revert
db_path = ".agentic-coding/file_tracker.db"
tracker = FileTracker(db_path)

session = "test-session-99"
file1 = "test_phase6_1.txt"
file2 = "test_phase6_2.txt"

# 1. Track some changes
tracker.track(session, file1, "Initial file 1", "Modified file 1")
tracker.track(session, file2, "", "New file 2")

# 2. Check changes
changes = tracker.get_session_diffs(session)
print(f"Changes count: {len(changes)}")

# 3. Revert session
reverts = tracker.revert_session(session)
print(f"Reverts to perform: {len(reverts)}")
for r in reverts:
    print(f"  Reverting {r['file']} to '{r['original']}'")

# 4. Final check
changes_after = tracker.get_session_diffs(session)
print(f"Changes after revert: {len(changes_after)}")
