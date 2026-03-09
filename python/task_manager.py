import json
import os
import datetime
from typing import List, Dict, Optional

class TaskManager:
    """
    State machine and lifecycle management for agentic-coding-plugin tasks.
    Manages persistence in .agentic-coding/tasks/current.json.
    """
    def __init__(self, tasks_file: str):
        self.tasks_file = tasks_file
        self.data = self._load()

    def _load(self) -> Dict:
        """Loads tasks from the persistent JSON file."""
        if os.path.exists(self.tasks_file):
            try:
                with open(self.tasks_file, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                pass
        return {"tasks": [], "history": []}

    def _save(self):
        """Saves current tasks atomically to disk."""
        os.makedirs(os.path.dirname(self.tasks_file), exist_ok=True)
        # Use a temporary file for atomic write
        tmp_file = f"{self.tasks_file}.tmp"
        with open(tmp_file, 'w') as f:
            json.dump(self.data, f, indent=2)
        os.rename(tmp_file, self.tasks_file)

    def register_tasks(self, new_tasks: List[Dict]):
        """Adds a new set of tasks to the tracker."""
        for task in new_tasks:
            if "status" not in task:
                task["status"] = "pending"
            task["created_at"] = datetime.datetime.now().isoformat()
            self.data["tasks"].append(task)
        self._save()

    def update_task_status(self, task_id: str, status: str, result: str = None):
        """Updates the status and result of a specific task."""
        for task in self.data["tasks"]:
            if task.get("id") == task_id:
                task["status"] = status
                if result:
                    task["result"] = result
                task["updated_at"] = datetime.datetime.now().isoformat()
                
                # If completed or failed, move to history log
                if status in ["completed", "failed"]:
                    self.data["history"].append(task)
                break
        self._save()

    def get_next_task(self) -> Optional[Dict]:
        """Identifies the next pending task without unsatisfied dependencies."""
        completed_ids = {t["id"] for t in self.data["tasks"] if t["status"] == "completed"}
        
        for task in self.data["tasks"]:
            if task["status"] == "pending":
                # Check dependencies
                deps = task.get("dependencies", [])
                if all(dep in completed_ids for dep in deps):
                    return task
        return None

    def get_status_summary(self) -> Dict:
        """Returns a summary of the current task state."""
        counts = {}
        for task in self.data["tasks"]:
            s = task["status"]
            counts[s] = counts.get(s, 0) + 1
        return {
            "counts": counts,
            "next": self.get_next_task()
        }

if __name__ == "__main__":
    # Test task manager locally
    manager = TaskManager("test_tasks.json")
    manager.register_tasks([{"id": "task_1", "description": "Analyzer", "status": "pending"}])
    manager.update_task_status("task_1", "completed")
    print(manager.get_status_summary())
