FROM node:16-alpine as build

# install dependencies

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy all local files into the image.
COPY . .

RUN npm install --prefer-offline && npm run build

FROM node:16-alpine

WORKDIR /app
COPY --from=build /app .
COPY . .


EXPOSE 3000
CMD ["npm", "start"]