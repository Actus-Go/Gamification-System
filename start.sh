#!/bin/sh

# Start services in the background
npm run auth-service &
npm run points-service &
npm run main-service &

# Wait for all background processes
wait
