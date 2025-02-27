from flask_socketio import emit, SocketIO
from src.utils.logger import get_logger, sent, received

logger = get_logger("socket_handlers")
debug = logger.debug
info = logger.info

def register_socket_handlers(socketio):
    """Register all socket event handlers"""
    
    @socketio.on('message')
    def handle_client_message(data):
        received(f"Received message from client: {data}")
        handle_message(data)

    @socketio.on('recieved_message')
    def handle_client_confirmation(data):
        handle_confirmation(data)

def handle_message(data):
    """Process a message from the client"""
    emit('received_message', data)
    debug(f"Sent confirmation: {data}")

def handle_confirmation(data):
    """Process a confirmation from the client"""
    debug(f"Comfirmation recieved: {data['content']}")
