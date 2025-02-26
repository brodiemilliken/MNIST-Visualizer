from flask_socketio import SocketIO, emit
from utils.logger import get_logger

logger = get_logger("socket_handlers.js") 
debug = logger.debug

socketio = SocketIO()

@socketio.on('send_text')
def handle_message(data):
    debug(f"Received message: {data}")
    emit('receive_text', {'message': 'Text received successfully!'})