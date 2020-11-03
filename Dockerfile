# Base on offical Node.js Alpine image
FROM node:14-alpine

# Disable NextJS telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Required for node-gyp
RUN apk add python2 make g++

# Set working directory
WORKDIR /usr/app

# Install PM2 globally
RUN npm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package*.json ./

# Install dependencies
RUN npm install --production

# Rebuild node-sass
RUN npm uninstall node-sass && npm install node-sass

# Copy all files
COPY ./ ./

# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]
