FROM node:18.18.0
RUN mkdir -p /app
COPY dist/* ./app
WORKDIR /app
CMD ["node", "app.bundle.js"]