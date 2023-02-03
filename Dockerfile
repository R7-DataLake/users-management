# Stage 1
FROM node:18-alpine as builder

LABEL maintainer="Satit Rianpit <rianpit@gmail.com>"

WORKDIR /app

RUN apk add --upgrade --no-cache --virtual deps python3 build-base git

COPY . .

RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

RUN pnpm i
RUN pnpm run build

# STAGE 2
FROM nginx:stable-alpine

COPY --from=builder /app/dist/web /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
