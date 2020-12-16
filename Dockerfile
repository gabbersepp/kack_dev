
FROM node:12.18.1 as node

ARG TWTR_CKEY
ARG TWTR_CSECRET
ARG TWTR_ATOKEN
ARG TWTR_ASECRET

ENV TWTR_CKEY=$TWTR_CKEY
ENV TWTR_CSECRET=$TWTR_CSECRET
ENV TWTR_ATOKEN=$TWTR_ATOKEN
ENV TWTR_ASECRET=$TWTR_ASECRET

RUN mkdir kackdev
COPY "./app" "./kackdev/app"
COPY "./build" "./kackdev/build"
COPY "./k8s" "./kackdev/k8s"
COPY "package.json" "./kackdev/"
COPY "package-lock.json" "./kackdev/"

WORKDIR /kackdev/
RUN npm install
RUN npm run twitter 2>&1 | tee out_twitter.txt && \
    npm run 11ty 2>&1 | tee out_11ty.txt

FROM nginx
COPY --from=node /kackdev/app/dist /usr/share/nginx/html