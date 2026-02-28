FROM node:22-alpine AS test
WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "test"]
