from flask import Blueprint, jsonify, request
from app.services.auth_service import AuthService
from app.repositories.user_repo import UserRepository

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()
user_repo = UserRepository()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not all([email, password, username]):
        return jsonify({"error": "Email, password, and username are required"}), 400

    try:
        print(f"API: Starting signup for {email}")
        # 1. Create user in Supabase Auth
        auth_response = auth_service.signup(email, password, username)
        print(f"API: Auth service response received")
        user = auth_response.user
        print(f"API: User ID is {user.id}")

        # 2. Create the RPG character profile
        print(f"API: Creating profile for {user.id}")
        user_repo.create_profile(user.id, username)
        print(f"API: Profile creation successful")

        return jsonify({
            "message": "Adventurer registered successfully!",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": username
            }
        }), 201
    except Exception as e:
        print(f"API ERROR during signup: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Authenticate via Supabase
        session = auth_service.login(email, password)

        return jsonify({
            "message": "Welcome back, Adventurer!",
            "token": session.session.access_token,
            "user": {
                "id": session.user.id,
                "email": session.user.email
            }
        }), 200
    except Exception as e:
        return jsonify({"error": "Invalid credentials or authentication failure"}), 401
