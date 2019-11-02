# Development container
FROM node:10.15 as build
WORKDIR /app

# Installing all dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Config files
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Server container
FROM node:10.15
WORKDIR /app
ENV NODE_ENV production \
  PORT 80

# Installing production dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Preparing built code to run
COPY --from=build /app/build ./build

# Application port
EXPOSE ${PORT}

CMD [ "node", "build/index.js" ]
