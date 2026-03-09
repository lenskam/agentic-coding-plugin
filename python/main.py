import sys
import json
import argparse
from python.planner import TaskPlanner
from python.task_manager import TaskManager
from python.memory import MemoryProvider
from python.rules_engine import RulesEngine
from python.search_engine import SearchEngine
from python.file_tracker import FileTracker
from python.artifacts import ArtifactManager

def main():
    parser = argparse.ArgumentParser(description="Agentic Coding Plugin: Python Backend")
    subparsers = parser.add_subparsers(dest="command", help="Agent command to execute")

    # Plan command
    plan_parser = subparsers.add_parser("plan", help="Decompose a request into tasks")
    plan_parser.add_argument("request", help="The user request to plan")

    # Search command
    search_parser = subparsers.add_parser("search", help="Execute hybrid search (code + memory)")
    search_parser.add_argument("query", help="Search query")

    # Rules check command
    rules_parser = subparsers.add_parser("check-rules", help="Evaluate safety rules for an action")
    rules_parser.add_argument("action", help="The action to check (e.g., 'git commit')")
    rules_parser.add_argument("--content", help="Content context for the rule (e.g., file code)")

    # Memory command
    memory_parser = subparsers.add_parser("memory-add", help="Add a new memory record")
    memory_parser.add_argument("session_id", help="Session ID")
    memory_parser.add_argument("content", help="Memory content")
    memory_parser.add_argument("--tags", nargs="*", help="Optional tags")

    args = parser.parse_args()

    if args.command == "plan":
        planner = TaskPlanner()
        plan = planner.generate_plan(args.request)
        print(json.dumps(plan))

    elif args.command == "search":
        engine = SearchEngine(".", ".agentic-coding/chroma")
        results = engine.search(args.query)
        print(json.dumps(results))

    elif args.command == "check-rules":
        engine = RulesEngine(".opencode/rules")
        context = {"content": args.content} if args.content else {}
        decision = engine.evaluate(args.action, context)
        print(json.dumps({
            "action": decision.action,
            "message": decision.message,
            "rule_name": decision.rule_name
        }))

    elif args.command == "memory-add":
        provider = MemoryProvider(".agentic-coding/chroma")
        provider.save_session_memory(args.session_id, args.content, args.tags)
        print(json.dumps({"status": "success"}))

    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
