#!/bin/bash

# Step 1: Build Redis image
echo "Building Redis image..."
docker build -t sentinel-redis-image -f ../redis/Dockerfile .

# Step 2: Run Redis container
echo "Removing previous Redis container..."
docker rm -f sentinel-redis-container

echo "Starting Redis container..."
docker run -d --name sentinel-redis-container -p 6379:6379 sentinel-redis-image

# Step 3: Build PostgreSQL image
echo "Building PostgreSQL image..."
docker build -t sentinel-postgresql-image -f ../postgres/Dockerfile .

# Step 4: Run PostgreSQL container
echo "Removing previous PostgreSQL container..."
docker rm -f sentinel-postgresql-container

echo "Starting PostgreSQL container..."
docker run -d --name sentinel-postgresql-container \
  -e POSTGRES_DB=sentinel \
  -e POSTGRES_USER=sentinel \
  -e POSTGRES_PASSWORD=A#f@jh2APfyt \
  -p 5432:5432 \
  --restart always \
  sentinel-postgresql-image

echo "Services are now running:"
docker ps