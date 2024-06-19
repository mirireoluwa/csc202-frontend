# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies.
COPY package*.json ./
RUN npm install

# Copy application code.
COPY . .

# Build the app.
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Start the app
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 5173
