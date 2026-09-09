from .base_repo import BaseRepository

class UserRepository(BaseRepository):
    """
    Repository for managing User Profiles and their RPG progression.
    """
    TABLE = "profiles"

    def get_user_profile(self, user_id: str):
        """
        Fetches a user's complete profile, including dual-track levels.
        """
        # DEMO BYPASS: Return a mock profile for the demo user
        if user_id == "demo-user-id-123":
            return {
                "id": user_id,
                "username": "DemoAdventurer",
                "knowledge_xp": 500,
                "capability_xp": 300,
                "knowledge_level": 3,
                "capability_level": 2,
                "total_xp": 800,
                "class_type": "Novice",
                "ai_guidance_enabled": True
            }

        filters = {"id": user_id}
        results = self.select(self.TABLE, filters=filters)
        return results[0] if results else None

    def update_profile_data(self, user_id: str, data: dict):
        """
        Updates arbitrary fields in the user profile.
        """
        if user_id == "demo-user-id-123":
            return True # Mock success for demo user

        filters = {"id": user_id}
        return self.update(self.TABLE, filters=filters, data=data)

    def update_ai_settings(self, user_id: str, goal: str = None, enabled: bool = None, path_id: str = None):
        """
        Specifically updates AI goal and guidance settings.
        """
        data = {}
        if goal is not None: data["current_goal"] = goal
        if enabled is not None: data["ai_guidance_enabled"] = enabled
        if path_id is not None: data["current_path_id"] = path_id

        if not data: return None
        return self.update_profile_data(user_id, data)


    def create_profile(self, user_id: str, username: str):
        """
        Initializes a new character profile upon signup.
        """
        # DEMO BYPASS: Avoid DB insert for demo user
        if user_id == "demo-user-id-123":
            return True

        data = {
            "id": user_id,
            "username": username,
            "knowledge_xp": 0,
            "capability_xp": 0,
            "knowledge_level": 1,
            "capability_level": 1,
            "total_xp": 0,
            "class_type": "Novice",
            "ai_guidance_enabled": False
        }
        return self.insert(self.TABLE, data)
