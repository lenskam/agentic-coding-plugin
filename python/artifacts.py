import os
import shutil

class ArtifactManager:
    """
    Manages session-prefixed project artifacts for traceability.
    Stores files and directories in .agentic-coding/artifacts/.
    """
    def __init__(self, artifacts_dir):
        self.artifacts_dir = artifacts_dir
        self._init_dir()

    def _init_dir(self):
        if not os.path.exists(self.artifacts_dir):
            os.makedirs(self.artifacts_dir)

    def save_artifact(self, session_id, file_path, name):
        """
        Saves a project artifact with a session-based prefix.
        """
        # Placeholder for artifact storage logic
        dest_filename = f"{session_id}_{name}"
        dest_path = os.path.join(self.artifacts_dir, dest_filename)
        # For prototype, assume copying from project
        if os.path.exists(file_path):
            shutil.copy(file_path, dest_path)

if __name__ == "__main__":
    # Test artifact manager locally
    manager = ArtifactManager(".agentic-coding/artifacts")
    print(manager.artifacts_dir)
