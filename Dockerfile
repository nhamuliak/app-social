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

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the built application from the previous stage
COPY --from=build /usr/src/app-social/dist/app-social /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port that Nginx will run on
EXPOSE 80

# Set the default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
