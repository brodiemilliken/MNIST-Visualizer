from flask import jsonify
from src.utils.logger import get_logger

logger = get_logger("api_routes")
debug = logger.debug

def register_routes(app):
    """Register all API routes with the Flask app"""
    
    @app.route('/api/hello', methods=['GET'])
    def hello_world():
        debug("API endpoint /api/hello was called")
        return jsonify({"message": "Hello from API!"})
    
    # Add more API routes here
    
    return app

# Ensure the function is available when imported
__all__ = ['register_routes']