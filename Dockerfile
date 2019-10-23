FROM node:10.16.3

WORKDIR /usr/src/bot

COPY package.json /usr/src/bot

RUN npm install

COPY . /usr/src/bot

CMD ["node", "RinsedBot.js"]