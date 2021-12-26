FROM node:16.13.1

# Install Truffle
RUN npm install -g truffle
RUN npm config set bin-links false

# Move Contract Files
COPY contracts ./contracts
COPY migrations ./migrations
COPY test ./test
COPY truffle-config.js ./truffle-config.js

# Move NextJs Files
COPY client/ ./client/
COPY client/public ./client/public
COPY client/package*.json ./client/package*.json

EXPOSE 3000

# Clean Install NPM Dependencies
RUN cd client && npm ci