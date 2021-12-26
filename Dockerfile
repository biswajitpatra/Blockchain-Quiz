FROM node:16.13.1

WORKDIR /app

# Install Truffle
RUN npm install -g truffle
RUN npm config set bin-links false

COPY ./client/package.json ./client/
COPY ./client/yarn.lock ./client/
RUN cd client && yarn

COPY . .

EXPOSE 3000
CMD cd client && yarn run dev