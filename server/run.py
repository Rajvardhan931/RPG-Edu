from flask import Flask
from flask_cors import CORS
from app.api.auth import auth_bp
from app.api.user import user_bp
from app.api.skills import skills_bp
from app.api.quests import quests_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(skills_bp, url_prefix='/api/skills')
    app.register_blueprint(quests_bp, url_prefix='/api/quests')

    @app.route('/health')
    def health():
        return {"status": "healthy", "message": "SkillQuest Backend is running"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
