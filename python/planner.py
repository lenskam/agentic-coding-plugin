import json
import os
import requests
from typing import List, Dict, Optional

class TaskPlanner:
    """
    Core planning and task decomposition modules for the agentic-coding-plugin.
    Transforms high-level requests into a structured task graph.
    """
    def __init__(self, session_id: str, provider: str = "openrouter"):
        self.session_id = session_id
        self.provider = provider
        self.api_key = os.environ.get("LLM_API_KEY", "")
        self.model = os.environ.get("LLM_MODEL", "kimi/kimi-v1")

    def plan_task(self, request: str, context: Optional[Dict] = None) -> Dict:
        """
        Decomposes the developer request into a structured JSON task graph.
        """
        if not self.api_key:
            # Fallback to a basic template-based planner if no API key is present
            return self._fallback_plan(request)

        # Prompt for task decomposition
        prompt = f"""
        Analyze the following developer request and decompose it into a task graph:
        REQUEST: {request}
        CONTEXT: {json.dumps(context or {})}

        Return a JSON object with the following schema:
        {{
          "session_id": "{self.session_id}",
          "tasks": [
            {{
              "id": "unique_task_id",
              "description": "clear description of the step",
              "status": "pending",
              "dependencies": ["list_of_ids_this_task_depends_on"]
            }}
          ]
        }}
        """

        try:
            # Prototype call (OpenRouter default)
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                  "Authorization": f"Bearer {self.api_key}",
                  "Content-Type": "application/json"
                },
                json={
                  "model": self.model,
                  "messages": [{"role": "user", "content": prompt}],
                  "response_format": { "type": "json_object" }
                }
            )
            response.raise_for_status()
            plan = response.json()["choices"][0]["message"]["content"]
            return json.loads(plan)
        except Exception as e:
            return self._fallback_plan(request, error=str(e))

    def _fallback_plan(self, request: str, error: str = "") -> Dict:
        """Simple template-based fallback if the LLM call fails or is unavailable."""
        return {
            "session_id": self.session_id,
            "tasks": [
                {
                  "id": "initial_analysis", 
                  "description": f"Analyze: {request}", 
                  "status": "pending", 
                  "dependencies": []
                },
                {
                  "id": "implementation", 
                  "description": "Implement requested functionality.", 
                  "status": "pending", 
                  "dependencies": ["initial_analysis"]
                },
                {
                  "id": "verification", 
                  "description": "Verify implementation with tests.", 
                  "status": "pending", 
                  "dependencies": ["implementation"]
                }
            ],
            "error": error
        }

if __name__ == "__main__":
    # Test planning logic locally
    planner = TaskPlanner("test-session")
    print(json.dumps(planner.plan_task("Setup a Node.js project for unit testing."), indent=2))
