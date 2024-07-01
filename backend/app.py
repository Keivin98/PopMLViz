from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Allow all origins
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    with app.app_context():
        from .routes import main_blueprint
        app.register_blueprint(main_blueprint)
        
    return app
