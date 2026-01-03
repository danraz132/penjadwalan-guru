FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (dev + prod) for build
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Generate Prisma client before build
RUN npx prisma generate

# Build Next.js app
RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app

# Install only production dependencies in the final image
COPY package*.json ./
RUN npm ci --only=production

# Copy build artifacts and static files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/prisma ./prisma

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
