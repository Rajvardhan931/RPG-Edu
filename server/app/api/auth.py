from flask import Blueprint, jsonify, request

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    # TODO: Implement authentication logic using Supabase
    return jsonify({"message": "Login endpoint stub"}), 200

@auth_bp.route('/signup', methods=['POST'])
def signup():
    # TODO: Implement signup logic
    return jsonify({"message": "Signup endpoint stub"}), 200
