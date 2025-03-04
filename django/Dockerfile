# Use official Python image
FROM python:3.12.9-slim-bookworm

# Set the working directory in the container
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy Django project files
COPY . .

EXPOSE 8000
