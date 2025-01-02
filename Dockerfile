# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the application port (default is 3000)
EXPOSE 3000

# Define the environment variable for the application port
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
