from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from socket_handlers import handle_message
from utils.logger import get_logger

logger = get_logger("app.js") 
debug = logger.debug

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/api/hello', methods=['GET'])
def hello_world():
    debug("API endpoint /api/hello was called")
    return jsonify({"message": "Hello from MNIST Visualizer API!"})

@socketio.on('message')
def receive_text(data):
    handle_message(data)
    debug("Message processed successfully")

@socketio.on('connect')
def handle_connect():
    debug("Client connected to WebSocket")

if __name__ == '__main__':
    debug("Starting MNIST Visualizer API server")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)