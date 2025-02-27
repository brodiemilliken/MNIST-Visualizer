from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
# Fix the import path
from src.socket_handlers import register_socket_handlers
from src.utils.logger import get_logger
from src.debug_console import debug_bp
import threading
import time

# Set up logger
logger = get_logger("app")
debug = logger.debug
info = logger.info
sent = logger.sent
recieved = logger.received
error = logger.error

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(debug_bp)

# Initialize SocketIO
socketio = SocketIO(
    app, 
    cors_allowed_origins="*", 
    async_mode='threading',
    logger=False,  # Set to True only for troubleshooting
    engineio_logger=False,
    ping_timeout=60
)

# Register socket handlers
register_socket_handlers(socketio)

# Background thread management
thread = None
thread_lock = threading.Lock()
thread_stop_event = threading.Event()

def background_thread():
    """Background thread that sends a message every 5 seconds"""
    count = 0
    while not thread_stop_event.is_set():
        try:
            time.sleep(5)
            count += 1
            message = {'type': 'text', 'content': f'Server update #{count}'}
            sent(f"Sending background message: {message['content']}")
            socketio.emit('message', message)
        except Exception as e:
            error(f"Error in background thread: {e}")

@app.route('/api/hello', methods=['GET'])
def hello_world():
    debug("API endpoint /api/hello was called")
    return jsonify({"message": "Hello from API!"})

@socketio.on('connect')
def handle_connect():
    global thread
    debug("Client connected to WebSocket")
    
    with thread_lock:
        if thread is None or not thread.is_alive():
            thread_stop_event.clear()
            thread = threading.Thread(target=background_thread)
            thread.daemon = True
            thread.start()
            debug("Background thread started")

@socketio.on('disconnect')
def handle_disconnect():
    debug("Client disconnected from WebSocket")

if __name__ == '__main__':
    info("Starting Flask-SocketIO server")
    # Run with explicit host and debug settings
    socketio.run(app, host='0.0.0.0', port=5000, debug=True, allow_unsafe_werkzeug=True)