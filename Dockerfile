FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app files
COPY . .

# Build aplikasi
RUN npm run build

# Expose port
EXPOSE 3000

# Start aplikasi
CMD ["npm", "start"]
