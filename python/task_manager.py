import json
import os

class TaskManager:
    """
    Manages the lifecycle of agentic-coding-plugin tasks.
    States: pending, running, completed, failed, retrying.
    """
    def __init__(self, tasks_file):
        self.tasks_file = tasks_file
        self.tasks = self._load_tasks()

    def _load_tasks(self):
        if os.path.exists(self.tasks_file):
            with open(self.tasks_file, 'r') as f:
                return json.load(f)
        return {"tasks": []}

    def update_task_status(self, task_id, status):
        """
        Updates the status of a specific task.
        """
        for task in self.tasks.get('tasks', []):
            if task.get('id') == task_id:
                task['status'] = status
                break
        self._save_tasks()

    def _save_tasks(self):
        with open(self.tasks_file, 'w') as f:
            json.dump(self.tasks, f, indent=2)

if __name__ == "__main__":
    # Test task manager locally
    manager = TaskManager("current_tasks.json")
    manager.update_task_status("task_1", "running")
    print(manager.tasks)
