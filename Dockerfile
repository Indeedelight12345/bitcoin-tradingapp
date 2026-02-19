


FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --silent

COPY . .
RUN npm run build

FROM nginx:stable-alpine

RUN touch /var/run/nginx.pid && \
    chown -R 1001:0 /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chmod -R g=u /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d


RUN rm -rf /usr/share/nginx/html/*


COPY --from=builder /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf
 docket image s
EXPOSE 8080


USER 1001

CMD ["nginx", "-g", "daemon off;"]