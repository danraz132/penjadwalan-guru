FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (dev + prod) for build
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Set dummy DATABASE_URL for build (will be overridden at runtime)
ENV DATABASE_URL="mysql://root:NUKEoLXiPiQMeatwdgXgNPbLGDhinkOs@mysql.railway.internal:3306/railway"

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
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port and run
EXPOSE 3000
CMD ["npm", "start"]
