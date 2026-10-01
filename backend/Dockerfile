# Nexus Clean Backend - Production Dockerfile
FROM node:20-alpine AS base

# Install dumb-init or dependencies if needed
RUN apk add --no-cache dumb-init

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY database/ ./database/
COPY src/ ./src/
RUN mkdir -p uploads

# Set environment
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Use dumb-init for proper signal handling and PID 1 management
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["npm", "start"]
