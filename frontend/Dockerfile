FROM node:20-bookworm

WORKDIR /app


COPY package.json package-lock.json ./

# 2. Prevent host-os specific binaries from being used 
# and explicitly install the Linux ARM64 binary required by Next.js/Tailwind
RUN npm install --include=optional && \
    npm rebuild lightningcss

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
