from flask_socketio import SocketIO
from src.utils.logger import get_logger
from src.sockets.handlers import register_handlers

logger = get_logger("socket_manager")
debug = logger.debug
info = logger.info

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
    
    # Register the standard socket handlers
    register_handlers(socketio)
    
    info("SocketIO initialized successfully")
    return socketio