import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from database import create_database
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from datetime import timedelta


# db = SQLAlchemy()

load_dotenv()
def create_app():
    app = Flask(__name__)
    jwt = JWTManager(app)
    bcrypt = Bcrypt()
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default_key')  
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['JWT_TOKEN_LOCATION'] = ['cookies']
    app.config['JWT_COOKIE_SECURE'] = True
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    app.config['JWT_COOKIE_SAMESITE'] = 'None'
    # Allow all origins
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    create_database()
    
    with app.app_context():
        from routes import main_blueprint
        app.register_blueprint(main_blueprint)

    bcrypt.init_app(app)
    
        
    return app
