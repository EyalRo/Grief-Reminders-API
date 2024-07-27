# syntax=docker/dockerfile:1

FROM node:lts-slim
WORKDIR /app
COPY . .
RUN npm install --omit=dev
CMD ["npx", "tsx", "src/index.ts"]
EXPOSE 3000