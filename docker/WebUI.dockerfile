# webui
FROM node:9.11 as build

WORKDIR /app
COPY /web-ui/package.json /web-ui/yarn.lock ./
RUN yarn
COPY /web-ui ./
RUN yarn build

FROM nginx:1.14-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
