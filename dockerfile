# ---------- build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

RUN pnpm run build:prod  # production build

# ---------- production stage ----------
FROM nginx:1.27-alpine

# copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
