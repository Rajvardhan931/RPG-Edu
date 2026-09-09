from app.repositories.skill_repo import SkillRepository

class SkillService:
    """
    The Map-Maker. Assembles the hierarchy and validates unlock status.
    """
    def __init__(self):
        self.skill_repo = SkillRepository()

    def get_skill_tree(self, user_id: str):
        """
        Returns the complete skill tree with user-specific status for each node.
        """
        all_nodes = self.skill_repo.get_all_nodes()
        user_progress = self.skill_repo.get_user_progress(user_id)

        # Map user progress for O(1) lookup
        progress_map = {
            p['node_id']: p['status']
            for p in user_progress
        } if user_progress else {}

        tree = []
        for node in all_nodes:
            status = progress_map.get(node['id'], 'locked')

            # Logic: A node is 'unlocked' if its prerequisite is 'completed'
            # Root nodes (no prereq) are always unlocked.
            prereq_id = node.get('prerequisite_id')
            if prereq_id:
                prereq_status = progress_map.get(prereq_id, 'locked')
                if prereq_status != 'completed' and status == 'locked':
                    # Still locked because prereq isn't done
                    pass
                elif prereq_status == 'completed' and status == 'locked':
                    # Prereq is done! We can now unlock this.
                    status = 'unlocked'
            else:
                # Root node
                if status == 'locked':
                    status = 'unlocked'

            tree.append({
                **node,
                "user_status": status
            })

        return tree
