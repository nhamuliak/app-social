# Specify Node version and Image
# name Image as "development"
FROM node:20 AS build

# Specify working directory inside the container
WORKDIR /usr/src/app-social

# Copy application code
COPY . .

# Install deps inside the container
RUN npm install

# Run build
RUN npm run build-prod

# Stage 2: Use 'serve' to serve the application
FROM node:20-alpine

# Install 'serve'
RUN npm install -g serve

# Set working directory
WORKDIR /usr/src/app-social

# Copy the built Angular app from the build stage
COPY --from=build /usr/src/app-social/dist/app-social /usr/src/app-social

# Expose the port Serve will use
EXPOSE 80

# Command to start the application
CMD ["serve", "-s", ".", "--single", "-l", "80"]
