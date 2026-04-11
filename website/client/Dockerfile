# ==============================================================================
# Base stage
# ==============================================================================
FROM node:24-alpine AS base

# Install Git (required for VitePress)
RUN apk add --no-cache git

WORKDIR /app

# ==============================================================================
# Dependencies installation stage
# ==============================================================================
FROM base AS deps

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies (with npm cache optimization)
RUN npm ci && npm cache clean --force

# ==============================================================================
# Development stage
# ==============================================================================
FROM deps AS development

# Copy source code (exclude node_modules to avoid conflict with deps stage)
COPY --exclude=node_modules . .

EXPOSE 5173

CMD ["npm", "run", "docs:dev"]

# ==============================================================================
# Production build stage
# ==============================================================================
FROM deps AS build

ARG VITE_REPOMIX_API_BASE_URL=https://api.repomix.com
ENV VITE_REPOMIX_API_BASE_URL=${VITE_REPOMIX_API_BASE_URL}
ENV NODE_OPTIONS=--max-old-space-size=1536

# Copy source code (exclude node_modules to avoid conflict with deps stage)
COPY --exclude=node_modules . .

RUN npm run docs:build

# ==============================================================================
# Production runtime stage
# ==============================================================================
FROM nginx:1.29-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.vitepress/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ==============================================================================
# Prebuilt runtime stage
# ==============================================================================
FROM nginx:1.29-alpine AS prebuilt

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY .vitepress/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
