FROM node:18.18.0
RUN mkdir -p /app
ADD dist/* ./app
WORKDIR /app
CMD ["node", "app.bundle.js"]