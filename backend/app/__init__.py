from flask import Flask
from flask_cors import CORS

cors = CORS()

def create_app():
    app = Flask(__name__)
    cors.init_app(app)
    with app.app_context():
        from .routes import main_blueprint
        app.register_blueprint(main_blueprint)
    return app
