import sys
import os
import json
import argparse

# Add current directory to path to allow importing modules even when run from outside
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from planner import TaskPlanner
from task_manager import TaskManager
from memory import MemoryProvider
from rules_engine import RulesEngine
from search_engine import SearchEngine
from file_tracker import FileTracker
from artifacts import ArtifactManager

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

    # Tracking commands
    track_parser = subparsers.add_parser("track-file", help="Track a file change")
    track_parser.add_argument("session_id", help="Session ID")
    track_parser.add_argument("file_path", help="File path")
    track_parser.add_argument("original_content", help="Original content before change")
    track_parser.add_argument("new_content", help="New content after change")

    changes_parser = subparsers.add_parser("session-changes", help="Get all changes for a session")
    changes_parser.add_argument("session_id", help="Session ID")

    revert_parser = subparsers.add_parser("revert-session", help="Revert all changes for a session")
    revert_parser.add_argument("session_id", help="Session ID")

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

    elif args.command == "track-file":
        tracker = FileTracker(".agentic-coding/file_tracker.db")
        tracker.track(args.session_id, args.file_path, args.original_content, args.new_content)
        print(json.dumps({"status": "success"}))

    elif args.command == "session-changes":
        tracker = FileTracker(".agentic-coding/file_tracker.db")
        changes = tracker.get_session_diffs(args.session_id)
        print(json.dumps(changes))

    elif args.command == "revert-session":
        tracker = FileTracker(".agentic-coding/file_tracker.db")
        reverts = tracker.revert_session(args.session_id)
        print(json.dumps(reverts))

    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
