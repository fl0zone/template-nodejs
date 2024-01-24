FROM node:18

RUN mkdir -p /home/app

COPY . /home/app

WORKDIR /home/app

RUN npm i

EXPOSE 3000

CMD ["node", "index.js"]
