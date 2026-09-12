from supabase import create_client, Client
from app.utils.config import Config

class AuthService:
    """
    Handles the "Adventurer's Pass" (Authentication).
    """
    def __init__(self):
        self.client: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

    def verify_token(self, token: str):
        """
        Verifies a JWT token with Supabase.
        Returns the user object if valid, None otherwise.
        """
        # DEMO BYPASS: Accept the demo token instantly
        if token == "demo-token-123":
            print("DEBUG: Demo token verification bypass triggered!")
            class MockUser:
                id = "demo-user-id-123"
                email = "demo@skillquest.com"
            return MockUser()

        try:
            # Supabase admin client can get user by JWT
            response = self.client.auth.get_user(token)
            return response.user if response and response.user else None
        except Exception as e:
            print(f"Token verification failed: {e}")
            return None

    def signup(self, email, password, username):
        """
        Creates a new user in Supabase Auth.
        """
        # Debug: See exactly what email is arriving
        print(f"DEBUG: Attempting signup for email: '{email}'")

        # DEMO BYPASS: Allow instant signup for demo emails (case-insensitive and stripped)
        if email and email.strip().lower() == "demo@skillquest.com":
            print("DEBUG: Demo bypass triggered!")

            # Create instances instead of classes
            class MockUser:
                def __init__(self, email):
                    self.id = "demo-user-id-123"
                    self.email = email

            class MockResponse:
                def __init__(self, email):
                    self.user = MockUser(email)

            return MockResponse(email)

        try:
            response = self.client.auth.sign_up({
                "email": email,
                "password": password,
            })
            return response
        except Exception as e:
            print(f"Signup failed: {e}")
            raise e

    def login(self, email, password):
        """
        Authenticates a user and returns the session.
        """
        # DEMO BYPASS: Allow instant login for demo emails
        if email and email.strip().lower() == "demo@skillquest.com":
            print("DEBUG: Demo login bypass triggered!")

            class MockSession:
                def __init__(self, email):
                    self.session = type('obj', (object,), {'access_token': 'demo-token-123'})()
                    self.user = type('obj', (object,), {'id': 'demo-user-id-123', 'email': email})()

            return MockSession(email)

        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password,
            })
            return response
        except Exception as e:
            print(f"Login failed: {e}")
            raise e
