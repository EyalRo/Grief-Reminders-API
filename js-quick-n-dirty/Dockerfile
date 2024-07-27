# syntax=docker/dockerfile:1

FROM node:lts-slim
WORKDIR /app
COPY . .
RUN npm install --omit=dev
CMD ["node", "src/index.ts"]
EXPOSE 3000