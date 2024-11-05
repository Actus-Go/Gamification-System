#!/bin/sh

# Start the services in the foreground
npm run auth-service &
npm run points-service &
npm run main-service &

# Wait for all processes to finish
wait
