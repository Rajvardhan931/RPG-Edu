from app.repositories.user_repo import UserRepository
from app.repositories.path_repo import PathRepository
from app.repositories.skill_repo import SkillRepository
from typing import List, Dict, Any, Optional

class PathService:
    """
    The AI Navigator. Coordinates goal setting and adaptive path generation.
    """
    def __init__(self):
        self.user_repo = UserRepository()
        self.path_repo = PathRepository()
        self.skill_repo = SkillRepository()

    def set_ai_goal(self, user_id: str, goal_text: str):
        """
        Entry point for AI-driven learning. Sets the goal and generates a path.
        """
        # 1. Update profile with the goal and enable guidance
        self.user_repo.update_ai_settings(
            user_id=user_id,
            goal=goal_text,
            enabled=True
        )

        # 2. Generate the adaptive path
        return self.generate_ai_path(user_id, goal_text)

    def generate_ai_path(self, user_id: str, goal_text: str):
        """
        Smart Mock AI Logic:
        Maps goals to skills, resolves dependencies, and orders them.
        """
        goal_text_lower = goal_text.lower()

        # 1. Keyword Mapping to Skills
        # In a real app, this would be an LLM call.
        skill_map = {
            "ai": "AI Engineering",
            "llm": "AI Engineering",
            "agent": "AI Engineering",
            "frontend": "Web Development",
            "react": "Web Development",
            "nextjs": "Web Development",
            "backend": "System Design",
            "python": "Python Programming",
            "database": "System Design"
        }

        target_skill_name = "General Knowledge" # Default
        for keyword, skill_name in skill_map.items():
            if keyword in goal_text_lower:
                target_skill_name = skill_name
                break

        # 2. Node Selection
        all_nodes = self.skill_repo.get_all_nodes()
        # In our demo, we assume skills are mapped to nodes.
        # For the mock, we'll take nodes that have names related to the goal
        # or are foundation nodes (no prereqs).
        selected_nodes = []
        for node in all_nodes:
            # Simple mock: if node name contains keywords or is a root node
            is_relevant = any(k in node['name'].lower() for k in ["introduction", "basic", "foundation"])
            if is_relevant:
                selected_nodes.append(node)

        # 3. Dependency Resolution (Recursive)
        # Ensure that if we want a node, we also include its prerequisites.
        final_nodes_set = set()
        def resolve(node):
            if node['id'] in final_nodes_set: return
            prereq_id = node.get('prerequisite_id')
            if prereq_id:
                # Find the prerequisite node
                prereq_node = next((n for n in all_nodes if n['id'] == prereq_id), None)
                if prereq_node:
                    resolve(prereq_node)
            final_nodes_set.add(node)

        for node in selected_nodes:
            resolve(node)

        # 4. Topological Sort (Ordering)
        # We order nodes such that prerequisites always come before the node.
        ordered_nodes = []
        unprocessed = list(final_nodes_set)

        while unprocessed:
            # Find a node whose prerequisites are already in ordered_nodes
            found = False
            for node in unprocessed:
                prereq_id = node.get('prerequisite_id')
                if not prereq_id or any(on['id'] == prereq_id for on in ordered_nodes):
                    ordered_nodes.append(node)
                    unprocessed.remove(node)
                    found = True
                    break
            if not found:
                # Cycle or missing prereq - just add the first one to avoid infinite loop
                node = unprocessed.pop(0)
                ordered_nodes.append(node)

        # 5. Persistence
        # Create the path record
        path = self.path_repo.create_path(user_id, goal_text)
        if not path:
            raise Exception("Failed to create learning path.")

        path_id = path['id']

        # Create the ordered node entries
        nodes_data = [
            {"path_id": path_id, "node_id": node['id'], "sequence_order": i}
            for i, node in enumerate(ordered_nodes)
        ]
        self.path_repo.add_nodes_to_path(path_id, nodes_data)

        # Link path to user profile
        self.user_repo.update_ai_settings(user_id=user_id, path_id=path_id)

        return {
            "path_id": path_id,
            "goal": goal_text,
            "nodes_count": len(ordered_nodes),
            "nodes": ordered_nodes
        }

    def get_user_path(self, user_id: str):
        """
        Retrieves the active AI path for the user.
        """
        # 1. Check if guidance is enabled
        profile = self.user_repo.get_user_profile(user_id)
        if not profile or not profile.get('ai_guidance_enabled'):
            return None

        # 2. Fetch the path via repository
        return self.path_repo.get_current_path_for_user(user_id)

    def toggle_ai_guidance(self, user_id: str, enabled: bool):
        """
        Toggles the AI guidance switch on the profile.
        """
        return self.user_repo.update_ai_settings(user_id=user_id, enabled=enabled)
