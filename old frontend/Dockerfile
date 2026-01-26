# ------------------------------
# Stage 1: Build Angular app
# ------------------------------
FROM node:18-alpine as build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Fix permissions and build with npx
RUN chmod +x node_modules/.bin/ng && npx ng build --configuration production

# ------------------------------
# Stage 2: Serve with Node.js (no Nginx)
# ------------------------------
FROM node:18-alpine
WORKDIR /app

# Install lightweight static server
RUN npm install -g serve

# Copy the built Angular app
COPY --from=build /app/dist/ng16/browser ./dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
