import os
import shutil
import glob
from typing import List, Dict, Optional

class ArtifactManager:
    """
    Manages session-prefixed artifacts for traceability and versioning.
    Stores files in .agentic-coding/artifacts/.
    """
    def __init__(self, artifacts_dir: str):
        self.artifacts_dir = artifacts_dir
        self._init_dir()

    def _init_dir(self):
        """Initializes the base artifact storage directory."""
        if not os.path.exists(self.artifacts_dir):
            os.makedirs(self.artifacts_dir, exist_ok=True)

    def save_artifact(self, session_id: str, file_path: str, name: str) -> str:
        """
        Saves a copy of a file or directory as an artifact.
        Filename format: {session_id}_{timestamp}_{name}
        """
        import time
        timestamp = int(time.time())
        dest_filename = f"{session_id}_{timestamp}_{name}"
        dest_path = os.path.join(self.artifacts_dir, dest_filename)

        if os.path.isdir(file_path):
            shutil.copytree(file_path, dest_path)
        elif os.path.isfile(file_path):
            shutil.copy2(file_path, dest_path)
        else:
            raise FileNotFoundError(f"Source file not found: {file_path}")
            
        return dest_path

    def list_artifacts(self, session_id: Optional[str] = None) -> List[Dict]:
        """Lists all artifacts, optionally filtering by session ID."""
        pattern = "*"
        if session_id:
            pattern = f"{session_id}_*"
            
        full_pattern = os.path.join(self.artifacts_dir, pattern)
        files = glob.glob(full_pattern)
        
        artifacts = []
        for file in files:
            name = os.path.basename(file)
            stats = os.stat(file)
            artifacts.append({
                "name": name,
                "path": file,
                "size": stats.st_size,
                "modified": stats.st_mtime
            })
        return artifacts

    def get_latest(self, session_id: str, name_pattern: str = "") -> Optional[str]:
        """Retrieves path to the most recent artifact matching the search pattern."""
        artifacts = self.list_artifacts(session_id)
        if not artifacts:
            return None
            
        # Filter by name if provided
        filtered = [a for a in artifacts if name_pattern in a["name"]]
        if not filtered:
            return None
            
        # Sort by modified time descending
        filtered.sort(key=lambda x: x["modified"], reverse=True)
        return filtered[0]["path"]

if __name__ == "__main__":
    # Test artifact manager locally
    manager = ArtifactManager("test_artifacts")
    print(manager.artifacts_dir)
