import chromadb
import os
import uuid
import datetime
from typing import List, Dict, Optional

class MemoryProvider:
    """
    Search past sessions to see if similar tasks have been performed.
    Uses ChromaDB for vector-based semantic search across sessions.
    """
    def __init__(self, chroma_path: str):
        self.chroma_path = chroma_path
        self._init_client()

    def _init_client(self):
        """Initializes the ChromaDB persistent client."""
        os.makedirs(os.path.dirname(self.chroma_path), exist_ok=True)
        self.client = chromadb.PersistentClient(path=self.chroma_path)
        self.collection = self.client.get_or_create_collection(
            name="agent_memory",
            metadata={"description": "Agentic coding plugin session memory."}
        )

    def search_past_sessions(self, query: str, top_n: int = 5) -> List[Dict]:
        """Performs semantic search on past memories."""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_n
        )
        
        memories = []
        if results and results["documents"]:
            for i, doc in enumerate(results["documents"][0]):
                metadata = results["metadatas"][0][i]
                memories.append({
                    "id": results["ids"][0][i],
                    "content": doc,
                    "session_id": metadata.get("session_id"),
                    "timestamp": metadata.get("timestamp")
                })
        return memories

    def save_session_memory(self, session_id: str, content: str, tags: List[str] = None):
        """Saves a new memory entry for the current session."""
        self.collection.add(
            ids=[str(uuid.uuid4())],
            documents=[content],
            metadatas=[{
                "session_id": session_id,
                "timestamp": datetime.datetime.now().isoformat(),
                "tags": ",".join(tags) if tags else ""
            }]
        )

if __name__ == "__main__":
    # Test memory searching locally with ChromaDB persistence
    mem = MemoryProvider("test_memory")
    mem.save_session_memory("test-session-123", "Tested initial memory logic and ChromaDB integration.")
    print(mem.search_past_sessions("Initial memory logic"))
