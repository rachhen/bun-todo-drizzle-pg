FROM oven/bun

WORKDIR /app

ENV NODE_ENV production
ADD package.json package.json
ADD bun.lockb bun.lockb
RUN bun install
COPY . .

CMD ["bun", "run", "start"]
