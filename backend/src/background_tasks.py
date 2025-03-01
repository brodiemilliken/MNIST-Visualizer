import threading
import time
import uuid

class BackgroundTask:
    """Class to manage background tasks that run on separate threads"""
    
    # Class-level dictionary to track all active tasks
    _tasks = {}
    
    def __init__(self, interval=5, callback=None, name=None):
        """
        Initialize a background task
        
        Args:
            interval: Time in seconds between executions
            callback: Function to call for sending messages
            name: Title of the thread to display in updates
        """
        self.interval = interval
        self.callback = callback
        self.name = name or f"task_{uuid.uuid4().hex[:8]}"
        
        # Thread control
        self.thread = None
        self.stop_event = threading.Event()
        self.lock = threading.Lock()
        self.count = 0
    
    def task_function(self):
        """The function that runs in the background thread"""
        while not self.stop_event.is_set():
            try:
                time.sleep(self.interval)
                self.count += 1
                
                if self.callback:
                    message = {
                        'content': f'{self.name} update #{self.count}'
                    }
                    self.callback('message', message)
            except Exception as e:
                print(f"Error in background task {self.name}: {e}")
    
    def start(self):
        """Start the background task"""
        with self.lock:
            if self.thread is None or not self.thread.is_alive():
                self.stop_event.clear()
                self.thread = threading.Thread(target=self.task_function)
                self.thread.daemon = True
                self.thread.start()
                # Register task in class dictionary
                BackgroundTask._tasks[self.name] = self
                return True
        return False
    
    def stop(self):
        """Stop the background task"""
        self.stop_event.set()
        if self.name in BackgroundTask._tasks:
            del BackgroundTask._tasks[self.name]
        return True
    
    @classmethod
    def get_task(cls, task_id):
        """Get a task by ID"""
        return cls._tasks.get(task_id)
    
    @classmethod
    def get_all_tasks(cls):
        """Get all active tasks"""
        return cls._tasks