# --- Build stage for frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- Build stage for backend ---
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# --- Final runtime image ---
FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app /app

# Copy frontend build into backend's dist folder
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000
# CMD ["node", "build/index.js"]
CMD npm install tsx --dev && npm start

