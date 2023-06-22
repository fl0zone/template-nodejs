FROM node:16 as development
WORKDIR /usr/src/app
COPY package-doesnt-exist.json ./
RUN non-existing-cmd ./
CMD [ "npm", "run", "start:dev" ]
