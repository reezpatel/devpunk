FROM mhart/alpine-node:10.20.0 AS builder
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn
COPY . /app
RUN yarn run build

FROM ubuntu:latest
RUN apt-get update && \
    apt-get install nodejs npm -y 
WORKDIR /app
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/yarn.lock /app/yarn.lock
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
ARG NODE_ENV=production
ARG PORT=3000
CMD ["npm", "run", "start:server"]