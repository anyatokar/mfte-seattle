FROM node:12.16.3-alpine as build

WORKDIR /app

COPY . ./

# ---
FROM fholzer/nginx-brotli:v1.12.2

WORKDIR /etc/nginx
ADD nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
WORKDIR /usr/share/nginx/html

# Add bash
RUN apk add --no-cache bash

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]