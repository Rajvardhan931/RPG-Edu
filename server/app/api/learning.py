from flask import Blueprint, jsonify, request
from app.services.path_service import PathService
from app.services.auth_service import AuthService

learning_bp = Blueprint('learning', __name__)
path_service = PathService()
auth_service = AuthService()

def get_authenticated_user():
    """Helper to verify JWT and return user ID."""
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ')[1]
    user = auth_service.verify_token(token)
    return user.id if user else None

@learning_bp.route('/goal', methods=['POST'])
def set_goal():
    """
    Sets a new AI learning goal and triggers path generation.
    Payload: {"goal": "...", "enabled": true/false}
    """
    user_id = get_authenticated_user()
    if not user_id:
        return jsonify({"error": "Your Adventurer's Pass is missing or expired"}), 401

    data = request.get_json()
    goal = data.get('goal')
    enabled = data.get('enabled', True)

    if not goal:
        return jsonify({"error": "A goal description is required"}), 400

    try:
        # Set goal and generate path
        result = path_service.set_ai_goal(user_id, goal)

        # Also explicitly set the guidance toggle if provided
        path_service.toggle_ai_guidance(user_id, enabled)

        return jsonify({
            "message": "AI Navigator has charted a new course!",
            "path": result
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@learning_bp.route('/path', methods=['GET'])
def get_path():
    """
    Retrieves the current AI-generated learning path for the user.
    """
    user_id = get_authenticated_user()
    if not user_id:
        return jsonify({"error": "Your Adventurer's Pass is missing or expired"}), 401

    try:
        path = path_service.get_user_path(user_id)
        if not path:
            return jsonify({
                "message": "No active AI path found. Set a goal to begin your guided journey.",
                "path": None
            }), 200

        return jsonify({
            "path": path,
            "message": "Your guided path is ready."
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@learning_bp.route('/guidance', methods=['PATCH'])
def toggle_guidance():
    """
    Toggles the AI guidance switch on the user's profile.
    Payload: {"enabled": true/false}
    """
    user_id = get_authenticated_user()
    if not user_id:
        return jsonify({"error": "Your Adventurer's Pass is missing or expired"}), 401

    data = request.get_json()
    enabled = data.get('enabled')

    if enabled is None:
        return jsonify({"error": "The 'enabled' field is required"}), 400

    try:
        path_service.toggle_ai_guidance(user_id, enabled)
        return jsonify({
            "message": f"AI Guidance has been {'enabled' if enabled else 'disabled'}.",
            "enabled": enabled
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
