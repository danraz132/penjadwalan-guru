FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (dev + prod) for build
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Generate Prisma client and build Next.js
RUN npx prisma generate && npm run build


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
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
