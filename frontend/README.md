# websocket-communication-project/frontend/README.md

# WebSocket Communication Project - Frontend

This project is the frontend part of the WebSocket Communication Project, which facilitates real-time communication between the frontend and backend using WebSockets. The frontend is built using React and is designed to display text and images sent from the backend.

## Project Structure

- **public/**: Contains static files.
  - **index.html**: The main HTML file for the React application.
  - **favicon.ico**: The favicon for the application.

- **src/**: Contains the source code for the React application.
  - **App.js**: The main component that sets up the application layout.
  - **components/**: Contains reusable components.
    - **ImageDisplay.js**: Component for displaying images received from the backend.
    - **TextConsole.js**: Component for displaying text messages received from the backend.
  - **services/**: Contains services for managing WebSocket connections.
    - **socketService.js**: Functions to send and receive data through sockets.
  - **styles/**: Contains styles for the application.
    - **App.css**: Styles for the frontend application.
  - **index.js**: The entry point for the React application.

## Installation

To install the necessary dependencies, navigate to the `frontend` directory and run:

```
npm install
```

## Running the Application

To start the frontend application, run the following command in the `frontend` directory:

```
npm start
```

This will start the development server and open the application in your default web browser.

## Communication with Backend

The frontend communicates with the backend using WebSockets. It can send and receive text and image data. Ensure that the backend server is running to establish a successful connection.

## Contributing

Feel free to contribute to this project by submitting issues or pull requests. Your contributions are welcome!

## License

This project is licensed under the MIT License.