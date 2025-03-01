from flask import Flask, jsonify, request
from flask_cors import CORS
from src.socket_handlers import init_socketio
from src.utils.logger import get_logger
from src.debug_console import debug_bp
from src.test_data_manager import register_handlers

# Set up logger
logger = get_logger("app")
debug = logger.debug
info = logger.info
error = logger.error

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(debug_bp)

# Initialize SocketIO with the app
socketio = init_socketio(app)

# Register test data handlers
register_handlers(socketio)

@app.route('/api/hello', methods=['GET'])
def hello_world():
    debug("API endpoint /api/hello was called")
    return jsonify({"message": "Hello from API!"})

if __name__ == '__main__':
    info("Starting Flask-SocketIO server")
    # Run with explicit host and debug settings
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)