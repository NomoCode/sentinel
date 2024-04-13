
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir /config
COPY config/*.yaml /config/
CMD ["npm", "start"]
