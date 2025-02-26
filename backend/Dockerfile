FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make sure port 5000 is exposed for both HTTP and WebSockets
EXPOSE 5000

# Use a more reliable way to run the Flask app with SocketIO
CMD ["python", "src/app.py"]