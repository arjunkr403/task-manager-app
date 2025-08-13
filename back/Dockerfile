#DEV STAGE
FROM node:22-alpine AS dev
WORKDIR /app
COPY ./package*.json ./
RUN npm i
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

#PROD STAGE
FROM node:22-alpine AS prod
WORKDIR /app
COPY ./package*.json ./
RUN npm i --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]

