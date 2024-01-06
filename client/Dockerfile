# syntax=docker/dockerfile:1

FROM node:20-slim as dev
RUN npm install -g node-gyp
WORKDIR /usr/ishiko/client
CMD \[ -d "node_modules" \] && npm run dev || npm install && npm run dev
