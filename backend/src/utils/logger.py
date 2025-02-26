import logging
import os
import inspect
from datetime import datetime

# Create logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)

# Configure root logger with file handler
logging.basicConfig(
    level=logging.DEBUG,
    format='{%(name)s} - %(message)s',  # Removed %(levelname)s
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(f"logs/app_{datetime.now().strftime('%Y%m%d')}.log")
    ]
)

def get_logger(name=None):
    """
    Creates a logger instance specific to a file.
    If name is not provided, tries to determine the caller's module name.
    """
    if name is None:
        # Get the caller's frame
        frame = inspect.currentframe().f_back
        # Get the module name from the frame
        module = inspect.getmodule(frame)
        name = module.__name__ if module else 'unknown'
    
    return Logger(name)

class Logger:
    def __init__(self, name):
        self.logger = logging.getLogger(name)
        self.name = name
    
    def _get_caller_method(self):
        """Get the name of the method that called the logger"""
        frame = inspect.currentframe().f_back.f_back
        method = frame.f_code.co_name
        return method
    
    def info(self, message):
        """Log info level message with caller method"""
        method = self._get_caller_method()
        self.logger.info(f"[{method}] {message}")
    
    def debug(self, message):
        """Log debug level message with caller method"""
        method = self._get_caller_method()
        self.logger.debug(f"[{method}] {message}")
    
    def error(self, message):
        """Log error level message with caller method"""
        method = self._get_caller_method()
        self.logger.error(f"[{method}] {message}")
    
    def warning(self, message):
        """Log warning level message with caller method"""
        method = self._get_caller_method()
        self.logger.warning(f"[{method}] {message}")

# For backwards compatibility
_default_logger = get_logger("Backend")
info = _default_logger.info
debug = _default_logger.debug
error = _default_logger.error
warning = _default_logger.warning