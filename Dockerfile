FROM node
COPY package.json ./
RUN npm install

COPY . .
ENTRYPOINT ["node", "index.js"]
