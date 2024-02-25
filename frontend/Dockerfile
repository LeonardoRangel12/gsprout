FROM nginx
ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./dist /app

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]