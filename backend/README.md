# README for Backend

# WebSocket Communication Project - Backend

This project is the backend component of the WebSocket Communication Project, which facilitates real-time communication between the frontend and backend using WebSockets. The backend is built using Flask and Flask-SocketIO.

## Project Structure

- **src/**: Contains the source code for the backend application.
  - **app.py**: Entry point of the backend application. Sets up the Flask server and initializes WebSocket communication.
  - **socket_handlers.py**: Contains WebSocket handlers to manage incoming messages and print received data.
  - **image_processor.py**: Responsible for processing images. Currently, it contains placeholder functions for future implementation.
  - **utils/**: Contains utility functions for the backend application.
    - **helpers.py**: Currently empty but can be populated with helper functions as needed.

- **requirements.txt**: Lists the dependencies required for the backend application, including Flask and Flask-SocketIO.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd websocket-communication-project/backend
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

## Running the Backend

To run the backend server, execute the following command:
```
python src/app.py
```

The server will start on `http://0.0.0.0:5000`.

## WebSocket Communication

The backend uses WebSocket for real-time communication. The frontend can send messages to the backend, and the backend will print the received data. The backend can also send text and image data to the frontend.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.