#!/bin/bash

# Step 1: Build Redis image
echo "Building Redis image..."
docker build -t gamemod-redis-image -f ../redis/Dockerfile .

# Step 2: Run Redis container
echo "Removing previous Redis container..."
docker rm -f gamemod-redis-container

echo "Starting Redis container..."
docker run -d --name gamemod-redis-container -p 6378:6378 gamemod-redis-image

# Step 3: Build PostgreSQL image
echo "Building PostgreSQL image..."
docker build -t gamemod-postgresql-image -f ../postgres/Dockerfile .

# Step 4: Run PostgreSQL container
echo "Removing previous PostgreSQL container..."
docker rm -f gamemod-postgresql-container

echo "Starting PostgreSQL container..."
docker run -d -p 5432:5432 --name gamemod-postgresql-container\
    -e POSTGRES_DB=gamemod \
    -e POSTGRES_PASSWORD=UMbufhVZL4^R \
    -e POSTGRES_USER=gamemod_docker \
    gamemod-postgresql-image

echo "Services are now running:"
docker ps