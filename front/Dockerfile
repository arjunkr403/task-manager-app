# DEV STAGE
FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# PROD BUILD STAGE
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# # PROD SERVE STAGE
# FROM node:22-alpine AS prod
# WORKDIR /app
# COPY --from=build /app/dist /usr/share/nginx/html
# COPY app.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

