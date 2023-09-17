# Base on offical Node.js Alpine image
FROM node:16.10.0-bullseye-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY ./ ./

# Run yarn start script
CMD ["yarn", "start"]