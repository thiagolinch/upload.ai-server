FROM node:18-alpine

WORKDIR /usr/app/ptag

COPY package.json .

RUN npm install 

RUN npm prisma generate

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]
