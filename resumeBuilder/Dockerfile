FROM node:20-slim

# Install essential packages and TeX Live with better organization
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Create temp directory with proper permissions
RUN mkdir -p /usr/src/app/temp && chmod 777 /usr/src/app/temp

# Expose port for the server
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]