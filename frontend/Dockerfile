FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose React's default port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]