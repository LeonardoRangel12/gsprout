FROM bitnami/node:18.18.0 AS build
RUN npm i && npm run build

FROM nginx:alpine
COPY --from=build /app/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]