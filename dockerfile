ARG NODE_VERSION=20.12.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

# Copy the rest of the source files into the image.
COPY . /app

WORKDIR /app/MicroServices

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=./MicroServices/package.json,target=./MicroServices/package.json \
    --mount=type=bind,source=./MicroServices/package-lock.json,target=./MicroServices/package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci


# Run the application as a non-root user.
USER node

# Expose the port that the application listens on.
EXPOSE 8080

# Run the application.
CMD ["sh", "-c", "npm run auth-service & npm run points-service & npm run main-service"]