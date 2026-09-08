from flask import Blueprint, jsonify, request

skills_bp = Blueprint('skills', __name__)

@skills_bp.route('/tree', methods=['GET'])
def get_tree():
    # TODO: Implement skill tree hierarchy retrieval
    return jsonify({"message": "Skill tree endpoint stub"}), 200

@skills_bp.route('/node/<node_id>', methods=['GET'])
def get_node(node_id):
    # TODO: Implement specific node detail retrieval
    return jsonify({"message": f"Node {node_id} endpoint stub"}), 200
