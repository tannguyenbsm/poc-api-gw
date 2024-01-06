# Stage 1: Build the application
FROM --platform=linux/amd64 node:14 AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies for building (including devDependencies)
RUN npm install

# Stage 2: Create the final image
FROM --platform=linux/amd64 node:14-alpine

RUN apk --no-cache add curl

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/ .

ADD . .
ARG USER_SERVICE_API_BASE

ENV USER_SERVICE_API_BASE=$USER_SERVICE_API_BASE
# Expose the port your app will run on
EXPOSE 80

# Define the command to run your application
CMD ["node", "index.js"]
