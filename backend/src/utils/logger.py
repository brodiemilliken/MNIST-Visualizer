import inspect
from src.debug_console import add_log

def get_logger(name=None):
    """
    Creates a simplified logger that sends messages directly to the debug console.
    """
    if name is None:
        # Get the caller's frame
        frame = inspect.currentframe().f_back
        # Get the module name from the frame
        module = inspect.getmodule(frame)
        name = module.__name__ if module else 'unknown'
    
    return ConsoleLogger(name)

class ConsoleLogger:
    def __init__(self, name):
        self.name = name
    
    def _get_caller_method(self):
        """Get the name of the method that called the logger"""
        frame = inspect.currentframe().f_back.f_back
        method = frame.f_code.co_name
        return method
    
    def info(self, message):
        """Log info level message with caller method"""
        method = self._get_caller_method()
        source = f"{self.name}.{method}"
        add_log("INFO", source, message)
    
    def debug(self, message):
        """Log debug level message with caller method"""
        method = self._get_caller_method()
        source = f"{self.name}.{method}"
        add_log("DEBUG", source, message)
    
    def error(self, message):
        """Log error level message with caller method"""
        method = self._get_caller_method()
        source = f"{self.name}.{method}"
        add_log("ERROR", source, message)
    
    def warn(self, message):
        """Log warning level message with caller method"""
        method = self._get_caller_method()
        source = f"{self.name}.{method}"
        add_log("WARN", source, message)
    
    def sent(self, message):
        """Log sent message with caller method"""
        method = self._get_caller_method()
        source = f"{self.name}.{method}"
        add_log("SENT", source, message)
    
    def received(self, message):
        """Log received message with caller method"""
        method = self._get_caller_method()
        source = f"{self.name}.{method}"
        add_log("RECEIVED", source, message)

# For backwards compatibility
_default_logger = get_logger("Backend")
info = _default_logger.info
debug = _default_logger.debug
error = _default_logger.error
warn = _default_logger.warn
sent = _default_logger.sent
received = _default_logger.received