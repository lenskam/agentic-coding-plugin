import sqlite3
import os

class FileTracker:
    """
    Tracks all file changes made by the agentic-coding-plugin.
    Supports session-based undo and auditing.
    """
    def __init__(self, db_path):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        # Create a SQLite table to store file change history
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS file_changes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                file_path TEXT,
                diff TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
        conn.close()

    def log_change(self, session_id, file_path, diff):
        """
        Logs a specific file change.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO file_changes (session_id, file_path, diff)
            VALUES (?, ?, ?)
        ''', (session_id, file_path, diff))
        conn.commit()
        conn.close()

if __name__ == "__main__":
    # Test tracking logic locally
    tracker = FileTracker("file_changes.db")
    tracker.log_change("test-session", "test.py", "+ added a new line")
    print(tracker.db_path)
