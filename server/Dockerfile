# 1. Use an official Node LTS image
FROM node:22

# 2. Create app directory
WORKDIR /app

# 3. Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# 4. Copy the rest of the code
COPY . .

# 5. Expose the server port
EXPOSE 3001

# 6. Start the server
CMD [ "node", "index.js" ]
