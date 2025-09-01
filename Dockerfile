# Build frontend inside the nginx build so we can copy the static /dist output
FROM node:22-alpine AS build
WORKDIR /app/front
COPY front/package*.json ./
RUN npm ci
COPY front/ ./
RUN npm run build

FROM nginx:alpine
COPY app.conf /etc/nginx/conf.d/default.conf
# copy the built frontend from the build stage
COPY --from=build /app/front/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
