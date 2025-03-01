from flask import Blueprint, render_template, jsonify, request
import queue
import json
import datetime
import logging
import time

# Disable werkzeug logging for the debug API endpoint
werkzeug_logger = logging.getLogger('werkzeug')
original_log = werkzeug_logger.log

def custom_log(level, message, *args, **kwargs):
    if "/api/debug/logs" not in message:  # Skip logging for debug endpoint
        original_log(level, message, *args, **kwargs)

werkzeug_logger.log = custom_log

# Create blueprint for debug console
debug_bp = Blueprint('debug_console', __name__)

# Message queue for debug logs
message_queue = queue.Queue(maxsize=1000)
last_log_timestamp = 0  # Track the last update timestamp

class LogMessage:
    def __init__(self, level, source, content):
        self.timestamp = datetime.datetime.now().strftime("%H:%M:%S")
        self.unix_time = time.time()
        self.level = level
        self.source = source
        self.content = content
    
    def to_dict(self):
        return {
            "timestamp": self.timestamp,
            "unix_time": self.unix_time,
            "level": self.level,
            "source": self.source,
            "content": self.content
        }

def add_log(level, source, content):
    """Add a log message to the queue"""
    try:
        # Convert complex objects to JSON strings
        if not isinstance(content, str):
            try:
                content = json.dumps(content)
            except:
                content = str(content)
        
        message = LogMessage(level, source, content)
        
        # Update last timestamp
        global last_log_timestamp
        last_log_timestamp = message.unix_time
        
        # If queue is full, remove oldest message
        if message_queue.full():
            message_queue.get_nowait()
            
        message_queue.put_nowait(message)
    except:
        pass  # Fail silently if queue operations fail

@debug_bp.route('/debug')
def debug_console():
    """Render the debug console HTML page"""
    return render_template('debug_console.html')

@debug_bp.route('/api/debug/logs')
def get_logs():
    """API endpoint to get all logs"""
    logs = []
    # Get all messages from queue without removing them
    queue_size = message_queue.qsize()
    for _ in range(queue_size):
        try:
            message = message_queue.get_nowait()
            logs.append(message.to_dict())
            message_queue.put_nowait(message)  # Put it back
        except:
            break
            
    return jsonify(logs)

@debug_bp.route('/api/debug/clear', methods=['POST'])
def clear_logs():
    """API endpoint to clear all logs"""
    global message_queue
    # Create a new empty queue with the same max size
    message_queue = queue.Queue(maxsize=1000)
    # Add an initialization message
    add_log("INFO", "debug_console", "Logs cleared")
    return jsonify({"success": True})

# Initialize the console by adding a startup message
add_log("DEBUG", "debug_console", "Debug console initialized")