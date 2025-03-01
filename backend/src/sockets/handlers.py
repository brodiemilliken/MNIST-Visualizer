from flask_socketio import emit, SocketIO
from src.utils.logger import get_logger, sent, received
from src.utils.message_tracker import track_message, confirm_message

logger = get_logger("socket_handlers")
debug = logger.debug
info = logger.info
warning = logger.warning
error = logger.error
sent = logger.sent
received = logger.received

ID = 0
socketio = None  # Will be set when initialized

def init_socketio(app):
    """Initialize SocketIO with the Flask app"""
    global socketio
    socketio = SocketIO(
        app, 
        cors_allowed_origins="*", 
        async_mode='threading',
        logger=False,
        engineio_logger=False,
        ping_timeout=60
    )
    
    register_handlers(socketio)
    return socketio

def register_handlers(socketio):
    """Register all socket event handlers"""
    
    @socketio.on('connect')
    def handle_connect():
        debug("Client connected to WebSocket")
    
    @socketio.on('disconnect')
    def handle_disconnect():
        debug("Client disconnected from WebSocket")
    
    @socketio.on('message')
    def handle_client_message(data):
        handle_message(data)

    @socketio.on('recieved_message')
    def handle_client_confirmation(data): 
        handle_confirmation(data)

def handle_message(data):
    received(f"Received: {data}")
    emit('received_message', data)

def handle_confirmation(data):
    """Process a confirmation from the client"""
    id = data.get('id', 'unknown')
    confirm_message(id)

def send_message(event, data):
    """Send a message via SocketIO"""
    from src.sockets.manager import socketio
    if socketio:
        append_id(data)
        track_message(data)
        socketio.emit(event, data)
        sent(f"Sending {event} to client: {data['content']} (ID: {data['id']})")
    else:
        error("Socket.IO not initialized, cannot send message")

def get_id():
    global ID
    ID += 1
    return ID

def append_id(data):
    data['id'] = get_id()
    return data