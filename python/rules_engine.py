import os
import re
import yaml
from dataclasses import dataclass
from typing import List, Optional, Dict

@dataclass
class RuleDecision:
    action: str  # block, warn, approval, allow
    message: str
    rule_name: str

class RulesEngine:
    """
    Evaluates Markdown-based project rules with YAML frontmatter.
    Rules are stored in .opencode/rules/*.md by default.
    """
    def __init__(self, rules_path: str):
        self.rules_path = rules_path
        self.rules = self._load_rules()

    def _load_rules(self) -> List[Dict]:
        """Loads and parses all project rules."""
        rules = []
        if not os.path.exists(self.rules_path):
            return rules

        for filename in os.listdir(self.rules_path):
            if filename.endswith(".md"):
                file_path = os.path.join(self.rules_path, filename)
                with open(file_path, 'r') as f:
                    content = f.read()
                    
                    # Extract YAML frontmatter
                    match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', content, re.DOTALL)
                    if match:
                        yaml_data = yaml.safe_load(match.group(1))
                        rules.append({
                            "name": yaml_data.get("name", filename),
                            "description": yaml_data.get("description", ""),
                            "condition": yaml_data.get("condition", ""),
                            "action": yaml_data.get("action", "warn"),
                            "body": match.group(2).strip()
                        })
        return rules

    def evaluate(self, action_string: str, context: Dict = None) -> RuleDecision:
        """
        Evaluates a proposed action string (e.g., 'git commit') and associated context.
        Decision precedence: block > approval > warn > allow.
        """
        context = context or {}
        decisions = []

        for rule in self.rules:
            # Basic condition matching (regex-like logic on the action_string)
            # This can be expanded to evaluate context variables (files, contents, etc.)
            condition = rule["condition"]
            
            # Simplified matching for Phase 3: Check if the action string matches the condition
            # OR if the condition is present within the action string.
            if self._matches_condition(condition, action_string, context):
                decisions.append(RuleDecision(
                    action=rule["action"],
                    message=rule["description"] or f"Rule '{rule['name']}' triggered.",
                    rule_name=rule["name"]
                ))

        if not decisions:
            return RuleDecision(action="allow", message="No rules triggered.", rule_name="default")

        # Resolve precedence
        for action_type in ["block", "approval", "warn"]:
            for d in decisions:
                if d.action == action_type:
                    return d

        return decisions[0]

    def _matches_condition(self, condition: str, action: str, context: Dict) -> bool:
        """Simplified condition matcher for rule evaluation."""
        if not condition:
            return False
            
        # 1. Direct command match (e.g., 'git commit')
        if condition.lower() in action.lower():
            # Check for additional context rules like 'and file contains'
            if "and file contains" in condition:
                pattern_match = re.search(r"contains '(.*?)'", condition)
                if pattern_match:
                    pattern = pattern_match.group(1)
                    # For simplicity in Phase 3, we check the action string or a 'content' key in context
                    target_text = context.get("content", action)
                    return bool(re.search(pattern, target_text))
            return True

        # 2. Key-based match (e.g., 'rm or deploy')
        if " or " in condition:
            parts = [p.strip() for p in condition.split(" or ")]
            return any(p.lower() in action.lower() for p in parts)

        return False

if __name__ == "__main__":
    # Test rules engine prototype locally with dummy paths and data
    rules_dir = "test_rules"
    os.makedirs(rules_dir, exist_ok=True)
    
    with open(os.path.join(rules_dir, "test.md"), "w") as f:
        f.write("---\nname: block-rm\ncondition: rm\naction: block\n---\nDon't delete files!")
        
    engine = RulesEngine(rules_dir)
    print(engine.evaluate("rm -rf node_modules"))
