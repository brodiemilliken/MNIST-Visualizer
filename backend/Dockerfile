FROM python:3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Update this line to use the new entry point
EXPOSE 5000

# Use the new run.py entry point
CMD ["python", "run.py"]