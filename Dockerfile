FROM node:16 AS develop
WORKDIR /app
CMD ["npm", "run", "devel"]

FROM develop as modules
ADD package.json ./
ADD package-lock.json ./
RUN npm ci

FROM modules as builder
ADD . ./
RUN npm run build
RUN npm ci --production
RUN rm -rf src/

FROM develop
COPY --chown=node:node --from=builder /app/ /app/
USER node
CMD ["npm", "run", "start"]
