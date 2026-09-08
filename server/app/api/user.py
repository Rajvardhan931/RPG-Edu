from flask import Blueprint, jsonify, request
from app.services.auth_service import AuthService
from app.repositories.user_repo import UserRepository

user_bp = Blueprint('user', __name__)
auth_service = AuthService()
user_repo = UserRepository()

def get_authenticated_user():
    """Helper to verify JWT and return user ID."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]
    user = auth_service.verify_token(token)
    return user.id if user else None

@user_bp.route('/stats', methods=['GET'])
def get_stats():
    user_id = get_authenticated_user()
    if not user_id:
        return jsonify({"error": "Your Adventurer's Pass is missing or expired"}), 401

    profile = user_repo.get_user_profile(user_id)
    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    return jsonify({
        "username": profile.get('username'),
        "class": profile.get('class_type'),
        "stats": {
            "knowledge": {
                "level": profile.get('knowledge_level'),
                "xp": profile.get('knowledge_xp')
            },
            "capability": {
                "level": profile.get('capability_level'),
                "xp": profile.get('capability_xp')
            },
            "total_xp": profile.get('total_xp')
        }
    }), 200
