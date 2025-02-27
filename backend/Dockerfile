FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make sure port 5000 is exposed for both HTTP and WebSockets
EXPOSE 5000

# Change this line to run as a module instead of a script
CMD ["python", "-m", "src.app"]