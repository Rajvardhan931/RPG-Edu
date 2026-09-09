from .base_repo import BaseRepository
from typing import List, Dict, Any, Optional

class PathRepository(BaseRepository):
    """
    Repository for managing AI-generated learning paths.
    """
    PATHS_TABLE = "learning_paths"
    NODES_TABLE = "path_nodes"

    def create_path(self, user_id: str, goal_text: str) -> Dict[str, Any]:
        """
        Creates a new learning path record.
        """
        data = {
            "user_id": user_id,
            "goal_text": goal_text
        }
        result = self.insert(self.PATHS_TABLE, data)
        # Supabase insert returns a list of the inserted record(s)
        return result[0] if result else None

    def add_nodes_to_path(self, path_id: str, nodes_data: List[Dict[str, Any]]) -> bool:
        """
        Bulk inserts the sequence of nodes into the path.
        Expects nodes_data as a list of {"node_id": ..., "sequence_order": ...}
        """
        # Supabase-py's insert supports lists for bulk inserts
        result = self.insert(self.NODES_TABLE, nodes_data)
        return result is not None

    def get_path_with_nodes(self, path_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches the path and its associated nodes in correct sequence.
        """
        # 1. Get path basic info
        filters = {"id": path_id}
        path_result = self.select(self.PATHS_TABLE, filters=filters)
        if not path_result: return None
        path = path_result[0]

        # 2. Get nodes for this path, ordered by sequence_order
        # Note: base_repo.select doesn't support ORDER BY directly.
        # We'll fetch them and sort in Python for simplicity in the demo.
        node_filters = {"path_id": path_id}
        nodes_result = self.select(self.NODES_TABLE, filters=node_filters)

        # Sort nodes by sequence_order
        if nodes_result:
            nodes_result.sort(key=lambda x: x.get('sequence_order', 0))

        return {
            **path,
            "nodes": nodes_result or []
        }

    def get_current_path_for_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetches the latest learning path associated with the user.
        """
        # In this demo, we fetch the most recent path created by the user
        # For a more robust system, we'd use the current_path_id from profiles.
        # But we'll start by just fetching the latest for simplicity.
        filters = {"user_id": user_id}
        results = self.select(self.PATHS_TABLE, filters=filters)
        if not results: return None

        # Get the most recent one (assuming they are sorted by created_at desc or just pick last)
        # Since select() order is not guaranteed, we'll take the last one in the list.
        latest_path = results[-1]
        return self.get_path_with_nodes(latest_path['id'])

    def delete_path(self, path_id: str):
        """
        Deletes a path and its associated nodes (Cascade handles nodes).
        """
        filters = {"id": path_id}
        return self.delete(self.PATHS_TABLE, filters=filters)
