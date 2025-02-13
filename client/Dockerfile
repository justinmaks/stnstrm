# Stage 1: Build the Vue app
FROM node:22 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build for production (outputs to /app/dist)
RUN npm run build

# Stage 2: Serve the built files
FROM node:22
RUN npm install -g serve
WORKDIR /app

# Copy 'dist' from the build stage
COPY --from=build /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Serve the production build
CMD ["serve", "-s", "dist", "-l", "3000"]
