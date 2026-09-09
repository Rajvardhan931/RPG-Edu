import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from the server directory explicitly
# Path: server/app/utils/config.py -> server/app/utils/ -> server/app/ -> server/
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    """
    Central configuration for the SkillQuest backend.
    Reads environment variables and provides typed access.
    """
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    FLASK_PORT = int(os.getenv('PORT', 5000))
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')

    @staticmethod
    def validate():
        """Ensures critical environment variables are present."""
        missing = []
        if not Config.SUPABASE_URL: missing.append('SUPABASE_URL')
        if not Config.SUPABASE_KEY: missing.append('SUPABASE_KEY')

        if missing:
            raise EnvironmentError(
                f"Missing critical environment variables: {', '.join(missing)}. "
                "Please check your server/.env file."
            )
