FROM node:12.18.1
ENV NODE_ENV=production
WORKDIR /
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
RUN bash -c "npm run 11ty"

FROM nginx
COPY dist /usr/share/nginx/html

