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

EXPOSE 4300

# Set the default command to start the application
#CMD ["npm", "run", "start"]
ENTRYPOINT ["npm", "run", "serve"]

