FROM node:16 as development
WORKDIR /usr/src/app

# These lines intentionally breaks the build in order to test FL0bot
COPY package*.json .
RUN npm install
COPY app.js ./
COPY ./public ./public

CMD [ "npm", "run", "start" ]
