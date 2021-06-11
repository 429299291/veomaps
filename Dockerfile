# FROM node:14.17.0

# WORKDIR /usr/src/app/

# COPY ./ ./
# RUN npm install 

# RUN npm run build


FROM nginx:latest

ADD dist /usr/share/nginx/html

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf