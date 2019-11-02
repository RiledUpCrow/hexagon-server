# Development container
FROM node:10.15
ENV NODE_ENV development \
  PORT 80
WORKDIR /app

# Installing all dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Config files
COPY tsconfig.json nodemon.json .eslintrc.json .prettierrc.json ./

CMD [ "npm", "run", "dev" ]
