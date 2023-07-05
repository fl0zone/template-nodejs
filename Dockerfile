FROM node:16 as development
WORKDIR /usr/src/app

# These lines intentionally breaks the build in order to test FL0bot
COPY package-doesnt-exist.json ./
RUN non-existing-cmd ./

CMD [ "npm", "run", "start:dev" ]
