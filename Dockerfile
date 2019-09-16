# Development container
FROM node:10.15 as dev
ENV NODE_ENV development \
  PORT 80
WORKDIR /app

# Installing all dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Config files
COPY tsconfig.json nodemon.json .eslintrc.json .prettierrc.json ./

CMD [ "npm", "run", "dev" ]

# Test container
FROM dev as build

# Building the project
COPY test ./test
COPY src ./src
RUN npm run build

# Server container
FROM node:10.15
WORKDIR /app
ENV NODE_ENV production \
  PORT 80

# Installing production dependencies
COPY package.json package-lock.json ./
RUN npm install

# Preparing built code to run
COPY --from=build /app/build ./build

# Application port
EXPOSE ${PORT}

CMD [ "node", "build/index.js" ]
