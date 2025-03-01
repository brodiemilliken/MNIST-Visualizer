# Fix import paths
from src.test.background_tasks import BackgroundTask  # Changed from backend.src.test
from src.utils.logger import get_logger
from src.sockets.handlers import send_message as socket_send_message  # Changed from backend.src.sockets

# Set up logger
logger = get_logger("test_data")
debug = logger.debug
info = logger.info
warning = logger.warning
error = logger.error

# Reference to socketio - will be initialized when register_handlers is called
socketio = None

def register_handlers(socketio_instance):
    """Register all socket handlers for test data management"""
    global socketio
    socketio = socketio_instance
    
    # Register event handlers
    socketio.on_event('connect', handle_connect)
    socketio.on_event('start_task', handle_start_task)
    socketio.on_event('stop_task', handle_stop_task)
    socketio.on_event('list_tasks', handle_list_tasks)
    
    info("Test data handlers registered")

def handle_connect():
    """Handle client connection - start multiple background tasks if needed"""
    debug("Client connected to WebSocket")
    
    tasks_to_create = [
        {
            'name': 'fast_updates',
            'interval': 4
        },
        {
            'name': 'medium_updates',
            'interval': 7
        },
        {
            'name': 'slow_updates',
            'interval': 13
        }
    ]
    
    # Start each task if it doesn't already exist
    for task_config in tasks_to_create:
        task_name = task_config['name']
        existing_task = BackgroundTask.get_task(task_name)
        
        if not existing_task:
            task = BackgroundTask(
                interval=task_config['interval'],
                callback=socket_send_message,
                name=task_name
            )
            task.start()
            debug(f"Background task '{task_name}' started with interval {task_config['interval']}s")

def handle_start_task(data):
    """Start a new background task with custom parameters"""
    try:
        task_name = data.get('name', f"custom_task_{len(BackgroundTask.get_all_tasks())}")
        interval = int(data.get('interval', 5))
        
        # Check if task with this name already exists
        if BackgroundTask.get_task(task_name):
            return {'status': 'error', 'message': f'Task {task_name} already exists'}
            
        task = BackgroundTask(
            interval=interval,
            callback=socket_send_message,
            name=task_name
        )
        success = task.start()
        
        if success:
            debug(f"Background task '{task_name}' started with interval {interval}s")
            return {'status': 'success', 'task_id': task_name}
        else:
            return {'status': 'error', 'message': 'Failed to start task'}
    except Exception as e:
        error(f"Error starting task: {str(e)}")
        return {'status': 'error', 'message': str(e)}

def handle_stop_task(data):
    """Stop a running background task"""
    try:
        task_id = data.get('task_id')
        task = BackgroundTask.get_task(task_id)
        
        if task:
            task.stop()
            debug(f"Background task '{task_id}' stopped")
            return {'status': 'success'}
        else:
            return {'status': 'error', 'message': f'Task {task_id} not found'}
    except Exception as e:
        error(f"Error stopping task: {str(e)}")
        return {'status': 'error', 'message': str(e)}

def handle_list_tasks():
    """List all active background tasks"""
    tasks = BackgroundTask.get_all_tasks()
    return {
        'status': 'success',
        'tasks': list(tasks.keys())
    }

def stop_all_tasks():
    """Stop all running test tasks - useful for cleanup"""
    tasks = BackgroundTask.get_all_tasks()
    for task_name, task in list(tasks.items()):
        task.stop()
        debug(f"Background task '{task_name}' stopped")