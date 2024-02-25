FROM bitnami/git AS repo
RUN git clone https://github.com/LeonardoRangel12/gsprout.git

FROM node:18.18.0
COPY --from=repo /gsprout /gsprout
WORKDIR /gsprout/backend
RUN npm i && npm run build
RUN mkdir -p /app
COPY ./dist /app
WORKDIR /app
CMD ["node", "app.bundle.js"]