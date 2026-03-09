import subprocess
import os
import re
from typing import List, Dict, Optional

class GrepSearcher:
    """Uses the system 'grep' command for fast keyword-based code search."""
    def __init__(self, root_dir: str):
        self.root_dir = root_dir

    def search(self, query: str, include: List[str] = None, exclude: List[str] = None) -> List[Dict]:
        """
        Performs a recursive grep search.
        Result format: list of {'file': str, 'line': int, 'content': str}
        """
        # Command: grep -rnI <query> <root_dir>
        # -r recursive, -n line numbers, -I ignore binary files
        cmd = ["grep", "-rnI", query, self.root_dir]
        
        if include:
            for pattern in include:
                cmd.extend(["--include", pattern])
        if exclude:
            # Common excludes to improve performance
            for pattern in exclude:
                cmd.extend(["--exclude", pattern])
        else:
            # Default excludes for node_modules, .git, etc.
            for pattern in ["node_modules/", ".git/", ".venv/", "venv/"]:
                cmd.extend(["--exclude-dir", pattern])
        
        try:
            # We use a 10s timeout to prevent hanging on massive queries.
            process = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
            
            if process.returncode != 0 and not process.stdout:
                return []
                
            matches = []
            for line in process.stdout.splitlines():
                # Format is typically: path/to/file:line:content
                parts = line.split(":", 2)
                if len(parts) >= 3:
                    matches.append({
                        "file": os.path.relpath(parts[0], self.root_dir),
                        "line": int(parts[1]),
                        "content": parts[2].strip()
                    })
            
            # Cap matches at 100 for stability
            return matches[:100]
            
        except (subprocess.TimeoutExpired, subprocess.CalledProcessError) as e:
            # Silently return empty on failures or no matches.
            return []

class SearchEngine:
    """Unified search interface for the agent."""
    def __init__(self, root_dir: str, chroma_path: str):
        self.root_dir = root_dir
        self.grep_searcher = GrepSearcher(root_dir)
        self.memory_provider = None
        
        # Lazy-load MemoryProvider to avoid issues if Chromadb is missing.
        try:
            from python.memory import MemoryProvider
            self.memory_provider = MemoryProvider(chroma_path)
        except (ImportError, Exception):
            # Log error internally or fallback to empty behavior
            pass

    def search(self, query: str, top_n: int = 5) -> Dict:
        """Performs a combined (hybrid) search of code and memory."""
        results = {
            "query": query,
            "code_matches": self.grep_searcher.search(query),
            "memory_matches": []
        }
        
        if self.memory_provider:
            results["memory_matches"] = self.memory_provider.search_past_sessions(query, top_n)
            
        return results

if __name__ == "__main__":
    # Test unified search logic locally
    engine = SearchEngine(".", "test_memory")
    print(engine.search("SearchEngine"))
