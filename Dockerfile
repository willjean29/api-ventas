FROM node:19-alpine3.15 as dev
WORKDIR /app
COPY package.json ./
RUN npm install
EXPOSE 4000
CMD npm run dev

