# syntax=docker/dockerfile:1

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies first (cached layer)
COPY package*.json ./
RUN npm install --silent

# copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# copy custom nginx config for SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
