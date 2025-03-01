import threading
import time
from src.utils.logger import get_logger

logger = get_logger("message_tracker")
debug = logger.debug
warning = logger.warning
error = logger.error

# Dictionary to store messages waiting for confirmation
# Format: {message_id: {'timestamp': time_sent, 'data': message_data}}
pending_messages = {}

# Lock for thread-safe operations on the dictionary
message_lock = threading.Lock()

# Configuration
CONFIRMATION_TIMEOUT = 0.5  # Time in seconds before issuing warning

def track_message(message_data):
    id = message_data.get('id')
    with message_lock:
        pending_messages[id] = {
            'timestamp': time.time(),
            'data': message_data
        }

def confirm_message(message_id):
    with message_lock:
        if message_id in pending_messages:
            message_data = pending_messages.pop(message_id)
            elapsed = time.time() - message_data['timestamp']
            debug(f"Message {message_id} confirmed after {elapsed:.3f}s")
            return True
        return False

def check_expired_messages():
    """Check for and remove expired messages"""
    current_time = time.time()
    expired_messages = []
    
    # Identify expired messages
    with message_lock:
        for message_id, info in list(pending_messages.items()):
            elapsed = current_time - info['timestamp']
            if elapsed > CONFIRMATION_TIMEOUT:
                expired_messages.append((message_id, info))
    
    # Process expired messages (outside the lock to minimize lock time)
    for message_id, info in expired_messages:
        warning(f"Message {message_id} not confirmed after {CONFIRMATION_TIMEOUT:.2f}s")
        with message_lock:
            if message_id in pending_messages:  # Check again in case it was confirmed
                pending_messages.pop(message_id)

def start_tracker():
    """Start the background thread that checks for expired messages"""
    def tracker_thread():
        while True:
            try:
                time.sleep(0.1)  # Check frequently but not too often
                check_expired_messages()
            except Exception as e:
                error(f"Error in tracker thread: {e}")
    
    thread = threading.Thread(target=tracker_thread)
    thread.daemon = True
    thread.start()
    debug("Message tracker thread started")
    
# Start the tracker thread when the module is imported
start_tracker()