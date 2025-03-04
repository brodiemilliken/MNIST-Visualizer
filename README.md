# README.md

# WebSocket Communication Project

This project demonstrates a dual pipeline communication system between a Flask backend and a React frontend using WebSockets. It allows for the transmission of both text and image data, enabling real-time interaction between the two components.

## Project Structure

```
websocket-communication-project
├── backend
│   ├── src
│   │   ├── app.py                # Entry point for the backend application
│   │   ├── socket_handlers.py     # WebSocket handlers for managing messages
│   │   ├── image_processor.py     # Processes image data (to be implemented)
│   │   └── utils
│   │       └── helpers.py         # Utility functions for backend (currently empty)
│   ├── requirements.txt           # Python dependencies for the backend
│   └── README.md                  # Documentation for the backend
├── frontend
│   ├── public
│   │   ├── index.html             # Main HTML file for the frontend
│   │   └── favicon.ico            # Favicon for the frontend
│   ├── src
│   │   ├── App.js                 # Main component of the React application
│   │   ├── components
│   │   │   ├── ImageDisplay.js     # Component for displaying images
│   │   │   └── TextConsole.js      # Component for displaying text messages
│   │   ├── services
│   │   │   └── socketService.js    # Manages WebSocket connections
│   │   ├── styles
│   │   │   └── App.css             # Styles for the frontend
│   │   └── index.js                # Entry point for the React application
│   ├── package.json                # Configuration for npm
│   └── README.md                   # Documentation for the frontend
└── README.md                       # Documentation for the overall project
```

## Features

- **Real-time Communication**: Utilizes WebSockets for instant data exchange between the frontend and backend.
- **Text and Image Handling**: Supports sending and receiving both text messages and images.
- **Modular Design**: Organized structure for easy maintenance and scalability.

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm

### Backend Setup

1. Navigate to the `backend` directory.
2. Install the required Python packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```
   python src/app.py
   ```

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the required npm packages:
   ```
   npm install
   ```
3. Start the frontend application:
   ```
   npm start
   ```

## Usage

Once both the backend and frontend are running, you can interact with the application through the frontend interface. The frontend will be able to send requests to the backend and receive responses in real-time.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.