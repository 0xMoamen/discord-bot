# Use official Node.js runtime image
FROM node:18-slim

# Create working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy bot source code
COPY . .

# Start the Discord bot
CMD ["node", "bot.js"]