from .base_repo import BaseRepository

class SkillRepository(BaseRepository):
    """
    Repository for the Skill Tree (Nodes and Skills).
    """
    NODES_TABLE = "nodes"
    SKILLS_TABLE = "skills"
    USER_SKILLS_TABLE = "user_skills"

    def get_all_nodes(self):
        """
        Fetches all nodes across all skills to build the global map.
        """
        # We select from nodes and join with skills if needed, but for the tree
        # we mainly need the node structure.
        return self.select(self.NODES_TABLE)

    def get_user_progress(self, user_id: str):
        """
        Fetches all skill nodes a specific user has interacted with.
        """
        filters = {"user_id": user_id}
        return self.select(self.USER_SKILLS_TABLE, filters=filters)

    def mark_node_completed(self, user_id: str, node_id: str):
        """
        Marks a node as completed for the user.
        """
        filters = {"user_id": user_id, "node_id": node_id}
        data = {
            "status": "completed",
            "completed_at": "now()" # Supabase handles this if set as default or via function
        }
        return self.update(self.USER_SKILLS_TABLE, filters=filters, data=data)

    def unlock_node(self, user_id: str, node_id: str):
        """
        Changes a node status from 'locked' to 'unlocked'.
        """
        filters = {"user_id": user_id, "node_id": node_id}
        data = {"status": "unlocked"}

        # Try update; if it fails (doesn't exist), insert it
        result = self.update(self.USER_SKILLS_TABLE, filters=filters, data=data)
        if not result:
            return self.insert(self.USER_SKILLS_TABLE, {
                "user_id": user_id,
                "node_id": node_id,
                "status": "unlocked"
            })
        return result
