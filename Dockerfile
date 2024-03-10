# Stage 1: Build Node.js application
FROM --platform=linux/amd64 node:14 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Stage 2: Create final image
FROM --platform=linux/amd64 node:14-alpine

WORKDIR /app

# Copy built node_modules from previous stage
COPY --from=build /app/node_modules ./node_modules

# Copy source code from previous stage
COPY --from=build /app .

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Expose port
EXPOSE 3333

# Command to run your Node.js application
CMD ["node", "index.mjs"]
