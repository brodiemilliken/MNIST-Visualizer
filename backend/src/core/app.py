from flask import Flask, jsonify, request
from flask_cors import CORS
from src.utils.logger import get_logger
from src.sockets.manager import init_socketio
from src.api.routes import register_routes
from src.debug.console import debug_bp
from src.test.test_data_manager import register_handlers

# Set up logger
logger = get_logger("app")
debug = logger.debug
info = logger.info
error = logger.error

def create_app():
    """Create and configure the Flask application"""
    info("Initializing Flask application")
    
    # Create Flask app
    app = Flask(__name__, template_folder='../debug/templates')
    app.config['SECRET_KEY'] = 'mysecretkey'
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Register blueprints
    app.register_blueprint(debug_bp)
    
    # Register API routes
    register_routes(app)
    
    # Initialize SocketIO with the app
    socketio = init_socketio(app)
    
    # Register test data handlers
    register_handlers(socketio)
    
    info("Flask application initialized successfully")
    return app, socketio

if __name__ == '__main__':
    info("Starting Flask-SocketIO server")
    app, socketio = create_app()
    # Run with explicit host and debug settings
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)