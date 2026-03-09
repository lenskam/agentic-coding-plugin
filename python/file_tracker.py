import sqlite3
import os
import json
import difflib
import datetime

class FileTracker:
    """
    Tracks and stores file changes in a SQLite database for audit and undo capabilities.
    Each session's changes can be reviewed and historically reverted.
    """
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Initializes the SQLite database with the file_changes table."""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS file_changes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                file_path TEXT,
                original_content TEXT,
                new_content TEXT,
                diff TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def track(self, session_id: str, file_path: str, original_content: str, new_content: str):
        """Records a specific change and stores the diff."""
        # Generate diff for easy preview
        diff = "\n".join(difflib.unified_diff(
            original_content.splitlines(),
            new_content.splitlines(),
            fromfile=f"original/{file_path}",
            tofile=f"new/{file_path}",
            lineterm=''
        ))

        # Log to DB
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO file_changes (session_id, file_path, original_content, new_content, diff)
            VALUES (?, ?, ?, ?, ?)
        ''', (session_id, file_path, original_content, new_content, diff))
        conn.commit()
        conn.close()
        
    def get_session_diffs(self, session_id: str):
        """Retrieves and summarizes all diffs for a given session."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT file_path, diff FROM file_changes WHERE session_id = ?', (session_id,))
        results = cursor.fetchall()
        conn.close()
        return [{"file": r[0], "diff": r[1]} for r in results]

    def undo_last_change(self, session_id: str):
        """Reverts the very last file change registered for the session."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, file_path, original_content 
            FROM file_changes 
            WHERE session_id = ? 
            ORDER BY timestamp DESC LIMIT 1
        ''', (session_id,))
        row = cursor.fetchone()
        
        if row:
            change_id, file_path, original_content = row
            # Normally we'd write to Disk here synchronously in actual plugin tools, 
            # here we return the metadata for completion.
            cursor.execute('DELETE FROM file_changes WHERE id = ?', (change_id,))
            conn.commit()
            conn.close()
            return {"file": file_path, "original": original_content}
        
        conn.close()
        return None

if __name__ == "__main__":
    # Test tracking logic locally
    tracker = FileTracker("test_changes.db")
    tracker.track("session-1", "test.ts", "import foo from 'bar';", "import { foo } from 'bar';")
    print(tracker.get_session_diffs("session-1"))
