# Specify Node version and Image
# name Image as "development"
FROM node:20 AS develop

# Specify working directory inside the container
WORKDIR /usr/src/app-social

# Copy application code
COPY . .

# Install deps inside the container
RUN npm install

# Run build
RUN npm run build-prod

# Install http-server globally to serve the production files
RUN npm install -g http-server

EXPOSE 4300

# Set the default command to start the application
CMD ["http-server", "dist/app-social", "-p", "4300"]

